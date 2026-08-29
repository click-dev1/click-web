/**
 * GA4 — the only module that talks to gtag.
 *
 * `gtag` itself is defined by the bootstrap script in
 * components/analytics/GoogleAnalytics.tsx, written exactly as Google
 * writes it: `dataLayer.push(arguments)`, pushing the Arguments object
 * rather than an array, because that is what gtag.js reads. Defining it
 * there and only calling it here keeps that one piece of required
 * weirdness in a single place.
 *
 * Every function here is a no-op until the bootstrap has run, so calling
 * them during SSR, before hydration, or with no Measurement ID
 * configured is safe and silent.
 */

/** Unset disables analytics entirely — GoogleAnalytics renders nothing.
 *  That is how development stays out of the property by default. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

/**
 * The consent banner's entire contract with analytics.
 *
 * Call it on mount to replay a stored choice, and again whenever the
 * visitor changes it. Consent Mode defaults everything to denied in the
 * bootstrap, so anything this is not told to grant stays denied — a
 * missing call fails closed, not open.
 */
export function updateConsent(granted: {
  analytics: boolean;
  marketing: boolean;
}) {
  gtag("consent", "update", {
    analytics_storage: granted.analytics ? "granted" : "denied",
    ad_storage: granted.marketing ? "granted" : "denied",
    ad_user_data: granted.marketing ? "granted" : "denied",
    ad_personalization: granted.marketing ? "granted" : "denied",
  });
}

/** Fired by components/analytics/PageViews.tsx, never by gtag itself —
 *  see the `send_page_view: false` note in GoogleAnalytics.tsx. */
export function pageview(path: string) {
  gtag("event", "page_view", { page_path: path });
}

/** Every custom event goes through here: cta_click, generate_lead,
 *  case_study_view, talent_profile_view. */
export function track(name: string, params: Record<string, unknown> = {}) {
  gtag("event", name, params);
}
