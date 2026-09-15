/**
 * Creates the home page singleton from the values Sections.tsx and
 * content/manifest.ts carry today.
 *
 *   pnpm seed:home
 *
 * ⚠ THE HOME PAGE IS LIVE. Running this overwrites what CLICK sees,
 * including anything they have edited in the Studio. One-time migration.
 *
 * Featured work is NOT restated here: `workPicks` is left empty so the
 * section resolves the featured case studies automatically, which means
 * publishing one puts it on the home page.
 */
import { createClient } from "@sanity/client";
import { brands, heroAnnotation, heroProof, recognition } from "../content/manifest";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });

let n = 0;
const k = () => `h${(n += 1)}`;

const BEATS = [
  {
    layers: "Platforms → Audience Intelligence",
    title: "The strongest partnerships aren't built on assumptions.",
    body: "Before a campaign launches, we map how your audience and creator communities actually overlap — the behaviors, passions and cultural signals that determine whether a partnership works.",
  },
  {
    layers: "Communities → Creator Expertise",
    title: "The overlap is the opportunity.",
    body: "Where a brand's audience and a creator's community are already the same people, the partnership has a foundation — and we can see it before anyone posts.",
  },
  {
    layers: "Creative Strategy",
    title: "Strategy, before the first post.",
    body: "Our strategists turn that intelligence into creator selection, creative direction, and media decisions — so every dollar is working before the first post goes live.",
  },
  {
    layers: "Cultural Impact → Business Growth",
    title: "Then creators do what only creators can.",
    body: "They turn insight into culture — and culture into measurable business outcomes.",
    proof: { value: "51.93%", label: "market share increase · Optus — Gaming on the Go" },
  },
];

async function main() {
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",

    heroEyebrow: "Influencer marketing · Talent management · Global",
    heroHeadline: "Understand Audiences. Move People.",
    heroCreed: {
      _type: "object",
      line1: "Science reveals the audience.",
      line2: "Creators shape the culture.",
      payoff: "CLICK powers the connection.",
    },
    heroLede:
      "Audience intelligence, human expertise, and the world's most influential creators — combined to build partnerships that move culture and grow your business.",
    heroCtas: [
      { _key: k(), _type: "cta", label: "Start the Conversation", destination: "modal", style: "primary" },
      { _key: k(), _type: "cta", label: "View Our Work", destination: "internal", href: "#work", style: "ghost" },
    ],
    heroAnnotation: {
      _type: "object",
      eyebrow: heroAnnotation.eyebrow,
      body: heroAnnotation.body,
      statusLabel: heroAnnotation.statusLabel,
    },
    heroProof: {
      _type: "object",
      eyebrow: heroProof.eyebrow,
      value: heroProof.value,
      label: heroProof.label,
    },

    journeys: {
      _type: "object",
      firstEyebrow: "For brands",
      firstHeading: "I'm a Brand",
      firstBody: "Make smarter creator decisions before a dollar is spent.",
      firstCta: "Start the Conversation",
      secondEyebrow: "For creators",
      secondHeading: "I'm a Creator",
      secondBody: "Build a business that outlasts the algorithm.",
      secondCta: "Join CLICK Talent",
    },

    brandsHeading: "Trusted by leading brands",
    brandClients: brands.clients,
    brandPlatforms: brands.platforms,

    beats: BEATS.map((b) => ({
      _key: k(),
      _type: "beat",
      layers: b.layers,
      title: b.title,
      body: b.body,
      ...(b.proof ? { proof: { _type: "metric", value: b.proof.value, label: b.proof.label } } : {}),
    })),

    workEyebrow: "Featured work",
    workHeading: "Smarter decisions. Stronger partnerships. Better results.",
    /* The hand-built home page led with these three, which is NOT the
       same as the first three featured (that would swap McDonald's for
       Optus). The selection is editorial, so it is explicit. */
    workPicks: [
      { _key: k(), _type: "reference", _ref: "caseStudy-capcom-pragmata" },
      { _key: k(), _type: "reference", _ref: "caseStudy-maybelline-eyes-up" },
      { _key: k(), _type: "reference", _ref: "caseStudy-mcdonalds-summer-24" },
    ],

    recognitionLine: recognition.line,
    recognitionYears: recognition.years,

    ctaHeading: "Great partnerships begin with understanding people.",
    ctaBody:
      "Whether you're building a brand, growing a creator business, or looking for your next breakthrough campaign, let's start with a conversation.",
    ctaButton: { _type: "cta", label: "Start the Conversation", destination: "modal", style: "primary" },
  });

  console.log("Seeded the home page singleton.");
  console.log("  Featured work pinned to the three the hand-built page led with.");
}

main().catch((e) => { console.error(e); process.exit(1); });
