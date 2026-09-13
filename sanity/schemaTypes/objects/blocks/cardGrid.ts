import { defineArrayMember, defineField, defineType } from "sanity";

/* A grid of short cards — the technology stack on /influencer-marketing,
   the "how we work" steps on /work, the office list on /about.

   The column count is derived from how many cards there are, so a grid
   never ends in a ragged row. Numbering is a switch rather than typed
   into each card's eyebrow, because hand-typed "01, 02, 03" survives
   exactly until someone reorders the cards. */
export const cardGridType = defineType({
  name: "cardGrid",
  title: "Card grid",
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
        "Optional. Leave it empty to run the cards directly under the section above.",
    }),
    defineField({
      name: "numbered",
      title: "Number the cards",
      type: "boolean",
      initialValue: false,
      description:
        "Marks each card 01, 02, 03… in order. Use it for steps or a ranked list.",
    }),
    defineField({
      name: "cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "eyebrow",
              type: "string",
              description:
                "The small label above the card title — e.g. “Technology”. Optional.",
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
            }),
            defineField({
              name: "image",
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
            defineField({
              name: "cta",
              title: "Link",
              type: "cta",
              description: "Optional. Adds a link at the foot of the card.",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
              media: "image",
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
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
        "Optional line above it — e.g. \u201cThe payoff \u00b7 one real finding\u201d. Adding one sets the smaller, stated-finding style.",
      hidden: ({ parent }) => !parent?.insight,
    }),
    defineField({
      name: "insightFootnote",
      title: "Insight footnote",
      type: "string",
      description:
        "Optional small line beneath it — e.g. \u201cStatus \u00b7 awaiting client insight\u201d.",
      hidden: ({ parent }) => !parent?.insight,
    }),
    defineField({
      name: "cta",
      title: "Link below the grid",
      type: "cta",
      description: "Optional. E.g. “View All Work”.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", cards: "cards" },
    prepare: ({ title, subtitle, cards }) => {
      const count = Array.isArray(cards) ? cards.length : 0;
      return {
        title: title || "Card grid",
        subtitle: [subtitle, `${count} card${count === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
