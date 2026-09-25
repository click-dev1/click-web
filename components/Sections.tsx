import Link from "next/link";
import ContactButton from "@/components/contact/ContactButton";
import BlockImage from "@/components/blocks/BlockImage";
import AttributionBadge from "@/components/work/AttributionBadge";
import IntelligenceDiagram from "@/components/IntelligenceDiagram";
import { ScribbleCircle, ScribbleUnderline } from "@/components/Scribble";
import type { Beat, CaseStudy, HomePage } from "@/lib/sanity/types";
import CtaLink from "@/components/blocks/CtaLink";

/* ============ HERO ============ */

export function Hero({ home }: { home: HomePage }) {
  const { heroCreed: creed, heroAnnotation, heroProof } = home;
  return (
    <section
      data-signal="overlap"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-28 pb-16 md:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow pill anim-fade-up mb-6">
          <span className="tick">●</span> {home.heroEyebrow}
        </p>

        <h1
          id="hero-heading"
          data-split
          className="font-display text-hero max-w-4xl"
        >
          {home.heroHeadline}
        </h1>

        {/* The brand triad leads the body copy: it is the positioning
            line, so it reads before the explanation of it. */}
        <p
          className="anim-fade-up font-display hero-creed mt-8 max-w-2xl"
          style={{ animationDelay: "0.25s" }}
        >
          {creed.line1}
          <br />
          {creed.line2}
          <br />
          <span className="creed-payoff">{creed.payoff}</span>
        </p>

        <p
          className="anim-fade-up mt-7 max-w-xl text-lg leading-body"
          style={{ color: "var(--ink-muted)", animationDelay: "0.4s" }}
        >
          {home.heroLede}
        </p>

        <div
          className="anim-fade-up mt-9 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          {(home.heroCtas ?? []).map((cta) => (
            <CtaLink key={cta._key ?? cta.label} cta={cta} />
          ))}
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
              <span className="tick">◉</span> {heroAnnotation?.eyebrow}
            </p>
            <p className="text-sm leading-body">{heroAnnotation?.body}</p>
            <p className="eyebrow mt-3" style={{ color: "var(--signal)" }}>
              {heroAnnotation?.statusLabel}
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
            <span className="tick">▸</span> {heroProof?.eyebrow}
          </span>
          <span className="tnum text-2xl font-medium">{heroProof?.value}</span>
          <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
            {heroProof?.label}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============ CHOOSE YOUR JOURNEY ============ */

export function Journeys({ home }: { home: HomePage }) {
  const j = home.journeys ?? {};
  /* The hand-drawn mark hugs the LAST word of the left heading — see
     Scribble.tsx. Split here rather than asking an editor to mark it up. */
  const firstWords = (j.firstHeading ?? "").split(" ");
  const firstLead = firstWords.slice(0, -1).join(" ");
  const firstMarked = firstWords[firstWords.length - 1] ?? "";
  return (
    <section
      id="journeys"
      data-signal="divide"
      className="hairline-t relative z-10"
      aria-label="Choose your journey"
    >
      <div className="journeys">
        {/* The whole panel is the control — it opens the contact form. */}
        <ContactButton className="journey-a texture-grid group relative block w-full px-5 py-16 text-left transition-colors md:px-10 md:py-24">
          <p className="mb-4">
            <span className="eyebrow pill">
              <span className="tick">01</span> {j.firstEyebrow}
            </span>
          </p>
          {/* One device per panel: the brand side gets the hand-drawn mark,
              the creator side keeps the outlined-caps poster treatment.
              Stacking both on one word just reads as noise. */}
          <h2 className="font-display text-h2">
            {firstLead}{" "}
            <span className="relative inline-block">
              {firstMarked}
              {/* 1 of 2 marks on this page — see Scribble.tsx. Hugs the line
                  box; any looser and it crosses the sentence underneath. */}
              <ScribbleCircle className="pointer-events-none absolute -inset-x-5 top-1 bottom-1 text-[var(--ink)]" />
            </span>
          </h2>
          <p
            className="mt-4 max-w-md text-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            {j.firstBody}
          </p>
          <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
            {j.firstCta} <span className="btn-arrow">→</span>
          </span>
        </ContactButton>

        <ContactButton className="journey-b group relative block w-full border-t px-5 py-16 text-left transition-colors md:border-t-0 md:border-l md:px-10 md:py-24 [border-color:var(--hairline)]">
          <p className="mb-4">
            <span className="eyebrow pill">
              <span className="tick">02</span> {j.secondEyebrow}
            </span>
          </p>
          <h2 className="font-display text-h2 display-outline">
            {j.secondHeading}
          </h2>
          <p
            className="mt-4 max-w-md text-lg"
            style={{ color: "var(--ink-muted)" }}
          >
            {j.secondBody}
          </p>
          <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
            {j.secondCta} <span className="btn-arrow">→</span>
          </span>
        </ContactButton>
      </div>
    </section>
  );
}

