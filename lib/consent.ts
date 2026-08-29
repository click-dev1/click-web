/**
 * COOKIE CONSENT — the one inventory the whole site reads from.
 *
 * Three things render from this file and therefore cannot disagree:
 *
 *   - the Cookie Policy's cookie table and its "who processes" list
 *     (content/legal.ts)
 *   - the consent banner and the preferences panel (components/consent)
 *   - the version stamped into the visitor's stored decision, and the
 *     cookies expired when a category is switched back off
 *
 * Add a vendor here and the policy, the panel and the stored version all
 * move together. This is the pattern the sister site (hatchet-web,
 * lib/config/consent.ts) settled on after its policy and its banner
 * described two different sites; it is copied here on purpose.
 *
 * ⚠️  BUMP `CONSENT_VERSION` WHENEVER THE INVENTORY CHANGES MATERIALLY —
 *     a new vendor, a new purpose, a new category. Not for a typo.
 *
 * A stored decision carrying an older version is treated as absent, so
 * every visitor is asked again. That is the point: consent given for two
 * vendors is not consent for a third.
 *
 * ⚠️  Durations are the vendors' documented values. Before launch, confirm
 *     every row in a real browser against staging with consent granted —
 *     a documented default and a shipped default are not always the same
 *     number, and a dependency can set a cookie without a script tag ever
 *     appearing in a grep (the sister site found its video player's cookie
 *     that way).
 */

/** Non-essential categories a visitor can actually decide about. */
export type OptionalConsentCategory = "analytics" | "marketing";

export type ConsentCategory = "essential" | OptionalConsentCategory;

/** What a visitor chose. Essential is absent — it is not a choice. */
export type ConsentChoices = Record<OptionalConsentCategory, boolean>;

/** Bump on any material change to `cookieInventory`. */
export const CONSENT_VERSION = 1;

/** First-party cookie holding the decision. Read before any tracking loads. */
export const CONSENT_COOKIE_NAME = "click_consent";

/**
 * How long a decision stands before we ask again. Twelve months is the
 * figure UK (ICO) and most EU guidance settle on; nothing that applies to
 * an Australian controller asks for less.
 */
export const CONSENT_MAX_AGE_DAYS = 365;

/**
 * GA4 property for www.clickmedia.group — named here only so the cookie
 * table can print the `_ga_<id>` cookie. Whether the tag renders at all is
 * decided by NEXT_PUBLIC_GA_MEASUREMENT_ID (lib/analytics.ts): unset means
 * no tag, which is how dev and preview deployments stay out of the property.
 */
export const GA_PROPERTY = "G-J6GF6EL37B";

/** Domain the policy names and the cookies are scoped to. */
export const SITE_DOMAIN = "clickmedia.group";

export type CookieEntry = {
  /** Exact cookie name as it appears in the browser. */
  name: string;
  vendor: string;
  category: ConsentCategory;
  /** Plain-language purpose. Ends up verbatim in the Cookie Policy. */
  purpose: string;
  duration: string;
  domain: string;
};

/**
 * Every cookie this site can set, and nothing it cannot.
 *
 * Not listed, deliberately: Microsoft Clarity (not yet elected — add its
 * seven cookies and bump the version if it is), and Google's `_gcl_au`
 * (only appears once a Google Ads account is linked; that is the day the
 * Marketing category gets its first cookie and shows up in the panel).
 */
/* Verified in a real browser on 2026-08-29 against a production build:
   with no consent, the only cookie present is Cloudflare's `__cf_bm` on
   HubSpot's domains (from the form-embed loader), before and after the
   contact modal is opened. Accepting sets exactly the GA4 and HubSpot rows
   below; rejecting afterwards removes them and adds `__hs_do_not_track`. */
