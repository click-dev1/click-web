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

/* ---------- Pages ---------- */

/** Portable Text — the shape `body` fields come back as. */
export type RichText = unknown[];

export interface Cta {
  _key?: string;
  label: string;
  destination: "modal" | "internal" | "external";
  href?: string;
  style?: "primary" | "ghost";
}

export interface PageHeroBlock {
  _type: "pageHero";
  _key: string;
  eyebrow: string;
  title: string;
  kicker?: string;
  lede?: string;
  ctas?: Cta[];
  aside?: SanityImage;
  outline?: boolean;
}

export interface CopyMediaBlock {
  _type: "copyMedia";
  _key: string;
  eyebrow?: string;
  heading: string;
  body: RichText;
  media?: SanityImage;
  mediaPosition?: "right" | "left" | "below";
  insight?: string;
}

export interface Metric {
  _key?: string;
  value: string;
  label: string;
}

export interface MetricRowBlock {
  _type: "metricRow";
  _key: string;
  eyebrow?: string;
  heading?: string;
  metrics: Metric[];
  footnote?: string;
}

export interface CapabilityGroup {
  _key?: string;
  label: string;
  items: string[];
}

export interface CapabilityListBlock {
  _type: "capabilityList";
  _key: string;
  eyebrow?: string;
  heading: string;
  groups: CapabilityGroup[];
}

export interface Card {
  _key?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  image?: SanityImage;
  cta?: Cta;
}

export interface CardGridBlock {
  _type: "cardGrid";
  _key: string;
  eyebrow?: string;
  heading: string;
  numbered?: boolean;
  cards: Card[];
  cta?: Cta;
}

export interface CtaBannerBlock {
  _type: "ctaBanner";
  _key: string;
  heading: string;
  body?: string;
  cta: Cta;
}

export type PageBlock =
  | PageHeroBlock
  | CopyMediaBlock
  | MetricRowBlock
  | CapabilityListBlock
  | CardGridBlock
  | CtaBannerBlock;

export interface Page {
  _id: string;
  title: string;
  slug: string;
  seo?: Seo;
  blocks: PageBlock[];
}
