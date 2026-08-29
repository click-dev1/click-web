import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  DEFAULT_CONSENT,
  cookiesForCategory,
  type ConsentChoices,
  type OptionalConsentCategory,
} from "@/lib/consent";

/**
 * Where the decision lives, and how it is read and written.
 *
 * A cookie rather than localStorage, for two reasons. It is readable by the
 * inline script that sets Consent Mode's defaults, which runs before React
 * exists and cannot reach a React store — that is what stops a returning
 * visitor's granted consent arriving a beat late. And it is the artefact a
 * regulator would expect to find.
 *
 * The cookie is genuinely external state: written here, read by that inline
 * script, and changeable from another tab. So it is exposed as a store for
 * `useSyncExternalStore` rather than mirrored into `useState`.
 */

export type ConsentRecord = {
  /** Notice version in force when the choice was made. */
  v: number;
  /** ISO-8601, so the record says when as well as what. */
  ts: string;
  /** Opaque id, so a decision can be correlated with an enquiry later. */
  id: string;
} & ConsentChoices;

/**
 * What the server "sees". Never a real value: the server has no cookie, and
 * pretending it does would render a banner (or not) before we know. A
 * sentinel keeps SSR output identical for everyone; the client swaps in the
 * real value on hydration.
 */
export const CONSENT_SERVER_SNAPSHOT = "__server_snapshot__";

let listeners: Array<() => void> = [];

export function subscribeConsent(onChange: () => void): () => void {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

/** Raw cookie value. A primitive, so `useSyncExternalStore` compares it by value. */
export function getConsentSnapshot(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
      ?.slice(CONSENT_COOKIE_NAME.length + 1) ?? ""
  );
}

export function getConsentServerSnapshot(): string {
  return CONSENT_SERVER_SNAPSHOT;
}

/**
 * Half of the consent proof. The other half is git: `v` pins the decision to
 * a notice whose exact wording and cookie list are committed with a date. A
 * record carrying an older version is treated as absent.
 */
export function parseConsent(raw: string): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentRecord>;
    if (parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      ts: typeof parsed.ts === "string" ? parsed.ts : "",
      id: typeof parsed.id === "string" ? parsed.id : "",
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    };
  } catch {
    // Corrupt or hand-edited. Ask again rather than guess.
    return null;
  }
}

export function writeConsent(choices: ConsentChoices): ConsentRecord {
  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    id: newConsentId(),
    ...choices,
  };
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const value = encodeURIComponent(JSON.stringify(record));
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${
    location.protocol === "https:" ? "; Secure" : ""
  }`;
  for (const listener of listeners) listener();
  return record;
}

function newConsentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Expire the cookies belonging to a category the visitor has just switched
 * off. Without this, withdrawing consent records a refusal while the cookies
 * it refused sit untouched in the browser.
 *
 * A cookie can only be removed on the exact domain and path that set it:
 * Google's and HubSpot's use `.clickmedia.group`, ours is host-only. Every
 * variant is attempted; the spare writes are harmless.
 */
export function clearCookiesForCategory(category: OptionalConsentCategory) {
  if (typeof document === "undefined") return;

  const host = location.hostname;
  const dotted = host.startsWith("www.") ? host.slice(3) : `.${host}`;

  for (const cookie of cookiesForCategory(category)) {
    for (const domain of [undefined, host, dotted]) {
      document.cookie = [
        `${cookie.name}=`,
        "path=/",
        "max-age=0",
        domain ? `domain=${domain}` : "",
      ]
        .filter(Boolean)
        .join("; ");
    }
  }
}

/** Everything off — the state before a choice, and the state a refusal returns to. */
export function deniedConsent(): ConsentChoices {
  return { ...DEFAULT_CONSENT };
}

/**
 * Global Privacy Control — the browser-level "do not sell or share" signal
 * California requires us to honour. Treated as a refusal of everything
 * optional; the visitor can still opt in from Cookie Preferences.
 */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl === true;
}