/* ============ BRAND MARQUEE ============ */

export function Marquee({ home }: { home: HomePage }) {
  const clients = home.brandClients ?? [];
  const platforms = home.brandPlatforms ?? [];
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
        {home.brandsHeading}
      </h2>
      {row(clients, "")}
      <div className="mt-6 opacity-60">{row(platforms, "")}</div>
      {/* full lists for assistive tech & no-motion contexts */}
      <p className="visually-hidden">
        Client work includes {clients.join(", ")}. Platform partnerships:{" "}
        {platforms.join(", ")}.
      </p>
    </section>
  );
}

/* ============ INTELLIGENCE (4 beats) ============ */

/* Titles and bodies are CLICK's own Section 2 copy. No "Beat 01 · Listen"
   style labels: the science → people → creators → culture → results
   progression is a structural principle in the blueprint, explicitly not
   copy — "do not print this progression as text on any page". */
/* Beat text and the diagram layer share this grid: text in column one,
   drawing in column two. Column two IS the drawing's width (--diag-w,
   set on #intel-stage in globals.css: height-capped for the pinned
   stage, 55vw at most) so a headline can never run under it, and the
   text column takes whatever is left. Gutter lives on the parent
   (px-5 md:px-8), container here — the site-wide order. */
const INTEL_GRID =
  "mx-auto w-full max-w-7xl lg:grid lg:grid-cols-[minmax(0,1fr)_var(--diag-w)] lg:gap-10 lg:items-center";

