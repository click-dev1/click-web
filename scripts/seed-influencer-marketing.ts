/**
 * Rebuilds /influencer-marketing as a `page` document.
 *
 *   pnpm seed:im
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local. Idempotent.
 *
 * It seeds to the slug `influencer-marketing-cms` ON PURPOSE. A static
 * route wins over a CMS page of the same slug, so seeding straight to
 * `influencer-marketing` would produce a page nobody could look at until
 * the hand-built file was deleted — which is the one step here that is
 * hard to walk back. Seed, compare the two side by side, and only then
 * delete app/(site)/influencer-marketing/page.tsx and change the slug.
 *
 * Every string below is lifted verbatim from that file. The section order
 * is unchanged. What does change: the Placeholder frames become
 * awaiting-image captions, and `data-signal` is derived from position
 * rather than hand-set, so the canvas cues differ slightly from the
 * original by design.

 * ⚠ THIS PAGE IS NOW LIVE. The slug below is the real one, so running
 * this overwrites what CLICK sees — and anything they have edited in the
 * Studio. It is kept for reference and for rebuilding from scratch, not
 * for routine use.
 */
import { createClient } from "@sanity/client";

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

const SLUG = "influencer-marketing";

/** Portable Text paragraphs. `muted` marks the greyed paragraphs the
    hand-built page sets with an inline style. */
let keySeed = 0;
const k = (p: string) => `${p}${(keySeed += 1)}`;
const para = (text: string) => ({
  _key: k("b"),
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: k("s"), _type: "span", text, marks: [] }],
});

