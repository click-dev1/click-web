import { assertPopulated, sanityFetch } from "./client";
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
   webhook can invalidate them. See the comment there for why the TTL is
   finite and why it is not 0. */
const tags = ["caseStudy"];

export const fetchCaseStudies = () =>
  sanityFetch<CaseStudy[]>(caseStudiesQuery, {}, tags)
    .then((rows) => assertPopulated(rows, "case studies"));

export const fetchCaseStudy = (slug: string) =>
  sanityFetch<CaseStudy | null>(caseStudyBySlugQuery, { slug }, tags);

export const fetchCaseStudySlugs = () =>
  sanityFetch<string[]>(caseStudySlugsQuery, {}, tags)
    .then((rows) => assertPopulated(rows, "case study slugs"));

/** Slug + last-modified for every publishable case study, for app/sitemap.ts. */
export const fetchCaseStudySitemap = () =>
  sanityFetch<{ slug: string; _updatedAt: string }[]>(
    caseStudySitemapQuery,
    {},
    tags,
  );

/* The /work singleton. Allowed to be missing — the page falls back to its
   built-in copy — so the route renders before the document is seeded. */
const workPageTags = ["workPage"];

export const fetchWorkPage = () =>
  sanityFetch<WorkPage | null>(workPageQuery, {}, workPageTags);
