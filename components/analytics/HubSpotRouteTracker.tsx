"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * HubSpot's script records one page view — the page it loaded on. Client
 * side navigations in Next don't reload, so each one is reported by hand.
 * The first run is skipped: the script already counted the landing page.
 *
 * `usePathname` only, deliberately — `useSearchParams` would force a
 * Suspense boundary above the whole layout.
 */
export default function HubSpotRouteTracker() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    window._hsq = window._hsq || [];
    window._hsq.push(["setPath", pathname]);
    window._hsq.push(["trackPageView"]);
  }, [pathname]);

  return null;
}
