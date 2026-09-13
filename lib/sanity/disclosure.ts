import type { CaseStudy, FiguresSource } from "./types";

/* Where the published figures came from, said out loud.
   
   This used to be a hand-written sentence in content/site.ts naming
   Capcom, Optus, Maybelline and McDonald's. That sentence was correct on
   the day it was written and would have quietly started lying the first
   time CLICK added a case study in the Studio — the whole point of the
   migration is that nobody has to remember to edit a paragraph in a code
   file. So it is derived from the documents instead.

   No imports from ./client here: WorkExplorer is a client component, and
   pulling the configured Sanity client into the browser bundle to read a
   string would ship a read token's worth of surface area for nothing. */

/** "a", "a and b", "a, b and c" — the way the disclosure line reads. */
function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const CLAUSES: Record<FiguresSource, (brands: string) => string> = {
  "client-confirmed": (b) => `${b} figures as confirmed by CLICK`,
  "verified-public": (b) => `${b} figures as published on clickmedia.group`,
  pending: (b) => `${b} details pending client confirmation`,
};

const ORDER: FiguresSource[] = [
  "client-confirmed",
  "verified-public",
  "pending",
];

/** The disclosure under the /work grid, built from what is actually there. */
export function workDisclosure(caseStudies: CaseStudy[]): string {
  const clauses = ORDER.map((source) => {
    const brands = [
      ...new Set(
        caseStudies.filter((c) => c.figuresSource === source).map((c) => c.brand),
      ),
    ];
    return brands.length ? CLAUSES[source](list(brands)) : null;
  }).filter(Boolean);

  if (!clauses.length) return "";
  return `${clauses.join("; ")}. Insight lines are editorial interpretations pending client confirmation.`;
}

/** The disclosure under one case study's results. */
export function figuresDisclosure(source: FiguresSource): string {
  switch (source) {
    case "client-confirmed":
      return "Figures as confirmed by CLICK.";
    case "verified-public":
      return "Figures as published on clickmedia.group. Insight line is an editorial interpretation pending client confirmation.";
    default:
      return "Campaign details pending client confirmation.";
  }
}
