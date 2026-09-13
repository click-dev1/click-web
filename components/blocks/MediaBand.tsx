import type { ReactNode } from "react";
import BlockImage from "./BlockImage";
import Placeholder from "@/components/Placeholder";
import type { MediaBlock as Block } from "@/lib/sanity/types";

/**
 * A band of images on their own.
 *
 * Mirrors the staggered row on /experiential "Experiences begin with
 * people". The stagger is the point: dropping the outer two frames
 * against the middle makes the band read as a moment rather than a
 * contact sheet, and it is derived from the count so an editor cannot
 * half-apply it.
 *
 * Frames are portrait (3/4) because that is what the built bands use and
 * what a crowd photograph wants; forcing one shape is also what keeps the
 * row from going ragged when four different assets land in it.
 */
const COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/* Only the three-up staggers — two reads as a pair and four as a grid. */
const STAGGER = ["md:mt-12", "", "md:mt-20"];

export default function MediaBand({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const images = (block.images ?? []).filter((m) => m?.asset);
  const labels = block.mediaLabels ?? [];
  const count = images.length || labels.length;
  if (!count) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[count] ?? "md:grid-cols-2 lg:grid-cols-4";
  const offset = (i: number) => (count === 3 ? STAGGER[i] : "");
  const sizes = "(min-width: 768px) 33vw, 100vw";

  const frames: ReactNode[] = images.length
    ? images.map((img, i) => (
        <BlockImage
          key={img.asset?._ref ?? i}
          image={img}
          ratio="3/4"
          sizes={sizes}
          className={offset(i)}
        />
      ))
    : labels.map((label, i) => (
        <Placeholder
          key={label}
          label={label}
          ratio="3/4"
          className={offset(i)}
        />
      ));

  return (
    <section
      data-signal={signal}
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      {...(block.heading ? { "aria-labelledby": headingId } : {})}
    >
      <div className="mx-auto max-w-7xl">
        {block.eyebrow && (
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> {block.eyebrow}
          </p>
        )}
        {block.heading && (
          <h2 id={headingId} data-split className="font-display text-h2 max-w-4xl">
            {block.heading}
          </h2>
        )}

        <div
          className={`grid gap-4 ${columns} ${
            block.heading || block.eyebrow ? "mt-12" : ""
          }`}
        >
          {frames}
        </div>

        {block.caption && (
          <p className="eyebrow mt-6">{block.caption}</p>
        )}
      </div>
    </section>
  );
}
