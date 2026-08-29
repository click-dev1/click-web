import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Placeholder from "@/components/Placeholder";
import ContactButton from "@/components/contact/ContactButton";
import { activationScorecard, campaigns } from "@/content/site";

export const metadata: Metadata = {
  title: "Experiential",
  description:
    "Experiences that don't end when the lights go down. CLICK combines audience intelligence, creator expertise and world-class execution to build live moments that keep creating value long after the event.",
  alternates: { canonical: "/experiential" },
};

/* This page is the site's tonal benchmark: energy over analysis, emotion
   over explanation. Two rules from the blueprint shape what is NOT here —
   no technology platform names (the stack is named on the Influencer
   Marketing page only), and no dashboard-heavy layouts (that visual
   language belongs to Influencer Marketing). Intelligence shows up on this
   page as what it reveals about communities, never as the tools behind it. */

const CATEGORIES = [
  {
    name: "Gaming & Esports",
    items: [
      "Championships",
      "Community tournaments",
      "Creator competitions",
      "Fan engagement",
    ],
  },
  {
    name: "Sports",
    items: [
      "Athlete partnerships",
      "Fan experiences",
      "Hospitality",
      "Brand integrations",
    ],
  },
  {
    name: "Entertainment",
    items: [
      "Premieres",
      "Launch events",
      "Creator collaborations",
      "Live performances",
    ],
  },
  {
    name: "Brand Activations",
    items: [
      "Pop-ups",
      "Product launches",
      "Sampling",
      "Retail experiences",
      "Interactive installations",
    ],
  },
  {
    name: "Community Experiences",
    items: [
      "Creator meetups",
      "VIP events",
      "Local activations",
      "Fan appreciation",
      "Lifestyle experiences",
    ],
  },
];

const EXECUTION = [
  {
    label: "Strategy",
    items: [
      "Audience Intelligence",
      "Cultural Insights",
      "Experience Strategy",
      "Creator Strategy",
      "Venue Selection",
      "Partnership Development",
    ],
  },
  {
    label: "Production",
    items: [
      "Event Management",
      "Brand Activations",
      "Creative Production",
      "Creator Coordination",
      "Hospitality",
      "Staffing",
      "Logistics",
    ],
  },
  {
    label: "Amplification",
    items: [
      "Content Capture",
      "Social Distribution",
      "Creator Publishing",
      "Paid Amplification",
      "Community Engagement",
      "PR Integration",
    ],
  },
  {
    label: "Optimization",
    items: [
      "Performance Reporting",
      "Audience Insights",
      "Event Analytics",
      "Creator Performance",
      "Community Growth",
      "Future Recommendations",
    ],
  },
];

/* "Great experiences create more than memories" — rendered as a stack so
   the four beats land one at a time, the way the copy is written. */
const IMPACT = [
  "They create communities.",
  "They generate content.",
  "They inspire conversation.",
];

