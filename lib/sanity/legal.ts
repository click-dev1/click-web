import { assertPresent, sanityFetch } from "./client";
import { legalPageQuery, legalSitemapQuery } from "./queries";
import type { LegalPageDoc, LegalSlug } from "./types";

/* The three legal documents. Same caching contract as everything else:
   tagged "legalPage" so a publish rebuilds the page. A missing document
   fails the build loudly — a site without its privacy policy must not
   ship green. */
const tags = ["legalPage"];

export const fetchLegalPage = (slug: LegalSlug) =>
  sanityFetch<LegalPageDoc | null>(legalPageQuery, { slug }, tags)
    .then((d) => assertPresent(d, `legal page "${slug}"`));

export const fetchLegalSitemap = () =>
  sanityFetch<{ slug: LegalSlug; _updatedAt: string }[]>(legalSitemapQuery, {}, tags);
