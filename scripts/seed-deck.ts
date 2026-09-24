/**
 * Brings CLICK's Aug–Sep 2026 decks into the CMS: case studies, the
 * /work page, the Experiential page, and new sections on Influencer
 * Marketing and About — with their imagery uploaded.
 *
 *   pnpm seed:deck            # report what it would do
 *   pnpm seed:deck --apply    # do it
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local, and the organised deck
 * imagery on disk (DECK_ASSETS_DIR, defaulting to the folder the images
 * were extracted into).
 *
 * ADDITIVE, NEVER DESTRUCTIVE — unlike the older page seeds, re-running
 * this cannot wipe Studio edits:
 *   - documents are created only if they do not exist yet
 *     (createIfNotExists), so an edited case study is left alone;
 *   - new page sections carry fixed `deck-*` keys and are inserted only
 *     when that key is not already on the page;
 *   - the few changes to existing content (featured picks, the four
 *     original case studies' taxonomy) apply only while the field still
 *     holds the value this script expects to replace.
 * The one deletion is the Australian Government case study, which is not
 * in CLICK's decks and was withdrawn.
 *
 * Figures are the decks' own, using the larger number where the decks
 * disagree (CLICK's call), and marked as confirmed by CLICK Influence —
 * CLICK supplied them.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-01",
  useCdn: false,
  /* A stalled upload otherwise hangs forever; with a deadline the retry
     loop below gets its chance. */
  timeout: 60_000,
  maxRetries: 0,
});

const ASSETS =
  process.env.DECK_ASSETS_DIR ??
  "/Users/sebb/Documents/Business/DevSebb/CLICK/deck-images-2026-08-12";
const apply = process.argv.includes("--apply");

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

let keySeed = 0;
const k = (p = "k") => `${p}${(keySeed += 1)}`;

/* Uploads are content-addressed by Sanity (same bytes, same asset), so
   re-running never duplicates an image. Cached here to skip the round
   trip within one run. */
const uploaded = new Map<string, string>();
async function asset(rel: string): Promise<string> {
  const path = join(ASSETS, rel);
  if (!existsSync(path)) throw new Error(`Missing image: ${path}`);
  const hit = uploaded.get(path);
  if (hit) return hit;
  if (!apply) {
    uploaded.set(path, `dry-run:${rel}`);
    return `dry-run:${rel}`;
  }
  /* Large originals over a slow connection can time out; Sanity dedupes
     by content, so a retry never creates a second copy. */
  for (let attempt = 1; ; attempt++) {
    try {
      /* Straight to the assets endpoint with fetch rather than
         client.assets.upload: under Node 26 the client's upload
         intermittently stalls forever mid-run (the same file posts in two
         seconds with curl). fetch with an abort deadline lets the retry
         loop do its job. */
      const type = path.endsWith(".png")
        ? "image/png"
        : path.endsWith(".gif")
          ? "image/gif"
          : "image/jpeg";
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v2026-08-01/assets/images/${dataset}?filename=${encodeURIComponent(basename(path))}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": type },
          body: readFileSync(path),
          signal: AbortSignal.timeout(90_000),
        },
      );
      if (!res.ok) throw new Error(`upload ${res.status}: ${await res.text()}`);
      const doc = ((await res.json()) as { document: { _id: string } }).document;
      uploaded.set(path, doc._id);
      log(`    ↑ ${rel}`);
      return doc._id;
    } catch (err) {
      if (attempt >= 4) throw err;
      log(`    retry ${attempt} — ${rel}`);
    }
  }
}

type ImgOpts = {
  alt: string;
  display?: "fill" | "fit";
  credit?: string;
  /** Focal point, 0–1 from top-left. Defaults to the centre. */
  focus?: [number, number];
};

async function img(rel: string, o: ImgOpts, withKey = false) {
  const ref = await asset(rel);
  return {
    ...(withKey ? { _key: k("img") } : {}),
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt: o.alt,
    ...(o.credit ? { credit: o.credit } : {}),
    ...(o.display ? { display: o.display } : {}),
    ...(o.focus
      ? {
          hotspot: {
            _type: "sanity.imageHotspot",
            x: o.focus[0],
            y: o.focus[1],
            width: 0.6,
            height: 0.6,
          },
          crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
        }
      : {}),
  };
}

const metric = (value: string, label: string) => ({
  _key: k("m"),
  _type: "metric",
  value,
  label,
});

const para = (text: string) => ({
  _key: k("b"),
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: k("s"), _type: "span", text, marks: [] }],
});

const cta = (label: string, href: string, style: "primary" | "ghost" = "ghost") => ({
  _type: "cta",
  label,
  destination: "internal",
  href,
  style,
});
const modalCta = (label: string) => ({
  _type: "cta",
  label,
  destination: "modal",
  style: "primary",
});

const ref = (id: string) => ({ _key: k("r"), _type: "reference", _ref: id });

const log = (...a: unknown[]) => console.log(...a);

/* ------------------------------------------------------------------ */
/* case studies                                                        */
/* ------------------------------------------------------------------ */

const CS = "01-case-studies";
const GS = `${CS}/_gamesquare-ecosystem`;
const CLICK_CREDIT = "CLICK Influence — Narrative deck, Aug 2026";
const GS_CREDIT = "GameSquare activation — CLICK Narrative deck, Aug 2026";

type Media = { file: string } & ImgOpts;

type Study = {
  slug: string;
  brand: string;
  title: string;
  headline?: string;
  service: string;
  industry: string;
  engagementType: string;
  attribution: "click" | "gamesquare";
  platforms: string[];
  insight: string;
  built: string;
  resultsIntro?: string;
  metrics?: [string, string][];
  proofLine?: string;
  media: Media;
  gallery?: Media[];
  quote?: { text: string; name: string; role: string; photo?: Media };
  featured?: boolean;
  sortOrder: number;
};

const collage = (dir: string, file: string, alt: string): Media => ({
  file: `${CS}/${dir}/${file}`,
  alt,
  display: "fit",
  credit: CLICK_CREDIT,
});

