import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchTalentSitemap } from "@/lib/sanity/talent";
import { fetchPageSitemap } from "@/lib/sanity/page";
import { campaigns, isCampaignPublishable } from "@/content/site";
import { isLegalPublishable, legalPages } from "@/content/legal";

/* Every indexable route.

   The rule throughout: a URL appears here only if it exists on the site
   AND is meant to be found. Talent comes from Sanity, which is what
   /talent and /talent/[slug] render from — the two cannot disagree, and
   the same "talent" cache tag that rebuilds those pages rebuilds this
   file. Case studies and legal pages join once their status says CLICK
   and counsel have signed them off. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/influencer-marketing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/experiential`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/talent-management`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/talent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const legal: MetadataRoute.Sitemap = Object.values(legalPages)
    .filter(isLegalPublishable)
    .map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

  const cases: MetadataRoute.Sitemap = campaigns
    .filter(isCampaignPublishable)
    .map((c) => ({
      url: `${siteUrl}/work/${c.slug}`,
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

  return [...statics, ...legal, ...cases, ...talent, ...cmsPages];
}
