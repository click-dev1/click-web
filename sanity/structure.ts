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
        .title("Home page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Work page")
        .id("workPage")
        .child(S.document().schemaType("workPage").documentId("workPage")),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("talent").title("Talent"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("person").title("Team"),
      S.divider(),
      S.documentTypeListItem("article").title("Insights & news"),
      S.documentTypeListItem("pressItem").title("Press"),
      S.divider(),
      /* Fixed documents, like the singletons: legal text is edited, never
         created or deleted from the sidebar. */
      S.listItem()
        .title("Legal pages")
        .id("legalPages")
        .child(
          S.list()
            .title("Legal pages")
            .items(
              [
                ["privacy-policy", "Privacy Policy"],
                ["cookie-policy", "Cookie Policy"],
                ["terms-of-use", "Terms of Use"],
              ].map(([slug, title]) =>
                S.listItem()
                  .title(title)
                  .id(`legalPage-${slug}`)
                  .child(S.document().schemaType("legalPage").documentId(`legalPage-${slug}`)),
              ),
            ),
        ),
    ]);
