/**
 * The featured CLICK roster — ten creators, US-led.
 *
 *   pnpm seed:roster
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local. Idempotent: documents get
 * deterministic ids (talent-<slug>) and each portrait is uploaded once per
 * filename, so re-running updates in place.
 *
 * PROVENANCE — read before publishing any of this.
 * Every figure, handle and biography below was drafted on 2026-09-01 from
 * public sources: each creator's own YouTube channel metadata (subscriber
 * counts read that day), GameSquare's investor announcements for the
 * SypherPK and Steak signings, and public profile pages for Fash. Nothing
 * here has been supplied or signed off by CLICK. Portraits are each
 * creator's own public channel avatar, carried at 1600px — they stand in
 * until CLICK supplies photography, and every one records that in its
 * credit field. Brand partners and ventures are deliberately left empty
 * rather than guessed at.
 *
 * The nine invented placeholder creators from the original content/site.ts
 * import are deleted by this script: they exist only as drafts and the real
 * roster replaces them. Muselk, a real CLICK creator, is kept — demoted out
 * of the featured set and sorted after the ten.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-01",
  useCdn: false,
});
const PUBLIC_DIR = join(process.cwd(), "public");
const SOURCED = "Drafted from public sources on 2026-09-01; figures read that day. Not yet confirmed by CLICK.";

type Platform = {
  platform: string;
  handle?: string;
  url?: string;
  audience?: string;
};

type Seed = {
  slug: string;
  name: string;
  category: string;
  region: string;
  location?: string;
  audience: string;
  platforms: Platform[];
  bio: string;
  story: { label: string; text: string }[];
  image: string;
  imageAlt: string;
  /** Focal point kept in frame on tight crops; defaults to just above centre. */
  hotspot?: { x: number; y: number };
  notes: string;
};

/* US first — the roster CLICK is scaling into the market — then a
   smaller Australian selection carrying the category breadth. */
