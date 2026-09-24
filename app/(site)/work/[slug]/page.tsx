import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import BlockImage from "@/components/blocks/BlockImage";
import AttributionBadge, {
  GAMESQUARE_CREDIT,
} from "@/components/work/AttributionBadge";
import ContactButton from "@/components/contact/ContactButton";
import { fetchCaseStudies, fetchCaseStudySlugs } from "@/lib/sanity/caseStudy";
import { figuresDisclosure } from "@/lib/sanity/disclosure";

export async function generateStaticParams() {
  const slugs = await fetchCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaigns = await fetchCaseStudies();
  const c = campaigns.find((x) => x.slug === slug);
  if (!c) return { title: "Case Study" };
  return {
    title: c.seo?.title ?? `${c.brand} — ${c.title}`,
    description: c.seo?.description ?? c.insight,
    alternates: { canonical: `/work/${c.slug}` },
    ...(c.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/* Three-beat case study: found → built → delivered. */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  /* The whole list, not just this one: the "next campaign" link at the
     foot needs its neighbour, and the list read is already cached. */
  const campaigns = await fetchCaseStudies();
  const c = campaigns.find((x) => x.slug === slug);
  if (!c) notFound();

  const i = campaigns.findIndex((x) => x.slug === slug);
  const next = campaigns[(i + 1) % campaigns.length];

  return (
    <>
      {/* ---- hero ---- */}
      <section
        data-signal="overlap"
        className="relative z-10 px-5 pt-36 pb-14 md:px-8"
        aria-labelledby="case-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill anim-fade-up mb-6">
            <Link href="/work" className="transition-opacity hover:opacity-70">
              Work
            </Link>{" "}
            <span className="tick">/</span> {c.engagementType ?? c.service} ·{" "}
            {c.industry}
          </p>
          <p className="font-display anim-fade-up text-h3" style={{ color: "var(--ink-muted)" }}>
            {c.brand}
          </p>
          <h1 id="case-heading" data-split className="font-display text-hero max-w-5xl">
            {c.title}
          </h1>
          <div
            className="anim-fade-up mt-6 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <AttributionBadge attribution={c.attribution} />
            <p className="eyebrow">{c.platforms.join(" · ")}</p>
          </div>
          {c.attribution === "gamesquare" && (
            <p className="anim-fade-up mt-4 max-w-2xl text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
              {GAMESQUARE_CREDIT}
            </p>
          )}
        </div>
      </section>

      {/* ---- beat 1: the insight, before everything ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="found-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">01</span> What the intelligence found
          </p>
          <p id="found-heading" data-split className="font-display text-h2 max-w-4xl">
            {c.insight}
          </p>
        </div>
      </section>

      {/* ---- beat 2: what we built ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="built-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">02</span> What we built
          </p>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <p
              id="built-heading"
              data-reveal
              className="max-w-xl text-lg leading-body"
            >
              {c.built}
            </p>
            {c.media?.asset ? (
              <BlockImage
                image={c.media}
                ratio="4/3"
                width={2000}
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            ) : (
              <Placeholder
                label={c.mediaLabel ?? "Campaign film · client-supplied"}
                ratio="4/3"
              />
            )}
          </div>

          {/* The rest of the campaign imagery, each at its own shape — a
              masonry wall, so phone-shot portraits and wide key art sit
              together without either being cropped. */}
          {c.gallery.length > 0 && (
            <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {c.gallery.map((img, n) => (
                <div
                  key={img.asset?._ref ?? n}
                  data-reveal
                  className="mb-4 break-inside-avoid"
                >
                  <BlockImage
                    image={img}
                    width={1200}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- beat 3: what it delivered ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="delivered-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">03</span> What it delivered
          </p>
          <h2 id="delivered-heading" className="visually-hidden">
            Results
          </h2>
          {c.resultsIntro && (
            <p data-reveal className="mt-4 max-w-2xl text-lg leading-body">
              {c.resultsIntro}
            </p>
          )}
          {c.metrics.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {c.metrics.map((m) => (
                <div key={m._key ?? m.label} data-reveal className="card-surface rounded-xl p-7">
                  <span className="tnum text-metric block">{m.value}</span>
                  <span className="mt-1 block text-sm" style={{ color: "var(--ink-muted)" }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div data-reveal className="insight-frame mt-6 max-w-md">
              <p className="font-display text-h3">{c.proofLine}</p>
            </div>
          )}
          <p className="mt-8 text-sm" style={{ color: "var(--ink-muted)" }}>
            {figuresDisclosure(c.figuresSource)}
          </p>

          {c.quote?.text && (
            <figure data-reveal className="insight-frame mt-14 max-w-3xl">
              <blockquote className="font-display text-h3 leading-snug">
                “{c.quote.text}”
              </blockquote>
              {(c.quote.name || c.quote.role) && (
                <figcaption className="mt-6 flex items-center gap-4">
                  {c.quote.photo?.asset && (
                    <div className="w-14 shrink-0 overflow-hidden rounded-full">
                      <BlockImage
                        image={c.quote.photo}
                        ratio="1/1"
                        width={240}
                        sizes="56px"
                      />
                    </div>
                  )}
                  <span>
                    {c.quote.name && (
                      <span className="eyebrow block">{c.quote.name}</span>
                    )}
                    {c.quote.role && (
                      <span className="block text-sm" style={{ color: "var(--ink-muted)" }}>
                        {c.quote.role}
                      </span>
                    )}
                  </span>
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      {/* ---- next case ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-label="Next case study"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow pill mb-3">
              <span className="tick">▸</span> Next campaign
            </p>
            <Link href={`/work/${next.slug}`} className="group block">
              <h2 className="font-display text-h2 transition-opacity group-hover:opacity-70">
                {next.brand} — {next.title}
              </h2>
            </Link>
          </div>
          <ContactButton className="btn-primary">
            Start the Conversation <span className="btn-arrow">→</span>
          </ContactButton>
        </div>
      </section>
    </>
  );
}
