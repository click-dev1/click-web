import { defineArrayMember, defineField, defineType } from "sanity";

/* A row of creators pulled from the Talent list. Same contract as
   featuredWork: empty picks means the featured creators, automatically. */
export const featuredTalentType = defineType({
  name: "featuredTalent",
  title: "Featured talent",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "The small pill above the heading. Optional.",
    }),
    defineField({
      name: "heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "picks",
      title: "Creators",
      type: "array",
      description:
        "Leave empty to show the featured creators automatically. Add creators here to choose them yourself.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "talent" }],
        }),
      ],
      validation: (rule) => rule.max(8).unique(),
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 4,
      description: "Only applies when the list above is empty.",
      validation: (rule) => rule.min(1).max(8),
    }),
    defineField({
      name: "cta",
      title: "Link below the row",
      type: "cta",
      description: "Optional — e.g. “View the full roster”.",
    }),
    /* An id other pages and in-page links can point at. Blocks with an
       anchor get scroll-margin from `section[id]` in globals.css, so the
       fixed nav does not cover the target. */
    defineField({
      name: "anchor",
      title: "Link target",
      type: "string",
      description:
        "Optional. Lets a link point straight at this section, e.g. an anchor of “enquiry” is reachable as /contact#enquiry. Letters, numbers and hyphens.",
      validation: (rule) =>
        rule.regex(/^[a-z0-9-]+$/, {
          name: "anchor",
          invert: false,
        }).error("Use lowercase letters, numbers and hyphens only."),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", picks: "picks" },
    prepare: ({ title, subtitle, picks }) => {
      const n = Array.isArray(picks) ? picks.length : 0;
      return {
        title: title || "Featured talent",
        subtitle: [subtitle, n ? `${n} chosen` : "automatic"]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
