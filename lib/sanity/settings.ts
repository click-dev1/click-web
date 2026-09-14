import { assertPresent, client, previewDrafts } from "./client";
import { navigationQuery, siteSettingsQuery } from "./queries";
import type { Navigation, SiteSettings } from "./types";

/* The nav and the footer render on every page, so these two reads happen
   once in the root layout and are handed down as props rather than
   fetched per component — Nav is a client component and could not fetch
   them anyway.

   Tagged with their own document types, like everything else, so editing
   the menu in the Studio rebuilds every page that shows it. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["siteSettings", "navigation"] } };

export const fetchSiteSettings = () =>
  client
    .fetch<SiteSettings | null>(siteSettingsQuery, {}, readOptions)
    .then((d) => assertPresent(d, "site settings"));

export const fetchNavigation = () =>
  client
    .fetch<Navigation | null>(navigationQuery, {}, readOptions)
    .then((d) => assertPresent(d, "navigation"));