const STUDIES: Study[] = [
  /* ---------------- CLICK Influence ---------------- */
  {
    slug: "capcom-resident-evil-requiem",
    brand: "Capcom",
    title: "Resident Evil Requiem",
    headline: "The audience wasn't just horror gamers.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Mass Awareness",
    attribution: "click",
    platforms: ["YouTube", "Twitch", "TikTok"],
    insight:
      "The audience wasn't just horror gamers — intelligence found lifestyle and comedy cohorts primed for Resident Evil's tension and release.",
    built:
      "34 creators across five marketing beats hit both audiences, positioning Requiem as a top-ranking release.",
    resultsIntro: "Capcom delivered an 89 on Metacritic. We delivered the audience.",
    metrics: [
      ["22M+", "Video views"],
      ["173K", "Sponsored stream hours"],
      ["8.3%", "Engagement rate"],
    ],
    media: {
      file: `${CS}/01-capcom-resident-evil-9-requiem/s19-creator-6.png`,
      alt: "Creators staged in a zombie-overrun store for Resident Evil Requiem",
      credit: CLICK_CREDIT,
    },
    gallery: [
      ["s51-re-requiem-logo.png", "Resident Evil Requiem logo"],
      ["s19-creator-9.png", "Cosplay creator as Leon Kennedy"],
      ["s19-creator-3.png", "VTuber creator reacting to Requiem"],
      ["s19-creator-1.png", "Creator in a Resident Evil crime-scene skit"],
      ["s19-creator-4.png", "Creators at the Resident Evil × Porsche event"],
      ["s19-creator-7.png", "Comedy creator in zombie make-up"],
      ["s19-creator-5.png", "Paper-cutout creator content for Requiem"],
      ["s19-creator-2.png", "Creators in Resident Evil jackets"],
    ].map(([f, alt]) => ({
      file: `${CS}/01-capcom-resident-evil-9-requiem/${f}`,
      alt,
      credit: CLICK_CREDIT,
    })),
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "capcom-monster-hunter-wilds",
    brand: "Capcom",
    title: "Monster Hunter Wilds",
    headline: "One creator whose community would turn a launch into a moment.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Mass Awareness",
    attribution: "click",
    platforms: ["YouTube", "X"],
    insight:
      "The landing point was one creator whose community would turn a launch into a moment.",
    built:
      "iShowSpeed, in full Hunter cosplay on a custom experiential set, for a 13-hour streamathon with live DLC drops.",
    metrics: [
      ["#5", "Most-watched MHW streamer"],
      ["72", "Earned posts"],
      ["7.1%", "Earned engagement rate"],
    ],
    media: {
      file: `${CS}/02-capcom-monster-hunter-wilds/s20-ishowspeed-cosplay.jpg`,
      alt: "iShowSpeed in full Monster Hunter cosplay on the custom set",
      credit: CLICK_CREDIT,
      focus: [0.5, 0.3],
    },
    gallery: [
      {
        file: `${CS}/02-capcom-monster-hunter-wilds/s20-set-build.jpg`,
        alt: "The Hunter weapon prop being built for the streamathon set",
        credit: CLICK_CREDIT,
      },
      {
        file: `${CS}/02-capcom-monster-hunter-wilds/s20-creature-render.png`,
        alt: "Monster Hunter Wilds creature render",
        credit: CLICK_CREDIT,
      },
      {
        file: `${CS}/02-capcom-monster-hunter-wilds/ishowspeed-portrait-streamer-awards.png`,
        alt: "iShowSpeed portrait",
        credit: CLICK_CREDIT,
      },
    ],
    quote: {
      text: "Click was an integral partner in supporting the release of Monster Hunter Wilds. They helped us create an engaging cultural moment and drive mass awareness.",
      name: "Tak Inoue",
      role: "Head of Marketing, Capcom",
      photo: {
        file: `${CS}/02-capcom-monster-hunter-wilds/tak-inoue-headshot-600px.jpg`,
        alt: "Tak Inoue, Head of Marketing, Capcom",
        credit: "Overwolf blog — Capcom's Marketing Playbook interview",
      },
    },
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "ubisoft-r6-siege-x",
    brand: "Ubisoft",
    title: "R6 Siege X",
    headline: "A decade of Siege deserved a total Twitch takeover.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Mass Deployment",
    attribution: "click",
    platforms: ["Twitch", "YouTube", "TikTok"],
    insight: "A decade of Siege deserved a total Twitch takeover.",
    built:
      "We activated 80 gaming creators across live streams, YouTube VODs and short-form content, rallying the community to celebrate the next decade of R6 Siege.",
    resultsIntro: "Widespread awareness with new audiences, plus 845K added-value video views.",
    metrics: [
      ["29M", "Video views"],
      ["684K", "Live stream hours watched"],
      ["7%", "Category share of voice"],
    ],
    media: collage("03-ubisoft-r6-siege-x", "s55-collage.jpg", "R6 Siege X creator content collage"),
    gallery: [
      {
        file: `${CS}/03-ubisoft-r6-siege-x/s27-wide-2.jpg`,
        alt: "Creator reacting on stream to R6 Siege X",
        credit: CLICK_CREDIT,
      },
      {
        file: `${CS}/03-ubisoft-r6-siege-x/s27-wide-1.jpg`,
        alt: "R6 Siege X creator thumbnail artwork",
        credit: CLICK_CREDIT,
      },
    ],
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "jack-in-the-box-menu-drops",
    brand: "Jack in the Box",
    title: "New Menu Drops",
    headline: "Two menu drops, one FYP takeover.",
    service: "Influencer Marketing",
    industry: "Food & Beverage",
    engagementType: "Tailored Activations",
    attribution: "click",
    platforms: ["TikTok", "Instagram"],
    insight: "Two menu drops, one FYP takeover.",
    built:
      "We activated foodie and collectible creators to taste, review and showcase the matcha latte and sliders Munchie Meal, with authentic reactions and limited-time drop excitement.",
    resultsIntro: "Food-first content that drove discovery, trial and giveaway hype.",
    metrics: [
      ["5M", "Video views"],
      ["314K", "Engagements"],
      ["6%", "Engagement rate"],
    ],
    media: collage("04-jack-in-the-box-menu-drops", "s53-collage.jpg", "Jack in the Box creator content collage"),
    sortOrder: 4,
  },
  {
    slug: "hyperx-cloud-iii",
    brand: "HyperX",
    title: "Cloud III",
    headline: "A creator program built end to end in our CRM.",
    service: "Influencer Marketing",
    industry: "Consumer Tech",
    engagementType: "Community Engagement",
    attribution: "click",
    platforms: ["YouTube", "TikTok", "Instagram"],
    insight: "A creator program built end to end in our CRM.",
    built:
      "Custom sign-up page, creator vetting, briefs and personalized kit seeding, all in one system. We tracked awareness, engagement and conversions to show the program's holistic value.",
    resultsIntro: "Reach, ROI and custom poster art crafted by a Tier 1 creator.",
    metrics: [
      ["649K+", "Video views"],
      ["1.3M+", "Impressions"],
      ["$116K", "Earned media"],
    ],
    media: collage("05-hyperx-cloud-iii-creator-program", "s56-collage.jpg", "HyperX Cloud III creator content collage"),
    gallery: [
      {
        file: `${CS}/05-hyperx-cloud-iii-creator-program/s34-signup-page.jpg`,
        alt: "The HyperX creator program sign-up page",
        credit: CLICK_CREDIT,
      },
      {
        file: `${CS}/05-hyperx-cloud-iii-creator-program/s36-creator-grid.jpg`,
        alt: "Creators unboxing their Cloud III kits",
        credit: CLICK_CREDIT,
      },
    ],
    sortOrder: 5,
  },
  {
    slug: "underdog-nfl-playoffs",
    brand: "Underdog",
    title: "NFL Playoffs",
    headline: "The window: NFL Playoffs, when fantasy attention peaks.",
    service: "Influencer Marketing",
    industry: "Sport & Lifestyle",
    engagementType: "Tailored Activations",
    attribution: "click",
    platforms: ["Twitch", "YouTube", "TikTok"],
    insight: "The window was the NFL Playoffs, when fantasy attention peaks.",
    built:
      "We activated a curated roster of Madden creators for sponsored livestreams and short-form cutdowns, weaving Underdog messaging and clear CTAs into playoff sports gaming content.",
    resultsIntro: "Creator-led playoff momentum, plus 720 added-value hours streamed.",
    metrics: [
      ["2.2M", "Impressions"],
      ["1.2M", "Video views"],
      ["57K", "Sponsored stream hours"],
    ],
    media: collage("06-underdog-nfl-playoffs", "s52-collage.jpg", "Underdog Madden creator content collage"),
    sortOrder: 6,
  },
  {
    slug: "ubisoft-r6-salt-lake-city-major",
    brand: "Ubisoft",
    title: "R6 Salt Lake City Major",
    headline: "The Major, extended beyond the arena.",
    service: "Experiential",
    industry: "Gaming",
    engagementType: "Onsite Support",
    attribution: "click",
    platforms: ["Twitch"],
    insight: "The Major, extended beyond the arena.",
    built:
      "We brought 9 creators onsite to co-stream, play a creator show match, meet fans and capture content across the event — a full 360 creator presence at the Salt Lake City Major.",
    resultsIntro: "Creator-led coverage and fan-first moments, online and in the building.",
    metrics: [
      ["5.5M", "Video views"],
      ["45K", "Stream hours watched"],
      ["22%", "Positive Twitch chat sentiment"],
    ],
    media: collage("10-ubisoft-r6-salt-lake-city-major", "s60-collage.jpg", "Creators onsite at the R6 Salt Lake City Major"),
    sortOrder: 7,
  },
  {
    slug: "annapurna-mixtape",
    brand: "Annapurna",
    title: "Mixtape",
    headline: "A '90s record store pop-up that became a launch engine.",
    service: "Experiential",
    industry: "Gaming",
    engagementType: "Onsite Support",
    attribution: "click",
    platforms: ["TikTok", "Instagram"],
    insight: "A '90s record store pop-up that became a launch engine.",
    built:
      "We activated 9 contracted and 27 earned creators across the Pizza Event, Pre-Launch and Launch phases, combining experiential content, kit seeding and creator-native storytelling.",
    resultsIntro: "The pop-up beat every benchmark: 194K views and 80% positive sentiment.",
    metrics: [
      ["607K", "Campaign views"],
      ["4.4M", "Kit seeding views"],
      ["9%", "Event engagement rate"],
    ],
    media: collage("11-annapurna-mixtape-popup", "s61-collage.jpg", "Mixtape record store pop-up and creator content"),
    sortOrder: 8,
  },
  {
    slug: "capcom-monster-hunter-stories-3",
    brand: "Capcom",
    title: "Monster Hunter Stories 3",
    headline: "Anime fans, artists and V-Tubers carried the adventure.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Kit Seeding",
    attribution: "click",
    platforms: ["YouTube", "Twitch", "TikTok"],
    insight: "Anime fans, artists and V-Tubers carried the adventure.",
    built:
      "We activated creators to showcase a compelling mix of gameplay and creative content, driving awareness and consideration around the release of Twisted Reflection.",
    resultsIntro: "Plus 65K stream hours watched and 52% positive sentiment on sponsored posts.",
    metrics: [
      ["1.9M+", "Paid video views"],
      ["2.5M", "Kit seeding views"],
      ["8.3%", "Engagement rate"],
    ],
    media: collage("09-capcom-monster-hunter-stories-3", "s59-collage.jpg", "Monster Hunter Stories 3 creator content collage"),
    sortOrder: 9,
  },
  {
    slug: "capcom-kunitsu-gami",
    brand: "Capcom",
    title: "Kunitsu-Gami: Path of the Goddess",
    headline: "A hidden gem, relaunched through the right hands.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Kit Seeding",
    attribution: "click",
    platforms: ["YouTube"],
    insight: "A hidden gem, relaunched through the right hands.",
    built:
      "We seeded collector edition kits and Nintendo Switch 2s to a select roster of gaming creators, who produced informational VODs and Shorts showcasing the kit and Switch 2 gameplay.",
    resultsIntro: "Educational content that connected with the target audience.",
    metrics: [
      ["1.41M+", "Video views"],
      ["4.5%", "Engagement rate"],
    ],
    media: collage("07-capcom-kunitsu-gami", "s57-collage.jpg", "Kunitsu-Gami collector kit creator content collage"),
    sortOrder: 10,
  },
  {
    slug: "hyperx-cloud-alpha-2-cloud-flight-2",
    brand: "HyperX",
    title: "Cloud Alpha 2 & Cloud Flight 2",
    headline: "Wireless audio, told through creators people already trust.",
    service: "Influencer Marketing",
    industry: "Consumer Tech",
    engagementType: "Tailored Activations",
    attribution: "click",
    platforms: ["TikTok", "Instagram", "YouTube"],
    insight: "Wireless audio, told through creators people already trust.",
    built:
      "We activated tech reviewers and gaming-adjacent creators on TikTok, Reels and Shorts, pairing polished product reviews with natural lifestyle integrations, built for paid media boosting.",
    resultsIntro: "Strong brand sentiment and paid-ready product storytelling.",
    metrics: [
      ["258K", "Video views"],
      ["5%", "Engagement rate"],
      ["410", "Total clicks"],
    ],
    media: collage("08-hyperx-cloud-alpha-2-flight-2", "s58-collage.jpg", "HyperX Cloud Alpha 2 and Cloud Flight 2 creator content collage"),
    sortOrder: 11,
  },
  {
    slug: "ubisoft-the-crew-motorfest",
    brand: "Ubisoft",
    title: "The Crew Motorfest S9",
    headline: "New features, new players.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "Tailored Activations",
    attribution: "click",
    platforms: ["YouTube", "TikTok"],
    insight: "New features, new players.",
    built:
      "We activated two creator cohorts to showcase TrackForge, the new track-building mechanic, and the arrival of iconic NASCAR cars, mixing edu-tainment content with chaotic gameplay.",
    resultsIntro: "Content that turned new features into acquisition-focused excitement.",
    metrics: [
      ["2.7M", "Video views"],
      ["2%", "Engagement rate"],
      ["24%", "Positive sentiment on sponsored posts"],
    ],
    media: collage("12-ubisoft-crew-motorfest-s9", "s62-collage.jpg", "The Crew Motorfest creator content collage"),
    sortOrder: 12,
  },
  {
    slug: "ea-golf-clash",
    brand: "EA",
    title: "Golf Clash",
    headline: "Organic creator content, rebuilt for paid scale.",
    service: "Influencer Marketing",
    industry: "Gaming",
    engagementType: "UA Content Development",
    attribution: "click",
    platforms: ["TikTok", "Instagram", "YouTube"],
    insight: "Organic creator content, rebuilt for paid scale.",
    built:
      "We activated golf, lifestyle and gaming creators to connect the mobile game to real golf moments, then repurposed top-performing posts into UA assets for EA's own channels.",
    resultsIntro: "Creator content that kept working long after the campaign.",
    metrics: [
      ["6.3M", "UA content impressions"],
      ["60%", "Positive sentiment on sponsored posts"],
    ],
    media: collage("13-ea-golf-clash-ua", "s50-collage.jpg", "EA Golf Clash creator content collage"),
    sortOrder: 13,
  },

  /* ---------------- GameSquare ---------------- */
  {
    slug: "tmnt-fortnite",
    brand: "TMNT",
    title: "TMNT × Fortnite",
    headline: "TMNT became the most engaged IP in Fortnite Creative.",
    service: "In-Game",
    industry: "Entertainment",
    engagementType: "Mass Awareness",
    attribution: "gamesquare",
    platforms: ["Twitch", "YouTube", "TikTok"],
    insight: "The ask: re-energize the TMNT franchise with Gen Z through Fortnite and UEFN.",
    built:
      "A holistic program for developers, Fortnite fans, and pop culture at large: IRL events, community challenges, cinematic trailers, custom merch capsules, and a New York Knicks collab.",
    metrics: [
      ["848K+", "Total engagements"],
      ["24.8M+", "Total impressions"],
      ["#1", "Most engaged IP, Fortnite Creative"],
    ],
    media: {
      file: `${GS}/15-tmnt-fortnite/s25-stream-still.jpg`,
      alt: "Kai Cenat live on stream during the TMNT × Fortnite program",
      credit: GS_CREDIT,
    },
    sortOrder: 101,
  },
  {
    slug: "turbotax-fanum",
    brand: "TurboTax",
    title: "TurboTax × Fanum",
    headline: "The Fanum Tax ended. The brand took Twitch by storm.",
    service: "Influencer Marketing",
    industry: "Finance",
    engagementType: "Mass Awareness",
    attribution: "gamesquare",
    platforms: ["Twitch", "YouTube"],
    insight: "The ask: make TurboTax the go-to tax service for the next generation of taxpayers.",
    built:
      "Tax season became a viral moment built from meme culture: 'The Fanum Tax is over.' A cinematic sketch-style hero ad anchored the campaign, and Fanum gave away $100K from the Refund Fund in a livestream series, with micro creators carrying the message to every niche.",
    metrics: [
      ["1.88B", "Stream impressions"],
      ["456K", "Hours watched"],
      ["18.9M", "Paid media impressions"],
    ],
    media: {
      file: `${GS}/17-turbotax-fanum/s28-hero-ad-still.jpg`,
      alt: "Fanum in the TurboTax hero ad",
      credit: GS_CREDIT,
    },
    gallery: [
      { file: `${GS}/17-turbotax-fanum/s28-stream.jpg`, alt: "Fanum's Refund Fund livestream", credit: GS_CREDIT },
    ],
    sortOrder: 102,
  },
  {
    slug: "red-bull-f1-karting-series",
    brand: "Red Bull",
    title: "F1 Karting Series",
    headline: "Star power meets grassroots, in every host city.",
    service: "Experiential",
    industry: "Sport & Lifestyle",
    engagementType: "Onsite Support",
    attribution: "gamesquare",
    platforms: ["Instagram", "TikTok"],
    insight:
      "The ask: amplify Red Bull's F1 sponsorship with direct fan engagement in key race markets.",
    built:
      "A rodeo-themed karting event series in major Formula 1 host cities put professional drivers, influencers, and the public head to head, with product sampling and interactive brand touchpoints throughout to drive trial.",
    proofLine: "An F1 host-city event series — pro-am karting, sampling and touchpoints.",
    media: {
      file: `${GS}/24-red-bull-f1-karting/s37-karting.jpg`,
      alt: "A driver racing in the Red Bull karting series",
      credit: GS_CREDIT,
    },
    gallery: [
      { file: `${GS}/24-red-bull-f1-karting/s37-sampling.jpg`, alt: "Fans sampling Red Bull at the event", credit: GS_CREDIT },
    ],
    sortOrder: 103,
  },
  {
    slug: "la-roche-posay-gaming-for-cause",
    brand: "La Roche-Posay",
    title: "Gaming for Cause",
    headline: "A 24-hour global stream across 11 markets, for a cause.",
    service: "Experiential",
    industry: "Beauty",
    engagementType: "Community Engagement",
    attribution: "gamesquare",
    platforms: ["Twitch"],
    insight: "The ask: raise funds for melanoma awareness through a global streamathon challenge.",
    built:
      "We built the Gaming for Cause brand and produced a 24-hour global event across 11 markets. Headliner Ninja shared his own melanoma story, joined on stream by dermatologist Dr. Daniel Sugai educating viewers on skin checks.",
    metrics: [
      ["$209K", "Dollars raised"],
      ["124K", "Hours watched"],
      ["22K", "Total peak CCV"],
    ],
    media: {
      file: `${GS}/23-la-roche-posay-gaming-for-cause/s35-ninja-stream.jpg`,
      alt: "The Gaming for Cause streamathon with its live donation tracker",
      credit: GS_CREDIT,
      focus: [0.45, 0.35],
    },
    sortOrder: 104,
  },
  {
    slug: "ghost-faze-clan",
    brand: "GHOST",
    title: "GHOST × FaZe Clan",
    headline: "FAZE POP became 7-Eleven's best-selling new energy flavor.",
    service: "Influencer Marketing",
    industry: "Food & Beverage",
    engagementType: "Mass Awareness",
    attribution: "gamesquare",
    platforms: ["Twitch", "YouTube", "X"],
    insight:
      "The ask: rise above gaming's saturated energy-drink noise and put GHOST top of mind.",
    built:
      "FAZE POP and FAZE UP launched across GHOST ENERGY and GHOST GAMER formats, backed by FaZe talent, livestreams, esports activations, giveaways, and product content.",
    metrics: [
      ["$63M+", "Total sales"],
      ["106M", "Total hours watched"],
      ["252M+", "Campaign impressions"],
    ],
    media: {
      file: `${GS}/22-ghost-faze-clan/s33-faze-pop.jpg`,
      alt: "GHOST × FaZe Clan FAZE POP key art",
      display: "fit",
      credit: GS_CREDIT,
    },
    sortOrder: 105,
  },
  {
    slug: "vitaminwater-fortnite",
    brand: "Vitaminwater",
    title: "Vitaminwater × Fortnite",
    headline: "The brand became the environment, not the ad.",
    service: "In-Game",
    industry: "Food & Beverage",
    engagementType: "Mass Awareness",
    attribution: "gamesquare",
    platforms: ["Twitch", "YouTube"],
    insight:
      "The ask: show up natively inside Fortnite to drive awareness, recall, and purchase intent.",
    built:
      "A custom Vitaminwater world anchored the campaign, supported by in-game placements, contextual targeting, and behavioral media. In-game drove awareness while contextual and behavioral media carried reach and efficiency.",
    metrics: [
      ["38.3M", "Total impressions"],
      ["94%", "In-game view-through rate"],
      ["1.8%", "Lift in unaided awareness"],
    ],
    media: {
      file: `${GS}/30-vitaminwater-fortnite/s43-key-art.jpg`,
      alt: "Fortnite characters in the custom Vitaminwater world",
      credit: GS_CREDIT,
    },
    gallery: [
      { file: `${GS}/30-vitaminwater-fortnite/s43-gameplay.jpg`, alt: "Vitaminwater world gameplay", credit: GS_CREDIT },
    ],
    sortOrder: 106,
  },
  {
    slug: "displate-comic-con",
    brand: "Displate",
    title: "Displate × Comic-Con",
    headline: "A render-to-reality booth that turned foot traffic into sales.",
    service: "Experiential",
    industry: "Retail",
    engagementType: "Onsite Support",
    attribution: "gamesquare",
    platforms: ["Instagram", "TikTok"],
    insight:
      "The ask: make a splash at San Diego Comic-Con and convert booth traffic into product sales.",
    built:
      "A render-to-reality booth design brought the campaign theme to life and pulled consumer foot traffic, while a newly identified brand-ambassador pool resonated with the audience and generated sales.",
    proofLine: "San Diego Comic-Con — a render-to-reality booth and a new ambassador pool.",
    media: {
      file: `${GS}/25-displate-comic-con/s38-booth-real.jpg`,
      alt: "The Displate booth at San Diego Comic-Con",
      credit: GS_CREDIT,
    },
    gallery: [
      { file: `${GS}/25-displate-comic-con/s38-booth-render.jpg`, alt: "The booth design render", credit: GS_CREDIT },
    ],
    sortOrder: 107,
  },
  {
    slug: "dairy-max-futp60-madden-open",
    brand: "Dairy Max",
    title: "FUTP60 Madden Open",
    headline: "Cowboys talent, live from GameSquare HQ.",
    service: "Experiential",
    industry: "Sport & Lifestyle",
    engagementType: "Onsite Support",
    attribution: "gamesquare",
    platforms: ["Twitch", "YouTube"],
    insight:
      "The ask: promote nutrition and healthy lifestyles for Texas students through Madden.",
    built:
      "The second annual FUTP60 Madden Open ran at GameSquare HQ with Dallas Cowboys talent, a live Twitch broadcast, pre-roll video, and social amplification featuring Darrynton Evans and Isaiah Stanback.",
    metrics: [
      ["40M", "PR reach"],
      ["1.5M", "Social impressions"],
      ["87%", "VCR"],
    ],
    media: {
      file: `${GS}/35-dairy-max-madden-open/s48-cowboys-talent.jpg`,
      alt: "Dallas Cowboys talent at the FUTP60 Madden Open",
      credit: GS_CREDIT,
    },
    gallery: [
      { file: `${GS}/35-dairy-max-madden-open/s48-broadcast.jpg`, alt: "The live Madden Open broadcast", credit: GS_CREDIT },
    ],
    sortOrder: 108,
  },
];

