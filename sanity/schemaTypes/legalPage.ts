import { defineArrayMember, defineField, defineType } from "sanity";

/* The three legal documents: Privacy Policy, Cookie Policy, Terms of Use.

   Each is a fixed document (legalPage-<slug>) at a fixed address, pinned
   in the Studio sidebar — legal text is edited, never created or deleted
   from here. The text carries legal weight, so it is changed on counsel's
   instruction; the Studio makes that a text edit rather than a deploy.

   What an editor does NOT write: the cookie table, the cookie categories
   and the list of processors. Those are generated from lib/consent.ts —
   the same list that drives the cookie notice — and placed in the text as
   a "Cookie inventory" insert, so the policy can never disagree with the
   banner. */

export const LEGAL_SLUGS = ["privacy-policy", "cookie-policy", "terms-of-use"] as const;

const linkAnnotation = {
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "href",
      title: "Address",
      type: "url",
      description: "https://…, mailto:…, or a page on this site such as /cookie-policy.",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https", "mailto"], allowRelative: true }),
    }),
  ],
};

/** Body text of a legal document: paragraphs, subheadings, bullet lists,
    links, plus two inserts — a plain table and the generated cookie
    inventory. */
const legalText = defineField({
  name: "body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Subheading", value: "h3" },
      ],
      lists: [{ title: "Bullets", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      type: "object",
      name: "legalTable",
      title: "Table",
      fields: [
        defineField({
          name: "columns",
          title: "Column headings",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "rows",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "legalTableRow",
              fields: [
                defineField({
                  name: "cells",
                  type: "array",
                  of: [{ type: "string" }],
                  description: "One entry per column. Web addresses become links.",
                }),
              ],
              preview: {
                select: { cells: "cells" },
                prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") }),
              },
            }),
          ],
        }),
      ],
      preview: {
        select: { columns: "columns" },
        prepare: ({ columns }) => ({ title: `Table: ${(columns ?? []).join(" · ")}` }),
      },
    }),
    defineArrayMember({
      type: "object",
      name: "cookieInventory",
      title: "Cookie inventory (generated)",
      description:
        "Filled in automatically from the site's cookie list. Choose which part to show here.",
      fields: [
        defineField({
          name: "show",
          type: "string",
          options: {
            list: [
              { title: "Cookie table", value: "table" },
              { title: "Cookie categories", value: "categories" },
              { title: "Processors sentence", value: "processors" },
            ],
            layout: "radio",
          },
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { show: "show" },
        prepare: ({ show }) => ({ title: `Cookie inventory — ${show ?? "choose a part"}` }),
      },
    }),
  ],
});

export const legalPageType = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "string",
      description: "Fixed — each legal document has its own address.",
      readOnly: true,
      options: { list: [...LEGAL_SLUGS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "Shown under the title and in search results.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      description: "Shown as “Last updated: …” on the page. Change it whenever the text changes.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approved",
      title: "Signed off by counsel",
      type: "boolean",
      description:
        "Until this is on, the page is live but hidden from search engines and left out of the sitemap. Turn it on only once counsel has approved this exact text.",
      initialValue: false,
    }),
    defineField({ ...legalText, name: "intro", title: "Opening paragraphs" }),
    defineField({
      name: "sections",
      type: "array",
      description: "Each section is numbered and listed under “On this page”.",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalSection",
          fields: [
            defineField({
              name: "heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            legalText,
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", approved: "approved" },
    prepare: ({ title, approved }) => ({
      title,
      subtitle: approved ? "Signed off" : "Awaiting sign-off — hidden from search",
    }),
  },
});
