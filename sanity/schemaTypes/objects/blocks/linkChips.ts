import { defineArrayMember, defineField, defineType } from "sanity";

/* A row of chips that link out — the "stay connected" row on /contact.

   `useSocials` pulls the list straight from Site settings rather than
   asking an editor to retype the same three URLs the footer already
   carries. Turn it off and the manual list below is used instead, for a
   row that is not the social profiles. */
export const linkChipsType = defineType({
  name: "linkChips",
  title: "Link chips",
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
      name: "useSocials",
      title: "Use the social profiles from Site settings",
      type: "boolean",
      initialValue: true,
      description:
        "Keeps this row and the footer in step. Turn it off to list your own links below.",
    }),
    defineField({
      name: "links",
      type: "array",
      hidden: ({ parent }) => parent?.useSocials !== false,
      of: [
        defineArrayMember({
          type: "object",
          name: "chipLink",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "anchor",
      title: "Link target",
      type: "string",
      description:
        "Optional. Lets a link point straight at this section. Letters, numbers and hyphens.",
      validation: (rule) =>
        rule.regex(/^[a-z0-9-]+$/, { name: "anchor", invert: false })
          .error("Use lowercase letters, numbers and hyphens only."),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", useSocials: "useSocials" },
    prepare: ({ title, subtitle, useSocials }) => ({
      title: title || "Link chips",
      subtitle: [subtitle, useSocials === false ? "custom links" : "social profiles"]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
