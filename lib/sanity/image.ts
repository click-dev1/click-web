import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/* URL builder honouring the editor's hotspot/crop. Call `.width(n)` etc.
   on the result; `auto("format")` lets Sanity serve AVIF/WebP. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/* The shape of the image as urlFor() delivers it. The asset's metadata
   describes the original upload, but an editor's crop in the Studio
   trims the delivered file — size a frame from the metadata alone and a
   cropped image sits letterboxed inside it. */
export function deliveredAspectRatio(image: {
  aspectRatio?: number;
  crop?: { top: number; bottom: number; left: number; right: number };
}): number | undefined {
  const { aspectRatio, crop } = image;
  if (!aspectRatio || !crop) return aspectRatio;
  const w = 1 - crop.left - crop.right;
  const h = 1 - crop.top - crop.bottom;
  return w > 0 && h > 0 ? (aspectRatio * w) / h : aspectRatio;
}
