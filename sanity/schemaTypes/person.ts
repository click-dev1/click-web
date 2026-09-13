import { defineField, defineType } from "sanity";

/* A member of the CLICK team.

   A document type rather than a block field because the same person
   appears in more than one place and their role changes without the
   pages around them changing — and because SOW §4 requires CLICK to
   edit the team without a developer.

   As with `caseStudy`, the old VerificationStatus splits: fitness to
   publish is draft vs published, and the editorial rule that survives as
   a field is `perspective`. A real person never gets an invented quote,
   so an empty perspective renders the collect-in-their-own-voice marker
   rather than filler. */
export const personType = defineType({
  name: "person",
  title: "Team member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      description: "Their title, as it should read — Head of Client Services.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      description:
        "Leave it empty until the commissioned photography arrives — the card shows the awaiting-portrait frame rather than a stand-in.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Alt text is required for accessibility."),
        }),
        defineField({
          name: "credit",
          title: "Credit / licence",
          type: "string",
          description: "Internal — never shown on the site.",
        }),
      ],
    }),
    defineField({
      name: "perspective",
      title: "Perspective line",
      type: "text",
      rows: 3,
      description:
        "One line in their own voice. Collect it from them — never write it for them. Empty is fine; the card says it is still to come.",
    }),
    defineField({
      name: "recognition",
      type: "string",
      description: "An award or listing — e.g. “Business Insider Top Talent Managers”.",
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      description:
        "Lower numbers appear first. Leadership first, then the rest. Leave blank to sort by name.",
    }),
  ],
  orderings: [
    {
      title: "Team order",
      name: "teamOrder",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
