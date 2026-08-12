import Link from "next/link";
import ContactButton from "@/components/contact/ContactButton";
import {
  brands,
  caseStudies,
  heroAnnotation,
  heroProof,
  recognition,
} from "@/content/manifest";

/* ============ HERO ============ */

export function Hero() {
  return (
    <section
      data-signal="overlap"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-28 pb-16 md:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow anim-fade-up mb-6">
          <span className="tick">●</span> Influencer marketing · Talent
          management · Global
        </p>

        <h1
          id="hero-heading"
          data-split
          className="font-display text-hero max-w-4xl"
        >
          Where Science Meets Culture.
        </h1>

        <p
          className="anim-fade-up mt-7 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--ink-muted)", animationDelay: "0.25s" }}
        >
          Audience intelligence, human expertise, and the world&apos;s most
          influential creators — combined to build partnerships that move
          culture and grow your business.
        </p>

        <p
          className="anim-fade-up font-mono-data mt-6 max-w-xl text-[0.72rem] leading-loose"
          style={{ color: "var(--ink-muted)", animationDelay: "0.4s" }}
        >
          Science reveals the audience.
          <br />
          Creators shape the culture.
          <br />
          <span style={{ color: "var(--signal)" }}>
            CLICK powers the connection.
          </span>
        </p>

        <div
          className="anim-fade-up mt-9 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <ContactButton className="btn-primary">
            Start the Conversation <span className="btn-arrow">→</span>
          </ContactButton>
          <Link href="/work" className="btn-ghost">
            View Our Work <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* resolved insight — the visualization's payoff. Held to xl and
          aligned to the content container: below that it would sit on top
          of the headline, which still runs close to full measure. */}
      <div className="pointer-events-none absolute inset-x-5 top-[24%] hidden md:inset-x-8 xl:block">
        <div className="mx-auto w-full max-w-7xl">
          <div
            className="anim-fade-up insight-frame ml-auto w-[21rem]"
            style={{ animationDelay: "2s" }}
          >
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> {heroAnnotation.eyebrow}
            </p>
            <p className="text-sm leading-relaxed">{heroAnnotation.body}</p>
            <p className="eyebrow mt-3" style={{ color: "var(--signal)" }}>
              {heroAnnotation.statusLabel}
            </p>
          </div>
        </div>
      </div>

      {/* featured result chip */}
      <div className="mx-auto mt-14 w-full max-w-7xl">
        <div
          className="anim-fade-up card-surface inline-flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg px-5 py-3"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="eyebrow">
            <span className="tick">▸</span> {heroProof.eyebrow}
          </span>
          <span className="tnum text-2xl font-medium">{heroProof.value}</span>
          <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
            {heroProof.label}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============ CHOOSE YOUR JOURNEY ============ */

export function Journeys() {
  return (
    <section
      id="journeys"
      data-signal="divide"
      className="hairline-t relative z-10"
      aria-label="Choose your journey"
    >
      <div className="journeys">
        {/* The whole panel is the control — it opens the questionnaire with
            the first answer already filled in for that audience. */}
        <ContactButton
          segment="brand"
          className="journey-a texture-grid group relative block w-full px-5 py-16 text-left transition-colors md:px-10 md:py-24"
        >
          <p className="eyebrow mb-4">
            <span className="tick">01</span> For brands
          </p>
          <h2 className="font-display text-h2">I&apos;m a Brand</h2>
          <p
            className="mt-4 max-w-md text-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            Make smarter creator decisions before a dollar is spent.
          </p>
          <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
            Start the Conversation <span className="btn-arrow">→</span>
          </span>
        </ContactButton>

        <ContactButton
          segment="creator"
          className="journey-b group relative block w-full border-t px-5 py-16 text-left transition-colors md:border-t-0 md:border-l md:px-10 md:py-24 [border-color:var(--hairline)]"
        >
          <p className="eyebrow mb-4">
            <span className="tick">02</span> For creators
          </p>
          <h2 className="font-display text-h2 display-outline">
            I&apos;m a Creator
          </h2>
          <p
            className="mt-4 max-w-md text-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            Build a business that outlasts the algorithm.
          </p>
          <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
            Join CLICK Talent <span className="btn-arrow">→</span>
          </span>
        </ContactButton>
      </div>
    </section>
  );
}

/* ============ BRAND MARQUEE ============ */

export function Marquee() {
  const row = (items: string[], label: string) => (
    <div className="marquee" aria-hidden="true">
      {[0, 1].map((copy) => (
        <div key={copy} className="marquee-track">
          {items.map((b) => (
            <span
              key={b}
              className="font-display whitespace-nowrap text-2xl md:text-3xl"
              style={{ color: "var(--ink-muted)" }}
            >
              {b}
            </span>
          ))}
        </div>
      ))}
      <span className="visually-hidden">{label}</span>
    </div>
  );

  return (
    <section
      className="hairline-t relative z-10 overflow-hidden py-14"
      aria-labelledby="brands-heading"
    >
      <h2 id="brands-heading" className="eyebrow mb-8 px-5 md:px-8">
        <span className="tick">●</span> Trusted by leading brands
      </h2>
      {row(brands.clients, "")}
      <div className="mt-6 opacity-60">{row(brands.platforms, "")}</div>
      {/* full lists for assistive tech & no-motion contexts */}
      <p className="visually-hidden">
        Client work includes {brands.clients.join(", ")}. Platform
        partnerships: {brands.platforms.join(", ")}.
      </p>
    </section>
  );
}

/* ============ INTELLIGENCE (4 beats) ============ */

