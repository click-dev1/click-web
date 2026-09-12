import { client, previewDrafts } from "./client";
import { pageBySlugQuery, pageSitemapQuery, pageSlugsQuery } from "./queries";
import type { Page } from "./types";

/* Cached and tagged "page" — the same convention every type follows, so
   app/api/revalidate needs no knowledge of this file.

   The one-hour TTL is a safety net: an indefinite cache entry survives in
   .next/cache across deployments, which is how a published page can stay
   out of a freshly built sitemap. See docs/SANITY.md. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["page"] } };

export const fetchPage = (slug: string) =>
  client.fetch<Page | null>(pageBySlugQuery, { slug }, readOptions);

export const fetchPageSlugs = () =>
  client.fetch<string[]>(pageSlugsQuery, {}, readOptions);

export const fetchPageSitemap = () =>
  client.fetch<{ slug: string; _updatedAt: string }[]>(
    pageSitemapQuery,
    {},
    readOptions,
  );
