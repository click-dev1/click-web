import { assertPopulated, client, previewDrafts } from "./client";
import {
  caseStudiesQuery,
  caseStudyBySlugQuery,
  caseStudySitemapQuery,
  caseStudySlugsQuery,
} from "./queries";
import type { CaseStudy } from "./types";

/* Server-side accessors for case studies. Same contract as ./talent:
   published reads are cached and tagged with the document type so the
   webhook can invalidate them, draft reads pass no cache directive. See
   the comment there for why the TTL is finite and why it is not 0. */
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["caseStudy"] } };

export const fetchCaseStudies = () =>
  client
    .fetch<CaseStudy[]>(caseStudiesQuery, {}, readOptions)
    .then((rows) => assertPopulated(rows, "case studies"));

export const fetchCaseStudy = (slug: string) =>
  client.fetch<CaseStudy | null>(caseStudyBySlugQuery, { slug }, readOptions);

export const fetchCaseStudySlugs = () =>
  client
    .fetch<string[]>(caseStudySlugsQuery, {}, readOptions)
    .then((rows) => assertPopulated(rows, "case study slugs"));

/** Slug + last-modified for every publishable case study, for app/sitemap.ts. */
export const fetchCaseStudySitemap = () =>
  client.fetch<{ slug: string; _updatedAt: string }[]>(
    caseStudySitemapQuery,
    {},
    readOptions,
  );
