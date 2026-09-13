import Link from "next/link";
import BlockImage from "./BlockImage";
import CtaLink from "./CtaLink";
import Placeholder from "@/components/Placeholder";
import type { FeaturedWorkBlock as Block } from "@/lib/sanity/types";

/**
 * A row of case studies — the "proof in practice" section.
 *
 * Chosen picks win; with none, the featured case studies fill the row
 * automatically, so a service page keeps showing current work without
 * anyone remembering to edit it. The limit applies only to the automatic
 * list: an editor who names four case studies meant four.
 *
 * Mirrors the hand-built cards on /influencer-marketing.
 */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export default function FeaturedWork({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const picked = block.picked?.filter(Boolean) ?? [];
  const items = picked.length
    ? picked
    : (block.auto ?? []).slice(0, block.limit ?? 3);
  if (!items.length) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[items.length] ?? "md:grid-cols-2 lg:grid-cols-3";

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
        <h2 id={headingId} data-split className="font-display text-h2 max-w-3xl">
          {block.heading}
        </h2>

        <div className={`mt-12 grid gap-6 ${columns}`}>
          {items.map((c) => (
            <Link
              key={c._id}
              href={`/work/${c.slug}`}
              data-reveal
              className="card-surface group block overflow-hidden rounded-xl"
            >
              {c.media?.asset ? (
                <BlockImage
                  image={c.media}
                  ratio="16/9"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="rounded-none"
                />
              ) : (
                <Placeholder
                  label={c.mediaLabel ?? "Campaign film · client-supplied"}
                  ratio="16/9"
                  className="rounded-none border-0"
                />
              )}
              <div className="p-6">
                <p className="eyebrow mb-2">
                  <span className="tick">▸</span> {c.brand}
                </p>
                <h3 className="font-display text-h3">{c.title}</h3>
                <p
                  className="mt-3 text-sm leading-body"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {c.insight}
                </p>
                <span className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                  View Case Study <span className="btn-arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {block.cta && (
          <div className="mt-10">
            <CtaLink cta={{ ...block.cta, style: block.cta.style ?? "ghost" }} />
          </div>
        )}
      </div>
    </section>
  );
}
