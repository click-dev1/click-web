import ContactButton from "@/components/contact/ContactButton";
import { ScribbleCircle, ScribbleUnderline } from "@/components/Scribble";
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
        <p className="eyebrow pill anim-fade-up mb-6">
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

        {/* The brand triad leads the body copy: it is the positioning
            line, so it reads before the explanation of it. */}
        <p
          className="anim-fade-up font-display hero-creed mt-8 max-w-2xl"
          style={{ animationDelay: "0.25s" }}
        >
          Science reveals the audience.
          <br />
          Creators shape the culture.
          <br />
          <span className="creed-payoff">CLICK powers the connection.</span>
        </p>

        <p
          className="anim-fade-up mt-7 max-w-xl text-lg leading-body"
          style={{ color: "var(--ink-muted)", animationDelay: "0.4s" }}
        >
          Audience intelligence, human expertise, and the world&apos;s most
          influential creators — combined to build partnerships that move
          culture and grow your business.
        </p>

        <div
          className="anim-fade-up mt-9 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <ContactButton className="btn-primary">
            Start the Conversation <span className="btn-arrow">→</span>
          </ContactButton>
          {/* in-page until /work exists */}
          <a href="#work" className="btn-ghost">
            View Our Work <span className="btn-arrow">→</span>
          </a>
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
            <p className="text-sm leading-body">{heroAnnotation.body}</p>
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
          <p className="mb-4">
            <span className="eyebrow pill">
              <span className="tick">01</span> For brands
            </span>
          </p>
          {/* One device per panel: the brand side gets the hand-drawn mark,
              the creator side keeps the outlined-caps poster treatment.
              Stacking both on one word just reads as noise. */}
          <h2 className="font-display text-h2">
            I&apos;m a{" "}
            <span className="relative inline-block">
              Brand
              {/* 1 of 2 marks on this page — see Scribble.tsx. Hugs the line
                  box; any looser and it crosses the sentence underneath. */}
              <ScribbleCircle className="pointer-events-none absolute -inset-x-5 top-1 bottom-1 text-[var(--ink)]" />
            </span>
          </h2>
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
          <p className="mb-4">
            <span className="eyebrow pill">
              <span className="tick">02</span> For creators
            </span>
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
        <span className="tick" aria-hidden="true">
          ●
        </span>{" "}
        Trusted by leading brands
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

/* Titles and bodies are CLICK's own Section 2 copy. No "Beat 01 · Listen"
   style labels: the science → people → creators → culture → results
   progression is a structural principle in the blueprint, explicitly not
   copy — "do not print this progression as text on any page". */
const BEATS = [
  {
    layers: "Platforms → Audience Intelligence",
    title: "The strongest partnerships aren't built on assumptions.",
    body: "Before a campaign launches, we map how your audience and creator communities actually overlap — the behaviors, passions and cultural signals that determine whether a partnership works.",
  },
  {
    layers: "Communities → Creator Expertise",
    title: "The overlap is the opportunity.",
    body: "Where a brand's audience and a creator's community are already the same people, the partnership has a foundation — and we can see it before anyone posts.",
  },
  {
    layers: "Creative Strategy",
    title: "Strategy, before the first post.",
    body: "Our strategists turn that intelligence into creator selection, creative direction, and media decisions — so every dollar is working before the first post goes live.",
  },
  {
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
      {/* Sits outside #intel-stage: the stage gets pinned on desktop and
          its children absolutely positioned, so the section title has to
          live above it to survive. */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-24 md:px-8">
        <h2 id="intel-heading" className="font-display text-h2 max-w-3xl">
          <span className="eyebrow pill mb-5">
            <span className="tick" aria-hidden="true">
              ●
            </span>{" "}
            Audience intelligence
          </span>
          <span className="visually-hidden"> — </span>
          <span data-split className="block">
            Intelligence Before Investment
          </span>
        </h2>
      </div>
      <div id="intel-stage" className="relative lg:min-h-screen">
        <div className="flex flex-col gap-24 pt-14 pb-24 lg:gap-0">
          {BEATS.map((b) => (
            /* On desktop Fx.tsx stacks these with position:absolute against
               #intel-stage, so the gutter + max-width live on the inner
               wrapper — otherwise the pinned beats lose their margins. */
            <div
              key={b.title}
              data-beat
              className="flex flex-col justify-center lg:min-h-[80vh]"
            >
              <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
                <p
                  className="font-data mb-5 text-[0.68rem]"
                  style={{ color: "var(--signal)" }}
                >
                  {b.layers}
                </p>
                <h3 data-reveal className="font-display text-h2 max-w-3xl">
                  {b.title}
                </h3>
                <p
                  data-reveal
                  className="mt-6 max-w-xl text-lg leading-body"
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

export function Work() {
  return (
    <section
      id="work"
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="work-heading" className="font-display text-h2 max-w-4xl">
          <span className="eyebrow pill mb-5">
            <span className="tick" aria-hidden="true">
              ●
            </span>{" "}
            Featured work
          </span>
          <span className="visually-hidden"> — </span>
          <span data-split className="block">
            Smarter decisions. Stronger partnerships. Better results.
          </span>
        </h2>

        <div className="mt-16 flex flex-col gap-6">
          {caseStudies.map((cs, i) => (
            <article
              key={cs.brand}
              data-reveal
              className="card-surface rounded-xl p-6 sm:p-7 md:p-10"
            >
              {/* The insight opens the card, before the brand or the
                  campaign name — blueprint: "One insight line — 'What we
                  found' — before anything else." */}
              <p className="eyebrow mb-3">
                <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                What the intelligence found
              </p>
              <p className="max-w-4xl text-xl leading-snug md:text-2xl">
                {cs.understood}
              </p>

              <div
                className="mt-8 grid gap-8 border-t pt-8 lg:grid-cols-[1fr_1.2fr_1fr]"
                style={{ borderColor: "var(--hairline)" }}
              >
                <div>
                  <p className="eyebrow mb-2">{cs.brand}</p>
                  <h3 className="font-display text-h3">{cs.campaign}</h3>
                </div>

                <div>
                  <p className="eyebrow mb-1.5">What we built</p>
                  <p className="leading-body">{cs.created}</p>
                </div>

                <div
                  className="flex flex-col justify-center gap-5 lg:border-l lg:pl-8"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <p className="eyebrow">What it delivered</p>
                  {cs.metrics.length > 0 ? (
                    cs.metrics.slice(0, 3).map((m) => (
                      <div key={m.label}>
                        <span className="tnum text-metric block">
                          {m.value}
                        </span>
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
              </div>
            </article>
          ))}
        </div>

        {/* The per-case "View Case Study" and "View All Work" CTAs are held
            back until /work and /work/* exist — they were pointing at
            routes that 404. They return with those pages. */}
        <div className="mt-10">
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Campaign figures as published on clickmedia.group. Insight lines
            are editorial interpretations pending client confirmation.
          </p>
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
        <span className="relative inline-block">
          {recognition.line}
          {/* 2 of 2 — the award line is the one claim the blueprint says to
              state once and leave alone, so it gets the emphasis */}
          <ScribbleUnderline className="pointer-events-none absolute -bottom-4 left-0 h-3 w-full text-[var(--ink)]" />
        </span>
      </p>
      {/* extra clearance: the scribble underline hangs below the line above */}
      <p className="eyebrow mt-7">
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
