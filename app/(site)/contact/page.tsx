import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import HubSpotInline from "@/components/contact/HubSpotInline";
import { contact } from "@/content/manifest";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's start the conversation. Whether you're a brand looking to drive business results, a creator building your next chapter, or a potential partner — tell us what you're building.",
  alternates: { canonical: "/contact" },
};

/* Four ways in, one form. Every card lands on the same HubSpot form —
   the routing happens in HubSpot, not in four separate forms. */
const CARDS = [
  {
    id: "enquiry",
    title: "I'm a Brand",
    body: "Looking to launch an influencer marketing campaign, experiential activation, or strategic creator partnership.",
    cta: "Talk With Our Team",
  },
  {
    id: "creator-network",
    title: "I'm a Creator",
    body: "Interested in representation with CLICK Talent, or joining the Creator Network to get on our radar.",
    cta: "Join the Creator Network",
  },
  {
    id: "enquiry",
    title: "I'm a Partner",
    body: "Interested in technology, media, agency, platform, or commercial partnerships.",
    cta: "Let's Connect",
  },
  {
    id: "enquiry",
    title: "General Inquiry",
    body: "Questions about CLICK, or looking to connect with the appropriate team.",
    cta: "Contact Us",
  },
];

const NETWORK_BENEFITS = [
  "Receive a complimentary audience intelligence snapshot",
  "Be considered for future brand partnerships",
  "Introduce yourself to our Talent team",
  "Receive opportunities aligned with your audience and content",
  "Stay connected as new opportunities become available",
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/clickmediagroup/" },
  { label: "Instagram", href: "https://www.instagram.com/weareclicktalent" },
  { label: "TikTok", href: "https://www.tiktok.com/@clickmgmt" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Start the Conversation"
        lede="Every great partnership begins with understanding your goals. Whether you're a brand looking to drive business results, a creator building your next chapter, or a potential partner — we'd love to learn what you're building."
        signal="overlap"
        aside={
          <div className="insight-frame">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> Prefer email?
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="font-display text-h3 break-all transition-opacity hover:opacity-70"
            >
              {contact.email}
            </a>
          </div>
        }
      />

      {/* ---- routing cards ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="route-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="route-heading" data-split className="font-display text-h2 max-w-3xl">
            How can we help?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <a
                key={c.title}
                href={`#${c.id}`}
                data-reveal
                className="card-surface group block rounded-xl p-6 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-h3">{c.title}</h3>
                <p className="mt-3 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                  {c.body}
                </p>
                <span className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                  {c.cta} <span className="btn-arrow">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---- creator network — canonical home ---- */}
      <section
        id="creator-network"
        data-signal="overlap"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="creator-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Creator Network
          </p>
          <h2 id="creator-heading" data-split className="font-display text-h2 max-w-3xl">
            Two ways to work with CLICK.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-6 text-lg leading-body">
              <p>
                <strong className="font-bold">CLICK Talent — Representation.</strong>{" "}
                <span style={{ color: "var(--ink-muted)" }}>
                  Full management for established creators: a dedicated
                  manager, commercial strategy, and the resources of the
                  GameSquare ecosystem behind your business.
                </span>
              </p>
              <p>
                <strong className="font-bold">The Creator Network — Open to all.</strong>{" "}
                <span style={{ color: "var(--ink-muted)" }}>
                  No commitment, no exclusivity, no obligation. Introduce
                  yourself and become discoverable as opportunities arise.
                </span>
              </p>
              <p style={{ color: "var(--ink-muted)" }}>
                One form serves both — tell us which path interests you and
                the Talent team picks it up.
              </p>
              <div>
                <a href="#enquiry" className="btn-primary">
                  Join the Creator Network <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
            <aside className="insight-frame self-start">
              <p className="eyebrow mb-4">
                <span className="tick">◉</span> Why join the Creator Network?
              </p>
              <ul className="flex flex-col gap-3">
                {NETWORK_BENEFITS.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-body">
                    <span aria-hidden="true">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ---- the form ---- */}
      <section
        id="enquiry"
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="enquiry-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow pill mb-4">
              <span className="tick">●</span> Start the conversation
            </p>
            <h2 id="enquiry-heading" data-split className="font-display text-h2">
              Tell us what you&apos;re building.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
              A few details and we&apos;ll connect you with the right team —
              brands, creators and partners alike. Budget and timeline are
              conversation questions, not form fields.
            </p>
            <p className="mt-6 text-sm">
              Prefer email?{" "}
              <a
                href={`mailto:${contact.email}`}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {contact.email}
              </a>
            </p>
          </div>
          <HubSpotInline />
        </div>
      </section>

      {/* ---- stay connected ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="connect-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Stay connected
          </p>
          <h2 id="connect-heading" data-split className="font-display text-h2 max-w-3xl">
            Creator news, campaign launches, industry insights.
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="chip"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
