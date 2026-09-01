import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Placeholder from "@/components/Placeholder";
import TalentMedia from "@/components/TalentMedia";
import ContactButton from "@/components/contact/ContactButton";
import { fetchRoster } from "@/lib/sanity/talent";
import { recognition } from "@/content/manifest";

export const metadata: Metadata = {
  title: "Talent Management",
  description:
    "Building creator businesses that last. CLICK partners with talent to build businesses beyond the screen — strategic partnerships, commercial strategy, and long-term career development.",
  alternates: { canonical: "/talent-management" },
};

const SERVICES = [
  {
    label: "Business Strategy",
    items: [
      "Career Development",
      "Personal Brand Strategy",
      "Commercial Planning",
      "Audience Growth",
      "Business Advisory",
    ],
  },
  {
    label: "Brand Partnerships",
    items: [
      "Sponsorship Strategy",
      "Partnership Negotiation",
      "Long-Term Relationships",
      "Campaign Management",
    ],
  },
  {
    label: "Business Growth",
    items: [
      "Product Development",
      "Licensing Strategy",
      "Merchandise",
      "Venture Development",
      "New Revenue Streams",
    ],
  },
  {
    label: "Creative & Production",
    items: [
      "Content Strategy",
      "Production Partnerships",
      "Creative Development",
      "Platform Strategy",
    ],
  },
  {
    label: "Business Operations",
    items: [
      "Legal Support",
      "Contract Management",
      "Data Analysis & Reporting",
      "Commercial Advisory",
    ],
  },
];

const JOURNEY = ["Creator", "Audience", "Community", "Brand", "Business", "Legacy"];

