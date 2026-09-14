import BlockImage from "./BlockImage";
import Placeholder from "@/components/Placeholder";
import type { TeamGridBlock as Block } from "@/lib/sanity/types";

/**
 * The team grid.
 *
 * Mirrors the hand-built grid on /about, including its editorial rule: a
 * real person never gets an invented quote, so a member without a
 * collected perspective line shows that it is still to come rather than
 * filler. The same goes for the portrait — the awaiting-photography frame
 * is the honest state, not a stock headshot.
 */
export default function TeamGrid({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const picked = block.picked?.filter(Boolean) ?? [];
  const people = picked.length ? picked : (block.auto ?? []);
  if (!people.length) return null;

  const headingId = `s-${block._key}`;

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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <article
              key={p._id}
              data-reveal
              className="card-surface overflow-hidden rounded-xl"
            >
              {p.photo?.asset ? (
                <BlockImage
                  image={p.photo}
                  ratio="4/5"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="rounded-none"
                />
              ) : (
                <Placeholder
                  label="Editorial portrait · single commissioned series"
                  ratio="4/5"
                  className="rounded-none border-0"
                />
              )}
              <div className="p-5">
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className="eyebrow mt-1">{p.role}</p>
                {p.perspective ? (
                  <p
                    className="mt-3 text-sm leading-body"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    &ldquo;{p.perspective}&rdquo;
                  </p>
                ) : (
                  <p className="font-data mt-3 text-[0.62rem]">
                    Perspective line · collected in their own voice
                  </p>
                )}
                {p.recognition && (
                  <p className="eyebrow mt-3">◆ {p.recognition}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {block.footnote && (
          <p className="mt-10 text-sm" style={{ color: "var(--ink-muted)" }}>
            {block.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
