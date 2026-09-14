/**
 * Rebuilds /contact as a `page` document.
 *
 *   pnpm seed:contact
 *
 * Seeds to `contact-cms` with noIndex — see docs/SANITY.md.
 *
 * Two things are deliberately NOT in this file. The enquiries address and
 * the social profiles come from Site settings, because the nav, the
 * footer and the structured data use the same values and nobody should
 * have to update four places. And the form's fields, labels and
 * thank-you stay in HubSpot, where the people reading the submissions can
 * change them without a deploy.
 *
 * The anchors matter: this page routes on #creator-network and #enquiry,
 * and its own cards point at them.
 */
import { createClient } from "@sanity/client";
import { contact } from "../content/manifest";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });

const SLUG = "contact-cms";
const EMAIL = contact.email;
let n = 0;
const k = (p: string) => `${p}${(n += 1)}`;
const para = (text: string) => ({
  _key: k("b"), _type: "block", style: "normal", markDefs: [],
  children: [{ _key: k("s"), _type: "span", text, marks: [] }],
});
/* A paragraph that opens with a bolded lead-in, as the creator-network
   copy does: "CLICK Talent — Representation. <muted rest>". */
const leadPara = (lead: string, rest: string) => ({
  _key: k("b"), _type: "block", style: "normal", markDefs: [],
  children: [
    { _key: k("s"), _type: "span", text: `${lead} `, marks: ["strong"] },
    { _key: k("s"), _type: "span", text: rest, marks: [] },
  ],
});

const CARDS = [
  { id: "enquiry", title: "I'm a Brand", body: "Looking to launch an influencer marketing campaign, experiential activation, or strategic creator partnership.", cta: "Talk With Our Team" },
  { id: "creator-network", title: "I'm a Creator", body: "Interested in representation with CLICK Talent, or joining the Creator Network to get on our radar.", cta: "Join the Creator Network" },
  { id: "enquiry", title: "I'm a Partner", body: "Interested in technology, media, agency, platform, or commercial partnerships.", cta: "Let's Connect" },
  { id: "enquiry", title: "General Inquiry", body: "Questions about CLICK, or looking to connect with the appropriate team.", cta: "Contact Us" },
];

const NETWORK_BENEFITS = [
  "Receive a complimentary audience intelligence snapshot",
  "Be considered for future brand partnerships",
  "Introduce yourself to our Talent team",
  "Receive opportunities aligned with your audience and content",
  "Stay connected as new opportunities become available",
];

async function main() {
  const blocks = [
    {
      _key: k("blk"), _type: "pageHero",
      eyebrow: "Contact",
      title: "Let's Start the Conversation",
      lede: "Every great partnership begins with understanding your goals. Whether you're a brand looking to drive business results, a creator building your next chapter, or a potential partner — we'd love to learn what you're building.",
      asideKind: "note",
      /* The address is repeated here rather than read from Site settings
         because the hero is page content — but it is the only place on
         this page that does, and it is visible to whoever edits it. */
      asideNote: {
        _type: "object",
        label: "Prefer email?",
        text: EMAIL,
        href: `mailto:${EMAIL}`,
      },
    },

    {
      _key: k("blk"), _type: "cardGrid",
      heading: "How can we help?",
      cards: CARDS.map((c) => ({
        _key: k("cd"), _type: "card",
        title: c.title,
        body: c.body,
        cta: { _type: "cta", label: c.cta, destination: "internal", href: `#${c.id}`, style: "ghost" },
      })),
    },

    {
      _key: k("blk"), _type: "copyMedia",
      anchor: "creator-network",
      eyebrow: "Creator Network",
      heading: "Two ways to work with CLICK.",
      body: [
        leadPara("CLICK Talent — Representation.", "Full management for established creators: a dedicated manager, commercial strategy, and the resources of the GameSquare ecosystem behind your business."),
        leadPara("The Creator Network — Open to all.", "No commitment, no exclusivity, no obligation. Introduce yourself and become discoverable as opportunities arise."),
        para("One form serves both — tell us which path interests you and the Talent team picks it up."),
      ],
      media: [],
      cta: { _type: "cta", label: "Join the Creator Network", destination: "internal", href: "#enquiry", style: "primary" },
      insightLabel: "Why join the Creator Network?",
      insightItems: NETWORK_BENEFITS,
    },

    {
      _key: k("blk"), _type: "contactForm",
      anchor: "enquiry",
      eyebrow: "Start the conversation",
      heading: "Tell us what you're building.",
      body: "A few details and we'll connect you with the right team — brands, creators and partners alike. Budget, timing and a brief are optional — send them if you have them.",
      emailPrompt: "Prefer email?",
    },

    {
      _key: k("blk"), _type: "linkChips",
      eyebrow: "Stay connected",
      heading: "Creator news, campaign launches, industry insights.",
      useSocials: true,
    },
  ];

  await client.createOrReplace({
    _id: `page-${SLUG}`,
    _type: "page",
    title: "Contact",
    slug: { _type: "slug", current: SLUG },
    blocks,
    seo: {
      _type: "seo",
      description:
        "Let's start the conversation. Whether you're a brand, a creator or a potential partner, tell us what you're building and we'll connect you with the right team.",
      noIndex: true,
    },
  });

  console.log(`Seeded /${SLUG} — ${blocks.length} sections`);
}

main().catch((e) => { console.error(e); process.exit(1); });
