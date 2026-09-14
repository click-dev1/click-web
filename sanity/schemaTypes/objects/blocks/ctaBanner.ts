import { defineField, defineType } from "sanity";

/* The closing call to action. Every bespoke page on the site ends with
   one, so it is a block rather than something baked into the template —
   an editor assembling a new page needs to be able to finish it. */
export const ctaBannerType = defineType({
  name: "ctaBanner",
  title: "Closing call to action",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "cta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Second button",
      type: "cta",
      description:
        "Optional. Sits beside the first — use it where a page genuinely has two audiences.",
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
        rule.regex(/^[a-z0-9-]+$/, {
          name: "anchor",
          invert: false,
        }).error("Use lowercase letters, numbers and hyphens only."),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "cta.label" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Closing call to action",
      subtitle: subtitle ? `Closing CTA · ${subtitle}` : "Closing CTA",
    }),
  },
});
