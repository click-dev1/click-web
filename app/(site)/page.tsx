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
