import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { campaigns, roster } from "@/content/site";

/* Every indexable route. /privacy is noindex until the legal text lands,
   so it stays out. Case studies and talent profiles come from the same
   data that renders them — a page exists here iff it exists on the site. */
export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/influencer-marketing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/talent-management`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/talent`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];
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
  return [...statics, ...cases, ...talent];
}
