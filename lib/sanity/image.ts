import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/* URL builder honouring the editor's hotspot/crop. Call `.width(n)` etc.
   on the result; `auto("format")` lets Sanity serve AVIF/WebP. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
