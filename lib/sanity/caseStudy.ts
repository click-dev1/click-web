import { assertPopulated, client, previewDrafts } from "./client";
import {
  caseStudiesQuery,
  caseStudyBySlugQuery,
  caseStudySitemapQuery,
  caseStudySlugsQuery,
  workPageQuery,
} from "./queries";
import type { CaseStudy, WorkPage } from "./types";

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

/* The /work singleton. Allowed to be missing — the page falls back to its
   built-in copy — so the route renders before the document is seeded. */
const workPageReadOptions = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["workPage"] } };

export const fetchWorkPage = () =>
  client.fetch<WorkPage | null>(workPageQuery, {}, workPageReadOptions);
