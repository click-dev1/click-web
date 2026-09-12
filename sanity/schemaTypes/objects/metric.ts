import { defineField, defineType } from "sanity";

/* One measured figure. Shared, because the same value/label pair appears
   in a metric row, on a case study and in a campaign scorecard, and a
   figure should read identically in all three.

   `value` is a string, not a number: the figures CLICK publishes are
   "4.2M", "+38%", "1 in 3". Storing them as typed numbers would mean
   inventing a formatting language for editors and getting it wrong. */
export const metricType = defineType({
  name: "metric",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "value",
      type: "string",
      description: "The figure exactly as it should read — 4.2M, +38%, 1 in 3.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      description: "What it measures. Keep it to a few words.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
