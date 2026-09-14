/**
 * Creates the two site-wide singletons.
 *
 *   pnpm seed:settings
 *
 * Reads the values out of content/manifest.ts and the LINKS / COLUMNS
 * arrays that Nav and Footer carried, so the migration cannot drift from
 * what the site renders today. One-time; stop running it once CLICK has
 * edited either document.
 *
 * Fixed ids (`siteSettings`, `navigation`) — these are singletons and the
 * Studio pins them by that id.
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

const LINKEDIN = "https://www.linkedin.com/company/clickmediagroup/";
const INSTAGRAM = "https://www.instagram.com/weareclicktalent";
const TIKTOK = "https://www.tiktok.com/@clickmgmt";

let n = 0;
const k = () => `n${(n += 1)}`;

async function main() {
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    email: contact.email,
    /* Footer order: Instagram, LinkedIn, TikTok — as the icon row runs. */
    socials: [
      { _key: k(), _type: "socialLink", platform: "Instagram", url: INSTAGRAM },
      { _key: k(), _type: "socialLink", platform: "LinkedIn", url: LINKEDIN },
      { _key: k(), _type: "socialLink", platform: "TikTok", url: TIKTOK },
    ],
    legalName: "Click Management Pty. Ltd., trading as CLICK",
    footerTagline: "Influencer Marketing · Talent · Experiential",
  });
  console.log("  siteSettings");

  await client.createOrReplace({
    _id: "navigation",
    _type: "navigation",
    main: [
      {
        _key: k(), _type: "navGroup", label: "Solutions",
        children: [
          { _key: k(), _type: "navChild", label: "Influencer Marketing", href: "/influencer-marketing" },
          { _key: k(), _type: "navChild", label: "Experiential", href: "/experiential" },
        ],
      },
      {
        _key: k(), _type: "navGroup", label: "Talent",
        children: [
          { _key: k(), _type: "navChild", label: "Talent Management", href: "/talent-management" },
          { _key: k(), _type: "navChild", label: "Talent Directory", href: "/talent" },
        ],
      },
      { _key: k(), _type: "navLink", label: "Work", href: "/work" },
      { _key: k(), _type: "navLink", label: "About", href: "/about" },
      { _key: k(), _type: "navLink", label: "Contact", href: "/contact" },
    ],
    footerColumns: [
      {
        _key: k(), _type: "footerColumn", label: "Solutions",
        links: [
          { _key: k(), _type: "footerLink", label: "Influencer Marketing", href: "/influencer-marketing" },
          { _key: k(), _type: "footerLink", label: "Experiential", href: "/experiential" },
        ],
      },
      {
        _key: k(), _type: "footerColumn", label: "Talent",
        links: [
          { _key: k(), _type: "footerLink", label: "Talent Management", href: "/talent-management" },
          { _key: k(), _type: "footerLink", label: "Talent Directory", href: "/talent" },
          { _key: k(), _type: "footerLink", label: "Creator Network", href: "/contact#creator-network" },
        ],
      },
      {
        _key: k(), _type: "footerColumn", label: "Company",
        links: [
          { _key: k(), _type: "footerLink", label: "Work", href: "/work" },
          { _key: k(), _type: "footerLink", label: "About", href: "/about" },
          { _key: k(), _type: "footerLink", label: "Contact", href: "/contact" },
        ],
      },
      {
        _key: k(), _type: "footerColumn", label: "Connect",
        links: [
          { _key: k(), _type: "footerLink", label: "General enquiries", href: `mailto:${contact.email}` },
          { _key: k(), _type: "footerLink", label: "LinkedIn", href: LINKEDIN, external: true },
          { _key: k(), _type: "footerLink", label: "Instagram", href: INSTAGRAM, external: true },
          { _key: k(), _type: "footerLink", label: "TikTok", href: TIKTOK, external: true },
        ],
      },
    ],
  });
  console.log("  navigation");
  console.log("\nDone. CLICK can now edit the menu, the footer and the contact email.");
}

main().catch((e) => { console.error(e); process.exit(1); });
