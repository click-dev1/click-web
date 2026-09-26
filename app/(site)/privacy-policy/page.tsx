import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { fetchLegalPage } from "@/lib/sanity/legal";

/* Edited in the Studio (Legal pages). noindex until counsel signs the
   text off — the "Signed off by counsel" switch on the document. */
export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchLegalPage("privacy-policy");
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/privacy-policy" },
    robots: page.approved ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function Page() {
  return <LegalPage page={await fetchLegalPage("privacy-policy")} />;
}