async function studyDoc(s: Study) {
  return {
    _id: `caseStudy-${s.slug}`,
    _type: "caseStudy",
    brand: s.brand,
    title: s.title,
    ...(s.headline ? { headline: s.headline } : {}),
    slug: { _type: "slug", current: s.slug },
    service: s.service,
    industry: s.industry,
    engagementType: s.engagementType,
    attribution: s.attribution,
    platforms: s.platforms,
    insight: s.insight,
    built: s.built,
    ...(s.resultsIntro ? { resultsIntro: s.resultsIntro } : {}),
    metrics: (s.metrics ?? []).map(([v, l]) => metric(v, l)),
    ...(s.proofLine ? { proofLine: s.proofLine } : {}),
    figuresSource: "client-confirmed",
    media: await img(s.media.file, s.media),
    gallery: await Promise.all((s.gallery ?? []).map((g) => img(g.file, g, true))),
    ...(s.quote
      ? {
          quote: {
            text: s.quote.text,
            name: s.quote.name,
            role: s.quote.role,
            ...(s.quote.photo
              ? { photo: await img(s.quote.photo.file, s.quote.photo) }
              : {}),
          },
        }
      : {}),
    featured: s.featured ?? false,
    sortOrder: s.sortOrder,
    notes:
      s.attribution === "gamesquare"
        ? "GameSquare activation, shown with CLICK's approval (Sep 2026). Figures from CLICK's Narrative deck."
        : "From CLICK's Narrative / Case Studies decks (Aug–Sep 2026). Where the decks disagreed, the larger figure is used at CLICK's direction.",
  };
}

