/**
 * Migrates the CLICK team from content/site.ts into Sanity.
 *
 *   pnpm seed:team
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local. Idempotent: ids are
 * deterministic (person-<slug>) and each portrait uploads once per
 * filename, so re-running updates in place.
 *
 * Reads content/site.ts rather than restating the names and roles, so the
 * migration cannot drift from what the site renders today. Once CLICK has
 * edited the team in the Studio, STOP RUNNING THIS.
 *
 * `perspective` is deliberately not invented for anyone. The file carries
 * none, and a real person does not get words put in their mouth to fill a
 * card — the grid says the line is still to be collected.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { people } from "../content/site";

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

const PUBLIC_DIR = join(process.cwd(), "public");

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function uploadOnce(publicPath: string) {
  const filename = basename(publicPath);
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  );
  if (existing) return existing;
  const abs = join(PUBLIC_DIR, publicPath);
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`);
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename,
  });
  console.log(`     uploaded ${filename}`);
  return asset._id;
}

async function main() {
  console.log(`Migrating ${people.length} team members → ${projectId}/${dataset}\n`);

  for (const [i, p] of people.entries()) {
    const slug = slugify(p.name);
    const photo = p.photo
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: await uploadOnce(p.photo) },
          alt: `${p.name} — ${p.role}, CLICK`,
          credit: "Supplied by CLICK.",
        }
      : undefined;

    await client.createOrReplace({
      _id: `person-${slug}`,
      _type: "person",
      name: p.name,
      role: p.role,
      ...(photo ? { photo } : {}),
      ...(p.recognition ? { recognition: p.recognition } : {}),
      sortOrder: i + 1,
    });

    console.log(
      `  ${String(i + 1).padStart(2)}  ${p.name} — ${p.role}` +
        (p.photo ? "  [portrait]" : ""),
    );
  }

  console.log("\nDone. Perspective lines are left empty by design — collect them.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