export default async function TalentManagementPage() {
  const roster = await fetchRoster();
  /* The whole US roster leads, then one Australian creator per category:
     the emphasis is on the market CLICK is scaling into, without losing
     the breadth the Australian roster is there to show. */
  const featured = roster.filter((t) => t.featured);
  const spotlight = [
    ...featured.filter((t) => t.region === "United States"),
    ...featured
      .filter((t) => t.region !== "United States")
      .filter(
        (t, i, rest) => rest.findIndex((x) => x.category === t.category) === i,
      ),
  ].slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="Talent · Talent Management"
        title="Building creator businesses that last."
        lede="Creators are entrepreneurs, storytellers, entertainers, and brands in their own right. CLICK partners with talent to build businesses beyond the screen — through strategic partnerships, commercial strategy, and long-term career development."
        ctas={[
          { href: "/contact#creator-network", label: "Join CLICK Talent", primary: true },
          { label: "Talk With Our Team", modal: true },
        ]}
        signal="overlap"
        aside={
          /* the award leads — quiet, confident, singular */
          <div className="insight-frame">
            <p className="font-display text-h3">{recognition.line}</p>
            <p className="eyebrow mt-2">
              <span className="tick">◆</span> {recognition.years}
            </p>
          </div>
        }
      />

      {/* ---- More Than Management ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="more-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> More than management
          </p>
          <h2 id="more-heading" data-split className="font-display text-h2 max-w-3xl">
            Great careers aren&apos;t built campaign by campaign.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-5 text-lg leading-body">
              <p>
                Established in 2017, CLICK is a global, digital-first talent
                management agency and ventures studio operating at the
                intersection of creators, culture, and brands. With offices
                around the world, we represent influential talent across
                gaming, sports, lifestyle, comedy, and entertainment.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                As long-term business partners, we help creators transform
                audiences into businesses — building personal brands, launching
                products, securing strategic partnerships, and creating new
                revenue streams that endure.
              </p>
            </div>
            <Placeholder label="Creator & manager · client photography" ratio="4/3" />
          </div>
        </div>
      </section>

      {/* ---- Business Partners + The CLICK Advantage ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="partners-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow pill mb-4">
                <span className="tick">●</span> Business partners for the creator economy
              </p>
              <h2 id="partners-heading" data-split className="font-display text-h3">
                Today&apos;s creators are entrepreneurs, founders, and media
                companies.
              </h2>
              <p className="mt-5 text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
                Our role is to provide the strategy, operational support, and
                commercial expertise that lets creators focus on what they do
                best — creating. Our talent managers are consistently
                recognized among Business Insider&apos;s Top Talent Managers,
                and every decision is guided by long-term value, not
                short-term opportunities.
              </p>
            </div>
            <div>
              <p className="eyebrow pill mb-4">
                <span className="tick">●</span> The CLICK advantage
              </p>
              <h2 data-split className="font-display text-h3">
                We work both sides of every great partnership.
              </h2>
              <p className="mt-5 text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
                Every day our teams help brands identify the right creators
                while helping creators understand what brands value most. That
                dual perspective — and the reach of the GameSquare ecosystem —
                lets us negotiate better and create opportunities that deliver
                for both sides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Technology & Intelligence (no tool names here) ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="intel-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Technology &amp; intelligence
          </p>
          <h2 id="intel-heading" data-split className="font-display text-h2 max-w-3xl">
            Better intelligence creates better creator businesses.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <Placeholder label="Strategy session · client photography" ratio="4/3" />
            <div className="flex flex-col gap-5 text-lg leading-body lg:pl-8">
              <p>
                Great creators know their audience. Great creator businesses
                understand them.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Our team uses the same enterprise intelligence ecosystem
                trusted by the world&apos;s biggest brands to help creators
                make smarter strategic decisions — understanding what resonates
                with their communities, identifying the right partnerships, and
                uncovering new growth opportunities.
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                Technology doesn&apos;t replace creative instinct. It gives our
                team the intelligence to help creators build stronger
                businesses and create with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Services ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Services
          </p>
          <h2 id="services-heading" data-split className="font-display text-h2 max-w-3xl">
            A ventures studio behind every career.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article key={s.label} data-reveal className="card-surface rounded-xl p-6">
                <h3 className="font-display text-2xl mb-4">{s.label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
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

      {/* ---- Creator Growth Journey ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="journey-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Built for long-term growth
          </p>
          <h2 id="journey-heading" data-split className="font-display text-h2 max-w-3xl">
            Great creators build audiences. Great businesses build legacies.
          </h2>
          <ol className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-6">
            {JOURNEY.map((stage, i) => (
              <li key={stage} data-reveal className="flex items-center gap-4">
                <span
                  className={`font-display ${
                    i === JOURNEY.length - 1 ? "text-h2" : "text-h3 opacity-80"
                  }`}
                >
                  {stage}
                </span>
                {i < JOURNEY.length - 1 && (
                  <span aria-hidden="true" className="font-data">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Talent Spotlight ---- */}
      {spotlight.length > 0 && (
        <section
          data-signal="quiet"
          className="hairline-t relative z-10 px-5 py-24 md:px-8"
          aria-labelledby="spotlight-heading"
        >
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Talent spotlight
            </p>
            <h2 id="spotlight-heading" data-split className="font-display text-h2 max-w-3xl">
              The creators behind the businesses.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {spotlight.map((t) => (
                <Link
                  key={t.slug}
                  href={`/talent/${t.slug}`}
                  data-reveal
                  className="card-surface group block overflow-hidden rounded-xl"
                >
                  <TalentMedia
                    talent={t}
                    label={`${t.name} · portrait`}
                    ratio="3/4"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="rounded-none border-0"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-2xl">{t.name}</h3>
                    <p className="eyebrow mt-1.5">
                      {t.category} · {t.audience}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/talent" className="btn-ghost">
                View the Talent Directory <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- Two Ways to Work With Us ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10"
        aria-label="Two ways to work with us"
      >
        <div className="journeys">
          <Link
            href="/contact#creator-network"
            className="journey-a texture-grid group relative block px-5 py-16 md:px-10 md:py-24"
          >
            <p className="mb-4">
              <span className="eyebrow pill">
                <span className="tick">01</span> Representation
              </span>
            </p>
            <h2 className="font-display text-h2">CLICK Talent</h2>
            <p className="mt-4 max-w-md text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
              Full management for established creators: a dedicated manager,
              commercial strategy, and the resources of the GameSquare
              ecosystem behind your business.
            </p>
            <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
              Apply for Representation <span className="btn-arrow">→</span>
            </span>
          </Link>

          <Link
            href="/contact#creator-network"
            className="journey-b group relative block border-t px-5 py-16 md:border-t-0 md:border-l md:px-10 md:py-24 [border-color:var(--hairline)]"
          >
            <p className="mb-4">
              <span className="eyebrow pill">
                <span className="tick">02</span> Open to all creators
              </span>
            </p>
            <h2 className="font-display text-h2 display-outline">
              The Creator Network
            </h2>
            <p className="mt-4 max-w-md text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
              Introduce yourself and become discoverable as opportunities
              arise. No commitment, no exclusivity — and every member can opt
              in to a complimentary audience intelligence snapshot.
            </p>
            <span className="btn-ghost mt-8 inline-flex group-hover:border-[var(--signal)]">
              Join the Creator Network <span className="btn-arrow">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="tm-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="tm-cta-heading" data-split className="font-display text-h2">
            Whether established or just beginning — build what&apos;s next.
          </h2>
          <div data-reveal className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/contact#creator-network" className="btn-primary">
              Join CLICK Talent <span className="btn-arrow">→</span>
            </Link>
            <ContactButton className="btn-ghost">
              Talk With Our Team <span className="btn-arrow">→</span>
            </ContactButton>
          </div>
        </div>
      </section>
    </>
  );
}