async function main() {
  const blocks = [
    {
      _key: k("blk"),
      _type: "pageHero",
      eyebrow: "Solutions · Influencer Marketing",
      title: "Built on Audience Intelligence.",
      lede: "We map the real overlap between your audience and creator communities — then build partnerships around what we find. The result: better creator selection, sharper creative, and less wasted spend.",
      ctas: [
        {
          _key: k("c"),
          _type: "cta",
          label: "Start the Conversation",
          destination: "modal",
          style: "primary",
        },
        {
          _key: k("c"),
          _type: "cta",
          label: "View Our Work",
          destination: "internal",
          href: "/work",
          style: "ghost",
        },
      ],
      asideKind: "note",
      asideNote: {
        _type: "object",
        label: "Resolved insight · illustrative",
        text: "Four intelligence layers, one finding: the audiences you want are already inside creator communities you haven't considered.",
        footnote: "Status · awaiting client insight",
      },
    },

    {
      _key: k("blk"),
      _type: "copyMedia",
      eyebrow: "Audience intelligence in action",
      heading: "Better understanding leads to better decisions.",
      body: [
        para(
          "Understanding today's consumer requires more than a single data source. CLICK brings together AI Audience Mapping, Sideqik, TubeBuddy, and Stream Hatchet to understand how audiences discover content, engage with creators, and participate in culture across every major platform.",
        ),
        para(
          "Each technology contributes a unique layer of intelligence — creating a complete understanding of the people brands want to reach. The result is smarter strategy, stronger creative direction, and creator partnerships built on meaningful audience alignment.",
        ),
      ],
      media: [],
      mediaLabels: ["Audience overlap visualization"],
      mediaPosition: "right",
    },

    {
      _key: k("blk"),
      _type: "cardGrid",
      numbered: true,
      cards: [
        {
          _key: k("cd"),
          _type: "card",
          eyebrow: "Technology",
          title: "AI Audience Mapping",
          body: "Reveal audience behavior, psychographic insights, community overlap, and emerging cultural trends.",
        },
        {
          _key: k("cd"),
          _type: "card",
          eyebrow: "Technology",
          title: "Sideqik",
          body: "Access a network of more than 40M creators, enterprise campaign management, audience analytics, and reporting.",
        },
        {
          _key: k("cd"),
          _type: "card",
          eyebrow: "Technology",
          title: "TubeBuddy",
          body: "Understand YouTube audiences, creator performance, channel optimization, and long-form content strategy.",
        },
        {
          _key: k("cd"),
          _type: "card",
          eyebrow: "Technology",
          title: "Stream Hatchet",
          body: "Unlock gaming, livestreaming, and esports intelligence across Twitch, YouTube Gaming, Kick, Facebook Live, Steam, SOOP, Chzzk, Trovo, Rumble, OpenREC, and emerging platforms.",
        },
      ],
      insightLabel: "The payoff · one real finding",
      insight:
        "This section resolves on a real, anonymized audience finding produced by the four layers working together — supplied by CLICK's content team before launch.",
      insightFootnote: "Status · awaiting client insight",
    },

    {
      _key: k("blk"),
      _type: "copyMedia",
      eyebrow: "Creator expertise",
      heading: "Technology informs. People create.",
      body: [
        para("Great influencer marketing is built on relationships."),
        para(
          "Creators aren't media placements — they're storytellers, entrepreneurs, and cultural leaders. Our team works alongside creators every day, from campaign briefing and creative collaboration to content refinement, approvals, and execution.",
        ),
        para(
          "We serve as the bridge between brands and creators, ensuring every partnership feels authentic to both the creator and the audience — guided by audience intelligence, human expertise, and mutual trust.",
        ),
      ],
      media: [],
      mediaLabels: [
        "Creator briefing · client photography",
        "Production day",
        "Creative review",
      ],
      mediaPosition: "left",
    },

    {
      _key: k("blk"),
      _type: "capabilityList",
      eyebrow: "End-to-end campaign management",
      heading: "Every stage of the lifecycle.",
      groups: [
        {
          _key: k("g"),
          _type: "capabilityGroup",
          label: "Strategy",
          items: [
            "Audience Intelligence",
            "Creator Discovery",
            "Creator Strategy",
            "Competitive Intelligence",
            "Creative Strategy",
          ],
        },
        {
          _key: k("g"),
          _type: "capabilityGroup",
          label: "Execution",
          items: [
            "Campaign Management",
            "Talent Partnerships",
            "Content Production",
            "Paid Media",
            "Whitelisting",
            "Product Seeding",
            "Social Commerce",
            "Affiliate Marketing",
            "Community Management",
            "Experiential Integration",
          ],
        },
        {
          _key: k("g"),
          _type: "capabilityGroup",
          label: "Optimization",
          items: [
            "Reporting",
            "Measurement",
            "Creator Performance",
            "Creative Optimization",
            "Audience Insights",
            "Campaign Optimization",
          ],
        },
      ],
    },

    {
      _key: k("blk"),
      _type: "activationScorecard",
      eyebrow: "Measured against what matters",
      heading: "Every partnership begins with a business objective.",
      body: [
        para(
          "No two brands define success the same way. We build the measurement framework around your objective and report against the three to five KPIs that actually move your business.",
        ),
        para(
          "Powered by Sideqik, every campaign is measured through customizable dashboards with real-time visibility into performance, audience behavior, and optimization opportunities.",
        ),
        para(
          "Great reporting doesn't simply explain what happened — it helps determine what happens next.",
        ),
      ],
      label: "Campaign scorecard",
      source: "Optus · Gaming on the Go",
      metrics: [
        { _key: k("m"), _type: "metric", value: "750M", label: "content impressions" },
        { _key: k("m"), _type: "metric", value: "51.93%", label: "market share increase" },
        { _key: k("m"), _type: "metric", value: "835K", label: "organic TikTok views" },
      ],
      mediaLabel: "Sideqik dashboard demonstration",
      footnote: "Figures as published on clickmedia.group",
    },

    {
      _key: k("blk"),
      _type: "featuredWork",
      eyebrow: "Proof in practice",
      heading: "Strategy is only meaningful when it delivers results.",
      picks: [
        { _key: k("p"), _type: "reference", _ref: "caseStudy-capcom-pragmata" },
        { _key: k("p"), _type: "reference", _ref: "caseStudy-optus-gaming-on-the-go" },
        { _key: k("p"), _type: "reference", _ref: "caseStudy-maybelline-eyes-up" },
      ],
      cta: {
        _type: "cta",
        label: "View All Work",
        destination: "internal",
        href: "/work",
        style: "ghost",
      },
    },

    {
      _key: k("blk"),
      _type: "ctaBanner",
      heading: "Better partnerships begin with better understanding.",
      body: "Let's build your next campaign through audience intelligence, creator expertise, and the human creativity that turns insight into cultural impact.",
      cta: {
        _type: "cta",
        label: "Start the Conversation",
        destination: "modal",
        style: "primary",
      },
    },
  ];

  await client.createOrReplace({
    _id: `page-${SLUG}`,
    _type: "page",
    title: "Influencer Marketing",
    slug: { _type: "slug", current: SLUG },
    blocks,
    seo: {
      _type: "seo",
      description:
        "Influencer marketing built on audience intelligence. We map the real overlap between your audience and creator communities, then build partnerships around what we find.",
      /* Kept out of search while it sits alongside the original — two
         pages with the same copy at two addresses is a duplicate-content
         problem, not a staging detail. */
      noIndex: true,
    },
  });

  console.log(`Seeded /${SLUG} — ${blocks.length} sections`);
  console.log("  hidden from search while it sits beside the original.");
  console.log("  Compare, then delete the hand-built route and change the slug.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
