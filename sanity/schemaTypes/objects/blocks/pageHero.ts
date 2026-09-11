import { defineArrayMember, defineField, defineType } from "sanity";

/* The top of a page. One per page, always first — the renderer gives it
   the full-height treatment and the "overlap" signal, so there is no
   layout choice for an editor to get wrong. */
export const pageHeroType = defineType({
  name: "pageHero",
  title: "Page hero",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "The small pill above the headline.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kicker",
      type: "text",
      rows: 2,
      description: "Optional large line under the headline — the page's thesis.",
    }),
    defineField({
      name: "lede",
      type: "text",
      rows: 3,
      description: "Optional smaller paragraph under that.",
    }),
    defineField({
      name: "ctas",
      title: "Buttons",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "aside",
      title: "Image (right column)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "credit", title: "Credit / licence", type: "string" }),
      ],
    }),
    defineField({
      name: "outline",
      title: "Outlined headline",
      type: "boolean",
      initialValue: false,
      description: "Draws the headline as an outline instead of solid.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow", media: "aside" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Page hero",
      subtitle: `Hero · ${subtitle ?? ""}`,
      media,
    }),
  },
});
