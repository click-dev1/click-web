import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Placeholder from "@/components/Placeholder";
import ContactButton from "@/components/contact/ContactButton";
import { people, timeline, offices, officesDisclosure, SHOW_PLACEHOLDERS } from "@/content/site";
import { recognition } from "@/content/manifest";

export const metadata: Metadata = {
  title: "About",
  description:
    "The people behind the intelligence. Founded in 2017 with roots in gaming, CLICK is a global agency at the intersection of creators, culture and brands — part of the GameSquare ecosystem.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="The people behind the intelligence."
        lede="Technology finds the opportunity. These are the people who turn it into partnerships, creative, and culture."
        signal="overlap"
      />

      {/* ---- opening frame: collaboration in motion ---- */}
      <section
        data-signal="quiet"
        className="relative z-10 px-5 pb-10 md:px-8"
        aria-label="Team at work"
      >
        <div className="mx-auto max-w-7xl">
          <Placeholder
            label="Strategy session in motion · commissioned photography"
            ratio="21/9"
          />
        </div>
      </section>

      {/* ---- our story + timeline ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="story-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Our story
          </p>
          <h2 id="story-heading" data-split className="font-display text-h2 max-w-4xl">
            Founded in 2017 with roots in gaming.
          </h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-5 text-lg leading-body">
              <p>
                CLICK has grown into a global agency operating at the
                intersection of creators, culture, and brands — spanning
                influencer marketing, experiential, and talent management.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Today, as part of the GameSquare ecosystem, CLICK combines
                enterprise audience intelligence with the human expertise and
                creator relationships that technology alone can&apos;t
                replicate. The belief that started the company hasn&apos;t
                changed: the strongest partnerships begin with understanding
                people.
              </p>
            </div>
            <ol className="flex flex-col gap-5 md:border-l md:pl-10 [border-color:var(--hairline)]">
              {timeline.map((m, idx) => (
                <li key={idx} data-reveal className="flex items-baseline gap-4">
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

      {/* ---- leadership & team ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="team-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Leadership &amp; team
          </p>
          <h2 id="team-heading" data-split className="font-display text-h2 max-w-3xl">
            Meet the team.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p) => (
              <article key={`${p.name}-${p.role}`} data-reveal className="card-surface overflow-hidden rounded-xl">
                {p.photo ? (
                  <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={p.photo}
                      alt={`${p.name} — ${p.role}, CLICK`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
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
                    <p className="mt-3 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
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
          {SHOW_PLACEHOLDERS && (
            <p className="mt-8 text-sm" style={{ color: "var(--ink-muted)" }}>
              Team roles beyond leadership are illustrative placeholders. Real
              people carry no invented quotes — perspective lines are collected
              from the team in their own voices before launch.
            </p>
          )}
        </div>
      </section>

      {/* ---- recognition ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 text-center md:px-8"
        aria-label="Recognition"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <div data-reveal>
            <p className="font-display text-h3">{recognition.line}</p>
            <p className="eyebrow mt-2">
              <span className="tick">◆</span> {recognition.years}
            </p>
          </div>
          <div data-reveal>
            <p className="font-display text-h3">Cannes Lions Silver</p>
            <p className="eyebrow mt-2">
              <span className="tick">◆</span> Maybelline — Eyes Up
            </p>
          </div>
          <div data-reveal>
            <p className="font-display text-h3">
              Business Insider Top Talent Managers
            </p>
            <p className="eyebrow mt-2">
              <span className="tick">◆</span> Recognized consistently
            </p>
          </div>
        </div>
      </section>

      {/* ---- part of GameSquare (brief) ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="gsq-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Part of GameSquare
            </p>
            <h2 id="gsq-heading" data-split className="font-display text-h2">
              A network no standalone agency can match.
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-lg leading-body">
            <p style={{ color: "var(--ink-muted)" }}>
              CLICK operates within the GameSquare ecosystem — a network
              spanning creator technology, gaming and esports, media, and
              experiential production.
            </p>
            <p style={{ color: "var(--ink-muted)" }}>
              For brands, that means partnerships backed by enterprise
              technology and reach. For creators, it means opportunities that
              extend across gaming, entertainment, and global commercial
              partnerships.
            </p>
            <Link href="/#ecosystem" className="btn-ghost self-start">
              Explore the Ecosystem <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- a global team ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="global-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> A global team
          </p>
          <h2 id="global-heading" data-split className="font-display text-h2 max-w-3xl">
            Every major market.
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Placeholder
              label="World map · office locations"
              ratio="16/9"
            />
            <div className="flex flex-col gap-4">
              {offices.map((o) => (
                <div key={o.city} data-reveal className="card-surface rounded-xl p-5">
                  <p className="font-display text-2xl">{o.city}</p>
                  <p className="eyebrow mt-1">{o.region}</p>
                </div>
              ))}
              <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {officesDisclosure}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- final CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="about-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="about-cta-heading" data-split className="font-display text-h2">
            Now you know who we are. Tell us what you&apos;re building.
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
            Whether you&apos;re a brand, a creator, or a future partner, every
            CLICK relationship starts the same way — with a conversation.
          </p>
          <div data-reveal className="mt-9">
            <ContactButton className="btn-primary">
              Start the Conversation <span className="btn-arrow">→</span>
            </ContactButton>
          </div>
        </div>
      </section>
    </>
  );
}
