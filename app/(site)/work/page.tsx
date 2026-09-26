import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import WorkExplorer from "@/components/WorkExplorer";
import ContactButton from "@/components/contact/ContactButton";
import { fetchCaseStudies, fetchWorkPage } from "@/lib/sanity/caseStudy";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";

const DESCRIPTION =
  "Smarter decisions. Stronger partnerships. Better results. Explore CLICK Influence's influencer marketing, experiential and in-game campaigns — each one starting with what the intelligence found.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchWorkPage();
  return {
    title: page?.seo?.title ?? "Work",
    description: page?.seo?.description ?? DESCRIPTION,
    alternates: { canonical: "/work" },
  };
}

export default async function WorkPage() {
  const [caseStudies, page] = await Promise.all([
    fetchCaseStudies(),
    fetchWorkPage(),
  ]);

  return (
    <>
      <JsonLd nodes={[breadcrumbList([{ name: "Work", path: "/work" }])]} />
      <PageHero
        eyebrow={page?.heroEyebrow ?? "Our Work"}
        title={
          page?.heroTitle ??
          "Smarter decisions. Stronger partnerships. Better results."
        }
        lede={
          page?.heroLede ??
          "Every campaign starts with what the intelligence found. Explore the partnerships that show what happens next."
        }
        ctas={[{ label: "Talk With Our Team", primary: true, modal: true }]}
        signal="overlap"
      />

      <WorkExplorer
        caseStudies={caseStudies}
        reels={page?.reels ?? []}
        reelsEyebrow={page?.reelsEyebrow}
        reelsHeading={page?.reelsHeading}
        brandsEyebrow={page?.brandsEyebrow}
        brandsHeading={page?.brandsHeading}
        brandWall={page?.brandWall}
      />

      {/* ---- final CTA ---- */}
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-28 md:px-8"
        aria-labelledby="work-cta-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="work-cta-heading" data-split className="font-display text-h2">
            {page?.ctaHeading ?? "Ready to build your next success story?"}
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
            {page?.ctaBody ??
              "Whether you're launching a product, growing your brand, or creating your next cultural moment, we'll help connect your business with the right creators, audiences, and ideas."}
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
