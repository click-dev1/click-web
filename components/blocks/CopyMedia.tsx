import type { ReactNode } from "react";
import BlockImage from "./BlockImage";
import RichText from "./RichText";
import InsightFrame from "./InsightFrame";
import CtaLink from "./CtaLink";
import Placeholder from "@/components/Placeholder";
import type { CopyMediaBlock as Block } from "@/lib/sanity/types";

/**
 * Eyebrow, heading, body copy, optional images, optional framed insight.
 *
 * The markup deliberately mirrors the hand-built sections it replaces
 * (see /talent-management "More than management" and
 * /influencer-marketing "Creator expertise") so a page assembled in the
 * CMS is indistinguishable from one written by hand.
 *
 * Two things are derived rather than chosen. The media arranges itself:
 * one frame fills the slot, two or three become the collage — one large
 * frame with the rest in a row beneath. And the insight takes the big
 * pull-quote style on its own, or the smaller stated-finding style once
 * it carries a label, because a finding with provenance should not be set
 * like a slogan.
 *
 * A section with no images but captions on file is waiting on
 * photography, not doing without it, so it renders the empty frames in
 * the arrangement the images will take.
 */
function MediaSlot({ frames }: { frames: ReactNode[] }) {
  if (frames.length === 0) return null;
  if (frames.length === 1) return <>{frames[0]}</>;

  const [lead, ...rest] = frames;
  return (
    <div className="grid gap-4">
      {lead}
      <div className="grid grid-cols-2 gap-4">{rest}</div>
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
  const labels = block.mediaLabels ?? [];
  const position = block.mediaPosition ?? "right";
  const hasMedia = images.length > 0 || labels.length > 0;
  const beside = hasMedia && position !== "below";

  const sizes = beside ? "(max-width: 1024px) 100vw, 40vw" : "100vw";
  const gap = block.heading || block.eyebrow ? "mt-10" : "";

  /* The lead frame keeps its own shape when it stands alone and takes 4/3
     in a collage; the followers are square. Reserving the space either way
     is what keeps CLS inside the SOW §6 threshold. */
  const collage = (images.length || labels.length) > 1;
  const frames: ReactNode[] = images.length
    ? images.map((img, i) => (
        <BlockImage
          key={img.asset?._ref ?? i}
          image={img}
          sizes={sizes}
          {...(collage ? { ratio: i === 0 ? "4/3" : "1/1" } : {})}
        />
      ))
    : labels.map((label, i) => (
        <Placeholder
          key={label}
          label={label}
          ratio={collage && i > 0 ? "1/1" : "4/3"}
        />
      ));

  /* Only wrapped when there is a link to hang off the copy — RichText
     already supplies its own flex container, so nesting a second one
     unconditionally would change every section that has no CTA. */
  const copy = block.cta ? (
    <div className="flex flex-col items-start gap-8">
      <RichText value={block.body} />
      <CtaLink cta={{ ...block.cta, style: block.cta.style ?? "ghost" }} />
    </div>
  ) : (
    <RichText value={block.body} />
  );
  const media = <MediaSlot frames={frames} />;

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
        <h2 id={headingId} data-split className="font-display text-h2 max-w-3xl">
          {block.heading}
        </h2>

        {beside ? (
          /* Images on the left means images FIRST, not copy reordered by
             CSS. Reading order is DOM order, and on a narrow screen the
             stack follows it — so a CSS-only swap would put the copy above
             the pictures on a phone, which is not what the hand-built
             section does. */
          <div
            className={`mt-10 grid gap-10 ${
              position === "left"
                ? "lg:grid-cols-[1fr_1.2fr]"
                : "lg:grid-cols-[1.2fr_1fr]"
            }`}
          >
            {position === "left" ? (
              <>
                {media}
                {copy}
              </>
            ) : (
              <>
                {copy}
                {media}
              </>
            )}
          </div>
        ) : (
          <div className={`${gap} flex flex-col gap-10`}>
            {copy}
            {media}
          </div>
        )}

        <InsightFrame
          text={block.insight}
          label={block.insightLabel}
          items={block.insightItems}
          footnote={block.insightFootnote}
        />
      </div>
    </section>
  );
}
