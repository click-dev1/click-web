import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/* One entry while the home page is the whole site; extend as the
   Solutions / Talent / Company routes are built. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
