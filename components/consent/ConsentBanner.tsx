"use client";

import Link from "next/link";
import { useConsent } from "./ConsentProvider";

/**
 * The first-visit notice. A region at the foot of the viewport, not a
 * modal: the site stays usable behind it, and nothing optional loads until
 * it is answered.
 *
 * ⚠️  "Reject All" and "Accept All" are the same size and sit side by side.
 *     The moment refusing becomes a text link while accepting stays a
 *     button, the banner fails the test regulators actually apply. There is
 *     no dismiss ✕ for the same reason — closing is not a decision, and a
 *     visitor who scrolls past has consented to nothing.
 */
export default function ConsentBanner() {
  const { acceptAll, rejectAll, openPreferences } = useConsent();

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="consent-banner"
      data-consent-banner
    >
      <div className="consent-banner-inner">
        <div>
          <p className="eyebrow mb-2">
            <span className="tick">◉</span> Cookies
          </p>
          <h2 className="font-display text-h3">We use cookies.</h2>
          <p className="mt-2 max-w-xl text-sm leading-body opacity-85">
            Only what the site needs to work is set unless you allow more.
            With your permission we count visits and see which pages are
            useful. Read our{" "}
            <Link href="/cookie-policy" className="underline underline-offset-4">
              Cookie Policy
            </Link>{" "}
            or{" "}
            <Link href="/privacy-policy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="consent-banner-actions">
          <button type="button" className="btn-ghost consent-btn" onClick={rejectAll}>
            Reject All
          </button>
          <button type="button" className="btn-primary consent-btn" onClick={acceptAll}>
            Accept All
          </button>
          <button
            type="button"
            className="consent-link"
            onClick={openPreferences}
          >
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