const ROSTER: Seed[] = [
  {
    slug: "sypherpk",
    name: "SypherPK",
    category: "Gaming",
    region: "United States",
    audience: "20M+",
    platforms: [
      { platform: "YouTube", handle: "@SypherPK", url: "https://www.youtube.com/@SypherPK", audience: "10.6M" },
      { platform: "Twitch", handle: "sypherpk", url: "https://www.twitch.tv/sypherpk", audience: "7.2M" },
      { platform: "Instagram", handle: "@sypherpk", url: "https://www.instagram.com/sypherpk" },
    ],
    bio: "Ali Hassan has spent a decade making Fortnite make sense — daily uploads and live coaching that turned one of gaming's largest audiences into a daily habit rather than a passing spike.",
    story: [
      { label: "Audience", text: "More than 20 million followers across YouTube, Twitch and Instagram, built on teaching a game rather than simply playing it." },
      { label: "Business", text: "Signed to CLICK in 2026 — the roster's highest-profile creator addition, announced by GameSquare." },
    ],
    image: "/talent/sypherpk.jpg",
    imageAlt: "SypherPK channel mark",
    notes: `${SOURCED} Sources: youtube.com/@SypherPK (10.6M subscribers), GameSquare investor announcement "GameSquare Signs SypherPK ... to Click Management Roster" (20M+ followers, signing). Twitch figure from public channel stats. Portrait is his own public channel avatar — a logo, not photography; replace with a CLICK-supplied portrait before launch.`,
  },
  {
    slug: "steak",
    name: "Steak",
    category: "Gaming",
    region: "United States",
    audience: "7.6M",
    platforms: [
      { platform: "YouTube", handle: "@steak", url: "https://www.youtube.com/@steak", audience: "7.63M" },
    ],
    bio: "One of the biggest creators on Roblox, live almost every day. Nolan Crait's audience turns up for the stream itself — a scheduled, family-friendly show in a platform usually driven by the algorithm.",
    story: [
      { label: "Audience", text: "7.6M subscribers on YouTube, built on a near-daily live schedule rather than viral one-offs." },
      { label: "Business", text: "Signed to CLICK alongside the appointment of a chief growth officer, as part of a talent push GameSquare expects to add over $5M in annualised revenue." },
    ],
    image: "/talent/steak.jpg",
    imageAlt: "Steak channel mark",
    notes: `${SOURCED} Sources: youtube.com/@steak (7.63M subscribers), GameSquare announcement of Justin Miclat as Chief Growth Officer of Click, which names Steak as the second-largest Roblox creator and gives the revenue expectation. Portrait is his own public channel avatar — a logo, not photography; replace before launch.`,
  },
  {
    slug: "killdozer",
    name: "Killdozer",
    category: "Gaming",
    region: "United States",
    audience: "785K",
    platforms: [
      { platform: "YouTube", handle: "@Killdozer_tv", url: "https://www.youtube.com/@Killdozer_tv", audience: "785K" },
      { platform: "Twitch", handle: "killdozer_tv", url: "https://www.twitch.tv/killdozer_tv" },
      { platform: "Kick", handle: "killdozer-tv", url: "https://kick.com/killdozer-tv" },
    ],
    bio: "Gaming streams and challenge videos played with a straight face, carried across YouTube, Twitch and Kick by a community that named itself after him.",
    story: [
      { label: "Audience", text: "785K subscribers on YouTube, with the same audience following him live across Twitch and Kick." },
      { label: "Business", text: "Managed by CLICK — his channel lists killdozer@clickmedia.group for business enquiries." },
    ],
    image: "/talent/killdozer.jpg",
    imageAlt: "Killdozer",
    notes: `${SOURCED} Sources: youtube.com/@Killdozer_tv (785K subscribers, business email killdozer@clickmedia.group confirming CLICK management). Twitch and Kick presence noted publicly but follower figures not verified — left blank rather than estimated. Portrait is his own public channel avatar; replace with CLICK-supplied photography before launch.`,
  },
  {
    slug: "eddievr",
    name: "EddieVR",
    category: "Comedy",
    region: "United States",
    audience: "7.6M",
    platforms: [
      { platform: "YouTube", handle: "@EddieVR", url: "https://www.youtube.com/@EddieVR", audience: "7.6M" },
      { platform: "Instagram", handle: "@sauceddie", url: "https://www.instagram.com/sauceddie" },
    ],
    bio: "Eduardo Saucedo — Special Edd — is one of the largest VR creators on YouTube: comedy built inside virtual worlds, improvised with the people he's playing beside.",
    story: [
      { label: "Audience", text: "7.6M subscribers, named by YouTube as one of its breakout gaming creators in 2020." },
      { label: "Business", text: "A founding member of The Boys, whose channel now carries the group's collaborative output alongside his own." },
    ],
    image: "/talent/eddievr.jpg",
    imageAlt: "EddieVR in a VR headset",
    notes: `${SOURCED} Sources: youtube.com/@EddieVR (7.6M subscribers, business email eddievr@clickmgmt.com.au confirming CLICK management). Real name and the 2020 YouTube breakout credit from public creator profiles. Portrait is his own public channel avatar; replace with CLICK-supplied photography before launch.`,
  },
  {
    slug: "the-boys",
    name: "The Boys",
    category: "Comedy",
    region: "United States",
    audience: "6.5M",
    platforms: [
      { platform: "YouTube", handle: "@yeptheboys", url: "https://www.youtube.com/@yeptheboys", audience: "6.52M" },
    ],
    bio: "JoshDub, Mully, EddieVR, JuicyFruitSnacks and Your Narrator — five creators split across Australia and the US whose VR comedy works because none of it is scripted.",
    story: [
      { label: "Audience", text: "6.5M subscribers on the group channel, on top of the individual audiences each member brings to it." },
      { label: "Business", text: "Managed by CLICK — the channel lists theboys@clickmgmt.com.au for business enquiries." },
    ],
    image: "/talent/the-boys.jpg",
    imageAlt: "The Boys channel mark",
    notes: `${SOURCED} Sources: youtube.com/@yeptheboys (6.52M subscribers, business email theboys@clickmgmt.com.au confirming CLICK management); membership and the Australia/US split from public creator profiles. Portrait is the group's own public channel avatar — a wordmark, not photography; replace before launch.`,
  },

  {
    slug: "aussieantics",
    name: "AussieAntics",
    category: "Gaming",
    region: "Australia",
    audience: "579K",
    platforms: [
      { platform: "YouTube", handle: "@AussieAntics", url: "https://www.youtube.com/@AussieAntics", audience: "579K" },
      { platform: "X", handle: "@AussieAntics", url: "https://x.com/AussieAntics" },
    ],
    bio: "Competitive Fortnite, covered from the inside — news, highlights and analysis for an audience that follows the scene as a sport.",
    story: [
      { label: "Audience", text: "579K subscribers built on competitive Fortnite coverage rather than casual play." },
      { label: "Business", text: "Creates as an Australian content creator for the esports organisation Dignitas." },
    ],
    image: "/talent/aussieantics.jpg",
    imageAlt: "AussieAntics channel mark",
    notes: `${SOURCED} Sources: youtube.com/@AussieAntics (579K subscribers; channel description names Dignitas; channel keywords confirm the competitive Fortnite focus). CLICK representation supplied by the client, not independently verified. Portrait is the channel avatar — the Dignitas mark, not photography; replace before launch.`,
  },
  {
    slug: "bundun",
    name: "Bundun",
    category: "Gaming",
    region: "Australia",
    audience: "3.75M",
    platforms: [
      { platform: "YouTube", handle: "@Bundun", url: "https://www.youtube.com/@Bundun", audience: "3.75M" },
      { platform: "Instagram", handle: "@bundunlive", url: "https://www.instagram.com/bundunlive" },
      { platform: "X", handle: "@BundunLive", url: "https://x.com/BundunLive" },
    ],
    bio: "Gaming played for the joy of it — a channel whose whole proposition, in its creator's words, is improving your day.",
    story: [
      { label: "Audience", text: "3.75M subscribers across more than a thousand videos." },
      { label: "Business", text: "Managed by CLICK — his channel lists bundun@clickmgmt.com.au for business enquiries." },
    ],
    image: "/talent/bundun.jpg",
    imageAlt: "Bundun",
    notes: `${SOURCED} Sources: youtube.com/@Bundun (3.75M subscribers, 1.2K videos, business email bundun@clickmgmt.com.au confirming CLICK management). Portrait is his own public channel avatar; replace with CLICK-supplied photography before launch.`,
  },
  {
    slug: "grace-mulgrew",
    name: "Grace Mulgrew",
    category: "Lifestyle",
    region: "Australia",
    location: "Melbourne, Australia",
    audience: "6M+",
    platforms: [
      { platform: "YouTube", handle: "@GracesWorld", url: "https://www.youtube.com/@GracesWorld", audience: "4.1M" },
      { platform: "TikTok", handle: "@grace.mulgrew", url: "https://www.tiktok.com/@grace.mulgrew", audience: "254K" },
      { platform: "Instagram", handle: "@grace.mulgrew", url: "https://www.instagram.com/grace.mulgrew", audience: "85K" },
    ],
    bio: "Grace started making videos at six and has been growing up on camera ever since — a storytelling channel that has moved with its audience into travel, fashion and university life.",
    story: [
      { label: "Audience", text: "4.1M subscribers on Grace's World, with a further 1.2M on Grace's Room and 647K on her Spanish-language channel." },
      { label: "Business", text: "Three channels and billions of lifetime views, extended across TikTok and Instagram as the audience aged with her." },
    ],
    image: "/talent/grace-mulgrew-2026.jpg",
    imageAlt: "Grace Mulgrew by the Yarra in Melbourne",
    hotspot: { x: 0.52, y: 0.3 },
    notes: `${SOURCED} Sources: youtube.com/@GracesWorld (4.12M), @GracesRoom (1.24M), @ElMundodeGrace (647K); TikTok and Instagram figures from public profile listings and not verified directly. Portrait is the current avatar from her own Grace's Room channel (youtube.com/@GracesRoom) — the Grace's World avatar dates from the channel's early years and was deliberately not used.`,
  },
  {
    slug: "fash",
    name: "Fash",
    category: "Lifestyle",
    region: "Australia",
    location: "Sydney, Australia",
    audience: "5.6M",
    platforms: [
      { platform: "TikTok", handle: "@fash", url: "https://www.tiktok.com/@fash", audience: "5.3M" },
      { platform: "Instagram", handle: "@imgonnafash", url: "https://www.instagram.com/imgonnafash", audience: "288K" },
    ],
    bio: "A Sydney creator and musician who built a global following on TikTok before turning it towards his own songwriting.",
    story: [
      { label: "Audience", text: "More than five million followers on TikTok, with a second audience on Instagram." },
      { label: "Business", text: "Released his debut single in 2020 and has recorded and collaborated as an artist since." },
    ],
    image: "/talent/fash.jpg",
    imageAlt: "Fash",
    notes: `${SOURCED} Instagram handle supplied by the client (instagram.com/imgonnafash). Figures from public profile listings — TikTok ~5.3M, Instagram 288K — and NOT verified directly, because both platforms block automated reads; confirm before publishing. Public reporting also suggests his TikTok and Instagram posts were removed during 2025, so the account state needs checking. Portrait is the avatar from his own YouTube channel, youtube.com/@imgonnafash.`,
  },
  {
    slug: "surfingwithnoz",
    name: "SurfingwithNoz",
    category: "Sports",
    region: "Australia",
    location: "Sydney, Australia",
    audience: "248K",
    platforms: [
      { platform: "YouTube", handle: "@SurfingWithNoz", url: "https://www.youtube.com/@SurfingwithNoz", audience: "248K" },
    ],
    bio: "A surfer and coach from Sydney filming the thing itself — POV sessions, technique and board reviews, weekly, for people who want to get better in the water.",
    story: [
      { label: "Audience", text: "248K subscribers across more than 600 videos, published to a weekly schedule." },
      { label: "Business", text: "Coaching and product reviews sit alongside the surf content, giving the channel a commercial spine beyond sponsorship." },
    ],
    image: "/talent/surfingwithnoz.jpg",
    imageAlt: "Noz paddling out on a surfboard",
    notes: `${SOURCED} Sources: youtube.com/@SurfingwithNoz (248K subscribers, 603 videos; channel description gives the Sydney base and the creator/coach framing). CLICK representation supplied by the client, not independently verified. Portrait is his own public channel avatar.`,
  },
];

