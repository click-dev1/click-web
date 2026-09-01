/**
 * SUPERSEDED — do not run. This migrated the original placeholder roster
 * from content/site.ts, whose invented creators have since been deleted in
 * favour of the real one. Re-running it would put them back. The live
 * roster is scripts/seed-roster.ts (pnpm seed:roster). Kept for reference.
 *
 * One-shot migration of the talent roster from content/site.ts into the
 * Sanity Content Lake.
 *
 *   pnpm seed:sanity
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.local (an Editor token from
 * sanity.io → project → API → Tokens). Idempotent: documents get
 * deterministic ids, so re-running updates in place instead of
 * duplicating, and an image is only uploaded once per filename.
 *
 * Status mapping (the VerificationStatus concept retires in favour of
 * Sanity's own drafts):
 *   verified-public / client-confirmed / awaiting-confirmation → published
 *   placeholder-do-not-publish                                 → draft only
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { roster } from "../content/site";
import type { Talent } from "../content/site";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });
const PUBLIC_DIR = join(process.cwd(), "public");
const today = new Date().toISOString().slice(0, 10);

/* "70% center" → hotspot {x: 0.7, y: 0.5}. Sanity's hotspot is the
   focal point the crop keeps in frame — the same intent as object-position. */
function hotspotFromPosition(position?: string) {
  if (!position) return undefined;
  const pct = (word: string) => {
    if (word === "left" || word === "top") return 0;
    if (word === "right" || word === "bottom") return 1;
    if (word === "center") return 0.5;
    const n = parseFloat(word);
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n / 100)) : 0.5;
  };
  const [x = "center", y = "center"] = position.trim().split(/\s+/);
  return { _type: "sanity.imageHotspot", x: pct(x), y: pct(y), width: 0.4, height: 0.4 };
}

async function uploadOnce(publicPath: string) {
  const filename = basename(publicPath);
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  );
  if (existing) return existing;
  const abs = join(PUBLIC_DIR, publicPath);
  if (!existsSync(abs)) throw new Error(`Image not found: ${abs}`);
  const asset = await client.assets.upload("image", createReadStream(abs), { filename });
  console.log(`  uploaded ${filename}`);
  return asset._id;
}

const key = (prefix: string, i: number) => `${prefix}-${i}`;

async function toDocument(t: Talent, index: number) {
  const isPlaceholder = t.status === "placeholder-do-not-publish";
  const baseId = `talent-${t.slug}`;
  const _id = isPlaceholder ? `drafts.${baseId}` : baseId;

  const portrait = t.image
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: await uploadOnce(t.image) },
        hotspot: hotspotFromPosition(t.imagePosition),
        alt: t.imageAlt ?? t.name,
        credit: t.imageCredit,
      }
    : undefined;

  return {
    _id,
    _type: "talent",
    name: t.name,
    slug: { _type: "slug", current: t.slug },
    category: t.category,
    platforms: t.platforms.map((platform, i) => ({
      _key: key("platform", i),
      _type: "platformPresence",
      platform,
    })),
    audience: t.audience,
    region: t.region,
    location: t.location,
    managed: t.managed,
    bio: t.bio,
    partners: t.partners,
    ventures: t.ventures,
    featured: t.featured ?? false,
    sortOrder: index + 1,
    portrait,
    story: t.story.map((s, i) => ({ _key: key("beat", i), _type: "storyBeat", ...s })),
    notes: `Imported from content/site.ts on ${today}. Status at import: ${t.status}.${
      isPlaceholder ? " Placeholder — replace with a real creator before publishing." : ""
    }`,
  };
}

async function main() {
  console.log(`Seeding ${roster.length} talent → ${projectId}/${dataset}`);
  for (const [i, t] of roster.entries()) {
    const doc = await toDocument(t, i);
    await client.createOrReplace(doc);
    console.log(`  ${doc._id.startsWith("drafts.") ? "draft    " : "published"} ${t.name}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
