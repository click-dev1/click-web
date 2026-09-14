/**
 * Rebuilds /talent-management as a `page` document.
 *
 *   pnpm seed:tm
 *
 * Seeds to `talent-management-cms` with noIndex — see the migration
 * procedure in docs/SANITY.md for why, and for the swap that finishes it.
 *
 * The spotlight is an explicit pick list rather than the automatic
 * fallback. The hand-built page selected the whole US roster plus ONE
 * Australian creator per category, which is not "the first eight
 * featured" — leaving it automatic would quietly swap SurfingwithNoz for
 * a second Australian gaming creator. Picks are also the better CMS
 * answer here: the selection is editorial, so it should be visible and
 * editable rather than emergent.
 */
import { createClient } from "@sanity/client";
import { recognition } from "../content/manifest";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });

const SLUG = "talent-management-cms";

let n = 0;
const k = (p: string) => `${p}${(n += 1)}`;
const para = (text: string) => ({
  _key: k("b"), _type: "block", style: "normal", markDefs: [],
  children: [{ _key: k("s"), _type: "span", text, marks: [] }],
});

const SPOTLIGHT = [
  "talent-sypherpk", "talent-steak", "talent-killdozer", "talent-eddievr",
  "talent-the-boys", "talent-aussieantics", "talent-grace-mulgrew",
  "talent-surfingwithnoz",
];

const SERVICES = [
  { label: "Business Strategy", items: ["Career Development", "Personal Brand Strategy", "Commercial Planning", "Audience Growth", "Business Advisory"] },
  { label: "Brand Partnerships", items: ["Sponsorship Strategy", "Partnership Negotiation", "Long-Term Relationships", "Campaign Management"] },
  { label: "Business Growth", items: ["Product Development", "Licensing Strategy", "Merchandise", "Venture Development", "New Revenue Streams"] },
  { label: "Creative & Production", items: ["Content Strategy", "Production Partnerships", "Creative Development", "Platform Strategy"] },
  { label: "Business Operations", items: ["Legal Support", "Contract Management", "Data Analysis & Reporting", "Commercial Advisory"] },
];

