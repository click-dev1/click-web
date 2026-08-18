/**
 * CONTENT & SOURCE MANIFEST
 * Every factual statement rendered on the page lives here with its
 * verification status. Nothing marked `awaiting-confirmation` may ship
 * to production without client sign-off; `placeholder-do-not-publish`
 * must never render outside this preview build.
 *
 * Statuses:
 *  - verified-public: confirmed on clickmedia.group or another public source
 *  - client-confirmed: approved in writing by CLICK
 *  - awaiting-confirmation: plausible, needs client sign-off
 *  - placeholder-do-not-publish: preview-only material
 *
 * Last checked: 2026-08-05 against https://www.clickmedia.group/our-work
 */

export type VerificationStatus =
  | "verified-public"
  | "client-confirmed"
  | "awaiting-confirmation"
  | "placeholder-do-not-publish";

export interface Metric {
  value: string;
  label: string;
  status: VerificationStatus;
}

export interface CaseStudy {
  brand: string;
  campaign: string;
  understood: string; // what was understood
  created: string; // what was created
  metrics: Metric[]; // what happened (max 3 rendered)
  proofLine?: string;
  status: VerificationStatus;
}

/* Campaign metrics verified against the live /our-work page on 2026-08-05.
   750M impressions + 51.93% market-share increase belong to OPTUS (not
   Maybelline — confirmed after a conflicting review note). Maybelline
   publishes no quantitative metrics; its proof is the Cannes recognition. */
export const caseStudies: CaseStudy[] = [
  {
    brand: "Optus",
    campaign: "Gaming on the Go",
    understood:
      "Gaming audiences judge network claims by lived experience, not ad copy.",
    created:
      "Creator-led streams and social content that put the product inside real play, on the platforms where gaming culture already lives.",
    metrics: [
      { value: "750M", label: "content impressions", status: "verified-public" },
      {
        value: "51.93%",
        label: "market share increase",
        status: "verified-public",
      },
      {
        value: "835K",
        label: "organic TikTok views",
        status: "verified-public",
      },
    ],
    status: "verified-public",
  },
  {
    brand: "Maybelline",
    campaign: "Eyes Up",
    understood:
      "Gen-Z women are players, not just spectators — beauty could meet them inside the game.",
    created:
      "A creator-led Fortnite environment built for tournament play and wider community participation.",
    metrics: [],
    proofLine: "Cannes Lions Silver",
    status: "verified-public",
  },
  {
    brand: "McDonald's",
    campaign: "Summer '24",
    understood:
      "Streamers' communities show up for participation, not placements.",
    created:
      "A creator program across Twitch, TikTok and Instagram built around live participation — 66 deliverables of streams, video and social content.",
    metrics: [
      {
        value: "2.26M",
        label: "total video views",
        status: "verified-public",
      },
      {
        value: "16,373",
        label: "stream hours watched",
        status: "verified-public",
      },
      { value: "66", label: "total deliverables", status: "verified-public" },
    ],
    status: "verified-public",
  },
];

/* NOTE: the "understood" lines above are editorial interpretations written
   for this build — they are consistent with the public campaign pages but
   are NOT documented client findings. Status for all three interpretive
   lines: awaiting-confirmation. Replace with CLICK's real campaign insights
   before production. */

export const heroAnnotation = {
  eyebrow: "ACTIVATION SIGNAL · MAYBELLINE — EYES UP",
  body: "A creator-led Fortnite environment connected the brand with Gen-Z through tournament play and wider community participation.",
  statusLabel: "STATUS · VERIFIED PUBLIC",
  status: "verified-public" as VerificationStatus,
};

export const heroProof = {
  eyebrow: "FEATURED RESULT · OPTUS",
  value: "750M",
  label: "content impressions — Gaming on the Go",
  status: "verified-public" as VerificationStatus,
};

export const recognition = {
  line: "2× AiMCO Talent Agency of the Year",
  years: "2024 · 2025",
  status: "verified-public" as VerificationStatus, // shown on clickmedia.group
};

/* Brand names shown on the current public site / blueprint logo list.
   Rendered as styled wordmarks (no logo files) — logo usage requires
   brand approval before production (blueprint's own launch gate). */
export const brands = {
  clients: [
    "Capcom",
    "EA",
    "Jack in the Box",
    "Universal",
    "PlayStation",
    "Samsung",
    "Optus",
    "Maybelline",
    "McDonald's",
  ],
  platforms: ["YouTube", "TikTok", "Snap", "Meta", "Twitch"],
  status: "awaiting-confirmation" as VerificationStatus,
};

/* GameSquare ecosystem — structure per CLICK's blueprint. Entity lineup
   must be re-verified at build time (blueprint's own rule; GameSquare's
   structure has changed during 2025–26). */
export const ecosystem = {
  center: "GameSquare",
  groups: [
    {
      label: "Technology",
      nodes: [
        {
          name: "AI Audience Mapping",
          blurb: "Audience behavior, community overlap and cultural trends.",
        },
        {
          name: "Sideqik",
          blurb: "Influencer marketing platform — creator discovery to reporting.",
        },
        {
          name: "TubeBuddy",
          blurb: "YouTube audience and channel intelligence.",
        },
        {
          name: "Stream Hatchet",
          blurb: "Live-streaming analytics across every major platform.",
        },
      ],
    },
    {
      label: "Creators",
      nodes: [
        {
          name: "CLICK Talent",
          blurb: "Managed representation for creators building lasting businesses.",
        },
        {
          name: "FaZe Clan",
          blurb: "One of the most recognized names in gaming culture.",
        },
        {
          name: "Code Red",
          blurb: "Esports and gaming talent agency within the ecosystem.",
        },
      ],
    },
    {
      label: "Gaming & Esports",
      nodes: [
        {
          name: "ZONED",
          blurb: "Gaming and esports agency capabilities.",
        },
      ],
    },
    {
      label: "Experiential",
      nodes: [
        {
          name: "Live Events",
          blurb: "Fan-facing events produced end to end.",
        },
        {
          name: "Brand Activations",
          blurb: "Physical and in-game brand moments built for participation.",
        },
        {
          name: "Creative Production",
          blurb: "Campaign content production, from concept through delivery.",
        },
      ],
    },
  ],
  status: "awaiting-confirmation" as VerificationStatus,
};

export const contact = {
  email: "info@clickmedia.group", // verified-public (site contact page)
};
