import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Placeholder from "@/components/Placeholder";
import ContactButton from "@/components/contact/ContactButton";
import { campaigns } from "@/content/site";

export const metadata: Metadata = {
  title: "Influencer Marketing",
  description:
    "Influencer marketing built on audience intelligence. We map the real overlap between your audience and creator communities, then build partnerships around what we find.",
  alternates: { canonical: "/influencer-marketing" },
};

/* The site's ONE technology section — the stack is named here and nowhere else. */
const STACK = [
  {
    name: "AI Audience Mapping",
    blurb:
      "Reveal audience behavior, psychographic insights, community overlap, and emerging cultural trends.",
  },
  {
    name: "Sideqik",
    blurb:
      "Access a network of more than 40M creators, enterprise campaign management, audience analytics, and reporting.",
  },
  {
    name: "TubeBuddy",
    blurb:
      "Understand YouTube audiences, creator performance, channel optimization, and long-form content strategy.",
  },
  {
    name: "Stream Hatchet",
    blurb:
      "Unlock gaming, livestreaming, and esports intelligence across Twitch, YouTube Gaming, Kick, Facebook Live, Steam, SOOP, Chzzk, Trovo, Rumble, OpenREC, and emerging platforms.",
  },
];

const CAPABILITIES = [
  {
    label: "Strategy",
    items: [
      "Audience Intelligence",
      "Creator Discovery",
      "Creator Strategy",
      "Competitive Intelligence",
      "Creative Strategy",
    ],
  },
  {
    label: "Execution",
    items: [
      "Campaign Management",
      "Talent Partnerships",
      "Content Production",
      "Paid Media",
      "Whitelisting",
      "Product Seeding",
      "Social Commerce",
      "Affiliate Marketing",
      "Community Management",
      "Experiential Integration",
    ],
  },
  {
    label: "Optimization",
    items: [
      "Reporting",
      "Measurement",
      "Creator Performance",
      "Creative Optimization",
      "Audience Insights",
      "Campaign Optimization",
    ],
  },
];

