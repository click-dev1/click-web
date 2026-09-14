import { defineArrayMember, defineField, defineType } from "sanity";

/* One word per stage, arrows between them, the last one carrying the
   weight — the creator growth journey on /talent-management.

   Single words by design. The whole device works because it can be read
   in one pass; a stage with a sentence attached breaks it, and that is
   what a card grid is for. */
export const journeySequenceType = defineType({
  name: "journeySequence",
  title: "Journey sequence",
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
      name: "stages",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description:
        "One word each, in order. The last is set larger — it is the destination.",
      validation: (rule) => rule.required().min(3).max(8),
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
    select: { title: "heading", stages: "stages" },
    prepare: ({ title, stages }) => ({
      title: title || "Journey sequence",
      subtitle: Array.isArray(stages) ? stages.join(" → ") : "",
    }),
  },
});
