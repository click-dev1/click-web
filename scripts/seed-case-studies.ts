/**
 * Migrates the five campaigns from content/site.ts into Sanity.
 *
 *   pnpm seed:case-studies
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local. Idempotent: ids are
 * deterministic (caseStudy-<slug>), so re-running updates in place.
 *
 * It reads content/site.ts rather than restating the copy, so the
 * migration cannot drift from what the site renders today. Once CLICK has
 * edited a case study in the Studio, STOP RUNNING THIS — it would
 * overwrite their edits with the file's version. It exists to move the
 * content once.
 *
 * VerificationStatus splits in two here. Whether a case study is fit to
 * publish becomes draft vs published; where its figures came from stays
 * as a field, because that drives a disclosure line the reader sees.
 */
import { createClient } from "@sanity/client";
import { campaigns } from "../content/site";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-01",
  useCdn: false,
});

/* content/site.ts carried one field for two different questions. */
const FIGURES_SOURCE = {
  "client-confirmed": "client-confirmed",
  "verified-public": "verified-public",
  "awaiting-confirmation": "pending",
  "placeholder-do-not-publish": "pending",
} as const;

/** Only a placeholder was never fit to publish; the rest all render today. */
const isDraft = (status: string) => status === "placeholder-do-not-publish";

const NOTE =
  "Migrated from content/site.ts on 2026-09-13. Figures unchanged from what the site rendered; " +
  "“Where the figures came from” carries the old VerificationStatus.";

async function main() {
  console.log(`Migrating ${campaigns.length} case studies → ${projectId}/${dataset}\n`);

  for (const [i, c] of campaigns.entries()) {
    const draft = isDraft(c.status);
    const _id = `${draft ? "drafts." : ""}caseStudy-${c.slug}`;

    await client.createOrReplace({
      _id,
      _type: "caseStudy",
      brand: c.brand,
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      service: c.service,
      industry: c.industry,
      platforms: c.platforms,
      insight: c.insight,
      built: c.built,
      ...(c.resultsIntro ? { resultsIntro: c.resultsIntro } : {}),
      metrics: c.metrics.map((m, n) => ({
        _key: `m${n}`,
        _type: "metric",
        value: m.value,
        label: m.label,
      })),
      ...(c.proofLine ? { proofLine: c.proofLine } : {}),
      figuresSource: FIGURES_SOURCE[c.status],
      mediaLabel: c.mediaLabel,
      /* The home page's Featured Work section shows the first three. */
      featured: i < 3,
      sortOrder: i + 1,
      notes: NOTE,
    });

    console.log(
      `  ${String(i + 1).padStart(2)}  ${c.brand} — ${c.title}` +
        `  [${FIGURES_SOURCE[c.status]}]${draft ? " (draft)" : ""}`,
    );
  }

  console.log("\nDone. Review each in the Studio before treating it as live.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
