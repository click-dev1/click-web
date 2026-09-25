import type { ReactNode } from "react";
import BlockImage from "./BlockImage";
import { deliveredAspectRatio } from "@/lib/sanity/image";
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
 * Shape follows count, like everything else here. A single frame is a
 * banner (21/9) — one image on its own is establishing a scene, which is
 * how /about opens. Two or more are portraits (3/4), which is what the
 * built bands use and what keeps a row from going ragged when several
 * different assets land in it.
 */
const COLUMNS: Record<number, string> = {
  /* Listed explicitly: missing, a lone image fell through to the
     four-column fallback below and rendered a quarter of the width. */
  1: "grid-cols-1",
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
  const ratio = count === 1 ? "21/9" : "3/4";
  const sizes = count === 1 ? "100vw" : "(min-width: 768px) 33vw, 100vw";

  /* A lone "fit" image keeps its own shape instead of being letterboxed
     into the banner — a portrait group shot in a 21/9 frame is mostly
     empty ground. Its width is capped so the height stays within ~80% of
     the viewport, and it centres in the column. */
  const lone =
    count === 1 && images[0]?.display === "fit"
      ? (deliveredAspectRatio(images[0]) ?? null)
      : null;

  const frames: ReactNode[] = images.length
    ? images.map((img, i) => (
        <div
          key={img.asset?._ref ?? i}
          className={lone ? "mx-auto w-full" : "contents"}
          style={lone ? { maxWidth: `calc(80svh * ${lone})` } : undefined}
        >
          <BlockImage
            image={img}
            ratio={lone ? undefined : ratio}
            sizes={lone ? `min(100vw, calc(80vh * ${lone}))` : sizes}
            width={count === 1 ? 2400 : 1200}
            className={offset(i)}
          />
        </div>
      ))
    : labels.map((label, i) => (
        <Placeholder
          key={label}
          label={label}
          ratio={ratio}
          className={offset(i)}
        />
      ));

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
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