export default function ExperientialPage() {
  const proof = campaigns.filter((c) => c.service === "Experiential");

  return (
    <>
      <PageHero
        eyebrow="Solutions · Experiential"
        title="Experiential"
        outline
        kicker="Creating moments that people don't just attend — they remember, share, and become part of."
        lede="The most impactful experiences don't end when the lights go down. They spark conversations, inspire content, strengthen communities, and create lasting connections between brands and the people they serve."
        ctas={[
          { label: "Start the Conversation", primary: true, modal: true },
          { href: "/work", label: "View Our Work" },
        ]}
        signal="divide"
        aside={
          <Placeholder label="Activation film · client footage" ratio="3/4" />
        }
      />

      {/* ---- Section 1 — Experiences Begin With People ----
          data-signal="overlap" is doing real work here: the persistent
          signal field forms its audience clusters behind this section, so
          the "subtle audience visualization over cinematic footage" the
          blueprint asks for comes from the system already on the page
          rather than a diagram bolted on top of it. */}
      <section
        data-signal="overlap"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="people-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Experiences begin with people
          </p>
          <h2
            id="people-heading"
            data-split
            className="font-display text-h2 max-w-4xl"
          >
            Every unforgettable experience begins with understanding who
            it&apos;s for.
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Placeholder
              label="Live crowd · client footage"
              ratio="3/4"
              className="md:mt-12"
            />
            <Placeholder label="Community moment" ratio="3/4" />
            <Placeholder
              label="Fan experience · gaming activation"
              ratio="3/4"
              className="md:mt-20"
            />
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <p className="text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
              Audience intelligence helps us identify the communities,
              passions, and cultural moments that bring people together. Those
              insights become the foundation for experiences that feel
              authentic, relevant, and worth sharing.
            </p>
            <p data-reveal className="font-display text-h3 max-w-xl">
              Because the best experiences aren&apos;t built around a venue —
              they&apos;re built around people.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Section 2 — Where Brands Become Part of Culture ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="culture-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Where brands become part of culture
          </p>
          <h2
            id="culture-heading"
            data-split
            className="font-display text-h2 max-w-4xl"
          >
            The most successful experiential campaigns don&apos;t interrupt
            culture — they contribute to it.
          </h2>
          <div className="mt-10 grid gap-8 text-lg leading-body lg:grid-cols-2 lg:gap-16">
            <p style={{ color: "var(--ink-muted)" }}>
              Our team creates experiences that naturally connect brands with
              communities through creators, gaming, entertainment, sports, and
              shared passions.
            </p>
            <p style={{ color: "var(--ink-muted)" }}>
              Whether launching a new product, activating around a major
              cultural moment, or building long-term community engagement,
              every experience is designed to create participation rather than
              observation.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <article
                key={c.name}
                data-reveal
                className="card-surface rounded-xl p-7"
              >
                <p className="eyebrow mb-3">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                  Experience category
                </p>
                <h3 className="font-display text-h3">{c.name}</h3>
                <ul
                  className="mt-5 flex flex-col gap-2 text-sm leading-body"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {c.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Section 3 — Creators Bring Experiences to Life ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="creators-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Creators bring experiences to life
          </p>
          <h2
            id="creators-heading"
            data-split
            className="font-display text-h2 max-w-4xl"
          >
            Creators don&apos;t simply attend events — they shape how audiences
            experience them.
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-4">
              <Placeholder
                label="Creator walkthrough · behind the scenes"
                ratio="16/9"
              />
              <div className="grid grid-cols-2 gap-4">
                <Placeholder label="Live filming" ratio="4/3" />
                <Placeholder label="Creator meet-and-greet" ratio="4/3" />
              </div>
            </div>
            <div className="flex flex-col gap-5 text-lg leading-body lg:pl-8">
              <p>
                By working alongside creators throughout planning,
                storytelling, production, and execution, we help brands create
                authentic moments that feel natural to both creators and their
                communities.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Our team serves as the bridge between brands and creators,
                ensuring every experience reflects the creator&apos;s voice
                while delivering meaningful business outcomes.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                The result is content that feels genuine, communities that feel
                included, and partnerships that continue long after the event
                ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Section 4 — End-to-End Experiential Execution ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="execution-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> End-to-end experiential execution
          </p>
          <h2
            id="execution-heading"
            data-split
            className="font-display text-h2 max-w-3xl"
          >
            From concept through execution.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {EXECUTION.map((group) => (
              <article
                key={group.label}
                data-reveal
                className="card-surface rounded-xl p-7"
              >
                <h3 className="font-display text-h3 mb-5">{group.label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Section 5 — Measured Beyond the Moment ----
          Reporting is integrated into the storytelling here. No dashboard:
          one activation scorecard, three or four numbers, nothing else. */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="measured-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Measured beyond the moment
          </p>
          <h2
            id="measured-heading"
            data-split
            className="font-display text-h2 max-w-4xl"
          >
            The value of an experience extends far beyond a single day.
          </h2>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-5 text-lg leading-body">
              <p style={{ color: "var(--ink-muted)" }}>
                Every activation is designed to generate lasting value through
                creator content, earned media, community engagement, social
                conversation, and measurable business impact.
              </p>
              <p>
                Every experience is measured against the objective it was built
                for — attendance and community growth, creator content and
                earned reach, or retail traffic and sales impact. We report the
                three to five numbers that prove the experience worked, not
                everything we could count.
              </p>
            </div>

            <div>
              {activationScorecard ? (
                <div data-reveal className="insight-frame">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="eyebrow">
                      <span className="tick">◉</span> Activation scorecard
                    </p>
                    <p className="font-data text-[0.62rem]">
                      {activationScorecard.label}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {activationScorecard.metrics.map((m) => (
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
                    ))}
                  </div>
                  <p className="eyebrow mt-6">
                    Status · placeholder, replaced with a real activation
                  </p>
                </div>
              ) : (
                <div data-reveal className="insight-frame">
                  <p className="eyebrow mb-2">
                    <span className="tick">◉</span> Activation scorecard
                  </p>
                  <p className="leading-body">
                    Three to four real numbers from a flagship experience land
                    here — attendance, content generated, social reach, business
                    outcome.
                  </p>
                  <p className="eyebrow mt-3">
                    Status · awaiting client activation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* From Experience to Impact */}
          <div className="hairline-t mt-20 pt-16">
            <p className="eyebrow pill mb-8">
              <span className="tick">●</span> From experience to impact
            </p>
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div className="flex flex-col gap-3">
                <p className="font-display text-h3" style={{ color: "var(--ink-muted)" }}>
                  Great experiences create more than memories.
                </p>
                {IMPACT.map((line) => (
                  <p key={line} data-reveal className="font-display text-h3">
                    {line}
                  </p>
                ))}
              </div>
              <p
                data-reveal
                className="self-end text-lg leading-body"
                style={{ color: "var(--ink-muted)" }}
              >
                Most importantly, they build lasting relationships between
                brands and the audiences they serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Section 6 — Performance in Practice ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="performance-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Performance in practice
          </p>
          <h2
            id="performance-heading"
            data-split
            className="font-display text-h2 max-w-3xl"
          >
            Great experiences don&apos;t end when the event is over.
          </h2>

          {proof.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {proof.map((c) => (
                <Link
                  key={c.slug}
                  href={`/work/${c.slug}`}
                  data-reveal
                  className="card-surface group block overflow-hidden rounded-xl"
                >
                  <Placeholder
                    label={c.mediaLabel}
                    ratio="16/9"
                    className="rounded-none border-0"
                  />
                  <div className="p-6 sm:p-7">
                    <p className="eyebrow">
                      <span className="tick">▸</span> {c.brand} · {c.industry}
                    </p>
                    <h3 className="font-display text-h3 mt-2">{c.title}</h3>
                    {/* the insight opens every case, before anything else */}
                    <p className="mt-4 leading-body">
                      <span className="eyebrow mr-2">What we found</span>
                      {c.insight}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                      {c.metrics.slice(0, 3).map((m) => (
                        <div key={m.label}>
                          <span className="tnum block text-xl font-bold">
                            {m.value}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "var(--ink-muted)" }}
                          >
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                      View Case Study <span className="btn-arrow">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div data-reveal className="insight-frame mt-12 max-w-2xl">
              <p className="eyebrow mb-2">
                <span className="tick">◉</span> Awaiting client-supplied work
              </p>
              <p className="leading-body">
                Experiential case studies land here — each opening on what the
                intelligence found, then the experience it produced, then the
                three to five numbers it delivered. Filtering across gaming,
                sports, entertainment, consumer brands, product launches,
                festivals and creator events lives on the Work page, where the
                whole collection is filterable by service.
              </p>
              <p className="eyebrow mt-3">Status · awaiting client campaigns</p>
            </div>
          )}

          <div className="mt-10">
            <Link href="/work" className="btn-ghost">
              View All Work <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="exp-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="exp-cta-heading" data-split className="font-display text-h2">
            Great experiences create lasting connections.
          </h2>
          <p
            data-reveal
            className="mx-auto mt-6 max-w-xl text-lg leading-body"
            style={{ color: "var(--ink-muted)" }}
          >
            Whether you&apos;re launching a product, building a community, or
            creating your next cultural moment, we&apos;ll help turn insight
            into unforgettable experiences that deliver measurable business
            results.
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
