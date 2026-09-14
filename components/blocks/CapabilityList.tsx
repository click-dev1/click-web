import type { CapabilityListBlock as Block } from "@/lib/sanity/types";

/**
 * Grouped capability chips — the "every stage of the lifecycle" section.
 *
 * The chips are plain list items. `.chip` also has an
 * `[aria-pressed="true"]` state in globals.css, but that belongs to the
 * interactive filters in the directory explorer; these are static, so
 * they carry no ARIA state at all.
 */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/* Three groups get room to breathe and carry the larger heading; past
   that the cards get narrower and the label has to come down with them.
   Derived, like everything else — the editor adds a group, not a size. */
const headingScale = (n: number) =>
  n <= 3 ? "font-display text-h3 mb-5" : "font-display text-2xl mb-4";

export default function CapabilityList({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const groups = block.groups ?? [];
  if (!groups.length) return null;

  const headingId = `s-${block._key}`;
  const columns =
    COLUMNS[groups.length] ?? "sm:grid-cols-2 lg:grid-cols-3";

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

        <div className={`mt-12 grid gap-6 ${columns}`}>
          {groups.map((group) => (
            <article
              key={group._key ?? group.label}
              data-reveal
              className="card-surface rounded-xl p-7"
            >
              <h3 className={headingScale(groups.length)}>{group.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {(group.items ?? []).map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
