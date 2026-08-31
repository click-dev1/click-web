import { defineField, defineType } from "sanity";

/* SEO metadata on every content type (SOW §4). Every field is optional:
   the page falls back to its own title and description, so an editor is
   never blocked from publishing — but the length rules surface as warnings
   in the form. */
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      description:
        "Overrides the page title in search results and the browser tab. Leave blank to use the page's own title.",
      validation: (rule) =>
        rule.max(60).warning("Search engines truncate titles after ~60 characters."),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "The summary shown under the title in search results.",
      validation: (rule) =>
        rule.max(160).warning("Descriptions are truncated after ~160 characters."),
    }),
    defineField({
      name: "image",
      title: "Social share image",
      type: "image",
      description:
        "Shown when the page is shared on LinkedIn, Slack, iMessage etc. 1200×630 works best. Falls back to the site default.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Keeps the page out of Google and the sitemap. Use sparingly.",
      initialValue: false,
    }),
  ],
});
