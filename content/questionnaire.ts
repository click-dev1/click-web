/**
 * CONTACT QUESTIONNAIRE — single source of truth.
 *
 * One array drives three things that otherwise drift apart:
 *   1. what the modal renders          (components/contact/ContactModal.tsx)
 *   2. what the server accepts         (app/api/contact/route.ts)
 *   3. which HubSpot property it lands in (lib/hubspot.ts)
 *
 * To add a question: add a field here. Nothing else needs editing except
 * creating the matching property in HubSpot (see docs/HUBSPOT_SETUP.md).
 *
 * `hubspot` MUST be the internal property name, not the label. HubSpot's
 * internal names are lowercase snake_case and are frozen after creation —
 * renaming the label in the HubSpot UI does not change them.
 */

export type FieldType = "text" | "email" | "choice";

export interface Field {
  /** form field name — also the key in the JSON payload */
  name: string;
  /** internal HubSpot property name this maps to */
  hubspot: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  /** prefix rendered inside the input (e.g. "@") and stripped before submit */
  prefix?: string;
  help?: string;
  /** choice fields only — value is what HubSpot stores */
  options?: { value: string; label: string; blurb: string }[];
  /** layout hint: pair two fields on one row at ≥sm */
  half?: boolean;
  autoComplete?: string;
  maxLength: number;
}

export const fields: Field[] = [
  {
    name: "segment",
    hubspot: "click_enquiry_type",
    label: "I'm here as",
    type: "choice",
    required: true,
    maxLength: 20,
    options: [
      {
        value: "brand",
        label: "A brand",
        blurb: "Planning a campaign or looking for creator partnerships.",
      },
      {
        value: "creator",
        label: "A creator",
        blurb: "Interested in representation by CLICK Talent.",
      },
    ],
  },
  {
    name: "firstName",
    hubspot: "firstname",
    label: "First name",
    type: "text",
    required: true,
    placeholder: "Alex",
    half: true,
    autoComplete: "given-name",
    maxLength: 60,
  },
  {
    name: "lastName",
    hubspot: "lastname",
    label: "Last name",
    type: "text",
    required: true,
    placeholder: "Rivera",
    half: true,
    autoComplete: "family-name",
    maxLength: 60,
  },
  {
    name: "email",
    hubspot: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
    autoComplete: "email",
    maxLength: 120,
  },
  {
    name: "socialTag",
    hubspot: "click_social_tag",
    label: "Social tag",
    type: "text",
    required: false,
    placeholder: "yourhandle",
    prefix: "@",
    help: "Optional — the handle we should look at first.",
    maxLength: 60,
  },
];

/** Copy for the modal shell, kept beside the schema it belongs to. */
export const questionnaire = {
  eyebrow: "Start the conversation",
  title: "Tell us who's asking.",
  intro:
    "Four questions. A strategist reads every one of these — you'll hear back within two working days.",
  submitLabel: "Send it",
  submittingLabel: "Sending",
  success: {
    eyebrow: "Signal received",
    title: "We've got it.",
    body: "Thanks — your details are with the team. Expect a reply within two working days.",
    dismissLabel: "Close",
  },
  /** shown when the API reports HubSpot isn't wired up yet */
  previewNote:
    "Preview mode — HubSpot isn't connected, so nothing was stored.",
  errorFallback: "Something went wrong on our end. Try again in a moment.",
  consent:
    "By sending this you agree we can contact you about your enquiry. We don't share your details.",
} as const;

/* ---------- validation (shared by client and server) ---------- */

/* Deliberately permissive: one @, a dot in the domain, no spaces. Anything
   stricter starts rejecting real addresses, and HubSpot validates again. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Answers = Record<string, string>;

/** Returns { fieldName: message } — empty object means valid. */
export function validate(answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = (answers[field.name] ?? "").trim();

    if (!value) {
      if (field.required) errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (value.length > field.maxLength) {
      errors[field.name] = `${field.label} is too long.`;
      continue;
    }
    if (field.type === "email" && !EMAIL_RE.test(value)) {
      errors[field.name] = "That email doesn't look right.";
      continue;
    }
    if (field.type === "choice" && !field.options?.some((o) => o.value === value)) {
      errors[field.name] = `Choose one option.`;
    }
  }

  return errors;
}

/** Trim, drop unknown keys, strip display prefixes like the leading "@". */
export function normalize(input: unknown): Answers {
  const raw = (input ?? {}) as Record<string, unknown>;
  const out: Answers = {};

  for (const field of fields) {
    const value = raw[field.name];
    if (typeof value !== "string") continue;

    let clean = value.trim().slice(0, field.maxLength);
    if (field.prefix && clean.startsWith(field.prefix)) {
      clean = clean.slice(field.prefix.length).trim();
    }
    if (clean) out[field.name] = clean;
  }

  return out;
}
