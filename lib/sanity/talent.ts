import { assertPopulated, client, previewDrafts } from "./client";
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
