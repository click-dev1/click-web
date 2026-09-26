import { assertPresent, sanityFetch } from "./client";
import { homePageQuery } from "./queries";
import type { HomePage } from "./types";

/* The home page is a singleton with editable copy per section — see
   sanity/schemaTypes/homePage.ts for why it is not a block canvas.

   Tagged with both types it reads: editing the home document rebuilds it,
   and so does publishing a case study, because the featured work section
   resolves from those. */
const tags = ["homePage", "caseStudy"];

export const fetchHomePage = () =>
  sanityFetch<HomePage | null>(homePageQuery, {}, tags)
    .then((d) => assertPresent(d, "the home page"));