/* Invented stand-ins from the original import. They only ever existed as
   drafts; the real roster replaces them. */
const PLACEHOLDERS = [
  "gg-mara",
  "navi-quinn",
  "soft-serve-sam",
  "lumen",
  "pit-lane-priya",
  "taste-of-talia",
  "kickflip-ko",
  "glowby",
];

async function uploadOnce(publicPath: string) {
  const filename = basename(publicPath);
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  );
  if (existing) return existing;
  const abs = join(PUBLIC_DIR, publicPath);
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`);
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename,
  });
  console.log(`  uploaded ${filename}`);
  return asset._id;
}

async function toDocument(t: Seed, index: number) {
  return {
    _id: `talent-${t.slug}`,
    _type: "talent",
    name: t.name,
    slug: { _type: "slug", current: t.slug },
    category: t.category,
    platforms: t.platforms.map((p, i) => ({
      _key: `platform-${i}`,
      _type: "platformPresence",
      ...p,
    })),
    audience: t.audience,
    region: t.region,
    location: t.location,
    managed: true,
    bio: t.bio,
    partners: [],
    ventures: [],
    featured: true,
    sortOrder: index + 1,
    portrait: {
      _type: "image",
      asset: { _type: "reference", _ref: await uploadOnce(t.image) },
      /* Channel avatars are square and centre-weighted; the face sits a
         little above the middle once a card crops them. */
      hotspot: {
        _type: "sanity.imageHotspot",
        x: t.hotspot?.x ?? 0.5,
        y: t.hotspot?.y ?? 0.45,
        width: 0.7,
        height: 0.7,
      },
      alt: t.imageAlt,
      credit: "Creator's own public channel avatar, carried at 1600px. Placeholder until CLICK supplies photography.",
    },
    story: t.story.map((s, i) => ({
      _key: `beat-${i}`,
      _type: "storyBeat",
      ...s,
    })),
    notes: t.notes,
  };
}

async function main() {
  console.log(`Seeding ${ROSTER.length} creators → ${projectId}/${dataset}\n`);
  for (const [i, t] of ROSTER.entries()) {
    const doc = await toDocument(t, i);
    await client.createOrReplace(doc);
    console.log(`  ${String(i + 1).padStart(2)} ${t.region === "United States" ? "US" : "AU"}  ${t.name}`);
  }

  /* Muselk is real CLICK talent and stays published — out of the featured
     set, sorted after the ten. */
  const muselk = await client.getDocument("talent-muselk");
  if (muselk) {
    await client
      .patch("talent-muselk")
      .set({ featured: false, sortOrder: ROSTER.length + 1 })
      .commit();
    console.log(`\n  kept Muselk (unfeatured, sorted last)`);
  }

  for (const slug of PLACEHOLDERS) {
    const ids = [`talent-${slug}`, `drafts.talent-${slug}`];
    for (const id of ids) {
      if (await client.getDocument(id)) {
        await client.delete(id);
        console.log(`  removed placeholder ${id}`);
      }
    }
  }

  console.log("\nDone. Every entry carries its sources in Internal notes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
