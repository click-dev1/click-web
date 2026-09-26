import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/* "Used on" links at the top of a document in the Studio: where on the
   site this document appears, so an editor can open the preview on the
   right page. Keep in step with the routes in app/(site). */

const at = (title: string | undefined, href: string) => ({ title: title ?? href, href });

export const locations: NonNullable<PresentationPluginOptions["resolve"]>["locations"] = {
  homePage: defineLocations({ message: "The home page", locations: [at("Home", "/")] }),
  workPage: defineLocations({ message: "The Work page", locations: [at("Work", "/work")] }),
  page: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (d) => (d?.slug ? { locations: [at(d.title, `/${d.slug}`)] } : undefined),
  }),
  talent: defineLocations({
    select: { title: "name", slug: "slug.current" },
    resolve: (d) =>
      d?.slug
        ? { locations: [at(d.title, `/talent/${d.slug}`), at("Talent Directory", "/talent")] }
        : undefined,
  }),
  caseStudy: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (d) =>
      d?.slug ? { locations: [at(d.title, `/work/${d.slug}`), at("Work", "/work")] } : undefined,
  }),
  article: defineLocations({
    select: { title: "title", slug: "slug.current", kind: "kind" },
    resolve: (d) => {
      if (!d?.slug) return undefined;
      const base = d.kind === "news" ? "/news" : "/insights";
      return { locations: [at(d.title, `${base}/${d.slug}`), at(undefined, base)] };
    },
  }),
  pressItem: defineLocations({ message: "Listed on the Press page", locations: [at("Press", "/press")] }),
  legalPage: defineLocations({
    select: { title: "title", slug: "slug" },
    resolve: (d) => (d?.slug ? { locations: [at(d.title, `/${d.slug}`)] } : undefined),
  }),
  person: defineLocations({ message: "Shown on the About page", locations: [at("About", "/about")] }),
  siteSettings: defineLocations({ message: "Used on every page (nav, footer)", locations: [at("Home", "/")] }),
  navigation: defineLocations({ message: "The menu and footer on every page", locations: [at("Home", "/")] }),
};
