import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

/**
 * An editor-supplied image in a section block.
 *
 * Same contract as TalentMedia: the editor's hotspot becomes the CSS
 * object-position, so their chosen focal point survives every slot
 * without a server-side crop per aspect ratio, and the asset's LQIP is
 * the blur-up. The slot reserves its space from the asset's own aspect
 * ratio, which is what keeps CLS inside the SOW §6 threshold.
 */
export default function BlockImage({
  image,
  sizes,
  className = "",
  priority = false,
  ratio,
  width = 1600,
}: {
  image: SanityImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Force a slot shape. Used where a ragged grid would be worse than a
      crop — a card grid, for instance. Omit it and the asset's own
      aspect ratio wins, which is the better default everywhere else. */
  ratio?: string;
  /** Pixel width requested from the Sanity CDN. Size it to the slot: ~1200
      for a card, ~2000 for a full-width hero. */
  width?: number;
}) {
  const { hotspot, lqip, aspectRatio } = image;
  const fit = image.display === "fit";
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "center";

  return (
    <div
      className={`talent-media relative w-full overflow-hidden ${
        fit ? "media-fit" : ""
      } ${className}`}
      style={{ aspectRatio: ratio ?? (aspectRatio ? String(aspectRatio) : "4/3") }}
    >
      <Image
        src={urlFor(image).width(width).quality(80).url()}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={lqip && !fit ? "blur" : "empty"}
        blurDataURL={lqip}
        className={fit ? "object-contain" : "object-cover"}
        style={fit ? undefined : { objectPosition }}
      />
    </div>
  );
}
