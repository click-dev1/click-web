import { defineArrayMember, defineField, defineType } from "sanity";

/* A standard page, assembled from the delivered section blocks.

   This is the type SOW §4 row 1 is about: "Publish new pages assembled
   from the delivered section blocks; edit all copy and headings; replace
   or add images; edit calls to action." Everything an editor needs to do
   that is here, and nothing that would let them break the page's rhythm
   is — the vertical spacing, hairlines and the signal each section sends
   to the background canvas are derived from position, not chosen.

   The bespoke pages that already exist (/influencer-marketing,
   /experiential, /talent-management, /about, /contact) migrate onto this
   type. The home page deliberately does not: it is a singleton with
   editable copy per section, because nobody will ever assemble a second
   one and decomposing it buys nothing. */
export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page name",
      type: "string",
      group: "content",
      description: "Used in the CMS and as the fallback browser-tab title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "The page's web address: /<slug>. Set it before publishing.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Sections",
      type: "array",
      group: "content",
      description:
        "The page, top to bottom. Drag to reorder. A page normally opens with a hero and closes with a call to action.",
      of: [
        defineArrayMember({ type: "pageHero" }),
        defineArrayMember({ type: "copyMedia" }),
        defineArrayMember({ type: "metricRow" }),
        defineArrayMember({ type: "capabilityList" }),
        defineArrayMember({ type: "cardGrid" }),
        defineArrayMember({ type: "featuredWork" }),
        defineArrayMember({ type: "featuredTalent" }),
        defineArrayMember({ type: "mediaBlock" }),
        defineArrayMember({ type: "teamGrid" }),
        defineArrayMember({ type: "timeline" }),
        defineArrayMember({ type: "recognition" }),
        defineArrayMember({ type: "activationScorecard" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? `/${slug}` : "No address set",
    }),
  },
});
