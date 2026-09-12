import { client, previewDrafts } from "./client";
import {
  rosterQuery,
  talentBySlugQuery,
  talentSitemapQuery,
  talentSlugsQuery,
} from "./queries";
import type { Talent } from "./types";

/* Server-side accessors.

Published reads are cached and tagged with the document type, so the
   Sanity webhook (app/api/revalidate) can invalidate exactly the pages an
   edit touches.

   The TTL is a safety net, not the mechanism. `revalidate: false` was
   wrong here: it caches indefinitely, and Next persists that entry in
   .next/cache which Vercel restores between deployments — so a build
   could bake content captured at an EARLIER build and never notice. That
   is how a published page stayed out of the sitemap. A finite TTL means a
   missed or misconfigured webhook self-heals within the hour instead of
   surviving deploys.

   Draft reads pass no cache directive at all. They must not be cached —
   an editor has to see their own unpublished change on the next reload —
   but they must not say `revalidate: 0` either: that opts the route out
   of prerendering, and every page here is required to ship as static
   HTML (SOW §2). An untagged, undirected fetch is uncached at request
   time in dev and still baked in at build time, which is both. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["talent"] } };

/* A private dataset does not reject an unauthorised read — it returns an
   empty result set. So a build with a missing or wrong
   SANITY_API_READ_TOKEN succeeds and silently ships a site with no
   creators at all, green build, no error anywhere. An empty roster is
   never a legitimate state for this site, so treat it as the
   misconfiguration it always is and fail the build loudly. */
function assertPopulated<T>(rows: T[], what: string): T[] {
  if (!rows.length) {
    throw new Error(
      `Sanity returned no ${what}. This is almost always a missing or ` +
        `invalid SANITY_API_READ_TOKEN — the dataset is private, and an ` +
        `unauthorised read comes back empty rather than failing. See docs/SANITY.md.`,
    );
  }
  return rows;
}

export const fetchRoster = () =>
  client
    .fetch<Talent[]>(rosterQuery, {}, readOptions)
    .then((rows) => assertPopulated(rows, "talent"));

export const fetchTalent = (slug: string) =>
  client.fetch<Talent | null>(talentBySlugQuery, { slug }, readOptions);

export const fetchTalentSlugs = () =>
  client
    .fetch<string[]>(talentSlugsQuery, {}, readOptions)
    .then((rows) => assertPopulated(rows, "talent slugs"));

/** Slug + last-modified for every profile, for app/sitemap.ts. */
export const fetchTalentSitemap = () =>
  client.fetch<{ slug: string; _updatedAt: string }[]>(
    talentSitemapQuery,
    {},
    readOptions,
  );
