import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchTalentSitemap } from "@/lib/sanity/talent";
import { fetchPageSitemap } from "@/lib/sanity/page";
import { fetchCaseStudySitemap } from "@/lib/sanity/caseStudy";
import { isLegalPublishable, legalPages } from "@/content/legal";

/* Every indexable route.

   The rule throughout: a URL appears here only if it exists on the site
   AND is meant to be found. Talent comes from Sanity, which is what
   /talent and /talent/[slug] render from — the two cannot disagree, and
   the same "talent" cache tag that rebuilds those pages rebuilds this
   file. Case studies come from Sanity too, and join once their figures
   are confirmed; legal pages join once counsel has signed them off. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Only the routes that are still hand-built. As each bespoke page moves
     onto the `page` type its entry comes from Sanity instead, with a real
     lastModified — listing it here as well is how the same URL ends up in
     the file twice. The dedupe at the bottom is the backstop. */
  const statics: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/experiential`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/talent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const legal: MetadataRoute.Sitemap = Object.values(legalPages)
    .filter(isLegalPublishable)
    .map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

  /* The query already excludes case studies hidden from search and those
     still awaiting the client's confirmation of their figures — the job
     isCampaignPublishable() used to do in content/site.ts. */
  const cases: MetadataRoute.Sitemap = (await fetchCaseStudySitemap()).map((c) => ({
    url: `${siteUrl}/work/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const talent: MetadataRoute.Sitemap = (await fetchTalentSitemap()).map((t) => ({
    url: `${siteUrl}/talent/${t.slug}`,
    lastModified: new Date(t._updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /* Pages CLICK assembles in the CMS. Unlike talent, an empty list is a
     legitimate state — there simply may not be any yet. Editors keep a
     page out of here with SEO → "Hide from search engines". */
  const cmsPages: MetadataRoute.Sitemap = (await fetchPageSitemap()).map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /* One entry per URL. A page that has migrated to the CMS would
     otherwise appear twice — once from the hardcoded list above and once
     from Sanity — and duplicate <loc>s are a real SEO defect, not a
     cosmetic one. The CMS entry wins: it carries a lastModified. */
  const all = [...statics, ...legal, ...cases, ...talent, ...cmsPages];
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of all) byUrl.set(entry.url, entry);
  return [...byUrl.values()];
}
