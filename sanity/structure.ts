import type { StructureResolver } from "sanity/structure";

/* The Studio sidebar. Explicit rather than auto-generated so the order
   matches how the marketing team thinks about the site, and so singletons
   (added later: Site settings, Navigation, Home) can be pinned at the top
   instead of appearing as lists of one. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("talent").title("Talent"),
    ]);
