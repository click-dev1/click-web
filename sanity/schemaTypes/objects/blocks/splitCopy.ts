import { defineArrayMember, defineField, defineType } from "sanity";

/* Two short arguments side by side, each with its own eyebrow and
   heading — the "business partners / the CLICK advantage" pair on
   /talent-management.

   Not a card grid: these are two halves of one point, set as prose at
   heading scale, and putting them in bordered boxes would make them read
   as features. Exactly two columns, because three of these stops being a
   pair and starts being a list. */
export const splitCopyType = defineType({
  name: "splitCopy",
  title: "Two-column copy",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "splitColumn",
          fields: [
            defineField({
              name: "eyebrow",
              type: "string",
              description: "The small pill above this column's heading.",
            }),
            defineField({
              name: "heading",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              type: "text",
              rows: 6,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "heading", subtitle: "eyebrow" } },
        }),
      ],
      validation: (rule) => rule.required().length(2),
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
    select: { a: "columns.0.heading", b: "columns.1.heading" },
    prepare: ({ a, b }) => ({
      title: "Two-column copy",
      subtitle: [a, b].filter(Boolean).join("  ·  "),
    }),
  },
});
