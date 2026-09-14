import { defineField, defineType } from "sanity";

/* The full-bleed split panel — "two ways to work with us".

   A signature block: two routes, side by side, edge to edge, with the
   second drawn as an outline so the pair reads as a choice rather than a
   ranking. Exactly two, and the treatment of each is fixed; the copy and
   the destinations are the editable part. */
export const journeyPanelsType = defineType({
  name: "journeyPanels",
  title: "Split routes",
  type: "object",
  fields: [
    defineField({
      name: "first",
      title: "Left route",
      type: "journeyPanel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "second",
      title: "Right route",
      type: "journeyPanel",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { a: "first.title", b: "second.title" },
    prepare: ({ a, b }) => ({
      title: "Split routes",
      subtitle: [a, b].filter(Boolean).join("  ·  "),
    }),
  },
});

export const journeyPanelType = defineType({
  name: "journeyPanel",
  title: "Route",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "e.g. “Representation”. Numbered automatically.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Where it goes",
      type: "cta",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});
