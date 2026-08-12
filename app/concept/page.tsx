import type { Metadata } from "next";
import ConceptExperience from "@/components/concept/ConceptExperience";

export const metadata: Metadata = {
  title: "Concept 001 — CLICK · Independent Concept",
  description:
    "A self-contained scroll experience: one wordmark, five acts, all four Signal design directions. Independent design concept.",
};

export default function ConceptPage() {
  return <ConceptExperience />;
}
