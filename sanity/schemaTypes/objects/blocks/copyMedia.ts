import { defineArrayMember, defineField, defineType } from "sanity";

/* The workhorse section: eyebrow, heading, body copy, and optionally an
   image beside or beneath it. Roughly a third of every section on the
   site is this shape, which is why it earns the most care.

   The pull-quote ("insight") is a FIELD here rather than a block of its
   own: on the built pages it almost always sits inside a section, and as
   a separate block an editor would have to position it by hand and would
   get it wrong. */
export const copyMediaType = defineType({
  name: "copyMedia",
  title: "Copy + media",
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
      type: "array",
      description: "The paragraphs. Bold, italics and links are available.",
      of: [
        defineArrayMember({
          type: "block",
          /* Body copy only — headings are the section's job, not the
             paragraph's, so the styles list stays deliberately short. */
          styles: [{ title: "Paragraph", value: "normal" }],
          lists: [{ title: "Bullets", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "string",
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    /* A list, not one image, because several of the built sections use a
       collage — one large frame with two smaller ones beneath it (see
       /influencer-marketing "Creator expertise"). The renderer derives
       the arrangement from how many there are, so an editor adds a second
       picture and gets the collage rather than a layout choice. */
    defineField({
      name: "media",
      title: "Images",
      type: "array",
      description:
        "One image sits beside the copy. Add a second or third and they arrange as a collage.",
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
          ],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "mediaLabel",
      title: "Awaiting-image caption",
      type: "string",
      description:
        "Shown in an empty frame while there are no images — e.g. \u201cAudience overlap visualization\u201d. Remove it once the images are in.",
    }),
    defineField({
      name: "mediaPosition",
      title: "Image position",
      type: "string",
      initialValue: "right",
      options: {
        list: [
          { title: "Right of the copy", value: "right" },
          { title: "Left of the copy", value: "left" },
          { title: "Full width, below", value: "below" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => !parent?.media?.length && !parent?.mediaLabel,
    }),
    /* The framed insight at the foot of a section. On its own it reads as
       a pull quote; give it a label and it becomes a stated finding, which
       is how the built pages use it — and the footnote is where the
       provenance goes ("Status · awaiting client insight"). The renderer
       switches on whether a label is present, so the two never have to be
       separate blocks. */
    defineField({
      name: "insight",
      title: "Framed insight",
      type: "text",
      rows: 3,
      description:
        "Optional. Rendered in the framed style at the end of the section.",
    }),
    defineField({
      name: "insightLabel",
      title: "Insight label",
      type: "string",
      description:
        "Optional line above it — e.g. “The payoff · one real finding”. Adding one sets the smaller, stated-finding style.",
      hidden: ({ parent }) => !parent?.insight,
    }),
    defineField({
      name: "insightFootnote",
      title: "Insight footnote",
      type: "string",
      description:
        "Optional small line beneath it — e.g. “Status · awaiting client insight”.",
      hidden: ({ parent }) => !parent?.insight,
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "media.0" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Copy + media",
      subtitle: subtitle ? `Copy + media · ${subtitle}` : "Copy + media",
      media,
    }),
  },
});
