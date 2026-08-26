import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import ContactButton from "@/components/contact/ContactButton";
import { campaigns } from "@/content/site";

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = campaigns.find((x) => x.slug === slug);
  if (!c) return { title: "Case Study" };
  return {
    title: `${c.brand} — ${c.title}`,
    description: c.insight,
    alternates: { canonical: `/work/${c.slug}` },
  };
}

/* Three-beat case study: found → built → delivered. */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
            <span className="tick">/</span> {c.service} · {c.industry}
          </p>
          <p className="font-display anim-fade-up text-h3" style={{ color: "var(--ink-muted)" }}>
            {c.brand}
          </p>
          <h1 id="case-heading" data-split className="font-display text-hero max-w-5xl">
            {c.title}
          </h1>
          <p className="eyebrow anim-fade-up mt-6" style={{ animationDelay: "0.3s" }}>
            {c.platforms.join(" · ")}
          </p>
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
            <div className="grid gap-4">
              <Placeholder label={c.mediaLabel} ratio="16/9" />
              <div className="grid grid-cols-2 gap-4">
                <Placeholder label="Creator content" ratio="4/3" />
                <Placeholder label="Behind the scenes" ratio="4/3" />
              </div>
            </div>
          </div>
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
                <div key={m.label} data-reveal className="card-surface rounded-xl p-7">
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
            {c.status === "client-confirmed"
              ? "Figures as confirmed by CLICK."
              : c.status === "verified-public"
                ? "Figures as published on clickmedia.group. Insight line is an editorial interpretation pending client confirmation."
                : "Campaign details pending client confirmation."}
          </p>
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
