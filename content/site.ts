import { caseStudies, type VerificationStatus } from "./manifest";

/**
 * SITE CONTENT — everything the sub-pages render that isn't already in
 * manifest.ts. Same truth discipline: every entry carries a
 * VerificationStatus, and nothing marked `placeholder-do-not-publish`
 * may reach production.
 *
 * SHOW_PLACEHOLDERS is the one switch. While the pages are reviewed on
 * dev it is true so every layout can be seen populated; flip it to false
 * before the production deploy and the placeholder talent, team members
 * and their profile routes disappear. The pages handle the empty states.
 */
export const SHOW_PLACEHOLDERS = true;

const publishable = <T extends { status: VerificationStatus }>(items: T[]) =>
  SHOW_PLACEHOLDERS
    ? items
    : items.filter((i) => i.status !== "placeholder-do-not-publish");

/* ============ WORK / CAMPAIGNS ============ */

export type Service =
  | "Influencer Marketing"
  | "Experiential"
  | "Talent Partnerships";

export interface Campaign {
  slug: string;
  brand: string;
  title: string;
  service: Service;
  industry: string;
  platforms: string[];
  /** Beat 1 — what the intelligence found. Always shown first. */
  insight: string;
  /** Beat 2 — what we built. */
  built: string;
  /** Optional lead-in above the metrics. */
  resultsIntro?: string;
  /** Beat 3 — what it delivered (max 3 rendered on cards). */
  metrics: { value: string; label: string }[];
  proofLine?: string;
  mediaLabel: string;
  status: VerificationStatus;
}

/* The three case studies on the home page are the source of truth for
   their copy and figures — read from manifest.ts so /work and the home
   Featured Work section can never disagree. */
function fromManifest(brand: string) {
  const cs = caseStudies.find((c) => c.brand === brand);
  if (!cs) throw new Error(`manifest.ts has no case study for ${brand}`);
  return {
    insight: cs.understood,
    built: cs.created,
    resultsIntro: cs.resultsIntro,
    metrics: cs.metrics.map(({ value, label }) => ({ value, label })),
    proofLine: cs.proofLine,
    status: cs.status,
  };
}

export const campaigns: Campaign[] = [
  {
    slug: "capcom-pragmata",
    brand: "Capcom",
    title: "Pragmata",
    service: "Influencer Marketing",
    industry: "Gaming",
    platforms: ["YouTube", "Twitch", "TikTok"],
    mediaLabel: "Creator content reel · client-supplied",
    ...fromManifest("Capcom"),
  },
  {
    slug: "optus-gaming-on-the-go",
    brand: "Optus",
    title: "Gaming on the Go",
    service: "Influencer Marketing",
    industry: "Technology",
    platforms: ["TikTok", "Twitch", "YouTube"],
    insight:
      "Gaming audiences judge network claims by lived experience, not ad copy.",
    built:
      "Creator-led streams and social content that put the product inside real play, on the platforms where gaming culture already lives.",
    metrics: [
      { value: "750M", label: "content impressions" },
      { value: "51.93%", label: "market share increase" },
      { value: "835K", label: "organic TikTok views" },
    ],
    mediaLabel: "Campaign film · client-supplied",
    status: "verified-public",
  },
  {
    slug: "maybelline-eyes-up",
    brand: "Maybelline",
    title: "Eyes Up",
    service: "Influencer Marketing",
    industry: "Consumer Packaged Goods",
    platforms: ["TikTok", "Instagram"],
    mediaLabel: "Campaign film · client-supplied",
    ...fromManifest("Maybelline"),
  },
  {
    slug: "mcdonalds-summer-24",
    brand: "McDonald's",
    title: "Summer '24",
    service: "Influencer Marketing",
    industry: "Retail",
    platforms: ["Twitch", "TikTok", "Instagram"],
    mediaLabel: "Creator content reel · client-supplied",
    ...fromManifest("McDonald's"),
  },
  {
    slug: "national-youth-vaping",
    brand: "Australian Government",
    title: "National Youth Vaping Campaign",
    service: "Influencer Marketing",
    industry: "Public Sector",
    platforms: ["TikTok", "YouTube"],
    insight:
      "Health messaging lands with young audiences when it comes from voices they already trust.",
    built:
      "A creator-led public-awareness program that carried the message through the channels young Australians actually watch.",
    metrics: [],
    proofLine: "Campaign published on clickmedia.group",
    mediaLabel: "Campaign film · client-supplied",
    status: "awaiting-confirmation",
  },
];

