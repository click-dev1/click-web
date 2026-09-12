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
}: {
  image: SanityImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Force a slot shape. Used where a ragged grid would be worse than a
      crop — a card grid, for instance. Omit it and the asset's own
      aspect ratio wins, which is the better default everywhere else. */
  ratio?: string;
}) {
  const { hotspot, lqip, aspectRatio } = image;
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "center";

  return (
    <div
      className={`talent-media relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio ?? (aspectRatio ? String(aspectRatio) : "4/3") }}
    >
      <Image
        src={urlFor(image).width(1600).quality(80).url()}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip}
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
