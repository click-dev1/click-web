import { defineField } from "sanity";

/* How an image sits in its frame. Every image slot on the site has a
   fixed shape (a card is 4:3, a banner 21:9), and by default the picture
   is cropped to fill it around the hotspot. That is right for photography
   and wrong for artwork that has its own composition — the case-study
   collages from CLICK's decks, a key-art poster, a screenshot — where a
   crop cuts the design itself. "Fit" shows the whole image on the deck
   navy instead, which is also the collages' own background, so their
   edges disappear into the frame.

   Added as a sub-field of each image rather than a new image type so the
   existing documents keep validating and nothing needs migrating. */
export const IMAGE_DISPLAY = ["fill", "fit"] as const;
export type ImageDisplay = (typeof IMAGE_DISPLAY)[number];

export const imageDisplayField = defineField({
  name: "display",
  title: "Display",
  type: "string",
  initialValue: "fill",
  description:
    "Fill crops the image to the frame around the hotspot — best for photos. Fit shows the whole image on navy — use it for collages, key art and screenshots.",
  options: {
    list: [
      { title: "Fill (crop to frame)", value: "fill" },
      { title: "Fit (show whole image)", value: "fit" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
});
