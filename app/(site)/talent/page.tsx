import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import DirectoryExplorer from "@/components/DirectoryExplorer";
import TalentMedia from "@/components/TalentMedia";
import ContactButton from "@/components/contact/ContactButton";
import { fetchRoster } from "@/lib/sanity/talent";
import { platformNames } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Talent Directory",
  description:
    "Meet the creators shaping what's next. From gaming and sports to lifestyle, comedy and entertainment, CLICK represents creators building communities, influencing culture, and creating lasting businesses.",
  alternates: { canonical: "/talent" },
};

const MATCH_STEPS = [
  "Brand Objective",
  "Audience Alignment",
  "Creator Match",
  "Creative Collaboration",
  "Business Results",
];

export default async function TalentDirectoryPage() {
  const roster = await fetchRoster();
  /* Featured talent reads US first — the roster CLICK is scaling into the
     market — then a smaller Australian selection. Grouping by region is
     the emphasis: the order alone would not say which market leads. */
  const featured = roster.filter((t) => t.featured);
  const groups = [
    { region: "United States", label: "United States" },
    { region: "Australia", label: "Australia" },
  ]
    .map((g) => ({ ...g, talent: featured.filter((t) => t.region === g.region) }))
    .filter((g) => g.talent.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Talent · Directory"
        title="Meet the creators shaping what's next."
        lede="From gaming and sports to lifestyle, comedy, and entertainment, CLICK represents creators who are building communities, influencing culture, and creating lasting businesses."
        ctas={[
          { href: "#directory", label: "Find Talent", primary: true },
          { href: "/contact#creator-network", label: "Join CLICK Talent" },
        ]}
        signal="overlap"
      />

      {/* ---- the directory (search + filters) ---- */}
      <DirectoryExplorer roster={roster} />

      {/* ---- Featured Talent ---- */}
      {groups.length > 0 && (
        <section
          data-signal="divide"
          className="hairline-t relative z-10 px-5 py-24 md:px-8"
          aria-labelledby="featured-heading"
        >
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Featured talent
            </p>
            <h2 id="featured-heading" data-split className="font-display text-h2 max-w-3xl">
              Flagship creators, up close.
            </h2>

            {groups.map((g, i) => (
              <div key={g.region} className={i === 0 ? "mt-12" : "mt-16"}>
                <p className="eyebrow hairline-t pt-4">
                  <span className="tick" aria-hidden="true">
                    ◉
                  </span>{" "}
                  {g.label} · {g.talent.length} creators
                </p>
                <div className="mt-6 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {g.talent.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/talent/${t.slug}`}
                      data-reveal
                      className="card-surface group block overflow-hidden rounded-xl"
                    >
                      <TalentMedia
                        talent={t}
                        label={`${t.name} · portrait`}
                        ratio="4/5"
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                        className="rounded-none border-0"
                      />
                      <div className="p-4">
                        <h3 className="font-display text-xl">{t.name}</h3>
                        <p className="eyebrow mt-1.5">
                          {t.category} · {t.audience}
                        </p>
                        {/* the lead market carries a little more of the
                            story; the Australian row stays compact */}
                        {i === 0 && (
                          <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                            {platformNames(t).join(" · ")}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- Built for Better Partnerships ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="match-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Built for better partnerships
          </p>
          <h2 id="match-heading" data-split className="font-display text-h2 max-w-3xl">
            Finding the right creator is about more than audience size.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
            Every creator in the CLICK ecosystem is evaluated through audience
            intelligence, content quality, brand alignment, and long-term
            partnership potential.
          </p>
          <ol className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-4">
            {MATCH_STEPS.map((step, i) => (
              <li key={step} data-reveal className="flex items-center gap-4">
                <span
                  className={`font-data text-sm ${i === MATCH_STEPS.length - 1 ? "font-bold" : ""}`}
                >
                  {step}
                </span>
                {i < MATCH_STEPS.length - 1 && <span aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Join the CLICK Community ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="join-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="join-heading" data-split className="font-display text-h2 max-w-3xl">
            Join the CLICK community.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ContactButton className="card-surface group block rounded-xl p-8 text-left">
              <h3 className="font-display text-h3">I&apos;m a Brand</h3>
              <p className="mt-3 leading-body" style={{ color: "var(--ink-muted)" }}>
                Connect with our partnerships team to discover creators aligned
                with your audience and business objectives.
              </p>
              <span className="btn-ghost mt-6 inline-flex group-hover:border-[var(--signal)]">
                Talk With Our Team <span className="btn-arrow">→</span>
              </span>
            </ContactButton>
            <Link
              href="/contact#creator-network"
              data-reveal
              className="card-surface group block rounded-xl p-8"
            >
              <h3 className="font-display text-h3 display-outline">
                I&apos;m a Creator
              </h3>
              <p className="mt-3 leading-body" style={{ color: "var(--ink-muted)" }}>
                Learn about representation with CLICK Talent, or join the
                Creator Network to get on our radar — no commitment, no
                exclusivity.
              </p>
              <span className="btn-ghost mt-6 inline-flex group-hover:border-[var(--signal)]">
                Join the Creator Network <span className="btn-arrow">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
