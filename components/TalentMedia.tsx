import Image from "next/image";
import Placeholder from "./Placeholder";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

/**
 * The media slot for a creator — card hero, spotlight portrait, profile
 * hero. Renders the talent's portrait when one is on file and falls back
 * to the design Placeholder when it isn't, so the layouts never depend on
 * every creator having photography.
 *
 * The image comes from Sanity: the editor's hotspot becomes the CSS
 * object-position (so the focal point survives every aspect ratio without
 * a server-side crop per slot) and the asset's LQIP is the blur-up.
 */
export default function TalentMedia({
  talent,
  ratio,
  label,
  sizes,
  className = "",
  priority = false,
}: {
  talent: { name: string; portrait?: SanityImage };
  /** CSS aspect-ratio of the slot, e.g. "4/5". */
  ratio: string;
  /** Placeholder label when no image is on file. */
  label: string;
  /** next/image `sizes` hint for the slot. */
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const { portrait } = talent;
  if (!portrait?.asset) {
    return <Placeholder label={label} ratio={ratio} className={className} />;
  }
  const { hotspot, lqip } = portrait;
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "center";
  return (
    <div
      className={`talent-media relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={urlFor(portrait).width(1600).quality(80).url()}
        alt={portrait.alt ?? talent.name}
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
