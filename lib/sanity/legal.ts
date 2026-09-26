import { assertPresent, client, previewDrafts } from "./client";
import { legalPageQuery, legalSitemapQuery } from "./queries";
import type { LegalPageDoc, LegalSlug } from "./types";

/* The three legal documents. Same caching contract as everything else:
   tagged "legalPage" so a publish rebuilds the page. A missing document
   fails the build loudly — a site without its privacy policy must not
   ship green. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["legalPage"] } };

export const fetchLegalPage = (slug: LegalSlug) =>
  client
    .fetch<LegalPageDoc | null>(legalPageQuery, { slug }, readOptions)
    .then((d) => assertPresent(d, `legal page "${slug}"`));

export const fetchLegalSitemap = () =>
  client.fetch<{ slug: LegalSlug; _updatedAt: string }[]>(legalSitemapQuery, {}, readOptions);
