import { defineArrayMember, defineField, defineType } from "sanity";

/* The home page. A singleton with editable copy per section — NOT a
   free-form block canvas, and that was the deliberate call.
   
   Nobody will ever assemble a second home page, and decomposing this one
   would hand an editor the ability to reorder the argument the whole site
   is built on: audience intelligence, then the two journeys, then proof,
   then the ecosystem behind it. The sections are fixed. Every word in
   them is editable, which is what SOW §4 actually asks for.

   Each group below is one section, in the order they appear on the page. */
export const homePageType = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "journeys", title: "Two journeys" },
    { name: "brands", title: "Brand marquee" },
    { name: "intelligence", title: "Intelligence" },
    { name: "work", title: "Featured work" },
    { name: "closing", title: "Recognition & closing" },
    { name: "ecosystem", title: "Ecosystem" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ---- hero ---- */
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroCreed",
      title: "The positioning lines",
      type: "object",
      group: "hero",
      description:
        "Three lines, set large under the headline. The third is the payoff and is styled differently — keep it short.",
      fields: [
        defineField({ name: "line1", type: "string", validation: (r) => r.required() }),
        defineField({ name: "line2", type: "string", validation: (r) => r.required() }),
        defineField({ name: "payoff", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "heroLede",
      title: "Lede",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroCtas",
      title: "Buttons",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "cta" })],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "heroAnnotation",
      title: "Floating insight",
      type: "object",
      group: "hero",
      description:
        "The framed note that fades in over the hero on wide screens. It is a real, named finding — keep the status line honest.",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({ name: "statusLabel", title: "Status line", type: "string" }),
      ],
    }),
    defineField({
      name: "heroProof",
      title: "Featured result",
      type: "object",
      group: "hero",
      description: "The single figure in the chip below the hero.",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "value", type: "string" }),
        defineField({ name: "label", type: "string" }),
      ],
    }),

    /* ---- journeys ---- */
    defineField({
      name: "journeys",
      title: "The two journeys",
      type: "object",
      group: "journeys",
      description:
        "The split panel. Both open the contact form; the layout, the numbering and the two type treatments are fixed.",
      fields: [
        defineField({ name: "firstEyebrow", title: "Left eyebrow", type: "string" }),
        defineField({
          name: "firstHeading",
          title: "Left heading",
          type: "string",
          description: "The last word carries the hand-drawn mark.",
        }),
        defineField({ name: "firstBody", title: "Left copy", type: "text", rows: 2 }),
        defineField({ name: "firstCta", title: "Left button", type: "string" }),
        defineField({ name: "secondEyebrow", title: "Right eyebrow", type: "string" }),
        defineField({ name: "secondHeading", title: "Right heading", type: "string" }),
        defineField({ name: "secondBody", title: "Right copy", type: "text", rows: 2 }),
        defineField({ name: "secondCta", title: "Right button", type: "string" }),
      ],
    }),

    /* ---- brand marquee ---- */
    defineField({
      name: "brandsHeading",
      title: "Heading",
      type: "string",
      group: "brands",
    }),
    defineField({
      name: "brandClients",
      title: "Clients",
      type: "array",
      group: "brands",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Scrolls as the first row. Only brands CLICK has actually worked with.",
    }),
    defineField({
      name: "brandPlatforms",
      title: "Platform partners",
      type: "array",
      group: "brands",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),

    /* ---- intelligence ---- */
    defineField({
      name: "beats",
      title: "The four beats",
      type: "array",
      group: "intelligence",
      description:
        "The argument beside the diagram, in order. The diagram is drawn to match — changing the count is development work.",
      of: [
        defineArrayMember({
          type: "object",
          name: "beat",
          fields: [
            defineField({
              name: "layers",
              title: "Layer label",
              type: "string",
              description: "e.g. “Platforms → Audience Intelligence”.",
            }),
            defineField({ name: "title", type: "text", rows: 2, validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 4, validation: (r) => r.required() }),
            defineField({
              name: "proof",
              title: "Closing figure",
              type: "metric",
              description: "Optional. Only the last beat carries one.",
            }),
          ],
          preview: { select: { title: "title", subtitle: "layers" } },
        }),
      ],
    }),

    /* ---- featured work ---- */
    defineField({
      name: "workEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "work",
    }),
    defineField({
      name: "workHeading",
      title: "Heading",
      type: "text",
      rows: 2,
      group: "work",
    }),
    defineField({
      name: "workPicks",
      title: "Case studies",
      type: "array",
      group: "work",
      description:
        "Leave empty to show the featured case studies automatically — publishing one then puts it on the home page.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })],
      validation: (rule) => rule.max(4).unique(),
    }),

    /* ---- recognition + closing ---- */
    defineField({
      name: "recognitionLine",
      title: "Recognition",
      type: "string",
      group: "closing",
      description: "The one claim the blueprint says to state once and leave alone.",
    }),
    defineField({
      name: "recognitionYears",
      title: "Years",
      type: "string",
      group: "closing",
    }),
    defineField({
      name: "ctaHeading",
      title: "Closing heading",
      type: "text",
      rows: 2,
      group: "closing",
    }),
    defineField({
      name: "ctaBody",
      title: "Closing copy",
      type: "text",
      rows: 3,
      group: "closing",
    }),
    defineField({
      name: "ctaButton",
      title: "Closing button",
      type: "cta",
      group: "closing",
    }),

    /* ---- ecosystem ---- */
    /* Sits between recognition and the closing call to action on the
       page; grouped last here because it is edited least. GameSquare's
       structure has changed more than once, which is why the lineup lives
       here and not in code. */
    defineField({
      name: "ecosystemEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "ecosystem",
    }),
    defineField({
      name: "ecosystemHeading",
      title: "Heading",
      type: "string",
      group: "ecosystem",
    }),
    defineField({
      name: "ecosystemGroups",
      title: "Groups",
      type: "array",
      group: "ecosystem",
      description:
        "Each group is a labelled row of names. Hovering or tapping a name shows its line in the panel beside them — the first name is shown to start.",
      of: [
        defineArrayMember({
          type: "object",
          name: "ecosystemGroup",
          fields: [
            defineField({
              name: "label",
              type: "string",
              description: "e.g. “Technology”.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "nodes",
              title: "Names",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "ecosystemNode",
                  fields: [
                    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
                    defineField({
                      name: "blurb",
                      title: "Line",
                      type: "text",
                      rows: 2,
                      description: "One sentence on what it is.",
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: { select: { title: "name", subtitle: "blurb" } },
                }),
              ],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { title: "label", nodes: "nodes" },
            prepare: ({ title, nodes }) => ({
              title,
              subtitle: (nodes ?? []).map((n: { name?: string }) => n.name).join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "ecosystemNote",
      title: "Footnote",
      type: "string",
      group: "ecosystem",
      description: "The small line under the panel. Optional.",
    }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
