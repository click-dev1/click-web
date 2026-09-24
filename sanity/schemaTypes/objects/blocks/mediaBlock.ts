import { defineArrayMember, defineField, defineType } from "sanity";
import { imageDisplayField } from "../imageDisplay";

/* A band of images on their own, not beside copy.

   The arrangement comes from how many there are: two sit side by side,
   three take the staggered row the built pages use (the outer two dropped
   against the middle, so the band reads as a moment rather than a
   contact sheet), four fall into a grid. An editor adds a picture; they
   do not choose a layout.

   Captions work the same way they do on `copyMedia`: one per image that
   is coming, rendered as empty frames until the photography arrives. */
export const mediaBlockType = defineType({
  name: "mediaBlock",
  title: "Image band",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "The small pill above the band. Optional.",
    }),
    defineField({
      name: "heading",
      type: "text",
      rows: 2,
      description: "Optional — a band of images often needs no heading.",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({
              name: "credit",
              title: "Credit / licence",
              type: "string",
            }),
            imageDisplayField,
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "mediaLabels",
      title: "Awaiting-image captions",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "One per image you intend to add. They show as empty frames in the arrangement the images will take.",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "caption",
      type: "string",
      description: "Optional line under the band — a credit, or what it shows.",
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
    select: {
      title: "heading",
      eyebrow: "eyebrow",
      images: "images",
      labels: "mediaLabels",
      media: "images.0",
    },
    prepare: ({ title, eyebrow, images, labels, media }) => {
      const n = (Array.isArray(images) ? images.length : 0) ||
        (Array.isArray(labels) ? labels.length : 0);
      return {
        title: title || "Image band",
        subtitle: [eyebrow, `${n} image${n === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