/* The four case studies that pre-date the decks: taxonomy for the new
   filters, and they step back behind the deck's lead campaigns. Each
   change applies only while the field still holds the old value. */
const EXISTING: {
  id: string;
  engagementType: string;
  industry?: [from: string, to: string];
  sortOrder: number;
}[] = [
  { id: "caseStudy-capcom-pragmata", engagementType: "Kit Seeding", sortOrder: 14 },
  { id: "caseStudy-optus-gaming-on-the-go", engagementType: "Mass Awareness", sortOrder: 15 },
  {
    id: "caseStudy-maybelline-eyes-up",
    engagementType: "Tailored Activations",
    industry: ["Consumer Packaged Goods", "Beauty"],
    sortOrder: 16,
  },
  {
    id: "caseStudy-mcdonalds-summer-24",
    engagementType: "Tailored Activations",
    industry: ["Retail", "Food & Beverage"],
    sortOrder: 17,
  },
];

/* ------------------------------------------------------------------ */
/* /work                                                               */
/* ------------------------------------------------------------------ */

const workPage = {
  _id: "workPage",
  _type: "workPage",
  heroEyebrow: "Our Work",
  heroTitle: "Smarter decisions. Stronger partnerships. Better results.",
  heroLede:
    "Every campaign starts with what the intelligence found. Explore the partnerships that show what happens next.",
  reelsEyebrow: "Industry reels",
  reelsHeading: "Work, by industry.",
  reels: [
    { label: "Beauty", industry: "Beauty" },
    { label: "Consumer Tech", industry: "Consumer Tech" },
    { label: "Sport & Lifestyle", industry: "Sport & Lifestyle" },
    { label: "Food & Bev", industry: "Food & Beverage" },
  ].map((r) => ({ _key: k("reel"), _type: "reel", ...r })),
  ctaHeading: "Ready to build your next success story?",
  ctaBody:
    "Whether you're launching a product, growing your brand, or creating your next cultural moment, we'll help connect your business with the right creators, audiences, and ideas.",
};