export const workDisclosure =
  "Capcom figures as confirmed by CLICK; Optus, Maybelline and McDonald's figures as published on clickmedia.group. Insight lines are editorial interpretations pending client confirmation.";

/* ============ EXPERIENTIAL ============ */

/* The activation scorecard is the Experiential page's "show, don't claim"
   moment — the blueprint asks for 3–4 real numbers from one flagship
   experience, not a menu of every metric we could count. No experiential
   activation has been supplied yet, so the only entry here is a shaped
   placeholder: it lets the layout be reviewed populated and disappears
   the moment SHOW_PLACEHOLDERS is off, leaving the page's honest
   awaiting-content state. Replace it with a real activation. */
export interface ActivationScorecard {
  /** The experience the numbers came from. */
  label: string;
  metrics: { value: string; label: string }[];
  status: VerificationStatus;
}

const ACTIVATION_SCORECARDS: ActivationScorecard[] = [
  {
    label: "Flagship activation",
    metrics: [
      { value: "12K", label: "attendees" },
      { value: "3.8M", label: "broadcast views" },
      { value: "410", label: "content pieces" },
    ],
    status: "placeholder-do-not-publish",
  },
];

export const activationScorecard: ActivationScorecard | null =
  publishable(ACTIVATION_SCORECARDS)[0] ?? null;

/* ============ TALENT ROSTER ============ */

export interface Talent {
  slug: string;
  name: string;
  category: string;
  platforms: string[];
  region: string;
  location: string;
  audience: string;
  managed: boolean;
  bio: string;
  partners: string[];
  ventures: string[];
  featured?: boolean;
  /** Public path of the creator's primary image (card, portrait and hero slots). */
  image?: string;
  imageAlt?: string;
  /** CSS object-position for the crop, e.g. "70% center". */
  imagePosition?: string;
  /** Source / licence note — kept in data so it ships with the asset. */
  imageCredit?: string;
  /** Success story beats for the profile page. */
  story: { label: string; text: string }[];
  status: VerificationStatus;
}

/* Only Muselk is a real CLICK creator (awaiting confirmation of the
   figures). Every other entry is an invented placeholder that exists so
   the directory, cards and profile template can be reviewed populated —
   replace with the live roster; see SHOW_PLACEHOLDERS above.

   IMAGES: Muselk's image is his own published creator asset (see
   imageCredit). The placeholder creators are invented, so their images are
   category-matched stock photography from Pexels (Pexels licence — free
   for commercial use, no attribution required) chosen to read correctly
   in the layouts. They are illustrative only and go with the entries when
   the live roster replaces them. */
