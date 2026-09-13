import { defineArrayMember, defineField, defineType } from "sanity";

/* Awards and listings, centred and stacked so each lands on its own.

   Deliberately not a card grid: these are claims about the company, and
   setting them as a row of boxes makes them read as features. One per
   line, each with what it was for. */
export const recognitionType = defineType({
  name: "recognition",
  title: "Recognition",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "Optional pill above the list.",
    }),
    defineField({
      name: "entries",
      title: "Awards and listings",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "award",
          fields: [
            defineField({
              name: "line",
              title: "The recognition",
              type: "string",
              description: "e.g. “Cannes Lions Silver”.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "detail",
              title: "What it was for",
              type: "string",
              description: "e.g. “Maybelline — Eyes Up”, or the years it covers.",
            }),
          ],
          preview: { select: { title: "line", subtitle: "detail" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { entries: "entries", subtitle: "eyebrow" },
    prepare: ({ entries, subtitle }) => {
      const n = Array.isArray(entries) ? entries.length : 0;
      return {
        title: "Recognition",
        subtitle: [subtitle, `${n} item${n === 1 ? "" : "s"}`]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
