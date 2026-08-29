"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";
import { HUBSPOT_FORM } from "@/components/contact/hubspot";
import { GA_ID } from "@/lib/analytics";
import HubSpotRouteTracker from "./HubSpotRouteTracker";

/**
 * HubSpot's tracking script — the thing that sets `hubspotutk`, `__hstc`
 * and friends and joins a form submission to the pages read beforehand.
 *
 * Rendered only once analytics consent is true: no consent, no script tag.
 * Also off wherever GA is off (no NEXT_PUBLIC_GA_MEASUREMENT_ID) — one
 * switch decides whether an environment reports to anyone.
 * A visitor who refuses submits the enquiry form anonymously — HubSpot
 * still receives it, it just carries no browsing history. That is the
 * correct outcome, and it will show up as fewer attributed enquiries.
 *
 * The script cannot be un-loaded once it has run, so withdrawal is handled
 * two ways: the provider expires the cookies, and this tells HubSpot to
 * stop tracking for the rest of the visit.
 */
const SRC = `https://js.hs-scripts.com/${HUBSPOT_FORM.portalId}.js`;

export default function HubSpotLoader() {
  const { choices } = useConsent();
  const allowed = Boolean(GA_ID) && choices?.analytics === true;
  const wasAllowed = useRef(false);

  useEffect(() => {
    if (wasAllowed.current && !allowed) {
      window._hsq = window._hsq || [];
      window._hsq.push(["doNotTrack"]);
    }
    if (allowed && wasAllowed.current === false && window._hsq) {
      /* re-granted after a withdrawal in the same visit */
      window._hsq.push(["doNotTrack", { track: true }]);
    }
    wasAllowed.current = allowed;
  }, [allowed]);

  if (!allowed) return null;

  return (
    <>
      {/* The id is load-bearing: HubSpot's own code looks for it. */}
      <Script id="hs-script-loader" src={SRC} strategy="afterInteractive" />
      <HubSpotRouteTracker />
    </>
  );
}
