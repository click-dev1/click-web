import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { isLegalPublishable, legalPages } from "@/content/legal";

/* One entry while the home page is the whole site; extend as the
   Solutions / Talent / Company routes are built. Legal pages join once
   their text is signed off (content/legal.ts) — until then they are
   noindex and stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
  ];
  const legal: MetadataRoute.Sitemap = Object.values(legalPages)
    .filter(isLegalPublishable)
    .map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      changeFrequency: "yearly",
      priority: 0.3,
    }));
  return [...home, ...legal];
}
