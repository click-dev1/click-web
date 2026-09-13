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

export interface Metric {
  _key?: string;
  value: string;
  label: string;
}

/* ---------- Case studies ---------- */

/** Where a case study's figures came from. Drives the disclosure line
    under the results, and keeps unconfirmed campaigns out of the sitemap. */
export type FiguresSource = "client-confirmed" | "verified-public" | "pending";

export interface CaseStudy {
  _id: string;
  brand: string;
  title: string;
  slug: string;
  service: string;
  industry: string;
  platforms: string[];
  insight: string;
  built: string;
  resultsIntro?: string;
  metrics: Metric[];
  proofLine?: string;
  figuresSource: FiguresSource;
  media?: SanityImage;
  mediaLabel?: string;
  featured?: boolean;
  seo?: Seo;
}

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
  asideKind?: "none" | "image" | "note";
  aside?: SanityImage;
  asideLabel?: string;
  asideNote?: { label?: string; text: string; footnote?: string };
  outline?: boolean;
}

export interface CopyMediaBlock {
  _type: "copyMedia";
  _key: string;
  eyebrow?: string;
  heading?: string;
  body: RichText;
  media?: SanityImage[];
  mediaLabels?: string[];
  mediaPosition?: "right" | "left" | "below";
  cta?: Cta;
  insight?: string;
  insightLabel?: string;
  insightFootnote?: string;
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
  items?: string[];
  image?: SanityImage;
  cta?: Cta;
}

export interface CardGridBlock {
  _type: "cardGrid";
  _key: string;
  eyebrow?: string;
  heading?: string;
  numbered?: boolean;
  cards: Card[];
  insight?: string;
  insightLabel?: string;
  insightFootnote?: string;
  footnote?: string;
  cta?: Cta;
}

export interface CaseStudyCard {
  _id: string;
  brand: string;
  title: string;
  slug: string;
  service: string;
  industry: string;
  insight: string;
  metrics: Metric[];
  proofLine?: string;
  media?: SanityImage;
  mediaLabel?: string;
}

export interface TalentCard {
  _id: string;
  name: string;
  slug: string;
  category: string;
  audience: string;
  portrait?: SanityImage;
}

/** Both featured blocks resolve chosen items and an automatic fallback;
    the renderer picks. See the projections in ./queries.ts. */
export interface FeaturedWorkBlock {
  _type: "featuredWork";
  _key: string;
  eyebrow?: string;
  heading: string;
  limit?: number;
  cta?: Cta;
  picked?: CaseStudyCard[];
  auto: CaseStudyCard[];
}

export interface FeaturedTalentBlock {
  _type: "featuredTalent";
  _key: string;
  eyebrow?: string;
  heading: string;
  limit?: number;
  cta?: Cta;
  picked?: TalentCard[];
  auto: TalentCard[];
}

export interface PersonCard {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImage;
  perspective?: string;
  recognition?: string;
}

export interface TeamGridBlock {
  _type: "teamGrid";
  _key: string;
  eyebrow?: string;
  heading: string;
  footnote?: string;
  picked?: PersonCard[];
  auto: PersonCard[];
}

export interface Milestone {
  _key?: string;
  year: string;
  text: string;
}

export interface TimelineBlock {
  _type: "timeline";
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: RichText;
  entries: Milestone[];
}

export interface Award {
  _key?: string;
  line: string;
  detail?: string;
}

export interface RecognitionBlock {
  _type: "recognition";
  _key: string;
  eyebrow?: string;
  entries: Award[];
}

export interface MediaBlock {
  _type: "mediaBlock";
  _key: string;
  eyebrow?: string;
  heading?: string;
  images?: SanityImage[];
  mediaLabels?: string[];
  caption?: string;
}

export interface ActivationScorecardBlock {
  _type: "activationScorecard";
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: RichText;
  label: string;
  source: string;
  metrics: Metric[];
  media?: SanityImage;
  mediaLabel?: string;
  footnote?: string;
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
  | FeaturedWorkBlock
  | FeaturedTalentBlock
  | MediaBlock
  | TeamGridBlock
  | TimelineBlock
  | RecognitionBlock
  | ActivationScorecardBlock
  | CtaBannerBlock;

export interface Page {
  _id: string;
  title: string;
  slug: string;
  seo?: Seo;
  blocks: PageBlock[];
}
