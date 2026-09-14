import { defineField, defineType } from "sanity";

/* Copy on the left, the HubSpot form on the right.

   The FORM is not editable here and deliberately so: its fields, labels,
   validation and thank-you all live in HubSpot, where the people who read
   the submissions can change them without a deploy. Duplicating any of
   that into Sanity would create a second source of truth for the same
   form. What this block owns is the copy around it.

   `emailPrompt` is the "Prefer email?" line. The address itself comes
   from Site settings — it is the same one the nav, the footer and the
   structured data use, and it should not be retyped here. */
export const contactFormType = defineType({
  name: "contactForm",
  title: "Contact form",
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
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "emailPrompt",
      title: "Email fallback line",
      type: "string",
      initialValue: "Prefer email?",
      description:
        "The lead-in before the enquiries address. The address itself comes from Site settings.",
    }),
    /* An id other pages and in-page links can point at. Blocks with an
       anchor get scroll-margin from `section[id]` in globals.css, so the
       fixed nav does not cover the target. */
    defineField({
      name: "anchor",
      title: "Link target",
      type: "string",
      description:
        "Optional. Lets a link point straight at this section, e.g. an anchor of “enquiry” is reachable as /contact#enquiry. Letters, numbers and hyphens.",
      validation: (rule) =>
        rule.regex(/^[a-z0-9-]+$/, { name: "anchor", invert: false })
          .error("Use lowercase letters, numbers and hyphens only."),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Contact form",
      subtitle: subtitle ? `Contact form · ${subtitle}` : "Contact form",
    }),
  },
});
