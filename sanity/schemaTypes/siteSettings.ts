import { defineArrayMember, defineField, defineType } from "sanity";

/* Site-wide values. A singleton — there is only ever one, and the Studio
   pins it rather than showing a list of one.

   What lives here is anything used in more than one place. The contact
   email is read by the nav, the footer, the structured data AND the
   contact page: four copies of one string is three chances to update it
   incompletely, which is exactly the kind of edit SOW §4 says CLICK
   should be able to make without a developer.

   Social icons are NOT editable. They are inline SVG, and letting an
   editor paste markup into the page is how a CMS becomes an XSS hole —
   so the platform is a choice from a list and the icon stays in code. */
export const SOCIAL_PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "TikTok",
  "YouTube",
  "X",
  "Facebook",
] as const;

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "social", title: "Social" },
    { name: "org", title: "Organisation" },
  ],
  fields: [
    defineField({
      name: "email",
      title: "General enquiries email",
      type: "string",
      group: "contact",
      description:
        "Shown in the navigation, the footer and on the contact page, and used in the site's structured data. Changing it here changes all four.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      group: "social",
      description: "Shown in the footer and on the contact page, in this order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: [...SOCIAL_PLATFORMS], layout: "dropdown" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "legalName",
      title: "Registered company name",
      type: "string",
      group: "org",
      description: "As it appears in the footer copyright line.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerTagline",
      type: "string",
      group: "org",
      description: "The small line at the foot of the legal bar.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
