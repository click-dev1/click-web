import { defineArrayMember, defineField, defineType } from "sanity";

/* A signature block: copy on the left, a dated list on the right.

   The years are strings, not dates. The built timeline runs
   "2017 / — / — / —": CLICK has one firm date and three ordered beats
   after it, and forcing those into real dates would mean inventing
   three. A dash is a legitimate entry here. */
export const timelineType = defineType({
  name: "timeline",
  title: "Story timeline",
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
      title: "Copy (left column)",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Paragraph", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: "entries",
      title: "Milestones",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({
              name: "year",
              type: "string",
              description: "A year, or “—” for a beat with no firm date.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "year", subtitle: "text" } },
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", entries: "entries" },
    prepare: ({ title, subtitle, entries }) => {
      const n = Array.isArray(entries) ? entries.length : 0;
      return {
        title: title || "Story timeline",
        subtitle: [subtitle, `${n} milestone${n === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