async function main() {
  const blocks = [
    {
      _key: k("blk"), _type: "pageHero",
      eyebrow: "Talent · Talent Management",
      title: "Building creator businesses that last.",
      lede: "Creators are entrepreneurs, storytellers, entertainers, and brands in their own right. CLICK partners with talent to build businesses beyond the screen — through strategic partnerships, commercial strategy, and long-term career development.",
      ctas: [
        { _key: k("c"), _type: "cta", label: "Join CLICK Talent", destination: "internal", href: "/contact#creator-network", style: "primary" },
        { _key: k("c"), _type: "cta", label: "Talk With Our Team", destination: "modal", style: "ghost" },
      ],
      asideKind: "note",
      /* No label, so the frame sets the award large — the award leads. */
      asideNote: { _type: "object", text: recognition.line, footnote: `◆ ${recognition.years}` },
    },

    {
      _key: k("blk"), _type: "copyMedia",
      eyebrow: "More than management",
      heading: "Great careers aren't built campaign by campaign.",
      body: [
        para("Established in 2017, CLICK is a global, digital-first talent management agency and ventures studio operating at the intersection of creators, culture, and brands. With offices around the world, we represent influential talent across gaming, sports, lifestyle, comedy, and entertainment."),
        para("As long-term business partners, we help creators transform audiences into businesses — building personal brands, launching products, securing strategic partnerships, and creating new revenue streams that endure."),
      ],
      media: [],
      mediaLabels: ["Creator & manager · client photography"],
      mediaPosition: "right",
    },

    {
      _key: k("blk"), _type: "splitCopy",
      columns: [
        {
          _key: k("col"), _type: "splitColumn",
          eyebrow: "Business partners for the creator economy",
          heading: "Today's creators are entrepreneurs, founders, and media companies.",
          body: "Our role is to provide the strategy, operational support, and commercial expertise that lets creators focus on what they do best — creating. Our talent managers are consistently recognized among Business Insider's Top Talent Managers, and every decision is guided by long-term value, not short-term opportunities.",
        },
        {
          _key: k("col"), _type: "splitColumn",
          eyebrow: "The CLICK advantage",
          heading: "We work both sides of every great partnership.",
          body: "Every day our teams help brands identify the right creators while helping creators understand what brands value most. That dual perspective — and the reach of the GameSquare ecosystem — lets us negotiate better and create opportunities that deliver for both sides.",
        },
      ],
    },

    {
      _key: k("blk"), _type: "copyMedia",
      eyebrow: "Technology & intelligence",
      heading: "Better intelligence creates better creator businesses.",
      body: [
        para("Great creators know their audience. Great creator businesses understand them."),
        para("Our team uses the same enterprise intelligence ecosystem trusted by the world's biggest brands to help creators make smarter strategic decisions — understanding what resonates with their communities, identifying the right partnerships, and uncovering new growth opportunities."),
        para("Technology doesn't replace creative instinct. It gives our team the intelligence to help creators build stronger businesses and create with greater confidence."),
      ],
      media: [],
      mediaLabels: ["Strategy session · client photography"],
      mediaPosition: "left",
    },

    {
      _key: k("blk"), _type: "capabilityList",
      eyebrow: "Services",
      heading: "A ventures studio behind every career.",
      groups: SERVICES.map((s) => ({
        _key: k("g"), _type: "capabilityGroup", label: s.label, items: s.items,
      })),
    },

    {
      _key: k("blk"), _type: "journeySequence",
      eyebrow: "Built for long-term growth",
      heading: "Great creators build audiences. Great businesses build legacies.",
      stages: ["Creator", "Audience", "Community", "Brand", "Business", "Legacy"],
    },

    {
      _key: k("blk"), _type: "featuredTalent",
      eyebrow: "Talent spotlight",
      heading: "The creators behind the businesses.",
      picks: SPOTLIGHT.map((id) => ({ _key: k("p"), _type: "reference", _ref: id })),
      cta: { _type: "cta", label: "View the Talent Directory", destination: "internal", href: "/talent", style: "ghost" },
    },

    {
      _key: k("blk"), _type: "journeyPanels",
      first: {
        _type: "journeyPanel",
        eyebrow: "Representation",
        title: "CLICK Talent",
        body: "Full management for established creators: a dedicated manager, commercial strategy, and the resources of the GameSquare ecosystem behind your business.",
        cta: { _type: "cta", label: "Apply for Representation", destination: "internal", href: "/contact#creator-network", style: "ghost" },
      },
      second: {
        _type: "journeyPanel",
        eyebrow: "Open to all creators",
        title: "The Creator Network",
        body: "Introduce yourself and become discoverable as opportunities arise. No commitment, no exclusivity — and every member can opt in to a complimentary audience intelligence snapshot.",
        cta: { _type: "cta", label: "Join the Creator Network", destination: "internal", href: "/contact#creator-network", style: "ghost" },
      },
    },

    {
      _key: k("blk"), _type: "ctaBanner",
      heading: "Whether established or just beginning — build what's next.",
      cta: { _type: "cta", label: "Join CLICK Talent", destination: "internal", href: "/contact#creator-network", style: "primary" },
      secondaryCta: { _type: "cta", label: "Talk With Our Team", destination: "modal", style: "ghost" },
    },
  ];

  await client.createOrReplace({
    _id: `page-${SLUG}`,
    _type: "page",
    title: "Talent Management",
    slug: { _type: "slug", current: SLUG },
    blocks,
    seo: {
      _type: "seo",
      description:
        "Building creator businesses that last. CLICK partners with talent to build businesses beyond the screen — strategic partnerships, commercial strategy, and long-term career development.",
      noIndex: true,
    },
  });

  console.log(`Seeded /${SLUG} — ${blocks.length} sections`);
}

main().catch((e) => { console.error(e); process.exit(1); });
