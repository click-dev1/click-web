import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import WorkExplorer from "@/components/WorkExplorer";
import ContactButton from "@/components/contact/ContactButton";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Smarter decisions. Stronger partnerships. Better results. Explore CLICK's influencer marketing and experiential campaigns — each one starting with what the intelligence found.",
  alternates: { canonical: "/work" },
};

const BEATS = [
  {
    n: "01",
    title: "What the intelligence found",
    body: "The insight that started everything — the audience overlap, the hidden community, the cultural signal others missed. Stated plainly.",
  },
  {
    n: "02",
    title: "What we built",
    body: "The strategy, creators and creative the insight produced — hero film, creator content, behind-the-scenes moments.",
  },
  {
    n: "03",
    title: "What it delivered",
    body: "Three to five metrics tied to the business objective. Real numbers, minimal framing.",
  },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Smarter decisions. Stronger partnerships. Better results."
        lede="Every campaign starts with what the intelligence found. Explore the partnerships that show what happens next."
        ctas={[{ label: "Talk With Our Team", primary: true, modal: true }]}
        signal="overlap"
      />

      <WorkExplorer />

      {/* ---- the three-beat structure, explained once ---- */}
      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="beats-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> How every case study is told
          </p>
          <h2 id="beats-heading" data-split className="font-display text-h2 max-w-3xl">
            A story with a scorecard, not a report.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BEATS.map((b) => (
              <article key={b.n} data-reveal className="card-surface rounded-xl p-7">
                <p className="eyebrow mb-3">
                  <span className="tick">{b.n}</span>
                </p>
                <h3 className="font-display text-h3">{b.title}</h3>
                <p className="mt-4 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                  {b.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- final CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="work-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="work-cta-heading" data-split className="font-display text-h2">
            Ready to build your next success story?
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
            Whether you&apos;re launching a product, growing your brand, or
            creating your next cultural moment, we&apos;ll help connect your
            business with the right creators, audiences, and ideas.
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
