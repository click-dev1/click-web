import type { RecognitionBlock as Block } from "@/lib/sanity/types";

/**
 * Awards and listings, centred and stacked.
 *
 * Mirrors the recognition section on /about. Not a card grid on purpose:
 * these are claims about the company, and a row of boxes makes them read
 * as features rather than as things other people said.
 */
export default function Recognition({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const entries = block.entries ?? [];
  if (!entries.length) return null;

  return (
    <section
      data-signal={signal}
      {...(block.anchor ? { id: block.anchor } : {})}
      className="hairline-t relative z-10 px-5 py-24 text-center md:px-8"
      aria-label="Recognition"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {block.eyebrow && (
          <p className="eyebrow pill mx-auto">
            <span className="tick">●</span> {block.eyebrow}
          </p>
        )}
        {entries.map((e, idx) => (
          <div key={e._key ?? idx} data-reveal>
            <p className="font-display text-h3">{e.line}</p>
            {e.detail && (
              <p className="eyebrow mt-2">
                <span className="tick">◆</span> {e.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
