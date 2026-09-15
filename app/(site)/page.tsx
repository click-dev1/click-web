import type { Metadata } from "next";
import Ecosystem from "@/components/Ecosystem";
import { fetchHomePage } from "@/lib/sanity/home";
import {
  Hero,
  Journeys,
  Marquee,
  Intelligence,
  Work,
  Recognition,
  FinalCta,
} from "@/components/Sections";

export async function generateMetadata(): Promise<Metadata> {
  const home = await fetchHomePage();
  return {
    ...(home.seo?.title ? { title: home.seo.title } : {}),
    ...(home.seo?.description ? { description: home.seo.description } : {}),
    alternates: { canonical: "/" },
  };
}

/* The home page is a singleton with editable copy per section, not a
   block canvas — see sanity/schemaTypes/homePage.ts. The sections and
   their order are fixed; every word in them comes from the CMS. */
export default async function Home() {
  const home = await fetchHomePage();

  return (
    <>
      <Hero home={home} />
      <Journeys home={home} />
      <Marquee home={home} />
      <Intelligence home={home} />
      <Work home={home} />
      <Recognition home={home} />
      <Ecosystem />
      <FinalCta home={home} />
    </>
  );
}
