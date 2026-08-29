import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { campaigns, roster } from "@/content/site";
import { isLegalPublishable, legalPages } from "@/content/legal";

/* Every indexable route. Legal pages join once their text is signed off
   (content/legal.ts) — until then they are noindex and stay out. Case
   studies and talent profiles come from the same data that renders them —
   a page exists here iff it exists on the site. */
export default function sitemap(): MetadataRoute.Sitemap {
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
  const cases: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${siteUrl}/work/${c.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));
  const talent: MetadataRoute.Sitemap = roster.map((t) => ({
    url: `${siteUrl}/talent/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...statics, ...legal, ...cases, ...talent];
}