/* ------------------------------------------------------------------ */
/* /experiential                                                        */
/* ------------------------------------------------------------------ */

const EV = "06-event-assets-hires";
const EV_CREDIT = "CLICK event photography";

async function experientialPage() {
  const blocks = [
    {
      _key: "blk1",
      _type: "pageHero",
      eyebrow: "Solutions · Experiential",
      title: "Experiential",
      outline: true,
      kicker:
        "Creating moments that people don't just attend — they remember, share, and become part of.",
      lede: "The most impactful experiences don't end when the lights go down. They spark conversations, inspire content, strengthen communities, and create lasting connections between brands and the people they serve.",
      ctas: [
        { _key: k("c"), ...modalCta("Start the Conversation") },
        { _key: k("c"), ...cta("View Our Work", "/work") },
      ],
      asideKind: "image",
      aside: await img(`${EV}/trip-of-terror-bus.jpg`, {
        alt: "CLICK creators arriving for the Trip of Terror event",
        credit: EV_CREDIT,
        focus: [0.5, 0.55],
      }),
    },
    {
      _key: "blk2",
      _type: "copyMedia",
      eyebrow: "Experiences begin with people",
      heading:
        "Every unforgettable experience begins with understanding who it's for.",
      body: [
        para(
          "Audience intelligence helps us identify the communities, passions, and cultural moments that bring people together. Those insights become the foundation for experiences that feel authentic, relevant, and worth sharing.",
        ),
        para(
          "Because the best experiences aren't built around a venue — they're built around people.",
        ),
      ],
      media: [
        await img(`${EV}/3kliks-pot-noodle-activation.jpg`, {
          alt: "3kliks with fans at the Pot Noodle activation",
          credit: EV_CREDIT,
        }, true),
        await img(`${EV}/nintendo-tomodachi-life-event_HIRES-of-deck-s03.jpg`, {
          alt: "Creators playing at the Nintendo Tomodachi Life event",
          credit: EV_CREDIT,
        }, true),
        await img(`${EV}/stadium-pitch-creators.jpg`, {
          alt: "Creators on the pitch at a stadium activation",
          credit: EV_CREDIT,
          focus: [0.5, 0.7],
        }, true),
      ],
      mediaPosition: "right",
    },
    {
      _key: "blk3",
      _type: "cardGrid",
      eyebrow: "Where brands become part of culture",
      heading:
        "The most successful experiential campaigns don't interrupt culture — they contribute to it.",
      numbered: true,
      cards: [
        ["Gaming & Esports", ["Championships", "Community tournaments", "Creator competitions", "Fan engagement"]],
        ["Sports", ["Athlete partnerships", "Fan experiences", "Hospitality", "Brand integrations"]],
        ["Entertainment", ["Premieres", "Launch events", "Creator collaborations", "Live performances"]],
        ["Brand Activations", ["Pop-ups", "Product launches", "Sampling", "Retail experiences", "Interactive installations"]],
        ["Community Experiences", ["Creator meetups", "VIP events", "Local activations", "Fan appreciation", "Lifestyle experiences"]],
      ].map(([title, items]) => ({
        _key: k("card"),
        _type: "card",
        eyebrow: "Experience category",
        title,
        items,
      })),
    },
    {
      _key: "blk4",
      _type: "copyMedia",
      eyebrow: "Creators bring experiences to life",
      heading:
        "Creators don't simply attend events — they shape how audiences experience them.",
      body: [
        para(
          "By working alongside creators throughout planning, storytelling, production, and execution, we help brands create authentic moments that feel natural to both creators and their communities.",
        ),
        para(
          "Our team serves as the bridge between brands and creators, ensuring every experience reflects the creator's voice while delivering meaningful business outcomes.",
        ),
        para(
          "The result is content that feels genuine, communities that feel included, and partnerships that continue long after the event ends.",
        ),
      ],
      media: [
        await img(`${EV}/surf-shoot-group-4k-still.jpg`, {
          alt: "CLICK creators at a surf content shoot",
          credit: EV_CREDIT,
        }, true),
        await img(`${EV}/lenovo-legion-launch-aussieantics.jpg`, {
          alt: "AussieAntics at the Lenovo Legion launch event",
          credit: EV_CREDIT,
          focus: [0.5, 0.35],
        }, true),
        await img(`${EV}/creators-behind-the-scenes.jpg`, {
          alt: "Creators behind the scenes at a CLICK shoot",
          credit: EV_CREDIT,
          focus: [0.5, 0.4],
        }, true),
      ],
      mediaPosition: "left",
    },
    {
      _key: "blk5",
      _type: "capabilityList",
      eyebrow: "End-to-end experiential execution",
      heading: "From concept through execution.",
      groups: [
        ["Strategy", ["Audience Intelligence", "Cultural Insights", "Experience Strategy", "Creator Strategy", "Venue Selection", "Partnership Development"]],
        ["Production", ["Event Management", "Brand Activations", "Creative Production", "Creator Coordination", "Hospitality", "Staffing", "Logistics"]],
        ["Amplification", ["Content Capture", "Social Distribution", "Creator Publishing", "Paid Amplification", "Community Engagement", "PR Integration"]],
        ["Optimization", ["Performance Reporting", "Audience Insights", "Event Analytics", "Creator Performance", "Community Growth", "Future Recommendations"]],
      ].map(([label, items]) => ({ _key: k("g"), _type: "capabilityGroup", label, items })),
    },
    {
      _key: "blk6",
      _type: "activationScorecard",
      eyebrow: "Measured beyond the moment",
      heading: "The value of an experience extends far beyond a single day.",
      body: [
        para(
          "Every activation is designed to generate lasting value through creator content, earned media, community engagement, social conversation, and measurable business impact.",
        ),
        para(
          "Every experience is measured against the objective it was built for — attendance and community growth, creator content and earned reach, or retail traffic and sales impact. We report the three to five numbers that prove the experience worked, not everything we could count.",
        ),
      ],
      label: "Ubisoft · R6 Salt Lake City Major",
      source: "CLICK Influence case study",
      metrics: [
        metric("5.5M", "Video views"),
        metric("45K", "Stream hours watched"),
        metric("22%", "Positive Twitch chat sentiment"),
      ],
      media: await img(`${CS}/10-ubisoft-r6-salt-lake-city-major/s60-collage.jpg`, {
        alt: "Creators onsite at the R6 Salt Lake City Major",
        display: "fit",
        credit: CLICK_CREDIT,
      }),
    },
    {
      _key: "blk7",
      _type: "featuredWork",
      eyebrow: "Performance in practice",
      heading: "Great experiences don't end when the event is over.",
      picks: [
        "caseStudy-ubisoft-r6-salt-lake-city-major",
        "caseStudy-annapurna-mixtape",
        "caseStudy-capcom-monster-hunter-wilds",
        "caseStudy-red-bull-f1-karting-series",
        "caseStudy-displate-comic-con",
        "caseStudy-dairy-max-futp60-madden-open",
      ].map(ref),
      cta: cta("View All Work", "/work"),
    },
    {
      _key: "blk8",
      _type: "ctaBanner",
      heading: "Great experiences create lasting connections.",
      body: "Whether you're launching a product, building a community, or creating your next cultural moment, we'll help turn insight into unforgettable experiences that deliver measurable business results.",
      cta: modalCta("Start the Conversation"),
    },
  ];

  return {
    _id: "page-experiential",
    _type: "page",
    title: "Experiential",
    slug: { _type: "slug", current: "experiential" },
    blocks,
    seo: {
      _type: "seo",
      description:
        "Experiences that don't end when the lights go down. CLICK combines audience intelligence, creator expertise and world-class execution to build live moments that keep creating value long after the event.",
    },
  };
}