export function Intelligence({ home }: { home: HomePage }) {
  const beats: Beat[] = home.beats ?? [];
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
      <div className="px-5 pt-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="eyebrow pill mb-8">
            <span className="tick" aria-hidden="true">
              ●
            </span>{" "}
            Audience intelligence
          </p>
          {/* Display headline left, supporting copy right. The paragraph
              sits on the headline's baseline block (items-end) so the two
              columns read as one line of thought, not a title + footnote. */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12 lg:gap-16">
            {/* Slightly looser than --leading-display: the split-line
                masks are overflow:hidden, so at 0.86 the comma's
                descender was clipped by the line below. */}
            <h2
              id="intel-heading"
              className="font-display text-h2"
              style={{ lineHeight: 0.94 }}
            >
              <span data-split className="block">
                We start with the audience.
              </span>
            </h2>
            <p
              data-reveal
              className="max-w-lg text-base leading-body md:text-lg"
              style={{ color: "var(--ink-muted)" }}
            >
              CLICK combines audience intelligence from GameSquare’s ecosystem, creator expertise,
              cultural insight and performance data in one continuous system.
              What we learn before, during and after every campaign feeds the
              next decision.
            </p>
          </div>
        </div>
      </div>
      <div id="intel-stage" className="relative lg:min-h-screen">
        <div className="flex flex-col gap-24 pt-14 pb-24 lg:gap-0">
          {/* The loop diagram. One instance serves every layout:
              - below lg it is a static block in flow, above the beats,
                fully drawn (final state), revealed like any other block;
              - at lg+ it leaves the flow as a layer over the pinned stage,
                sticky beside the crossfading beats, and Fx.tsx draws it in
                step with them.
              It shares the beats' wrapper + grid so its column is the same
              column the beat text leaves empty — alignment by construction. */}
          <div
            data-reveal
            className="px-5 md:px-8 lg:pointer-events-none lg:absolute lg:inset-0"
          >
            {/* pt clears the fixed nav so the drawing centres in the space
                actually visible below it */}
            <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:pt-20">
              <div className={INTEL_GRID}>
                <div className="hidden lg:block" />
                <div className="lg:flex lg:justify-end">
                  <IntelligenceDiagram />
                </div>
              </div>
            </div>
          </div>

          {beats.map((b) => (
            /* On desktop Fx.tsx stacks these with position:absolute against
               #intel-stage, so the gutter + max-width live on the inner
               wrapper — otherwise the pinned beats lose their margins. */
            <div
              key={b._key ?? b.title}
              data-beat
              className="flex flex-col justify-center px-5 md:px-8 lg:min-h-[80vh]"
            >
              <div className={INTEL_GRID}>
                <div>
                  <p
                    data-beat-aside
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
                    data-beat-aside
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
                {/* second column intentionally empty: the diagram layer
                    above occupies it */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FEATURED WORK ============ */

export function Work({ home }: { home: HomePage }) {
  /* Chosen case studies win; with none, the featured ones fill the
     section — so publishing a case study can reach the home page without
     anyone editing the home document. */
  const picked = home.workPicked?.filter(Boolean) ?? [];
  const studies: CaseStudy[] = picked.length ? picked : (home.workAuto ?? []);
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
            {home.workEyebrow}
          </span>
          <span className="visually-hidden"> — </span>
          <span data-split className="block">
            {home.workHeading}
          </span>
        </h2>

        <div className="mt-16 flex flex-col gap-6">
          {studies.map((cs, i) => (
            <article
              key={cs._id}
              data-reveal
              className="card-surface overflow-hidden rounded-xl lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]"
            >
              {/* The campaign's lead image, beside the three beats on a
                  wide screen and above them on a phone. Cards without one
                  stay text-only rather than showing an empty frame in the
                  middle of the home page. */}
              {cs.media?.asset && (
                <Link href={`/work/${cs.slug}`} className="relative block" tabIndex={-1} aria-hidden="true">
                  <BlockImage
                    image={cs.media}
                    ratio="4/3"
                    width={1200}
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    className="rounded-none lg:h-full lg:aspect-auto!"
                  />
                  <AttributionBadge attribution={cs.attribution} overlay />
                </Link>
              )}
              <div className="p-6 sm:p-7 md:p-10">
                {/* The insight opens the card, before the brand or the
                    campaign name — blueprint: "One insight line — 'What we
                    found' — before anything else." */}
                <p className="eyebrow mb-3">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                  What the intelligence found
                </p>
                <p className="max-w-4xl text-xl leading-snug md:text-2xl">
                  {cs.insight}
                </p>

                <div
                  className="mt-8 grid gap-8 border-t pt-8 lg:grid-cols-[1fr_1.2fr_1fr]"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <div>
                    <p className="eyebrow mb-2">{cs.brand}</p>
                    <h3 className="font-display text-h3 text-balance">{cs.headline ?? cs.title}</h3>
                  </div>

                  <div>
                    <p className="eyebrow mb-1.5">What we built</p>
                    <p className="leading-body">{cs.built}</p>
                  </div>

                  <div
                    className="flex flex-col justify-center gap-5 lg:border-l lg:pl-8"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <p className="eyebrow">What it delivered</p>
                    {cs.resultsIntro && (
                      <p
                        className="leading-body -mt-2 text-sm"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {cs.resultsIntro}
                      </p>
                    )}
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
                <Link
                  href={`/work/${cs.slug}`}
                  className="btn-ghost mt-8 inline-flex px-4 py-2 text-xs"
                >
                  View Case Study <span className="btn-arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link href="/work" className="btn-ghost">
            View All Work <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ RECOGNITION ============ */

export function Recognition({ home }: { home: HomePage }) {
  return (
    <section
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-28 text-center md:px-8"
      aria-label="Recognition"
    >
      <p data-reveal className="font-display text-h3">
        <span className="relative inline-block">
          {home.recognitionLine}
          {/* 2 of 2 — the award line is the one claim the blueprint says to
              state once and leave alone, so it gets the emphasis */}
          <ScribbleUnderline className="pointer-events-none absolute -bottom-4 left-0 h-3 w-full text-[var(--ink)]" />
        </span>
      </p>
      {/* extra clearance: the scribble underline hangs below the line above */}
      <p className="eyebrow mt-7">
        <span className="tick">◆</span> {home.recognitionYears}
      </p>
    </section>
  );
}

/* ============ FINAL CTA ============ */

export function FinalCta({ home }: { home: HomePage }) {
  return (
    <section
      data-signal="settle"
      className="hairline-t relative z-10 px-5 py-28 md:px-8"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 id="cta-heading" data-split className="font-display text-h2">
          {home.ctaHeading}
        </h2>
        <p
          data-reveal
          className="mx-auto mt-6 max-w-xl text-lg"
          style={{ color: "var(--ink-muted)" }}
        >
          {home.ctaBody}
        </p>
        <div data-reveal className="mt-9">
          {home.ctaButton && <CtaLink cta={home.ctaButton} />}
        </div>
      </div>
    </section>
  );
}
