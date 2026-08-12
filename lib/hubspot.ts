/**
 * HUBSPOT TRANSPORT
 *
 * Everything that knows about HubSpot lives here. The modal and the API
 * route only speak in `Answers` (see content/questionnaire.ts) — swapping
 * HubSpot for another CRM means rewriting this file and nothing else.
 *
 * Transport: the Forms API submission endpoint.
 *   POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
 *
 * Why this endpoint rather than the CRM contacts API:
 *   - it is the endpoint HubSpot's own embedded forms use, so submissions
 *     show up in the form's analytics, not just as orphan contact records;
 *   - it triggers the form's workflows, notifications and lifecycle rules;
 *   - it needs no private-app token, so there is no long-lived CRM
 *     credential to store or rotate. Portal ID and form GUID are not
 *     secrets — they ship in the markup of every embedded HubSpot form.
 *
 * Not configured = not an error. `isConfigured()` is false until the env
 * vars land, and the API route answers with `mode: "preview"` so the front
 * end stays fully demoable before anyone touches the HubSpot account.
 */

import { fields, type Answers } from "@/content/questionnaire";

const SUBMIT_BASE = "https://api.hsforms.com/submissions/v3/integration/submit";

/** HubSpot's object type id for Contacts. Every field below targets one. */
const CONTACT_OBJECT_TYPE = "0-1";

export interface SubmitContext {
  /** page the visitor submitted from — shows on the HubSpot timeline */
  pageUri?: string;
  pageName?: string;
  /** HubSpot's own tracking cookie, when present. Links this submission to
   *  the visitor's existing analytics session instead of starting a new
   *  anonymous one. Absent until the HubSpot tracking script is installed. */
  hutk?: string;
}

export type SubmitResult =
  | { ok: true; mode: "hubspot" | "preview" }
  | { ok: false; status: number; message: string };

export function isConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_FORM_GUID);
}

/**
 * Answers → HubSpot's `{ objectTypeId, name, value }` field list, using the
 * `hubspot` property name declared on each field in the questionnaire.
 * Blank optional answers are dropped: sending "" would overwrite whatever
 * that property already holds on a returning contact.
 */
export function toHubSpotFields(answers: Answers) {
  return fields
    .filter((field) => answers[field.name])
    .map((field) => ({
      objectTypeId: CONTACT_OBJECT_TYPE,
      name: field.hubspot,
      value: answers[field.name],
    }));
}

export async function submitToHubSpot(
  answers: Answers,
  context: SubmitContext = {},
): Promise<SubmitResult> {
  if (!isConfigured()) return { ok: true, mode: "preview" };

  const url = `${SUBMIT_BASE}/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_GUID}`;

  const payload = {
    fields: toHubSpotFields(answers),
    context: {
      ...(context.hutk ? { hutk: context.hutk } : {}),
      ...(context.pageUri ? { pageUri: context.pageUri } : {}),
      ...(context.pageName ? { pageName: context.pageName } : {}),
    },
  };

  /* HubSpot is occasionally slow; a hung request would hold the route open
     for the platform's whole function timeout. */
  const abort = AbortSignal.timeout(10_000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: abort,
    });
  } catch (error) {
    console.error("[hubspot] request failed", error);
    return { ok: false, status: 502, message: "Could not reach HubSpot." };
  }

  if (response.ok) return { ok: true, mode: "hubspot" };

  /* HubSpot returns a useful JSON body on 400 (unknown property, invalid
     email, form GUID mismatch). Log it — it is the only way to diagnose a
     misconfigured form — but never return it to the browser. */
  const detail = await response.text().catch(() => "");
  console.error("[hubspot] submission rejected", response.status, detail);

  return {
    ok: false,
    status: response.status === 400 ? 400 : 502,
    message:
      response.status === 400
        ? "HubSpot rejected those details."
        : "HubSpot is unavailable right now.",
  };
}
