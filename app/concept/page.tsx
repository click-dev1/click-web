import type { Metadata } from "next";
import ConceptExperience from "@/components/concept/ConceptExperience";

export const metadata: Metadata = {
  title: "Concept 001",
  description:
    "A self-contained scroll experience: one wordmark, five acts. Independent design concept.",
  alternates: { canonical: "/concept" },
};

export default function ConceptPage() {
  return <ConceptExperience />;
}
