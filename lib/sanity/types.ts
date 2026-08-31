/* Shapes of what the queries in ./queries.ts return. Hand-written for
   now; `sanity typegen` can generate these once the schema settles. */

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  credit?: string;
  lqip?: string;
  aspectRatio?: number;
}

export interface Seo {
  title?: string;
  description?: string;
  image?: SanityImage;
  noIndex?: boolean;
}

export interface PlatformPresence {
  platform: string;
  handle?: string;
  url?: string;
  audience?: string;
}

export interface Talent {
  _id: string;
  name: string;
  slug: string;
  category: string;
  platforms: PlatformPresence[];
  audience: string;
  region: string;
  location?: string;
  managed?: boolean;
  bio: string;
  partners: string[];
  ventures: string[];
  featured?: boolean;
  portrait?: SanityImage;
  story: { label: string; text: string }[];
  seo?: Seo;
}

/** Platform names in display order — the shape the old string[] had. */
export const platformNames = (t: Pick<Talent, "platforms">) =>
  (t.platforms ?? []).map((p) => p.platform);
