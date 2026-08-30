import Image from "next/image";
import Placeholder from "./Placeholder";
import type { Talent } from "@/content/site";

/**
 * The media slot for a creator — card hero, spotlight portrait, profile
 * hero. Renders the talent's image when one is on file and falls back to
 * the design Placeholder when it isn't, so the layouts never depend on
 * every creator having photography.
 */
export default function TalentMedia({
  talent,
  ratio,
  label,
  sizes,
  className = "",
  priority = false,
}: {
  talent: Pick<Talent, "name" | "image" | "imageAlt" | "imagePosition">;
  /** CSS aspect-ratio of the slot, e.g. "4/5". */
  ratio: string;
  /** Placeholder label when no image is on file. */
  label: string;
  /** next/image `sizes` hint for the slot. */
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!talent.image) {
    return <Placeholder label={label} ratio={ratio} className={className} />;
  }
  return (
    <div
      className={`talent-media relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={talent.image}
        alt={talent.imageAlt ?? talent.name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: talent.imagePosition ?? "center" }}
      />
    </div>
  );
}
