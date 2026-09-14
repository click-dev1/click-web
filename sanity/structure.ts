import type { StructureResolver } from "sanity/structure";

/* The Studio sidebar. Explicit rather than auto-generated so the order
   matches how the marketing team thinks about the site, and so
   singletons are pinned at the top instead of appearing as lists of one.
   Home joins them when it is built. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      /* Singletons are pinned, not listed: there is only ever one of
         each, and a "list" of one is a door with a corridor behind it. */
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("talent").title("Talent"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("person").title("Team"),
    ]);
