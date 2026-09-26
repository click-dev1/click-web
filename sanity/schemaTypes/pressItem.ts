import { defineField, defineType } from "sanity";

/* Coverage of CLICK in another outlet. It has no page of its own on this
   site — /press lists it and links out to the original, so the site never
   republishes someone else's article. */
export const pressItemType = defineType({
  name: "pressItem",
  title: "Press",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      description: "The headline as the outlet published it.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "outlet",
      type: "string",
      description: "The publication: The Drum, Mumbrella, AdAge…",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link to the article",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "Optional. A line from the piece, quoted exactly as published.",
      validation: (rule) => rule.max(280),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", outlet: "outlet", date: "publishedAt" },
    prepare: ({ title, outlet, date }) => ({
      title,
      subtitle: [outlet, date].filter(Boolean).join(" · "),
    }),
  },
});
