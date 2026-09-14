import type { SplitCopyBlock as Block } from "@/lib/sanity/types";

/**
 * Two short arguments side by side — the "business partners / the CLICK
 * advantage" pair on /talent-management.
 *
 * Each column carries its own eyebrow and heading, set as prose rather
 * than in cards: they are two halves of one point, and bordered boxes
 * would make them read as a feature list.
 *
 * Only the first column's heading gets the section's id — the second is
 * a sibling heading at the same level, exactly as in the hand-built
 * markup.
 */
export default function SplitCopy({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const columns = block.columns ?? [];
  if (columns.length !== 2) return null;

  const headingId = `s-${block._key}`;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {columns.map((c, i) => (
            <div key={c._key ?? i}>
              {c.eyebrow && (
                <p className="eyebrow pill mb-4">
                  <span className="tick">●</span> {c.eyebrow}
                </p>
              )}
              <h2
                {...(i === 0 ? { id: headingId } : {})}
                data-split
                className="font-display text-h3"
              >
                {c.heading}
              </h2>
              <p
                className="mt-5 text-lg leading-body"
                style={{ color: "var(--ink-muted)" }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