const BEATS = [
  {
    label: "Beat 01 · Listen",
    layers: "Platforms → Audience Intelligence",
    title: "Intelligence Before Investment",
    body: "The strongest partnerships aren't built on assumptions. Before a campaign launches, we map how your audience and creator communities actually overlap.",
  },
  {
    label: "Beat 02 · Map",
    layers: "Communities → Creator Expertise",
    title: "The overlap is the opportunity.",
    body: "Behaviors, passions and cultural signals show where a brand's audience and a creator's community are already the same people — before anyone posts.",
  },
  {
    label: "Beat 03 · Create",
    layers: "Creative Strategy",
    title: "People turn insight into strategy.",
    body: "Our strategists turn that intelligence into creator selection, creative direction, and media decisions — so every dollar is working before the first post goes live.",
  },
  {
    label: "Beat 04 · Prove",
    layers: "Cultural Impact → Business Growth",
    title: "Then creators do what only creators can.",
    body: "They turn insight into culture — and culture into measurable business outcomes.",
    proof: { value: "51.93%", label: "market share increase · Optus — Gaming on the Go" },
  },
];

export function Intelligence() {
  return (
    <section
      id="intelligence"
      data-signal="flow"
      className="hairline-t relative z-10"
      aria-labelledby="intel-heading"
    >
      <h2 id="intel-heading" className="visually-hidden">
        How audience intelligence works
      </h2>
      <div id="intel-stage" className="relative lg:min-h-screen">
        <div className="flex flex-col gap-24 py-24 lg:gap-0">
          {BEATS.map((b) => (
            /* On desktop Fx.tsx stacks these with position:absolute against
               #intel-stage, so the gutter + max-width live on the inner
               wrapper — otherwise the pinned beats lose their margins. */
            <div
              key={b.label}
              data-beat
              className="flex flex-col justify-center lg:min-h-[80vh]"
            >
              <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
                <p className="eyebrow mb-3">
                  <span className="tick">◆</span> {b.label}
                </p>
                <p
                  className="font-mono-data mb-5 text-[0.68rem]"
                  style={{ color: "var(--signal)" }}
                >
                  {b.layers}
                </p>
                <h3 data-reveal className="font-display text-h2 max-w-3xl">
                  {b.title}
                </h3>
                <p
                  data-reveal
                  className="mt-6 max-w-xl text-lg leading-relaxed"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {b.body}
                </p>
                {"proof" in b && b.proof && (
                  <div data-reveal className="insight-frame mt-8 max-w-md">
                    <span className="tnum text-metric block">
                      {b.proof.value}
                    </span>
                    <span
                      className="mt-1 block text-sm"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {b.proof.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FEATURED WORK ============ */

const CASE_ROUTES: Record<string, string> = {
  Optus: "/work/optus-gaming-on-the-go",
  Maybelline: "/work/maybelline-eyes-up",
  "McDonald's": "/work/mcdonalds-summer-24",
};

export function Work() {
  return (
    <section
      id="work"
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-4">
          <span className="tick">●</span> Featured work
        </p>
        <h2 id="work-heading" data-split className="font-display text-h2 max-w-3xl">
          Smarter decisions. Stronger partnerships. Better results.
        </h2>

        <div className="mt-16 flex flex-col gap-6">
          {caseStudies.map((cs, i) => (
            <article
              key={cs.brand}
              data-reveal
              className="card-surface grid gap-8 rounded-xl p-6 sm:p-7 md:p-10 lg:grid-cols-[1fr_1.2fr_1fr]"
            >
              <div>
                <p className="eyebrow mb-2">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {cs.brand}
                </p>
                <h3 className="font-display text-h3">{cs.campaign}</h3>
                <Link
                  href={CASE_ROUTES[cs.brand] ?? "/work"}
                  className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs"
                >
                  View Case Study <span className="btn-arrow">→</span>
                </Link>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="eyebrow mb-1.5">What was understood</p>
                  <p className="leading-relaxed">{cs.understood}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5">What was created</p>
                  <p
                    className="leading-relaxed"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {cs.created}
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col justify-center gap-5 lg:border-l lg:pl-8"
                style={{ borderColor: "var(--hairline)" }}
              >
                <p className="eyebrow">What happened</p>
                {cs.metrics.length > 0 ? (
                  cs.metrics.slice(0, 3).map((m) => (
                    <div key={m.label}>
                      <span className="tnum text-metric block">{m.value}</span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {m.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <div>
                    <span
                      className="font-display block text-2xl"
                      style={{ color: "var(--signal)" }}
                    >
                      {cs.proofLine}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Campaign figures as published on clickmedia.group. Insight lines
            are concept interpretations pending client confirmation.
          </p>
          <Link href="/work" className="btn-ghost">
            View All Work <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ RECOGNITION ============ */

export function Recognition() {
  return (
    <section
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-28 text-center md:px-8"
      aria-label="Recognition"
    >
      <p data-reveal className="font-display text-h3">
        {recognition.line}
      </p>
      <p className="eyebrow mt-3">
        <span className="tick">◆</span> {recognition.years}
      </p>
    </section>
  );
}

/* ============ FINAL CTA ============ */

export function FinalCta() {
  return (
    <section
      data-signal="settle"
      className="hairline-t relative z-10 px-5 py-28 md:px-8"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 id="cta-heading" data-split className="font-display text-h2">
          Great partnerships begin with understanding people.
        </h2>
        <p
          data-reveal
          className="mx-auto mt-6 max-w-xl text-lg"
          style={{ color: "var(--ink-muted)" }}
        >
          Whether you&apos;re building a brand, growing a creator business, or
          looking for your next breakthrough campaign, let&apos;s start with a
          conversation.
        </p>
        <div data-reveal className="mt-9">
          <ContactButton className="btn-primary">
            Start the Conversation <span className="btn-arrow">→</span>
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
