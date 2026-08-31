"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/analytics";

/**
 * Pageviews for client-side navigation.
 *
 * App Router navigates with pushState, so without this the `config` call
 * would be the only pageview of the whole visit. Enhanced measurement
 * can catch history events instead, but it fires before React has
 * committed the new document title — the previous page's title gets
 * recorded against the new URL. Firing from an effect happens after the
 * commit, so the pair is correct.
 *
 * The stream's "Page changes based on browser history events" setting is
 * therefore switched OFF in GA4. Turning it back on double-counts every
 * navigation after the first.
 *
 * Mounted inside <Suspense> in the root layout: useSearchParams opts its
 * whole subtree out of static rendering otherwise.
 */
export default function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    /* The Studio is staff tooling, not traffic. */
    if (pathname.startsWith("/studio")) return;
    const qs = searchParams.toString();
    pageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
