import { defineArrayMember, defineField, defineType } from "sanity";

/* A row of case studies pulled from the Case studies list — the "proof in
   practice" section on the service pages.

   The picks are optional by design. Leave them empty and the block shows
   the featured case studies automatically, so a page stays current as
   CLICK publishes work without anyone remembering to come back and edit
   it. Name specific ones and those are what appear, in the order given.
   That is the confirmed behaviour for both featured blocks. */
export const featuredWorkType = defineType({
  name: "featuredWork",
  title: "Featured work",
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
      title: "Case studies",
      type: "array",
      description:
        "Leave empty to show the featured case studies automatically. Add case studies here to choose them yourself.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "caseStudy" }],
        }),
      ],
      validation: (rule) => rule.max(6).unique(),
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 3,
      description: "Only applies when the list above is empty.",
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "cta",
      title: "Link below the row",
      type: "cta",
      description: "Optional — e.g. “View All Work”.",
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
        title: title || "Featured work",
        subtitle: [subtitle, n ? `${n} chosen` : "automatic"]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
