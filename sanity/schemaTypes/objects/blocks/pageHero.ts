import { defineArrayMember, defineField, defineType } from "sanity";
import { imageDisplayField } from "../imageDisplay";

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
    /* The right column is either a picture or a framed note. Several of
       the built heroes use the note — an illustrative finding, with the
       fact that it is illustrative stated on it — so the CMS has to be
       able to do both. Making it a choice rather than "fill in whichever"
       keeps a half-filled hero from rendering something nobody meant.

       It defaults to "image", and the renderer falls back to the image
       whenever the choice is absent, so heroes authored before this field
       existed keep working. */
    defineField({
      name: "asideKind",
      title: "Right column",
      type: "string",
      initialValue: "image",
      options: {
        list: [
          { title: "Nothing", value: "none" },
          { title: "An image", value: "image" },
          { title: "A framed note", value: "note" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "aside",
      title: "Image (right column)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.asideKind === "note" || parent?.asideKind === "none",
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "credit", title: "Credit / licence", type: "string" }),
        imageDisplayField,
      ],
    }),
    defineField({
      name: "asideLabel",
      title: "Awaiting-image caption",
      type: "string",
      description:
        "Shown as an empty frame until the image above is supplied — e.g. \u201cActivation film \u00b7 client footage\u201d.",
      hidden: ({ parent }) =>
        parent?.asideKind === "note" || parent?.asideKind === "none",
    }),
    defineField({
      name: "asideNote",
      title: "Note (right column)",
      type: "object",
      hidden: ({ parent }) => parent?.asideKind !== "note",
      fields: [
        defineField({
          name: "label",
          type: "string",
          description: "The line above the note — e.g. “Resolved insight · illustrative”.",
        }),
        defineField({
          name: "text",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "footnote",
          type: "string",
          description:
            "A small line under the note — e.g. “Status · awaiting client insight”.",
        }),
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
