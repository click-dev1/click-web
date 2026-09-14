import { defineArrayMember, defineField, defineType } from "sanity";

/* A row of measured figures.

   The number of columns is derived from how many figures there are, not
   chosen — three figures should always sit as three, and an editor who
   could pick "four columns" for three figures would leave a hole.

   `footnote` exists because every published figure on this site carries
   its provenance ("Figures as confirmed by CLICK"). Making it a field
   keeps that habit available to editors rather than something only the
   hand-built pages do. */
export const metricRowType = defineType({
  name: "metricRow",
  title: "Figures",
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
      description:
        "Optional. Leave it empty to run the figures as a bare strip under the section above.",
    }),
    defineField({
      name: "metrics",
      title: "Figures",
      type: "array",
      of: [defineArrayMember({ type: "metric" })],
      validation: (rule) => rule.required().min(2).max(4),
    }),
    defineField({
      name: "footnote",
      type: "string",
      description:
        "Where the figures come from — e.g. “Figures as confirmed by CLICK.”",
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
    select: { title: "heading", subtitle: "eyebrow", metrics: "metrics" },
    prepare: ({ title, subtitle, metrics }) => {
      const count = Array.isArray(metrics) ? metrics.length : 0;
      return {
        title: title || "Figures",
        subtitle: [subtitle, `${count} figure${count === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
