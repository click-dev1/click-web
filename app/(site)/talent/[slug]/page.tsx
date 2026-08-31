import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import TalentMedia from "@/components/TalentMedia";
import ContactButton from "@/components/contact/ContactButton";
import { fetchRoster, fetchTalent, fetchTalentSlugs } from "@/lib/sanity/talent";
import { platformNames } from "@/lib/sanity/types";

export async function generateStaticParams() {
  const slugs = await fetchTalentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await fetchTalent(slug);
  if (!t) return { title: "Talent" };
  return {
    title: t.seo?.title ?? `${t.name} — CLICK Talent`,
    description: t.seo?.description ?? t.bio,
    alternates: { canonical: `/talent/${t.slug}` },
    robots: t.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

/* Media kit + storytelling platform + talent case study, in one template. */
export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await fetchTalent(slug);
  if (!t) notFound();

  const others = (await fetchRoster()).filter((r) => r.slug !== t.slug).slice(0, 3);

  return (
    <>
      {/* ---- hero ---- */}
      <section
        data-signal="overlap"
        className="relative z-10 px-5 pt-36 pb-16 md:px-8"
        aria-labelledby="profile-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill anim-fade-up mb-6">
            <Link href="/talent" className="transition-opacity hover:opacity-70">
              Talent Directory
            </Link>{" "}
            <span className="tick">/</span> {t.category}
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h1 id="profile-heading" data-split className="font-display text-hero">
                {t.name}
              </h1>
              {t.managed && (
                <p className="eyebrow anim-fade-up mt-4">
                  ◆ CLICK Talent · Managed representation
                </p>
              )}
              <p
                className="anim-fade-up mt-6 max-w-xl text-lg leading-body"
                style={{ color: "var(--ink-muted)", animationDelay: "0.25s" }}
              >
                {t.bio}
              </p>
              <div
                className="anim-fade-up mt-8 flex flex-wrap gap-4"
                style={{ animationDelay: "0.4s" }}
              >
                <ContactButton className="btn-primary">
                  Contact for Partnerships <span className="btn-arrow">→</span>
                </ContactButton>
              </div>
            </div>
            <TalentMedia
              talent={t}
              label={`${t.name} · hero video`}
              ratio="4/5"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="anim-fade-up rounded-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* ---- audience overview ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="audience-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="audience-heading" className="visually-hidden">
            Audience overview
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div data-reveal className="card-surface rounded-xl p-6">
              <p className="eyebrow mb-2">Audience</p>
              <span className="tnum text-metric block">{t.audience}</span>
              <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                across platforms
              </span>
            </div>
            <div data-reveal className="card-surface rounded-xl p-6">
              <p className="eyebrow mb-2">Platforms</p>
              <p className="font-display text-2xl">{platformNames(t).join(" · ")}</p>
            </div>
            <div data-reveal className="card-surface rounded-xl p-6">
              <p className="eyebrow mb-2">Base</p>
              <p className="font-display text-2xl">{t.location}</p>
            </div>
            <div data-reveal className="card-surface rounded-xl p-6">
              <p className="eyebrow mb-2">Demographics</p>
              <p className="text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                Audience demographic snapshot — shared in partnership
                conversations with full context.
              </p>
            </div>
          </div>
          <p className="eyebrow mt-6">
            Audience figures pending confirmation · as-of date shown in production
          </p>
        </div>
      </section>

      {/* ---- partnerships & ventures ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="ventures-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Brand partnerships
            </p>
            <h2 id="ventures-heading" data-split className="font-display text-h3">
              Partners who came for the audience and stayed for the work.
            </h2>
            {t.partners.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {t.partners.map((p) => (
                  <span key={p} className="font-display text-2xl opacity-80">
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm" style={{ color: "var(--ink-muted)" }}>
                Partnership roster shared on request.
              </p>
            )}
          </div>
          <div>
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Business ventures
            </p>
            {t.ventures.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {t.ventures.map((v) => (
                  <li key={v} data-reveal className="card-surface rounded-xl p-5">
                    <p className="font-display text-xl">{v}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
                Ventures in development.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---- success story (the talent case study) ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="story-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Success story
          </p>
          <h2 id="story-heading" data-split className="font-display text-h2 max-w-3xl">
            Building with CLICK.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.story.map((s, i) => (
              <article key={s.label} data-reveal className="card-surface rounded-xl p-6">
                <p className="eyebrow mb-3">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {s.label}
                </p>
                <p className="leading-body">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- media gallery ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-label="Media gallery"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-6">
            <span className="tick">●</span> Recent content &amp; media
          </p>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Placeholder label="Featured content" ratio="9/16" />
            <Placeholder label="Featured content" ratio="9/16" className="lg:mt-8" />
            <Placeholder label="Campaign still" ratio="9/16" />
            <Placeholder label="Behind the scenes" ratio="9/16" className="lg:mt-8" />
          </div>
        </div>
      </section>

      {/* ---- more talent + CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="more-talent-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="more-talent-heading" data-split className="font-display text-h3">
              More from the directory.
            </h2>
            <Link href="/talent" className="btn-ghost">
              All Talent <span className="btn-arrow">→</span>
            </Link>
          </div>
          {others.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/talent/${o.slug}`}
                  data-reveal
                  className="card-surface group block overflow-hidden rounded-xl"
                >
                  <TalentMedia
                    talent={o}
                    label={`${o.name} · portrait`}
                    ratio="4/3"
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="rounded-none border-0"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-xl">{o.name}</h3>
                    <p className="eyebrow mt-1">{o.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
