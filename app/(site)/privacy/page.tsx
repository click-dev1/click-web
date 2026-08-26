import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contact } from "@/content/manifest";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CLICK Media Group collects, uses and protects your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

/* Structure only. The legal text is supplied and approved by CLICK's
   counsel before launch; until it lands, this page stays noindex. */
const SECTIONS = [
  {
    title: "Who we are",
    body: "CLICK Media Group entity details, contact information, and data-controller identification.",
  },
  {
    title: "What we collect",
    body: "Enquiry form submissions, Creator Network profiles, newsletter subscriptions, and — with consent — analytics data.",
  },
  {
    title: "How we use it",
    body: "Responding to enquiries, evaluating creator applications, delivering the opt-in audience intelligence snapshot, and improving the site.",
  },
  {
    title: "Cookies & consent",
    body: "The cookies in use on this site — including those set by the HubSpot form embed — and how preferences can be changed at any time.",
  },
  {
    title: "Your rights",
    body: "Access, correction, deletion, withdrawal of consent — including withdrawal of the audience-intelligence-snapshot consent — and how to exercise each.",
  },
  {
    title: "Data sharing & processors",
    body: "The full processor list (hosting, CRM, video delivery) with regions and safeguards.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" signal="quiet" />
      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-label="Privacy policy sections"
      >
        <div className="mx-auto max-w-3xl">
          <div className="insight-frame mb-12">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> Policy in preparation
            </p>
            <p className="text-sm leading-body">
              The full policy is being finalised. The headings below show its
              structure; for any privacy question in the meantime, email{" "}
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                {contact.email}
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col gap-10">
            {SECTIONS.map((s, i) => (
              <div key={s.title} data-reveal>
                <p className="eyebrow mb-2">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h2 className="font-display text-h3">{s.title}</h2>
                <p className="mt-3 leading-body" style={{ color: "var(--ink-muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