/* ------------------------------------------------------------------ */
/* new sections on existing pages                                      */
/* ------------------------------------------------------------------ */

const AI = "02-audience-intelligence";

async function imSections() {
  return {
    afterHero: [
      {
        _key: "deck-stats",
        _type: "metricRow",
        eyebrow: "Intelligence at scale",
        heading: "Intelligence before investment.",
        metrics: [
          metric("40M", "Creators mapped"),
          metric("100B+", "Signals processed daily"),
          metric("10B+", "Views on paid programs"),
        ],
        footnote: "Powered by GameSquare's data and technology.",
      },
      {
        _key: "deck-problem",
        _type: "cardGrid",
        eyebrow: "The problem",
        heading: "Creator-first is a bet.",
        cards: [
          ["Picked on reach", "Creators chosen for follower counts, not audience fit."],
          ["Fit is a guess", "No way to know if a creator's audience is actually yours."],
          ["Content ≠ connection", "Content everywhere, connection nowhere. Culture can smell it."],
          ["Reporting looks back", "It explains what happened, never what to do next."],
        ].map(([title, body]) => ({ _key: k("card"), _type: "card", title, body })),
        insight:
          "Most influencer marketing starts with creators, then works backward to the audience. Sometimes it works. The problem is knowing why it worked — and whether you can repeat it on purpose.",
      },
      {
        _key: "deck-models",
        _type: "cardGrid",
        eyebrow: "The difference",
        heading: "The industry has been built backwards.",
        cards: [
          {
            title: "The traditional model",
            items: [
              "Start from a creator wishlist",
              "Match on demographics and reach",
              "Brief everyone the same way",
              "Report impressions at the end",
              "Start over next campaign",
            ],
          },
          {
            title: "The CLICK model",
            items: [
              "Start with the audience, then identify the creators best positioned to move them",
              "Match on behavior and community overlap",
              "Tailor every brief to its cohort",
              "Define success upfront, then prove what works before scaling",
              "Every campaign makes the next smarter",
            ],
          },
        ].map((c) => ({ _key: k("card"), _type: "card", ...c })),
        footnote:
          "The same creators exist in both models. The difference is what informs the decision.",
      },
    ],
    afterAudience: [
      {
        _key: "deck-read",
        _type: "cardGrid",
        eyebrow: "Audience mapping",
        heading: "How we read an audience.",
        numbered: true,
        cards: [
          {
            title: "Map your brand",
            body: "Understand who actually engages with your brand — their communities, interests, affinities, and cultural behaviors. Bots and fake accounts are removed first.",
            image: await img(`${AI}/s08-01-map-your-brand.png`, {
              alt: "An audience map of a brand's engaged communities",
            }),
          },
          {
            title: "Map the field",
            body: "Apply the same intelligence to your competitive set — revealing where you compete for attention and where your brand owns unique ground.",
            image: await img(`${AI}/s08-02-map-the-field-prime.png`, {
              alt: "A competitive audience map comparing two brands",
              display: "fit",
            }),
          },
          {
            title: "Unearth audiences",
            body: "Surface the communities nobody planned for — high-affinity audiences hiding outside your category assumptions.",
            image: await img(`${AI}/s08-03-unearth-audiences.png`, {
              alt: "Community clusters surfaced around a brand audience",
            }),
          },
          {
            title: "Find the whitespace",
            body: "Untapped landing points where a partnership will hold, ranked before a single creator is contacted.",
            image: await img(`${AI}/s08-04-find-the-whitespace.png`, {
              alt: "Ranked whitespace opportunities for creator partnerships",
              display: "fit",
            }),
          },
        ].map((c) => ({ _key: k("card"), _type: "card", ...c })),
        footnote: "Every brand has a different audience opportunity. The map reveals yours.",
      },
    ],
    afterLifecycle: [
      {
        _key: "deck-engagement",
        _type: "cardGrid",
        eyebrow: "One model, built to flex",
        heading: "Start where it makes sense. Expand when the opportunity does.",
        numbered: true,
        cards: [
          ["Campaign Activation", "For a specific campaign, launch, or cultural moment.", "Strategy, creators, content, execution, and measurement built around a defined objective and timeline."],
          ["Strategic Engagement", "For brands that want intelligence to inform the activation.", "Start with audience intelligence to understand the opportunity, then translate those findings into creator strategy and campaign execution."],
          ["Enterprise Partnership", "For brands running multiple campaigns or priorities over time.", "Build an intelligence foundation, activate against it, measure what works, and use those learnings to continuously improve future campaigns and investment."],
          ["Enterprise AOR", "For an always-on partnership where intelligence compounds.", "A continuous operating model that connects audience intelligence, creator strategy, activation, optimization, and scale across campaigns, markets, and the broader GameSquare ecosystem."],
        ].map(([title, eyebrow, body]) => ({ _key: k("card"), _type: "card", eyebrow, title, body })),
        footnote: "Switch agencies and the model resets to zero. Stay, and it compounds.",
      },
      {
        _key: "deck-deliverables",
        _type: "capabilityList",
        eyebrow: "What you receive",
        heading: "Intelligence that shapes the work — and makes the next decision smarter.",
        groups: [
          ["Audience Intelligence", ["Personas and segmentation", "Interests and affinities", "Overlap analysis", "Whitespace opportunities"]],
          ["Competitive Intelligence", ["Benchmarking", "Share of voice", "Category trends", "Competitive positioning"]],
          ["Creator Intelligence", ["Recommendations", "Audience match scores", "Authenticity checks", "Tier strategy"]],
          ["Content Intelligence", ["Platform prioritization", "Search and cultural trends", "Creative best practices"]],
          ["Measurement", ["KPI dashboards", "Brand and sales lift", "ROAS and conversions", "Creator performance"]],
          ["Decision Intelligence", ["Audience and creator strategy", "Budget allocation", "Optimization roadmap", "Next best actions"]],
        ].map(([label, items]) => ({ _key: k("g"), _type: "capabilityGroup", label, items })),
      },
    ],
  };
}