export default function InfluencerMarketingPage() {
  const proof = campaigns.filter((c) =>
    ["capcom-pragmata", "optus-gaming-on-the-go", "maybelline-eyes-up"].includes(c.slug),
  );
  const optus = campaigns.find((c) => c.slug === "optus-gaming-on-the-go");

  return (
    <>
      <PageHero
        eyebrow="Solutions · Influencer Marketing"
        title="Built on Audience Intelligence."
        lede="We map the real overlap between your audience and creator communities — then build partnerships around what we find. The result: better creator selection, sharper creative, and less wasted spend."
        ctas={[
          { label: "Start the Conversation", primary: true, modal: true },
          { href: "/work", label: "View Our Work" },
        ]}
        signal="overlap"
        aside={
          <div className="insight-frame">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> Resolved insight · illustrative
            </p>
            <p className="text-sm leading-body">
              Four intelligence layers, one finding: the audiences you want are
              already inside creator communities you haven&apos;t considered.
            </p>
            <p className="eyebrow mt-3">Status · awaiting client insight</p>
          </div>
        }
      />

      {/* ---- Audience Intelligence in Action + the ONE technology section ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="intel-action-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Audience intelligence in action
          </p>
          <h2 id="intel-action-heading" data-split className="font-display text-h2 max-w-3xl">
            Better understanding leads to better decisions.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-5 text-lg leading-body">
              <p>
                Understanding today&apos;s consumer requires more than a single
                data source. CLICK brings together AI Audience Mapping, Sideqik,
                TubeBuddy, and Stream Hatchet to understand how audiences
                discover content, engage with creators, and participate in
                culture across every major platform.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Each technology contributes a unique layer of intelligence —
                creating a complete understanding of the people brands want to
                reach. The result is smarter strategy, stronger creative
                direction, and creator partnerships built on meaningful
                audience alignment.
              </p>
            </div>
            <Placeholder label="Audience overlap visualization" ratio="4/3" />
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STACK.map((t, i) => (
              <article key={t.name} data-reveal className="card-surface rounded-xl p-6">
                <p className="eyebrow mb-3">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>{" "}
                  Technology
                </p>
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-3 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                  {t.blurb}
                </p>
              </article>
            ))}
          </div>

          <div data-reveal className="insight-frame mt-10 max-w-2xl">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> The payoff · one real finding
            </p>
            <p className="leading-body">
              This section resolves on a real, anonymized audience finding
              produced by the four layers working together — supplied by
              CLICK&apos;s content team before launch.
            </p>
            <p className="eyebrow mt-3">Status · awaiting client insight</p>
          </div>
        </div>
      </section>

      {/* ---- Creator Expertise ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="creator-expertise-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Creator expertise
          </p>
          <h2 id="creator-expertise-heading" data-split className="font-display text-h2 max-w-3xl">
            Technology informs. People create.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="grid gap-4">
              <Placeholder label="Creator briefing · client photography" ratio="4/3" />
              <div className="grid grid-cols-2 gap-4">
                <Placeholder label="Production day" ratio="1/1" />
                <Placeholder label="Creative review" ratio="1/1" />
              </div>
            </div>
            <div className="flex flex-col gap-5 text-lg leading-body lg:pl-8">
              <p className="font-medium">
                Great influencer marketing is built on relationships.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Creators aren&apos;t media placements — they&apos;re
                storytellers, entrepreneurs, and cultural leaders. Our team
                works alongside creators every day, from campaign briefing and
                creative collaboration to content refinement, approvals, and
                execution.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                We serve as the bridge between brands and creators, ensuring
                every partnership feels authentic to both the creator and the
                audience — guided by audience intelligence, human expertise,
                and mutual trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- End-to-End Campaign Management ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="capabilities-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> End-to-end campaign management
          </p>
          <h2 id="capabilities-heading" data-split className="font-display text-h2 max-w-3xl">
            Every stage of the lifecycle.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {CAPABILITIES.map((group) => (
              <article key={group.label} data-reveal className="card-surface rounded-xl p-7">
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

      {/* ---- Measured Against What Matters ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="measurement-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Measured against what matters
          </p>
          <h2 id="measurement-heading" data-split className="font-display text-h2 max-w-3xl">
            Every partnership begins with a business objective.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col gap-5 text-lg leading-body">
              <p style={{ color: "var(--ink-muted)" }}>
                No two brands define success the same way. We build the
                measurement framework around your objective and report against
                the three to five KPIs that actually move your business.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Powered by Sideqik, every campaign is measured through
                customizable dashboards with real-time visibility into
                performance, audience behavior, and optimization opportunities.
              </p>
              <p>
                Great reporting doesn&apos;t simply explain what happened — it
                helps determine what happens next.
              </p>
            </div>

            {/* one real campaign scorecard */}
            {optus && (
              <div data-reveal className="card-surface rounded-xl p-7 md:p-9">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow">
                    <span className="tick">◉</span> Campaign scorecard
                  </p>
                  <p className="font-data text-[0.62rem]">
                    {optus.brand} · {optus.title}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {optus.metrics.map((m) => (
                    <div key={m.label}>
                      <span className="tnum text-metric block">{m.value}</span>
                      <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Placeholder label="Sideqik dashboard demonstration" ratio="21/9" />
                </div>
                <p className="eyebrow mt-5">
                  Figures as published on clickmedia.group
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- Proof in Practice ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="proof-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Proof in practice
          </p>
          <h2 id="proof-heading" data-split className="font-display text-h2 max-w-3xl">
            Strategy is only meaningful when it delivers results.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {proof.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                data-reveal
                className="card-surface group block rounded-xl p-6"
              >
                <p className="eyebrow mb-2">
                  <span className="tick">▸</span> {c.brand}
                </p>
                <h3 className="font-display text-h3">{c.title}</h3>
                <p className="mt-3 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                  {c.insight}
                </p>
                <span className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                  View Case Study <span className="btn-arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
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
        aria-labelledby="im-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="im-cta-heading" data-split className="font-display text-h2">
            Better partnerships begin with better understanding.
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
            Let&apos;s build your next campaign through audience intelligence,
            creator expertise, and the human creativity that turns insight into
            cultural impact.
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
