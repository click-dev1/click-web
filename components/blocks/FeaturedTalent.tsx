import Link from "next/link";
import CtaLink from "./CtaLink";
import TalentMedia from "@/components/TalentMedia";
import type { FeaturedTalentBlock as Block } from "@/lib/sanity/types";

/**
 * A row of creators. Same contract as FeaturedWork: chosen picks win,
 * otherwise the featured creators fill the row automatically.
 *
 * Mirrors the spotlight cards on /talent-management, including the
 * portrait fallback — TalentMedia renders the design placeholder when a
 * creator has no photography on file, which most of the roster currently
 * doesn't.
 */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeaturedTalent({
  block,
  signal,
}: {
  block: Block;
  signal: string;
}) {
  const picked = block.picked?.filter(Boolean) ?? [];
  const items = picked.length
    ? picked
    : (block.auto ?? []).slice(0, block.limit ?? 4);
  if (!items.length) return null;

  const headingId = `s-${block._key}`;
  const columns = COLUMNS[items.length] ?? "sm:grid-cols-2 lg:grid-cols-4";

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
          {items.map((t) => (
            <Link
              key={t._id}
              href={`/talent/${t.slug}`}
              data-reveal
              className="card-surface group block overflow-hidden rounded-xl"
            >
              <TalentMedia
                talent={t}
                label={`${t.name} · portrait`}
                ratio="3/4"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="rounded-none border-0"
              />
              <div className="p-5">
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="eyebrow mt-1.5">
                  {t.category} · {t.audience}
                </p>
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
