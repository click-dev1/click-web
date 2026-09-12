import type { MetricRowBlock as Block } from "@/lib/sanity/types";

/**
 * A row of measured figures.
 *
 * Mirrors the results strip on a case study (see /work/[slug] "What it
 * delivered"). The column count is derived from how many figures there
 * are, so the row never ends ragged — an editor controls the figures,
 * not the grid.
 *
 * The heading is optional. A section with no heading gets no
 * `aria-labelledby`: an unnamed <section> is a plain container rather
 * than an unlabelled landmark, which is the correct outcome when the row
 * is a continuation of the section above it.
 */
const COLUMNS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function MetricRow({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const metrics = block.metrics ?? [];
  if (!metrics.length) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[metrics.length] ?? "sm:grid-cols-2 lg:grid-cols-4";

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

        <div className={`grid gap-6 ${columns} ${block.heading || block.eyebrow ? "mt-10" : ""}`}>
          {metrics.map((m) => (
            <div
              key={m._key ?? m.label}
              data-reveal
              className="card-surface rounded-xl p-7"
            >
              <span className="tnum text-metric block">{m.value}</span>
              <span
                className="mt-1 block text-sm"
                style={{ color: "var(--ink-muted)" }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {block.footnote && (
          <p className="mt-8 text-sm" style={{ color: "var(--ink-muted)" }}>
            {block.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
