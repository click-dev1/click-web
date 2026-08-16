import type { Metadata } from "next";
import Ecosystem from "@/components/Ecosystem";
import {
  Hero,
  Journeys,
  Marquee,
  Intelligence,
  Work,
  Recognition,
  FinalCta,
} from "@/components/Sections";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Journeys />
      <Marquee />
      <Intelligence />
      <Work />
      <Recognition />
      <Ecosystem />
      <FinalCta />
    </>
  );
}