async function aboutWhoWeAre() {
  return {
    _key: "deck-who",
    _type: "cardGrid",
    eyebrow: "Who we are",
    heading: "Understand audiences. Move people.",
    cards: [
      {
        eyebrow: "What we do",
        title: "We turn cultural relevance into measurable impact.",
        body: "Creator-led campaigns that launch products, grow franchises, and connect brands with the communities shaping what's next.",
        image: await img(`${EV}/ebay-live-set_HIRES-of-deck-s03.jpg`, {
          alt: "The CLICK team on the eBay live set",
          credit: EV_CREDIT,
          focus: [0.5, 0.45],
        }),
      },
      {
        eyebrow: "How we're different",
        title: "Audience intelligence, creator expertise, and the scale of GameSquare.",
        body: "Billions of first-party signals help us understand where attention lives. Our talent business gives us a deeper understanding of the creators who can move it.",
        image: await img(`${EV}/stumpy-wembley_HIRES-of-deck-s03.jpg`, {
          alt: "Creator Stumpy at Wembley Stadium",
          credit: EV_CREDIT,
          focus: [0.6, 0.35],
        }),
      },
      {
        eyebrow: "Why it holds",
        title: "Data guides our people; it doesn't replace them.",
        body: "Our strategists turn intelligence into creator, creative, and media decisions, with the broader GameSquare ecosystem extending what works across culture.",
        image: await img(`${EV}/nintendo-tomodachi-life-event_HIRES-of-deck-s03.jpg`, {
          alt: "Creators and the CLICK team at the Nintendo Tomodachi Life event",
          credit: EV_CREDIT,
        }),
      },
    ].map((c) => ({ _key: k("card"), _type: "card", ...c })),
  };
}

