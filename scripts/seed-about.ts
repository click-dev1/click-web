/**
 * Rebuilds /about as a `page` document.
 *
 *   pnpm seed:about
 *
 * Seeds to `about-cms` with noIndex, for the same reason seed:im does —
 * a static route wins over a CMS page of the same slug, so the two have
 * to coexist while they are compared. See docs/SANITY.md.
 *
 * Team members are NOT restated here: the grid resolves them from the
 * `person` documents that pnpm seed:team created, which is the whole
 * point of making the team a type. Leave its picks empty and adding
 * someone to the team adds them to this page.
 */
import { createClient } from "@sanity/client";
import { timeline, offices, officesDisclosure } from "../content/site";
import { recognition } from "../content/manifest";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });

const SLUG = "about-cms";

let n = 0;
const k = (p: string) => `${p}${(n += 1)}`;
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
      eyebrow: "About",
      title: "The people behind the intelligence.",
      lede: "Technology finds the opportunity. These are the people who turn it into partnerships, creative, and culture.",
      asideKind: "none",
    },

    {
      _key: k("blk"),
      _type: "mediaBlock",
      images: [],
      mediaLabels: ["Strategy session in motion · commissioned photography"],
    },

    {
      _key: k("blk"),
      _type: "timeline",
      eyebrow: "Our story",
      heading: "Founded in 2017 with roots in gaming.",
      body: [
        para(
          "CLICK has grown into a global agency operating at the intersection of creators, culture, and brands — spanning influencer marketing, experiential, and talent management.",
        ),
        para(
          "Today, as part of the GameSquare ecosystem, CLICK combines enterprise audience intelligence with the human expertise and creator relationships that technology alone can't replicate. The belief that started the company hasn't changed: the strongest partnerships begin with understanding people.",
        ),
      ],
      entries: timeline.map((m) => ({
        _key: k("t"),
        _type: "milestone",
        year: m.year,
        text: m.text,
      })),
    },

    {
      _key: k("blk"),
      _type: "teamGrid",
      eyebrow: "Leadership & team",
      heading: "Meet the team.",
      picks: [],
      footnote:
        "Team names and titles are confirmed by CLICK. Portraits are awaiting supply, and no one carries an invented quote — perspective lines are collected in their own voices before launch.",
    },

    {
      _key: k("blk"),
      _type: "recognition",
      entries: [
        { _key: k("a"), _type: "award", line: recognition.line, detail: recognition.years },
        { _key: k("a"), _type: "award", line: "Cannes Lions Silver", detail: "Maybelline — Eyes Up" },
        {
          _key: k("a"),
          _type: "award",
          line: "Business Insider Top Talent Managers",
          detail: "Recognized consistently",
        },
      ],
    },

    {
      _key: k("blk"),
      _type: "copyMedia",
      eyebrow: "Part of GameSquare",
      heading: "A network no standalone agency can match.",
      body: [
        para(
          "CLICK operates within the GameSquare ecosystem — a network spanning creator technology, gaming and esports, media, and experiential production.",
        ),
        para(
          "For brands, that means partnerships backed by enterprise technology and reach. For creators, it means opportunities that extend across gaming, entertainment, and global commercial partnerships.",
        ),
      ],
      media: [],
      cta: {
        _type: "cta",
        label: "Explore the Ecosystem",
        destination: "internal",
        href: "/#ecosystem",
        style: "ghost",
      },
    },

    {
      _key: k("blk"),
      _type: "mediaBlock",
      eyebrow: "A global team",
      heading: "Every major market.",
      images: [],
      mediaLabels: ["World map · office locations"],
    },

    {
      _key: k("blk"),
      _type: "cardGrid",
      cards: offices.map((o) => ({
        _key: k("cd"),
        _type: "card",
        title: o.city,
        /* The region is a subtitle, not a category, so it goes below the
           city — cardGrid sets the eyebrow above the title. */
        body: o.region,
      })),
      footnote: officesDisclosure,
    },

    {
      _key: k("blk"),
      _type: "ctaBanner",
      heading: "Now you know who we are. Tell us what you're building.",
      body: "Whether you're a brand, a creator, or a future partner, every CLICK relationship starts the same way — with a conversation.",
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
    title: "About",
    slug: { _type: "slug", current: SLUG },
    blocks,
    seo: {
      _type: "seo",
      description:
        "The people behind the intelligence. Founded in 2017 with roots in gaming, CLICK is a global agency at the intersection of creators, culture and brands — part of the GameSquare ecosystem.",
      noIndex: true,
    },
  });

  console.log(`Seeded /${SLUG} — ${blocks.length} sections`);
  console.log("  team resolves from the person documents, not from this script.");
}

main().catch((e) => { console.error(e); process.exit(1); });
