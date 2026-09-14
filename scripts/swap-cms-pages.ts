/**
 * Promotes a rebuilt page from its temporary `-cms` slug to the real one.
 *
 *   pnpm swap:pages            # report only
 *   pnpm swap:pages --apply    # actually do it
 *
 * The third step of the migration procedure in docs/SANITY.md. For each
 * page it copies `page-<slug>-cms` to `page-<slug>`, sets the real slug,
 * clears the noIndex flag that kept the twin out of search, and deletes
 * the temporary document.
 *
 * The matching hand-built route file must be deleted in the same commit.
 * A static route wins over this one, so until the file goes the CMS page
 * builds but nobody can reach it.
 *
 * Reversible: `git restore` the route files and re-run the seed scripts.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: "2026-08-01", useCdn: false });

const PAGES = ["influencer-marketing", "about", "contact", "talent-management"];
const apply = process.argv.includes("--apply");

type PageDoc = Record<string, unknown> & {
  _id: string;
  _type: string;
  seo?: Record<string, unknown>;
};

async function main() {
  console.log(apply ? "Swapping pages\n" : "DRY RUN — pass --apply to commit\n");

  for (const slug of PAGES) {
    const from = `page-${slug}-cms`;
    const to = `page-${slug}`;

    const doc = (await client.getDocument(from)) as PageDoc | undefined;
    if (!doc) {
      console.log(`  ${slug.padEnd(22)} no ${from} — skipped`);
      continue;
    }
    const existing = await client.getDocument(to);
    if (existing) {
      console.log(`  ${slug.padEnd(22)} ${to} already exists — skipped`);
      continue;
    }

    /* Drop noIndex rather than set it false: the field is optional and an
       absent flag reads more clearly in the Studio than an unticked one. */
    const seo = { ...(doc.seo ?? {}) };
    delete seo.noIndex;

    /* _rev/_createdAt/_updatedAt belong to the document we are copying
       FROM; carrying them onto a new id would hand Sanity a revision it
       has never seen. */
    const { _rev, _createdAt, _updatedAt, ...rest } = doc as PageDoc &
      Record<string, unknown>;
    void _rev;
    void _createdAt;
    void _updatedAt;

    const next = {
      ...rest,
      _id: to,
      _type: doc._type,
      slug: { _type: "slug", current: slug },
      seo,
    };

    if (apply) {
      await client.createOrReplace(next);
      await client.delete(from);
    }
    console.log(`  ${slug.padEnd(22)} ${from} -> ${to}  (noIndex cleared)`);
  }

  if (apply) {
    console.log("\nDone. Now delete the matching hand-built route files:");
    for (const s of PAGES) console.log(`   app/(site)/${s}/page.tsx`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
