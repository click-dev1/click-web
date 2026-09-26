import { urlFor } from "@/lib/sanity/image";
import { ARTICLE_SECTIONS, articlePath } from "@/lib/sanity/article";
import type { Article, CaseStudy, SanityImage, Talent } from "@/lib/sanity/types";
import { siteUrl } from "@/lib/site";

/**
 * Structured data (JSON-LD) builders — SOW §5's schema set.
 *
 * The rule is Google's and the blueprint's: describe only what the page
 * visibly says. Every value here is read from the same Sanity document the
 * page renders, so an edit in the Studio changes both at once and they
 * cannot drift. Nothing is added that a reader could not see.
 *
 * Nodes point at each other by @id, so the organisation declared once in
 * the site layout (components/StructuredData.tsx) is the same entity a case
 * study credits.
 */

export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

type Node = Record<string, unknown>;

/**
 * JSON for a <script type="application/ld+json">. JSON.stringify alone is
 * not safe there: the HTML parser ends the script at the first "</script",
 * whatever the JSON thinks, so a CMS string containing it could close the
 * tag and inject markup. Escaping <, > and & as \u sequences keeps the JSON
 * identical to a parser and inert to HTML. U+2028/2029 are escaped too, for
 * older JavaScript parsers.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export const absolute = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);

function imageUrl(image?: SanityImage): string | undefined {
  return image?.asset ? urlFor(image).width(1200).url() : undefined;
}

/** Only http(s) links reach sameAs — a CMS url field accepts other schemes. */
const httpOnly = (urls: (string | undefined)[]) =>
  urls.filter((u): u is string => !!u && /^https?:\/\//i.test(u));

/**
 * The trail a reader sees in the page's eyebrow, starting from Home.
 * Pass the crumbs below home; the last one is the current page.
 */
export function breadcrumbList(crumbs: { name: string; path: string }[]): Node {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${absolute(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

/**
 * A creator's profile: a ProfilePage whose main entity is the creator — a
 * Person, or an Organization when the profile is a group channel.
 */
export function talentProfile(t: Talent): Node[] {
  const url = absolute(`/talent/${t.slug}`);
  const creator: Node = {
    "@type": t.entityType === "group" ? "Organization" : "Person",
    "@id": `${url}#creator`,
    name: t.name,
    url,
    description: t.bio,
    image: imageUrl(t.portrait),
    sameAs: httpOnly(t.platforms.map((p) => p.url)),
    knowsAbout: t.category,
    ...(t.location
      ? t.entityType === "group"
        ? { location: { "@type": "Place", name: t.location } }
        : { homeLocation: { "@type": "Place", name: t.location } }
      : {}),
  };
  return [
    {
      "@type": "ProfilePage",
      "@id": url,
      url,
      name: t.name,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": `${url}#creator` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    creator,
    breadcrumbList([
      { name: "Talent Directory", path: "/talent" },
      { name: t.name, path: `/talent/${t.slug}` },
    ]),
  ];
}

/**
 * A case study as the CreativeWork it documents. The creator is whoever
 * the page credits: CLICK for its own work, GameSquare for the group's
 * activations — the same line AttributionBadge draws for a reader.
 */
export function caseStudyWork(c: CaseStudy): Node[] {
  const url = absolute(`/work/${c.slug}`);
  return [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: `${c.brand} — ${c.title}`,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": `${url}#work` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      url,
      name: `${c.brand} — ${c.title}`,
      headline: c.headline ?? c.title,
      description: c.insight,
      image: imageUrl(c.media),
      genre: c.industry,
      keywords: c.platforms.join(", "),
      sponsor: { "@type": "Organization", name: c.brand },
      creator:
        c.attribution === "gamesquare"
          ? { "@type": "Organization", name: "GameSquare" }
          : { "@id": ORG_ID },
    },
    breadcrumbList([
      { name: "Work", path: "/work" },
      { name: `${c.brand} — ${c.title}`, path: `/work/${c.slug}` },
    ]),
  ];
}

/**
 * An insight (Article) or a news story (NewsArticle). The author is the
 * team member the byline names, or CLICK itself when it names no one —
 * again, exactly what the page says.
 */
export function articleJsonLd(a: Article): Node[] {
  const path = articlePath(a);
  const url = absolute(path);
  const section = ARTICLE_SECTIONS[a.kind];
  return [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: a.title,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": `${url}#article` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": a.kind === "news" ? "NewsArticle" : "Article",
      "@id": `${url}#article`,
      url,
      headline: a.title,
      description: a.excerpt,
      image: imageUrl(a.mainImage),
      datePublished: a.publishedAt,
      dateModified: a._updatedAt,
      articleSection: section.label,
      author: a.author
        ? { "@type": "Person", name: a.author.name, ...(a.author.role ? { jobTitle: a.author.role } : {}) }
        : { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": url },
    },
    breadcrumbList([
      { name: section.label, path: section.path },
      { name: a.title, path },
    ]),
  ];
}
