import { defineArrayMember, defineField, defineType } from "sanity";

/* Grouped capability chips — the "every stage of the lifecycle" shape on
   /influencer-marketing, and the same device on the other service pages.

   Items are plain strings rather than objects with descriptions: the
   whole point of this section is that it scans in two seconds. Anything
   that needs a sentence belongs in a card grid instead. */
export const capabilityListType = defineType({
  name: "capabilityList",
  title: "Capability groups",
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
      name: "groups",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "capabilityGroup",
          title: "Group",
          fields: [
            defineField({
              name: "label",
              type: "string",
              description: "The stage — Strategy, Execution, Optimization.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { layout: "tags" },
              description: "One capability per tag. Press Enter after each.",
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label", items: "items" },
            prepare: ({ title, items }) => ({
              title,
              subtitle: Array.isArray(items) ? items.join(", ") : "",
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Capability groups",
      subtitle: subtitle
        ? `Capability groups · ${subtitle}`
        : "Capability groups",
    }),
  },
});
