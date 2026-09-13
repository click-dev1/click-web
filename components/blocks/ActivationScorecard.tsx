import BlockImage from "./BlockImage";
import RichText from "./RichText";
import Placeholder from "@/components/Placeholder";
import type { ActivationScorecardBlock as Block } from "@/lib/sanity/types";

/**
 * Copy on the left, a framed scorecard on the right.
 *
 * A signature block: the layout is fixed and only the copy, the source
 * and the figures are editable. Mirrors the Optus scorecard on
 * /influencer-marketing and the activation scorecard on /experiential —
 * same frame, same figure treatment, same provenance line.
 */
const COLUMNS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2",
};

export default function ActivationScorecard({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const metrics = block.metrics ?? [];
  if (!metrics.length) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[metrics.length] ?? "sm:grid-cols-3";

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

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          {block.body ? <RichText value={block.body} /> : <div />}

          <div data-reveal className="card-surface rounded-xl p-7 md:p-9">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">
                <span className="tick">◉</span> {block.label}
              </p>
              <p className="font-data text-[0.62rem]">{block.source}</p>
            </div>

            <div className={`grid grid-cols-1 gap-6 ${columns}`}>
              {metrics.map((m) => (
                <div key={m._key ?? m.label}>
                  <span className="tnum text-metric block">{m.value}</span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {(block.media?.asset || block.mediaLabel) && (
              <div className="mt-8">
                {block.media?.asset ? (
                  <BlockImage
                    image={block.media}
                    ratio="21/9"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                ) : (
                  <Placeholder label={block.mediaLabel!} ratio="21/9" />
                )}
              </div>
            )}

            {block.footnote && (
              <p className="eyebrow mt-5">{block.footnote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