const ROSTER: Talent[] = [
  {
    slug: "muselk",
    name: "Muselk",
    category: "Gaming",
    platforms: ["YouTube", "TikTok"],
    region: "Australia",
    location: "Sydney, AU",
    audience: "9M+",
    managed: true,
    bio: "One of Australia's biggest gaming creators — a decade of daily invention across YouTube's most-watched games.",
    image: "/talent/muselk.jpg",
    imageAlt: "Muselk — Elliott Watkins",
    imagePosition: "center 20%",
    imageCredit:
      "Muselk's own public profile photo (X/Twitter @muselk), upscaled from 400px — replace with a CLICK-supplied high-res portrait before production.",
    partners: ["EA", "Optus"],
    ventures: ["Merchandise line"],
    featured: true,
    story: [
      { label: "Audience", text: "Built one of Australia's largest gaming audiences on consistency and character." },
      { label: "Business", text: "Expanded from AdSense-first to a diversified brand, licensing and partnerships model." },
      { label: "Next", text: "Long-form formats and ventures beyond the channel." },
    ],
    status: "awaiting-confirmation",
  },
  {
    slug: "gg-mara",
    name: "GG Mara",
    category: "Gaming",
    platforms: ["Twitch", "YouTube"],
    region: "North America",
    location: "Austin, US",
    audience: "1.8M",
    managed: true,
    bio: "Variety streamer whose community treats every broadcast like a hometown show.",
    image: "/talent/gg-mara.jpg",
    imageAlt: "Streamer at a triple-monitor setup, mid-broadcast",
    imagePosition: "78% center",
    imageCredit: "Illustrative stock — Pexels #7915357 (RDNE Stock project).",
    partners: ["Capcom"],
    ventures: ["Peripherals collab"],
    featured: true,
    story: [
      { label: "Audience", text: "Grew a nightly live audience by programming like a broadcaster, not a streamer." },
      { label: "Business", text: "Signed multi-season brand partnerships structured around live moments." },
      { label: "Next", text: "A creator-owned live events format." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "navi-quinn",
    name: "Navi Quinn",
    category: "Lifestyle",
    platforms: ["TikTok", "Instagram"],
    region: "North America",
    location: "Toronto, CA",
    audience: "2.4M",
    managed: true,
    bio: "Documentary-style lifestyle storytelling with a community that plans its weekends around the uploads.",
    image: "/talent/navi-quinn.jpg",
    imageAlt: "Lifestyle creator at home in warm evening light",
    imagePosition: "center 30%",
    imageCredit: "Illustrative stock — Pexels #30625145.",
    partners: ["Samsung"],
    ventures: ["Homeware label"],
    featured: true,
    story: [
      { label: "Audience", text: "Turned a personal renovation diary into a 2M-strong community." },
      { label: "Business", text: "Launched a homeware label with a sell-through launch weekend." },
      { label: "Next", text: "Retail expansion with ecosystem support." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "soft-serve-sam",
    name: "Soft Serve Sam",
    category: "Comedy",
    platforms: ["TikTok", "Instagram"],
    region: "Australia",
    location: "Melbourne, AU",
    audience: "3.1M",
    managed: false,
    bio: "Sketch comedy at the speed of the feed — characters the internet quotes back.",
    image: "/talent/soft-serve-sam.jpg",
    imageAlt: "Comedy creator mid-laugh, studio portrait",
    imagePosition: "center 25%",
    imageCredit: "Illustrative stock — Pexels #31750367.",
    partners: ["Jack in the Box"],
    ventures: [],
    story: [
      { label: "Audience", text: "Recurring characters made the account appointment viewing." },
      { label: "Business", text: "Comedy-led brand integrations that keep the joke intact." },
      { label: "Next", text: "Writers-room development for longer formats." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "lumen",
    name: "LUMEN",
    category: "Music",
    platforms: ["YouTube", "TikTok"],
    region: "Europe",
    location: "Berlin, DE",
    audience: "1.2M",
    managed: true,
    bio: "Producer and performer documenting the process as much as the product.",
    image: "/talent/lumen.jpg",
    imageAlt: "Producer in headphones working at a studio mixer",
    imagePosition: "30% center",
    imageCredit: "Illustrative stock — Pexels #8132964.",
    partners: ["Universal"],
    ventures: ["Sample library"],
    story: [
      { label: "Audience", text: "Process-first videos built an audience of makers, not just listeners." },
      { label: "Business", text: "A sample library business that outearns the catalog." },
      { label: "Next", text: "Live shows built with the community." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "pit-lane-priya",
    name: "Pit Lane Priya",
    category: "Sports",
    platforms: ["YouTube", "Instagram"],
    region: "United Kingdom",
    location: "London, UK",
    audience: "980K",
    managed: true,
    bio: "Motorsport explained by someone who clearly loves it — paddock access with fan energy.",
    image: "/talent/pit-lane-priya.jpg",
    imageAlt: "Motorsport creator in a racing helmet, city skyline behind",
    imagePosition: "center 40%",
    imageCredit: "Illustrative stock — Pexels #9607373.",
    partners: ["Adidas"],
    ventures: [],
    story: [
      { label: "Audience", text: "Made race weekends legible to a new generation of fans." },
      { label: "Business", text: "Broadcast-adjacent partnerships across a full season." },
      { label: "Next", text: "A grid-side interview format." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "taste-of-talia",
    name: "Taste of Talia",
    category: "Food",
    platforms: ["Instagram", "TikTok"],
    region: "Australia",
    location: "Brisbane, AU",
    audience: "1.5M",
    managed: false,
    bio: "Home cooking with restaurant standards — recipes the comments actually make.",
    image: "/talent/taste-of-talia.jpg",
    imageAlt: "Food creator plating dishes in a home kitchen",
    imagePosition: "center 30%",
    imageCredit: "Illustrative stock — Pexels #8329331.",
    partners: [],
    ventures: ["Cookware range"],
    story: [
      { label: "Audience", text: "Recipe formats engineered for the save button." },
      { label: "Business", text: "A cookware range grown from the most-requested tools." },
      { label: "Next", text: "A test-kitchen studio." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "kickflip-ko",
    name: "Kickflip Ko",
    category: "Sports",
    platforms: ["Instagram", "TikTok"],
    region: "Asia-Pacific",
    location: "Seoul, KR",
    audience: "2.0M",
    managed: true,
    bio: "Street skating and street style, filmed like cinema.",
    image: "/talent/kickflip-ko.jpg",
    imageAlt: "Skater resting on a board in an empty warehouse",
    imagePosition: "center 30%",
    imageCredit: "Illustrative stock — Pexels #9724752.",
    partners: ["Nike"],
    ventures: ["Board shop"],
    story: [
      { label: "Audience", text: "A visual signature strong enough to spot without the handle." },
      { label: "Business", text: "Footwear partnerships on multi-year terms." },
      { label: "Next", text: "A skate film with festival ambitions." },
    ],
    status: "placeholder-do-not-publish",
  },
  {
    slug: "glowby",
    name: "Glowby",
    category: "Beauty",
    platforms: ["TikTok", "YouTube"],
    region: "North America",
    location: "Los Angeles, US",
    audience: "4.2M",
    managed: true,
    bio: "Beauty science without the lecture — testing everything so the audience doesn't have to.",
    image: "/talent/glowby.jpg",
    imageAlt: "Beauty creator, clean close-up portrait",
    imagePosition: "center 35%",
    imageCredit: "Illustrative stock — Pexels #3373716.",
    partners: ["Maybelline"],
    ventures: ["Skincare line"],
    featured: true,
    story: [
      { label: "Audience", text: "Evidence-first reviews earned rare cross-platform trust." },
      { label: "Business", text: "A skincare line built on the audience's actual routines." },
      { label: "Next", text: "Retail distribution across two markets." },
    ],
    status: "placeholder-do-not-publish",
  },
];

/** The roster the pages render — gated by SHOW_PLACEHOLDERS. */
export const roster: Talent[] = publishable(ROSTER);

export const rosterDisclosure = SHOW_PLACEHOLDERS
  ? "Roster shown is illustrative while the directory is reviewed. In production it is populated from CLICK's live roster of 90+ creator profiles."
  : "Audience figures as at the date shown on each profile.";

/* ============ ABOUT ============ */

export interface Person {
  name: string;
  role: string;
  /** Portrait in /public/team. Absent = the commissioned-portrait placeholder. */
  photo?: string;
  /** One line in their own voice. Real people never get an invented
      quote — they carry a collect-in-own-voice marker instead. */
  perspective?: string;
  recognition?: string;
  status: VerificationStatus;
}

const PEOPLE: Person[] = [
  {
    name: "Grace Watkins",
    role: "Co-CEO",
    photo: "/team/grace-watkins.png",
    recognition: "Business Insider Top Talent Managers",
    status: "verified-public",
  },
  {
    name: "Emma Barnes",
    role: "Co-CEO",
    photo: "/team/emma-barnes.png",
    recognition: "Business Insider Top Talent Managers",
    status: "verified-public",
  },
  {
    name: "Strategist",
    role: "Head of Audience Intelligence",
    perspective: "Most brands underestimate how smart audiences are.",
    status: "placeholder-do-not-publish",
  },
  {
    name: "Talent Manager",
    role: "Senior Talent Manager",
    perspective: "My job is the career after the algorithm changes.",
    status: "placeholder-do-not-publish",
  },
  {
    name: "Creative Lead",
    role: "Creative Director",
    perspective: "The insight writes the brief. We just listen first.",
    status: "placeholder-do-not-publish",
  },
  {
    name: "Partnerships Lead",
    role: "Head of Brand Partnerships",
    perspective: "Great deals feel obvious to both sides — that's the tell.",
    status: "placeholder-do-not-publish",
  },
];

export const people: Person[] = publishable(PEOPLE);

export const timeline = [
  { year: "2017", text: "Founded with roots in gaming." },
  { year: "—", text: "Growth across creators, culture and brands." },
  { year: "—", text: "Global offices across major markets." },
  { year: "—", text: "Part of the GameSquare ecosystem." },
  { year: "2024–25", text: "AiMCO Talent Agency of the Year, twice." },
];

export const offices = [
  { city: "Sydney", region: "Australia" },
  { city: "Los Angeles", region: "North America" },
  { city: "London", region: "Europe" },
];

export const officesDisclosure =
  "Office locations to be confirmed with CLICK before production.";
