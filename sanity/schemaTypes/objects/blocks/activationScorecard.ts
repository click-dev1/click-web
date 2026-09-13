import { defineArrayMember, defineField, defineType } from "sanity";

/* A signature block: fixed layout, editable copy.

   Copy on the left, a framed scorecard on the right — the "show, don't
   claim" moment on /influencer-marketing (the Optus campaign) and on
   /experiential. An editor writes the copy, names the source and supplies
   the figures; they cannot rearrange it, because the arrangement is the
   point.

   `source` and `footnote` are where the provenance goes, and they are not
   decoration: the blueprint asks for three or four real numbers from one
   named piece of work, not a menu of everything we could count. A
   scorecard that does not say whose it is fails that. */
export const activationScorecardType = defineType({
  name: "activationScorecard",
  title: "Scorecard",
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
      name: "body",
      title: "Copy (left column)",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Paragraph", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        }),
      ],
    }),

    defineField({
      name: "label",
      title: "Scorecard label",
      type: "string",
      description: "The line at the top of the frame — e.g. “Campaign scorecard”.",
      initialValue: "Campaign scorecard",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Whose figures these are",
      type: "string",
      description:
        "Named on the frame — e.g. “Optus · Gaming on the Go”. A scorecard that doesn't say whose it is isn't proof.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metrics",
      title: "Figures",
      type: "array",
      of: [defineArrayMember({ type: "metric" })],
      validation: (rule) => rule.required().min(2).max(4),
    }),
    defineField({
      name: "media",
      title: "Image inside the frame",
      type: "image",
      options: { hotspot: true },
      description: "Optional — e.g. a dashboard screenshot beneath the figures.",
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "credit", title: "Credit / licence", type: "string" }),
      ],
    }),
    defineField({
      name: "mediaLabel",
      title: "Awaiting-image caption",
      type: "string",
      description:
        "Shown in the empty frame until the image above is supplied — e.g. “Sideqik dashboard demonstration”.",
    }),
    defineField({
      name: "footnote",
      type: "string",
      description:
        "The provenance line under the figures — e.g. “Figures as published on clickmedia.group”.",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      source: "source",
      metrics: "metrics",
      media: "media",
    },
    prepare: ({ title, source, metrics, media }) => {
      const n = Array.isArray(metrics) ? metrics.length : 0;
      return {
        title: title || "Scorecard",
        subtitle: [source, `${n} figure${n === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
