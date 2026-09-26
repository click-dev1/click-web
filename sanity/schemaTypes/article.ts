import { defineArrayMember, defineField, defineType } from "sanity";
import { imageDisplayField } from "./objects/imageDisplay";

/* An insight or a news story. One type with a `kind`, not two: they share
   every field, and an editor should not have to decide which schema a
   piece belongs to before writing it. The kind decides the address —
   /insights/<slug> or /news/<slug> — and which index lists it.

   Press coverage in other outlets is NOT this type: it links out to
   someone else's article (see pressItem.ts). */

export const ARTICLE_KINDS = [
  { title: "Insight", value: "insight" },
  { title: "News", value: "news" },
] as const;

/* Links in the body: web, email, or a path on this site. Anything else
   (javascript:, data:) is refused here and again by the renderer. */
const linkAnnotation = {
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "href",
      title: "Address",
      type: "url",
      description: "https://…, mailto:…, or a page on this site such as /work.",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https", "mailto"], allowRelative: true }),
    }),
  ],
};

export const articleType = defineType({
  name: "article",
  title: "Insight / news",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "kind",
      type: "string",
      group: "content",
      description: "Insights live at /insights, news at /news.",
      options: { list: [...ARTICLE_KINDS], layout: "radio", direction: "horizontal" },
      initialValue: "insight",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "The web address. Generated from the title; change it only before publishing.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "content",
      description: "Shown on the article and used to order the list, newest first.",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "One or two sentences. Shown on the list card and, unless SEO overrides it, in search results.",
      validation: (rule) =>
        rule.required().max(220).warning("Keep it under ~220 characters — it has to fit a card."),
    }),
    defineField({
      name: "author",
      type: "reference",
      group: "content",
      to: [{ type: "person" }],
      description: "A member of the team. Leave empty to credit CLICK.",
    }),
    defineField({
      name: "mainImage",
      title: "Lead image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "What the image shows, for screen readers.",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "credit", type: "string" }),
        imageDisplayField,
      ],
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [linkAnnotation],
          },
        }),
        defineArrayMember({
          type: "image",
          name: "bodyImage",
          title: "Image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", kind: "kind", date: "publishedAt", media: "mainImage" },
    prepare: ({ title, kind, date, media }) => ({
      title,
      subtitle: [kind === "news" ? "News" : "Insight", date?.slice(0, 10)]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
