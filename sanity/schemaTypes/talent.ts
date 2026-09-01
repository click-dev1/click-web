import { defineArrayMember, defineField, defineType } from "sanity";

/* A creator on the roster. Mirrors the Talent interface the site rendered
   from content/site.ts, with two upgrades an editor needs: the portrait is
   a Sanity image (hotspot crop replaces the hand-set object-position) and
   platforms are objects, so a handle and audience figure can sit against
   each one (SOW §4: "including audience figures, platforms, biography,
   social links and imagery"). */

/* Vocabularies for the dropdowns and the directory filters. Adding a
   value here is a code change by design — filter chips are generated from
   the data, so a typo'd free-text category would become its own filter. */
export const TALENT_CATEGORIES = [
  "Gaming",
  "Lifestyle",
  "Comedy",
  "Beauty",
  "Food",
  "Sports",
  "Music",
  "Entertainment",
  "Fashion",
  "Tech",
] as const;

export const PLATFORMS = [
  "YouTube",
  "Twitch",
  "TikTok",
  "Instagram",
  "X",
  "Kick",
  "Facebook",
  "Snapchat",
  "LinkedIn",
  "Podcast",
] as const;

export const REGIONS = [
  "United States",
  "Australia",
  "Asia-Pacific",
  "North America",
  "United Kingdom",
  "Europe",
] as const;

export const talentType = defineType({
  name: "talent",
  title: "Talent",
  type: "document",

  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "media", title: "Imagery" },
    { name: "story", title: "Story" },
    { name: "seo", title: "SEO" },
    { name: "admin", title: "Admin" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "profile",
      description: "The profile's web address: /talent/<slug>. Generated from the name; change it only before the profile is published.",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "profile",
      options: { list: [...TALENT_CATEGORIES], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "platforms",
      type: "array",
      group: "profile",
      description: "Where the creator publishes. The first entry is treated as their primary platform.",
      of: [
        defineArrayMember({
          type: "object",
          name: "platformPresence",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: [...PLATFORMS] },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "handle", type: "string", description: "e.g. @muselk" }),
            defineField({ name: "url", type: "url", title: "Profile link" }),
            defineField({
              name: "audience",
              type: "string",
              description: "Followers / subscribers on this platform, as displayed: 2.1M, 480K.",
            }),
          ],
          preview: {
            select: { platform: "platform", handle: "handle", audience: "audience" },
            prepare: ({ platform, handle, audience }) => ({
              title: platform,
              subtitle: [handle, audience].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).error("Add at least one platform."),
    }),
    defineField({
      name: "audience",
      title: "Total audience",
      type: "string",
      group: "profile",
      description: "Combined reach across platforms, as displayed on the card: 2.1M.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      type: "string",
      group: "profile",
      options: { list: [...REGIONS], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      group: "profile",
      description: "City and country as shown on the profile: Sydney, Australia.",
    }),
    defineField({
      name: "managed",
      title: "Exclusively managed by CLICK",
      type: "boolean",
      group: "profile",
      initialValue: true,
    }),
    defineField({
      name: "bio",
      type: "text",
      rows: 5,
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partners",
      title: "Brand partners",
      type: "array",
      group: "profile",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "ventures",
      type: "array",
      group: "profile",
      description: "Own products, businesses or projects.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "portrait",
      type: "image",
      group: "media",
      description: "Used on the directory card, the profile hero and wherever the creator is featured. Drag the hotspot to choose what stays in frame on tight crops.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describes the image for screen readers and search engines, e.g. “Muselk at his desk, mid-stream.”",
          validation: (rule) => rule.required().error("Alt text is required for accessibility."),
        }),
        defineField({
          name: "credit",
          title: "Credit / licence",
          type: "string",
          description: "Source and usage rights. Internal — never shown on the site.",
        }),
      ],
    }),

    defineField({
      name: "story",
      title: "Success story",
      type: "array",
      group: "story",
      description: "The beats on the profile page, in order — typically the situation, what CLICK did, and the outcome.",
      of: [
        defineArrayMember({
          type: "object",
          name: "storyBeat",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),

    defineField({
      name: "featured",
      type: "boolean",
      group: "admin",
      description: "Featured creators appear first in the directory and on the Talent Management page.",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      group: "admin",
      description: "Lower numbers appear first among creators with the same featured setting. Leave blank to sort by name.",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      group: "admin",
      description: "Never shown on the site — sign-off status, figures to confirm, who supplied the imagery.",
    }),
  ],
  orderings: [
    { title: "Featured, then sort order", name: "featuredOrder", by: [
      { field: "featured", direction: "desc" },
      { field: "sortOrder", direction: "asc" },
      { field: "name", direction: "asc" },
    ] },
    { title: "Name A→Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", category: "category", audience: "audience", media: "portrait", featured: "featured" },
    prepare: ({ title, category, audience, media, featured }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle: [category, audience].filter(Boolean).join(" · "),
      media,
    }),
  },
});
