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
  /** Fill crops to the slot around the hotspot; fit shows the whole image
      on navy. See sanity/schemaTypes/objects/imageDisplay.ts. */
  display?: "fill" | "fit";
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
  /** Person or group, for structured data. Defaults to person in GROQ. */
  entityType: "person" | "group";
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

/* ---------- Site-wide ---------- */

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  email: string;
  socials: SocialLink[];
  legalName: string;
  footerTagline?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type NavItem =
  | ({ _type: "navLink"; _key: string } & NavLink)
  | { _type: "navGroup"; _key: string; label: string; children: NavLink[] };

export interface FooterColumn {
  _key: string;
  label: string;
  links: (NavLink & { external?: boolean })[];
}

export interface Navigation {
  main: NavItem[];
  footerColumns: FooterColumn[];
}

/* ---------- Case studies ---------- */

/** Where a case study's figures came from. Drives the disclosure line
    under the results, and keeps unconfirmed campaigns out of the sitemap. */
export type FiguresSource = "client-confirmed" | "verified-public" | "pending";

export type Attribution = "click" | "gamesquare";

export interface ClientQuote {
  text: string;
  name?: string;
  role?: string;
  photo?: SanityImage;
}

export interface CaseStudy {
  _id: string;
  brand: string;
  title: string;
  headline?: string;
  slug: string;
  service: string;
  industry: string;
  engagementType?: string;
  attribution: Attribution;
  platforms: string[];
  insight: string;
  built: string;
  resultsIntro?: string;
  metrics: Metric[];
  proofLine?: string;
  figuresSource: FiguresSource;
  media?: SanityImage;
  gallery: SanityImage[];
  quote?: ClientQuote;
  mediaLabel?: string;
  featured?: boolean;
  seo?: Seo;
}

export interface Reel {
  _key: string;
  label: string;
  industry?: string;
  poster?: SanityImage;
  /** Mux public playback id, once a film has been uploaded and processed. */
  playbackId?: string;
}

export interface WorkPage {
  heroEyebrow?: string;
  heroTitle?: string;
  heroLede?: string;
  reelsEyebrow?: string;
  reelsHeading?: string;
  reels: Reel[];
  brandsEyebrow?: string;
  brandsHeading?: string;
  brandWall?: string[];
  ctaHeading?: string;
  ctaBody?: string;
  seo?: Seo;
}

/* ---------- Home ---------- */

export interface Beat {
  _key?: string;
  layers?: string;
  title: string;
  body: string;
  proof?: Metric;
}

export interface EcosystemGroup {
  _key?: string;
  label: string;
  nodes: { _key?: string; name: string; blurb: string }[];
}

export interface HomePage {
  heroEyebrow: string;
  heroHeadline: string;
  heroCreed: { line1: string; line2: string; payoff: string };
  heroLede: string;
  heroCtas?: Cta[];
  heroAnnotation?: { eyebrow?: string; body?: string; statusLabel?: string };
  heroProof?: { eyebrow?: string; value?: string; label?: string };
  journeys?: {
    firstEyebrow?: string;
    firstHeading?: string;
    firstBody?: string;
    firstCta?: string;
    secondEyebrow?: string;
    secondHeading?: string;
    secondBody?: string;
    secondCta?: string;
  };
  brandsHeading?: string;
  brandClients?: string[];
  brandPlatforms?: string[];
  beats?: Beat[];
  workEyebrow?: string;
  workHeading?: string;
  workPicked?: CaseStudy[];
  workAuto: CaseStudy[];
  recognitionLine?: string;
  recognitionYears?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaButton?: Cta;
  ecosystemEyebrow?: string;
  ecosystemHeading?: string;
  ecosystemGroups?: EcosystemGroup[];
  ecosystemNote?: string;
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
  asideNote?: {
    label?: string;
    text: string;
    footnote?: string;
    href?: string;
  };
  outline?: boolean;
}

export interface CopyMediaBlock {
  _type: "copyMedia";
  _key: string;
  anchor?: string;
  eyebrow?: string;
  heading?: string;
  body: RichText;
  media?: SanityImage[];
  mediaLabels?: string[];
  mediaPosition?: "right" | "left" | "below";
  cta?: Cta;
  insight?: string;
  insightLabel?: string;
  insightItems?: string[];
  insightFootnote?: string;
}

export interface MetricRowBlock {
  _type: "metricRow";
  _key: string;
  anchor?: string;
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
  anchor?: string;
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
  anchor?: string;
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
  engagementType?: string;
  attribution: Attribution;
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
  anchor?: string;
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
  anchor?: string;
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
  anchor?: string;
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
  anchor?: string;
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
  anchor?: string;
  eyebrow?: string;
  entries: Award[];
}

export interface MediaBlock {
  _type: "mediaBlock";
  _key: string;
  anchor?: string;
  eyebrow?: string;
  heading?: string;
  images?: SanityImage[];
  mediaLabels?: string[];
  caption?: string;
}

export interface ActivationScorecardBlock {
  _type: "activationScorecard";
  _key: string;
  anchor?: string;
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

export interface ContactFormBlock {
  _type: "contactForm";
  _key: string;
  anchor?: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  emailPrompt?: string;
}

export interface LinkChipsBlock {
  _type: "linkChips";
  _key: string;
  anchor?: string;
  eyebrow?: string;
  heading: string;
  useSocials?: boolean;
  links?: NavLink[];
}

export interface CtaBannerBlock {
  _type: "ctaBanner";
  _key: string;
  anchor?: string;
  heading: string;
  body?: string;
  cta: Cta;
  secondaryCta?: Cta;
}

export interface SplitColumn {
  _key?: string;
  eyebrow?: string;
  heading: string;
  body: string;
}

export interface SplitCopyBlock {
  _type: "splitCopy";
  _key: string;
  anchor?: string;
  columns: SplitColumn[];
}

export interface JourneySequenceBlock {
  _type: "journeySequence";
  _key: string;
  anchor?: string;
  eyebrow?: string;
  heading: string;
  stages: string[];
}

export interface JourneyPanel {
  eyebrow: string;
  title: string;
  body: string;
  cta: Cta;
}

export interface JourneyPanelsBlock {
  _type: "journeyPanels";
  _key: string;
  anchor?: string;
  first: JourneyPanel;
  second: JourneyPanel;
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
  | SplitCopyBlock
  | JourneySequenceBlock
  | JourneyPanelsBlock
  | ContactFormBlock
  | LinkChipsBlock
  | CtaBannerBlock;

export interface Page {
  _id: string;
  title: string;
  slug: string;
  seo?: Seo;
  blocks: PageBlock[];
}
