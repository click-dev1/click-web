import BlockImage from "./BlockImage";
import RichText from "./RichText";
import InsightFrame from "./InsightFrame";
import Placeholder from "@/components/Placeholder";
import type { CopyMediaBlock as Block, SanityImage } from "@/lib/sanity/types";

/**
 * Eyebrow, heading, body copy, optional images, optional framed insight.
 *
 * The markup deliberately mirrors the hand-built sections it replaces
 * (see /talent-management "More than management" and
 * /influencer-marketing "Creator expertise") so a page assembled in the
 * CMS is indistinguishable from one written by hand.
 *
 * Two things are derived rather than chosen. The images arrange
 * themselves: one fills the slot, two or three become the collage — one
 * large frame with the rest in a row beneath. And the insight takes the
 * big pull-quote style on its own, or the smaller stated-finding style
 * once it carries a label, because a finding with provenance should not
 * be set like a slogan.
 */
function Collage({
  images,
  sizes,
}: {
  images: SanityImage[];
  sizes: string;
}) {
  const [lead, ...rest] = images;
  return (
    <div className="grid gap-4">
      <BlockImage image={lead} ratio="4/3" sizes={sizes} />
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {rest.map((img, i) => (
            <BlockImage
              key={img.asset?._ref ?? i}
              image={img}
              ratio="1/1"
              sizes={sizes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CopyMedia({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const headingId = `s-${block._key}`;
  const images = (block.media ?? []).filter((m) => m?.asset);
  const position = block.mediaPosition ?? "right";
  const hasMedia = images.length > 0 || Boolean(block.mediaLabel);
  const beside = hasMedia && position !== "below";

  const copy = <RichText value={block.body} />;
  const sizes = beside
    ? "(max-width: 1024px) 100vw, 40vw"
    : "100vw";
  /* No images yet but a caption on file means the section is waiting on
     photography, not doing without it — so it renders the empty frame the
     hand-built pages use rather than silently collapsing. */
  const media = images.length ? (
    images.length === 1 ? (
      <BlockImage image={images[0]} sizes={sizes} />
    ) : (
      <Collage images={images} sizes={sizes} />
    )
  ) : block.mediaLabel ? (
    <Placeholder label={block.mediaLabel} ratio="4/3" />
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

        <InsightFrame
          text={block.insight}
          label={block.insightLabel}
          footnote={block.insightFootnote}
        />
      </div>
    </section>
  );
}
