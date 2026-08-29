import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { isLegalPublishable, legalPages } from "@/content/legal";

const page = legalPages.terms;

/* noindex until counsel signs the text off — see content/legal.ts. */
export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/terms-of-use" },
  robots: isLegalPublishable(page)
    ? { index: true, follow: true }
    : { index: false, follow: true },
};

export default function TermsOfUsePage() {
  return <LegalPage page={page} />;
}
