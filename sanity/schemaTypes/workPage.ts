import { defineArrayMember, defineField, defineType } from "sanity";
import { INDUSTRIES } from "./caseStudy";

/* The /work page's own copy and its industry reels. A singleton, like the
   home page: the case-study grid below it assembles itself from the case
   studies, so what an editor needs here is the framing around it — the
   hero, the reels, and the closing call to action.

   Each reel is one of CLICK's vertical industry films. Its industry is
   picked from the same list the case studies use, which is what lets a
   reel's "See the work" link filter the grid to the matching campaigns.
   The film is uploaded to Mux from the Studio (see sanity.config.ts); a
   reel without one shows its poster, or an awaiting-footage frame. */
export const workPageType = defineType({
  name: "workPage",
  title: "Work page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "reels", title: "Industry reels" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({
      name: "heroTitle",
      title: "Headline",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroLede", title: "Intro", type: "text", rows: 3, group: "hero" }),

    defineField({ name: "reelsEyebrow", title: "Eyebrow", type: "string", group: "reels" }),
    defineField({ name: "reelsHeading", title: "Heading", type: "string", group: "reels" }),
    defineField({
      name: "reels",
      title: "Reels",
      type: "array",
      group: "reels",
      description: "Up to four vertical (9:16) industry films, in display order.",
      of: [
        defineArrayMember({
          type: "object",
          name: "reel",
          fields: [
            defineField({
              name: "label",
              type: "string",
              description: "Shown on the reel — e.g. “Beauty”.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "industry",
              type: "string",
              description:
                "The case-study industry this reel links to. Its “See the work” link filters the grid to it.",
              options: { list: [...INDUSTRIES], layout: "dropdown" },
            }),
            defineField({
              name: "video",
              title: "Film",
              type: "mux.video",
              description:
                "The vertical (9:16) reel, as an MP4 or MOV master — ideally 1080×1920. It plays muted when it comes into view; tapping it plays with sound.",
            }),
            defineField({
              name: "poster",
              type: "image",
              description:
                "Optional. A 9:16 still shown before the film plays. Leave it empty and a frame from the film is used.",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "industry", media: "poster" },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),

    defineField({ name: "ctaHeading", title: "Heading", type: "string", group: "closing" }),
    defineField({ name: "ctaBody", title: "Body", type: "text", rows: 3, group: "closing" }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Work page" }) },
});
