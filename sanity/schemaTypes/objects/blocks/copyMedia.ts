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
    defineField({
      name: "media",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "credit", title: "Credit / licence", type: "string" }),
      ],
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
      hidden: ({ parent }) => !parent?.media,
    }),
    defineField({
      name: "insight",
      title: "Pull quote",
      type: "text",
      rows: 2,
      description:
        "Optional. Rendered in the framed insight style at the end of the section.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "media" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Copy + media",
      subtitle: subtitle ? `Copy + media · ${subtitle}` : "Copy + media",
      media,
    }),
  },
});
