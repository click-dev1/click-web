import BlockImage from "./BlockImage";
import CtaLink from "./CtaLink";
import InsightFrame from "./InsightFrame";
import type { CardGridBlock as Block, Card } from "@/lib/sanity/types";

/**
 * A grid of short cards — the technology stack on /influencer-marketing.
 *
 * Columns are derived from the card count so the last row is never
 * ragged, and the 01/02/03 marks come from position rather than from an
 * editor typing them, so reordering the cards renumbers them.
 *
 * A card's link is a button inside the card, not the whole card wrapped
 * in an anchor: a card can also carry a link in its body one day, and
 * nesting interactive elements is the usual way that breaks.
 */
const COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  8: "md:grid-cols-2 lg:grid-cols-4",
};

/* Cards in a grid share a slot shape, whatever the editor uploaded. */
const CARD_RATIO = "4/3";

function CardBody({
  card,
  index,
  numbered,
}: {
  card: Card;
  index: number;
  numbered: boolean;
}) {
  const tick = numbered ? String(index + 1).padStart(2, "0") : "▸";
  return (
    <>
      {(card.eyebrow || numbered) && (
        <p className="eyebrow mb-3">
          <span className="tick">{tick}</span>
          {card.eyebrow ? ` ${card.eyebrow}` : ""}
        </p>
      )}
      <h3 className="font-display text-2xl">{card.title}</h3>
      {card.body && (
        <p
          className="mt-3 text-sm leading-body"
          style={{ color: "var(--ink-muted)" }}
        >
          {card.body}
        </p>
      )}
      {card.cta && (
        <div className="mt-6">
          <CtaLink cta={{ ...card.cta, style: card.cta.style ?? "ghost" }} />
        </div>
      )}
    </>
  );
}

export default function CardGrid({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const cards = block.cards ?? [];
  if (!cards.length) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[cards.length] ?? "md:grid-cols-2 lg:grid-cols-3";
  const numbered = Boolean(block.numbered);
  const sizes =
    "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw";

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
          <h2 id={headingId} data-split className="font-display text-h2 max-w-3xl">
            {block.heading}
          </h2>
        )}

        <div
          className={`grid gap-6 ${columns} ${
            block.heading || block.eyebrow ? "mt-12" : ""
          }`}
        >
          {cards.map((card, i) =>
            card.image?.asset ? (
              <article
                key={card._key ?? card.title}
                data-reveal
                className="card-surface overflow-hidden rounded-xl"
              >
                <BlockImage
                  image={card.image}
                  sizes={sizes}
                  ratio={CARD_RATIO}
                  className="rounded-none"
                />
                <div className="p-6">
                  <CardBody card={card} index={i} numbered={numbered} />
                </div>
              </article>
            ) : (
              <article
                key={card._key ?? card.title}
                data-reveal
                className="card-surface rounded-xl p-6"
              >
                <CardBody card={card} index={i} numbered={numbered} />
              </article>
            ),
          )}
        </div>

        <InsightFrame
          text={block.insight}
          label={block.insightLabel}
          footnote={block.insightFootnote}
        />

        {block.cta && (
          <div className="mt-10">
            <CtaLink cta={{ ...block.cta, style: block.cta.style ?? "ghost" }} />
          </div>
        )}
      </div>
    </section>
  );
}