/* ------------------------------------------------------------------ */
/* run                                                                 */
/* ------------------------------------------------------------------ */

type PageRow = {
  _id: string;
  blocks: {
    _key: string;
    _type: string;
    picks?: { _ref: string }[];
    media?: { asset?: { originalFilename?: string } }[];
  }[];
};

const sameRefs = (a: { _ref: string }[] | undefined, b: string[]) =>
  (a ?? []).map((r) => r._ref).join() === b.join();

async function main() {
  log(apply ? "Seeding from the decks\n" : "DRY RUN — pass --apply to write\n");
  const tx = client.transaction();

  /* case studies */
  const existingIds = new Set<string>(await client.fetch(`*[_type == "caseStudy"]._id`));
  for (const s of STUDIES) {
    const doc = await studyDoc(s);
    const state = existingIds.has(doc._id) ? "exists — left alone" : "create";
    log(`  case study  ${s.attribution.padEnd(10)} ${doc._id.padEnd(52)} ${state}`);
    tx.createIfNotExists(doc);
  }

  for (const e of EXISTING) {
    const cur = await client.getDocument<{ engagementType?: string; industry?: string }>(e.id);
    if (!cur) continue;
    const set: Record<string, unknown> = { sortOrder: e.sortOrder, featured: false };
    if (!cur.engagementType) set.engagementType = e.engagementType;
    if (e.industry && cur.industry === e.industry[0]) set.industry = e.industry[1];
    log(`  case study  update     ${e.id.padEnd(52)} ${Object.keys(set).join(", ")}`);
    tx.patch(e.id, (p) => p.set(set));
  }

  /* Withdrawn: not in CLICK's decks. Dropped from any featured picks
     first, or the delete would fail on the reference. */
  const vaping = "caseStudy-national-youth-vaping";
  const referrers: { _id: string }[] = await client.fetch(
    `*[references($id)]{ _id }`,
    { id: vaping },
  );
  if (referrers.length) log(`  ! ${vaping} referenced by ${referrers.map((r) => r._id).join(", ")} — not deleted`);
  else if (existingIds.has(vaping)) {
    log(`  case study  delete     ${vaping}`);
    tx.delete(vaping);
  }

  /* /work singleton */
  log(`  workPage    ${(await client.getDocument("workPage")) ? "exists — left alone" : "create"}`);
  tx.createIfNotExists(workPage);

  /* home: lead with the deck's campaigns while the picks are the old set */
  const home = await client.getDocument<{ workPicks?: { _ref: string }[] }>("homePage");
  const oldHome = ["caseStudy-capcom-pragmata", "caseStudy-maybelline-eyes-up", "caseStudy-mcdonalds-summer-24"];
  if (home && sameRefs(home.workPicks, oldHome)) {
    log("  homePage    featured work → RE9, MHW, R6 Siege X");
    tx.patch("homePage", (p) =>
      p.set({
        workPicks: [
          "caseStudy-capcom-resident-evil-requiem",
          "caseStudy-capcom-monster-hunter-wilds",
          "caseStudy-ubisoft-r6-siege-x",
        ].map(ref),
      }),
    );
  } else log("  homePage    featured work edited in the Studio — left alone");

  /* /experiential */
  const exp = await experientialPage();
  log(`  page        page-experiential ${(await client.getDocument("page-experiential")) ? "exists — left alone" : `create (${exp.blocks.length} sections)`}`);
  tx.createIfNotExists(exp);

  /* Influencer Marketing */
  const im = await client.fetch<PageRow | null>(
    `*[_id == "page-influencer-marketing"][0]{ _id, blocks[]{ _key, _type, picks, media[]{ asset->{ originalFilename } } } }`,
  );
  if (im) {
    const has = new Set(im.blocks.map((b) => b._key));
    const sections = await imSections();
    const insert = (after: string, blocks: { _key: string }[]) => {
      const fresh = blocks.filter((b) => !has.has(b._key));
      if (!fresh.length || !has.has(after)) return;
      log(`  IM page     + ${fresh.map((b) => b._key).join(", ")} after ${after}`);
      tx.patch(im._id, (p) => p.insert("after", `blocks[_key == "${after}"]`, fresh));
    };
    /* Inserted bottom-up so each anchor key is still where we left it. */
    insert("blk21", sections.afterLifecycle);
    insert("blk4", sections.afterAudience);
    insert("blk1", sections.afterHero);

    const proof = im.blocks.find((b) => b._key === "blk35");
    const oldProof = ["caseStudy-capcom-pragmata", "caseStudy-optus-gaming-on-the-go", "caseStudy-maybelline-eyes-up"];
    if (proof && sameRefs(proof.picks, oldProof)) {
      log("  IM page     proof in practice → RE9, MHW, R6 Siege X");
      tx.patch(im._id, (p) =>
        p.set({
          'blocks[_key == "blk35"].picks': [
            "caseStudy-capcom-resident-evil-requiem",
            "caseStudy-capcom-monster-hunter-wilds",
            "caseStudy-ubisoft-r6-siege-x",
          ].map(ref),
        }),
      );
    }

    /* "Creator expertise" was filled with images mislabelled as the
       deck's team photos (they are stock and a slide collage). Swap in
       the real CLICK photography — only while those are still there. */
    const expertise = im.blocks.find((b) => b._key === "blk14");
    const names = (expertise?.media ?? []).map((m) => m.asset?.originalFilename ?? "");
    if (names.length && names.every((n) => n.startsWith("s03-photo-"))) {
      log("  IM page     creator expertise images → CLICK event photography");
      const media = [
        await img(`${EV}/nintendo-tomodachi-life-event_HIRES-of-deck-s03.jpg`, {
          alt: "Creators and the CLICK team at the Nintendo Tomodachi Life event",
          credit: EV_CREDIT,
        }, true),
        await img(`${EV}/ebay-live-set_HIRES-of-deck-s03.jpg`, {
          alt: "The CLICK team on the eBay live set",
          credit: EV_CREDIT,
          focus: [0.5, 0.45],
        }, true),
        await img(`${EV}/stumpy-wembley_HIRES-of-deck-s03.jpg`, {
          alt: "Creator Stumpy at Wembley Stadium",
          credit: EV_CREDIT,
          focus: [0.6, 0.35],
        }, true),
      ];
      tx.patch(im._id, (p) => p.set({ 'blocks[_key == "blk14"].media': media }));
    }
  }

  /* About */
  const about = await client.fetch<PageRow | null>(
    `*[_id == "page-about"][0]{ _id, blocks[]{ _key, _type } }`,
  );
  if (about && !about.blocks.some((b) => b._key === "deck-who")) {
    const anchor = about.blocks.find((b) => b._key === "blk2") ? "blk2" : "blk1";
    log(`  About page  + deck-who after ${anchor}`);
    const who = await aboutWhoWeAre();
    tx.patch(about._id, (p) => p.insert("after", `blocks[_key == "${anchor}"]`, [who]));
  }

  if (!apply) {
    log("\nNothing written. Re-run with --apply.");
    return;
  }
  await tx.commit({ autoGenerateArrayKeys: false });
  log(`\nDone. ${uploaded.size} images uploaded or reused.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
