import { defineArrayMember, defineField, defineType } from "sanity";

/* A campaign case study. Mirrors the Campaign interface the site rendered
   from content/site.ts, with the three-beat structure intact: what the
   intelligence found, what we built, what it delivered.

   Two things changed in the move to the CMS.

   First, `status: VerificationStatus` split in two. Whether a case study
   is fit to publish is now draft vs published — that is what the draft
   state is for, and a "placeholder-do-not-publish" flag on a published
   document was always a loaded gun. What could NOT move is where the
   figures came from: that drives a disclosure line the reader sees, so it
   stays as `figuresSource`. Truth discipline is the site's whole premise
   and it does not survive being folded into a publish button.

   Second, the media is a real image with the old label as its fallback,
   so a case study without client-supplied footage still renders its
   honest awaiting-content state rather than a broken slot. */

/* Vocabularies for the dropdowns AND the /work filters. The filter chips
   are generated from the data, so free text here would let one typo
   become its own filter — same reasoning as the talent categories. */
export const SERVICES = [
  "Influencer Marketing",
  "Experiential",
  "Talent Partnerships",
] as const;

export const INDUSTRIES = [
  "Gaming",
  "Technology",
  "Consumer Packaged Goods",
  "Retail",
  "Public Sector",
  "Entertainment",
  "Sports",
  "Finance",
  "Automotive",
  "Food & Beverage",
] as const;

export const CAMPAIGN_PLATFORMS = [
  "YouTube",
  "Twitch",
  "TikTok",
  "Instagram",
  "X",
  "Kick",
  "Facebook",
  "Snapchat",
  "LinkedIn",
] as const;

export const caseStudyType = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "results", title: "Results" },
    { name: "media", title: "Imagery" },
    { name: "seo", title: "SEO" },
    { name: "admin", title: "Admin" },
  ],
  fields: [
    defineField({
      name: "brand",
      type: "string",
      group: "content",
      description: "The client — Capcom, Optus, McDonald's.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Campaign name",
      type: "string",
      group: "content",
      description: "Pragmata, Gaming on the Go, Summer '24.",
      validation: (rule) => rule.required(),
    }),
    /* The campaign's NAME is `title` ("Pragmata"); this is the longer
       editorial line the home page leads with ("Sending Pragmata into
       orbit with creator content"). The site carried both before the
       migration — one in content/site.ts, one in content/manifest.ts —
       and they are genuinely different things, so both survive. Most case
       studies need only the name. */
    defineField({
      name: "headline",
      title: "Editorial headline",
      type: "string",
      group: "content",
      description:
        "Optional. A fuller line used where the campaign is featured, e.g. on the home page. Leave it empty and the campaign name is used.",
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description:
        "The case study's web address: /work/<slug>. Change it only before publishing — a published address that changes breaks every link to it.",
      options: {
        maxLength: 96,
        source: (doc) =>
          [doc.brand, doc.title].filter(Boolean).join(" ") as string,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      type: "string",
      group: "content",
      options: { list: [...SERVICES], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "industry",
      type: "string",
      group: "content",
      options: { list: [...INDUSTRIES], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "platforms",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { list: [...CAMPAIGN_PLATFORMS] },
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "insight",
      title: "What the intelligence found",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Beat one, and the line that appears on every card. One sentence.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "built",
      title: "What we built",
      type: "text",
      rows: 4,
      group: "content",
      description: "Beat two — the work itself.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "resultsIntro",
      title: "Lead-in above the figures",
      type: "text",
      rows: 3,
      group: "results",
    }),
    defineField({
      name: "metrics",
      title: "Figures",
      type: "array",
      group: "results",
      description:
        "Beat three. The first three appear on the campaign card. Leave it empty if there are no figures to publish yet and fill in the proof line instead.",
      of: [defineArrayMember({ type: "metric" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "proofLine",
      title: "Proof line",
      type: "string",
      group: "results",
      description:
        "Shown in place of the figures when there are none — e.g. “Cannes Lions Silver”.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as
            | { metrics?: unknown[] }
            | undefined;
          if (value) return true;
          if (doc?.metrics?.length) return true;
          return "Add some figures, or a proof line to stand in for them.";
        }),
    }),
    defineField({
      name: "figuresSource",
      title: "Where the figures came from",
      type: "string",
      group: "results",
      initialValue: "pending",
      description:
        "Sets the disclosure line under the results, and keeps unconfirmed campaigns out of search results.",
      options: {
        list: [
          { title: "Confirmed by CLICK", value: "client-confirmed" },
          { title: "Published on clickmedia.group", value: "verified-public" },
          { title: "Awaiting client confirmation", value: "pending" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "media",
      title: "Campaign image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Alt text is required for accessibility."),
        }),
        defineField({
          name: "credit",
          title: "Credit / licence",
          type: "string",
          description: "Internal — never shown on the site.",
        }),
      ],
    }),
    defineField({
      name: "mediaLabel",
      title: "Awaiting-image caption",
      type: "string",
      group: "media",
      description:
        "Shown in the empty frame until the image above is supplied — e.g. “Campaign film · client-supplied”.",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),

    defineField({
      name: "featured",
      type: "boolean",
      group: "admin",
      initialValue: false,
      description: "Featured case studies appear first on /work and on the home page.",
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      group: "admin",
      description:
        "Lower numbers appear first among case studies with the same featured setting. Leave blank to sort by brand.",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      group: "admin",
      description: "Never shown on the site — sign-off status, figures to confirm.",
    }),
  ],
  orderings: [
    {
      title: "Featured, then sort order",
      name: "featuredOrder",
      by: [
        { field: "featured", direction: "desc" },
        { field: "sortOrder", direction: "asc" },
        { field: "brand", direction: "asc" },
      ],
    },
    { title: "Brand A→Z", name: "brandAsc", by: [{ field: "brand", direction: "asc" }] },
  ],
  preview: {
    select: {
      brand: "brand",
      title: "title",
      service: "service",
      media: "media",
      featured: "featured",
    },
    prepare: ({ brand, title, service, media, featured }) => ({
      title: `${featured ? "★ " : ""}${brand} — ${title}`,
      subtitle: service,
      media,
    }),
  },
});
