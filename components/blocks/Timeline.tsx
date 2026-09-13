import RichText from "./RichText";
import type { TimelineBlock as Block } from "@/lib/sanity/types";

/**
 * Copy on the left, a dated list on the right — the "our story" section
 * on /about. A signature block: the arrangement is fixed, the copy and
 * the milestones are editable.
 *
 * The list is an <ol> because the order carries meaning; the years are
 * whatever the editor typed, including a dash for a beat with no firm
 * date, which is how the built timeline reads.
 */
export default function Timeline({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const entries = block.entries ?? [];
  if (!entries.length) return null;

  const headingId = `s-${block._key}`;

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
        <h2 id={headingId} data-split className="font-display text-h2 max-w-4xl">
          {block.heading}
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {block.body ? <RichText value={block.body} /> : <div />}
          <ol className="flex flex-col gap-5 md:border-l md:pl-10 [border-color:var(--hairline)]">
            {entries.map((m, idx) => (
              <li
                key={m._key ?? idx}
                data-reveal
                className="flex items-baseline gap-4"
              >
                <span className="font-data tnum w-16 shrink-0 text-sm">
                  {m.year}
                </span>
                <span className="text-sm leading-body">{m.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
