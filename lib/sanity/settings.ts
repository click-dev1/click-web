import { assertPresent, sanityFetch } from "./client";
import { navigationQuery, siteSettingsQuery } from "./queries";
import type { Navigation, SiteSettings } from "./types";

/* The nav and the footer render on every page, so these two reads happen
   once in the root layout and are handed down as props rather than
   fetched per component — Nav is a client component and could not fetch
   them anyway.

   Tagged with their own document types, like everything else, so editing
   the menu in the Studio rebuilds every page that shows it. */
const tags = ["siteSettings", "navigation"];

export const fetchSiteSettings = () =>
  sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, tags)
    .then((d) => assertPresent(d, "site settings"));

export const fetchNavigation = () =>
  sanityFetch<Navigation | null>(navigationQuery, {}, tags)
    .then((d) => assertPresent(d, "navigation"));
