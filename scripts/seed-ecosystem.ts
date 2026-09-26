/**
 * Moves the last two hardcoded sections into the CMS: the GameSquare
 * ecosystem on the home page and the brand wall on /work.
 *
 *   pnpm seed:ecosystem            # dry run — prints what it would set
 *   pnpm seed:ecosystem --apply    # writes
 *
 * Additive: every field is `setIfMissing`, so anything an editor has
 * already written in the Studio is left alone and running it twice is a
 * no-op. Both singletons must already exist (seed:home, seed:deck).
 *
 * The values are the ones content/manifest.ts carried, which the site no
 * longer reads.
 */
import { createClient } from "@sanity/client";
import { brands, ecosystem } from "../content/manifest";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });
const apply = process.argv.includes("--apply");

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const home = {
  ecosystemEyebrow: "Backed by the GameSquare ecosystem",
  ecosystemHeading: "One ecosystem. Endless possibilities.",
  ecosystemGroups: ecosystem.groups.map((g) => ({
    _key: `eco-${slug(g.label)}`,
    _type: "ecosystemGroup",
    label: g.label,
    nodes: g.nodes.map((n) => ({
      _key: `eco-${slug(n.name)}`,
      _type: "ecosystemNode",
      name: n.name,
      blurb: n.blurb,
    })),
  })),
};

const work = {
  brandsEyebrow: "Brands we’ve partnered with",
  brandsHeading: "From global brands to emerging challengers.",
  brandWall: brands.clients,
};

async function main() {
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_id in ["homePage", "workPage"]]{ _id }`,
  );
  const ids = new Set(existing.map((d) => d._id));
  for (const id of ["homePage", "workPage"]) {
    if (!ids.has(id)) {
      console.error(`${id} does not exist yet — run its seed first.`);
      process.exit(1);
    }
  }

  console.log("homePage ← setIfMissing", JSON.stringify(home, null, 2));
  console.log("workPage ← setIfMissing", JSON.stringify(work, null, 2));
  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.");
    return;
  }

  await client
    .transaction()
    .patch("homePage", (p) => p.setIfMissing(home))
    .patch("workPage", (p) => p.setIfMissing(work))
    .commit();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
