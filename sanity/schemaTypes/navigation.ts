import { defineArrayMember, defineField, defineType } from "sanity";

/* Where things link. A singleton, like site settings.

   The main menu allows one level of nesting and no more: "Solutions" and
   "Talent" are dropdowns with no landing page of their own, which is the
   navigation the blueprint specifies, and a third level would be a menu
   nobody can use on a phone.

   Footer columns are a flat list per column — the footer is a sitemap,
   not a second menu. */
const linkFields = [
  defineField({
    name: "label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "href",
    title: "Link",
    type: "string",
    description:
      "A path like /work or /contact#creator-network, a full https:// address, or a mailto:.",
    validation: (rule) => rule.required(),
  }),
];

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  groups: [
    { name: "main", title: "Main menu", default: true },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "main",
      title: "Main menu",
      type: "array",
      group: "main",
      description:
        "Top level, left to right. A group opens as a dropdown and is not itself a link.",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          title: "Link",
          fields: linkFields,
          preview: { select: { title: "label", subtitle: "href" } },
        }),
        defineArrayMember({
          type: "object",
          name: "navGroup",
          title: "Dropdown",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "children",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "navChild",
                  fields: linkFields,
                  preview: { select: { title: "label", subtitle: "href" } },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label", children: "children" },
            prepare: ({ title, children }) => ({
              title,
              subtitle: `${Array.isArray(children) ? children.length : 0} links`,
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "footerLink",
                  fields: [
                    ...linkFields,
                    defineField({
                      name: "external",
                      title: "Opens in a new tab",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label", links: "links" },
            prepare: ({ title, links }) => ({
              title,
              subtitle: `${Array.isArray(links) ? links.length : 0} links`,
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});
