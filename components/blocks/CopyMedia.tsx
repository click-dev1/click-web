import BlockImage from "./BlockImage";
import RichText from "./RichText";
import type { CopyMediaBlock as Block } from "@/lib/sanity/types";

/**
 * Eyebrow, heading, body copy, optional image, optional pull quote.
 *
 * The markup deliberately mirrors the hand-built sections it replaces
 * (see /talent-management "More than management") so a page assembled in
 * the CMS is indistinguishable from one written by hand.
 */
export default function CopyMedia({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const headingId = `s-${block._key}`;
  const hasMedia = Boolean(block.media?.asset);
  const position = block.mediaPosition ?? "right";
  const beside = hasMedia && position !== "below";

  const copy = <RichText value={block.body} />;
  const media = block.media?.asset ? (
    <BlockImage
      image={block.media}
      sizes={beside ? "(max-width: 1024px) 100vw, 40vw" : "100vw"}
    />
  ) : null;

  return (
    <section
      data-signal={signal}
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        {block.eyebrow && (
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> {block.eyebrow}
          </p>
        )}
        <h2
          id={headingId}
          data-split
          className="font-display text-h2 max-w-3xl"
        >
          {block.heading}
        </h2>

        {beside ? (
          <div
            className={`mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] ${
              position === "left" ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {copy}
            {media}
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-10">
            {copy}
            {media}
          </div>
        )}

        {block.insight && (
          <div data-reveal className="insight-frame mt-8 max-w-md">
            <p className="font-display text-h3">{block.insight}</p>
          </div>
        )}
      </div>
    </section>
  );
}
