import { defineField, defineType } from "sanity";

/* A call to action. Shared by every block that has one, so the choice an
   editor makes here behaves identically wherever it appears.

   "Open the contact form" is its own destination rather than a URL an
   editor has to remember, because the contact form is a modal, not a
   page — SOW §4 requires editing calls to action without a developer. */
export const ctaType = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destination",
      type: "string",
      initialValue: "modal",
      options: {
        list: [
          { title: "Open the contact form", value: "modal" },
          { title: "A page on this site", value: "internal" },
          { title: "Another website", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "A path like /work or /contact#creator-network, or a full https:// address.",
      hidden: ({ parent }) => parent?.destination === "modal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { destination?: string } | undefined;
          if (parent?.destination === "modal") return true;
          if (!value) return "Add a link, or change the destination.";
          return true;
        }),
    }),
    defineField({
      name: "style",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary (filled)", value: "primary" },
          { title: "Secondary (outline)", value: "ghost" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "destination" },
  },
});