export const cookieInventory: CookieEntry[] = [
  {
    name: CONSENT_COOKIE_NAME,
    vendor: "CLICK",
    category: "essential",
    purpose:
      "Stores your own cookie choices, the version of the notice you were shown, and when you made them, so we honour your decision and do not ask again on every page.",
    duration: "12 months",
    domain: `www.${SITE_DOMAIN}`,
  },
  {
    name: "__hs_do_not_track",
    vendor: "HubSpot",
    category: "essential",
    purpose:
      "Set only if you withdraw analytics consent after giving it. Tells HubSpot's script to stop tracking you for the rest of your visit.",
    duration: "6 months",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: "__cf_bm",
    vendor: "Cloudflare",
    category: "essential",
    purpose:
      "Set by Cloudflare, which protects HubSpot's servers, when the contact form's loader is fetched. Tells a person from a bot; carries no identity of yours across sites. Set on HubSpot's own domains, not ours.",
    duration: "30 minutes",
    domain: ".hsforms.net / .hsforms.com",
  },
  {
    name: "_ga",
    vendor: "Google Analytics 4",
    category: "analytics",
    purpose:
      "Tells returning visitors apart by assigning a random identifier, so visits, sessions and campaign data can be counted.",
    duration: "2 years",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: `_ga_${GA_PROPERTY.replace(/^G-/, "")}`,
    vendor: "Google Analytics 4",
    category: "analytics",
    purpose: `Keeps session state for the Google Analytics property identified by ${GA_PROPERTY}.`,
    duration: "2 years",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: "__hstc",
    vendor: "HubSpot",
    category: "analytics",
    purpose:
      "HubSpot's main tracking cookie. Records the domain, a visitor identifier and the timestamps of the first, previous and current visit.",
    duration: "6 months",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: "hubspotutk",
    vendor: "HubSpot",
    category: "analytics",
    purpose:
      "Identifies a visitor across pages and visits, and is what lets an enquiry you submit be joined to the pages you looked at beforehand.",
    duration: "6 months",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: "__hssc",
    vendor: "HubSpot",
    category: "analytics",
    purpose: "Tracks a single browsing session and counts its page views.",
    duration: "30 minutes",
    domain: `.${SITE_DOMAIN}`,
  },
  {
    name: "__hssrc",
    vendor: "HubSpot",
    category: "analytics",
    purpose:
      "Records whether you restarted your browser, so HubSpot can tell a new session from a continued one.",
    duration: "Session",
    domain: `.${SITE_DOMAIN}`,
  },
];

export type ConsentCategoryDefinition = {
  id: ConsentCategory;
  label: string;
  description: string;
  /** Essential cannot be switched off, so its toggle is locked on. */
  required: boolean;
};

export const consentCategories: ConsentCategoryDefinition[] = [
  {
    id: "essential",
    label: "Essential",
    description:
      "Needed for the site to work — including remembering the cookie choice you make here. These are exempt from consent, so they cannot be switched off.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Let us count visitors and see which pages are useful, and let HubSpot join an enquiry you send us to the pages you read first. Nothing loads until you allow it.",
    required: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Allow measurement data to be used for advertising — for example, to tell whether an advertisement led to an enquiry.",
    required: false,
  },
];

/**
 * Everything off. The state before anyone has chosen, and the state a
 * rejection returns to.
 *
 * Never flip a default here to `true`. Pre-ticked boxes are not consent,
 * and this constant is the only thing standing between the banner and
 * that bug.
 */
export const DEFAULT_CONSENT: ConsentChoices = {
  analytics: false,
  marketing: false,
};

export function cookiesForCategory(category: ConsentCategory): CookieEntry[] {
  return cookieInventory.filter((cookie) => cookie.category === category);
}

/**
 * Categories worth showing a visitor. A category with no cookie in it is
 * hidden from the panel and the policy — asking someone to decide about
 * nothing is noise, and the day it gets a cookie is a version bump anyway.
 */
export function visibleConsentCategories(): ConsentCategoryDefinition[] {
  return consentCategories.filter(
    (c) => c.required || cookiesForCategory(c.id).length > 0,
  );
}

/** Third parties that process cookie data — derived, so it cannot go stale. */
export function cookieVendors(): string[] {
  const seen = new Set<string>();
  for (const cookie of cookieInventory) {
    if (cookie.vendor !== "CLICK") seen.add(cookie.vendor);
  }
  return [...seen];
}

/* HubSpot's command queue. gtag/dataLayer are declared in lib/analytics.ts. */
declare global {
  interface Window {
    _hsq?: unknown[][];
  }
}
