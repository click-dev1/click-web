import type { JourneySequenceBlock as Block } from "@/lib/sanity/types";

/**
 * One word per stage, arrows between them, the last carrying the weight.
 *
 * An ordered list, because the order is the argument. The arrows are
 * decorative and hidden from assistive tech — the list semantics already
 * say "these come in sequence", and reading "arrow" five times says
 * nothing a screen-reader user needs.
 */
export default function JourneySequence({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const stages = block.stages ?? [];
  if (!stages.length) return null;

  const headingId = `s-${block._key}`;
  const last = stages.length - 1;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
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

        <ol className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-6">
          {stages.map((stage, i) => (
            <li key={stage} data-reveal className="flex items-center gap-4">
              <span
                className={`font-display ${
                  i === last ? "text-h2" : "text-h3 opacity-80"
                }`}
              >
                {stage}
              </span>
              {i < last && (
                <span aria-hidden="true" className="font-data">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
