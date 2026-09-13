import { defineArrayMember, defineField, defineType } from "sanity";

/* The team grid. Same contract as the other featured blocks: name the
   people to show them in that order, or leave it empty and the whole
   team appears in its own sort order — which is what About wants, so
   adding someone to the team adds them to the page. */
export const teamGridType = defineType({
  name: "teamGrid",
  title: "Team",
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
      name: "picks",
      title: "People",
      type: "array",
      description:
        "Leave empty to show the whole team in their sort order. Add people here to choose and order them yourself.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "footnote",
      type: "string",
      description:
        "A line under the grid — e.g. what is still being collected.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", picks: "picks" },
    prepare: ({ title, subtitle, picks }) => {
      const n = Array.isArray(picks) ? picks.length : 0;
      return {
        title: title || "Team",
        subtitle: [subtitle, n ? `${n} chosen` : "whole team"]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
