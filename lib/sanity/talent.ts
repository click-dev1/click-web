import { client, previewDrafts } from "./client";
import {
  rosterQuery,
  talentBySlugQuery,
  talentSitemapQuery,
  talentSlugsQuery,
} from "./queries";
import type { Talent } from "./types";

/* Server-side accessors.

   Published reads are cached indefinitely and tagged with the document
   type, so the Sanity webhook (app/api/revalidate) can invalidate
   exactly the pages a talent edit touches — and nothing else.

   Draft reads pass no cache directive at all. They must not be cached —
   an editor has to see their own unpublished change on the next reload —
   but they must not say `revalidate: 0` either: that opts the route out
   of prerendering, and every page here is required to ship as static
   HTML (SOW §2). An untagged, undirected fetch is uncached at request
   time in dev and still baked in at build time, which is both. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: false as const, tags: ["talent"] } };

export const fetchRoster = () =>
  client.fetch<Talent[]>(rosterQuery, {}, readOptions);

export const fetchTalent = (slug: string) =>
  client.fetch<Talent | null>(talentBySlugQuery, { slug }, readOptions);

export const fetchTalentSlugs = () =>
  client.fetch<string[]>(talentSlugsQuery, {}, readOptions);

/** Slug + last-modified for every profile, for app/sitemap.ts. */
export const fetchTalentSitemap = () =>
  client.fetch<{ slug: string; _updatedAt: string }[]>(
    talentSitemapQuery,
    {},
    readOptions,
  );
