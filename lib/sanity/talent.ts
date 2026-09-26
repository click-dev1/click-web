import { assertPopulated, sanityFetch } from "./client";
import {
  rosterQuery,
  talentBySlugQuery,
  talentSitemapQuery,
  talentSlugsQuery,
} from "./queries";
import type { Talent } from "./types";

/* Server-side accessors, all through sanityFetch (./client).

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

   Draft reads for a local SANITY_PREVIEW_DRAFTS build pass no cache
   directive: `revalidate: 0` would opt the route out of prerendering, and
   every page here must ship as static HTML (SOW §2). An editor previewing
   from the Studio is a different path — see sanityFetch in ./client. */
const tags = ["talent"];

export const fetchRoster = () =>
  sanityFetch<Talent[]>(rosterQuery, {}, tags)
    .then((rows) => assertPopulated(rows, "talent"));

export const fetchTalent = (slug: string) =>
  sanityFetch<Talent | null>(talentBySlugQuery, { slug }, tags);

export const fetchTalentSlugs = () =>
  sanityFetch<string[]>(talentSlugsQuery, {}, tags)
    .then((rows) => assertPopulated(rows, "talent slugs"));

/** Slug + last-modified for every profile, for app/sitemap.ts. */
export const fetchTalentSitemap = () =>
  sanityFetch<{ slug: string; _updatedAt: string }[]>(
    talentSitemapQuery,
    {},
    tags,
  );
