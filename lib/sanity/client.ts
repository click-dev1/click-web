import { createClient, type QueryParams } from "next-sanity";
import { draftMode } from "next/headers";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/* Server-only read client.

   THE DATASET IS PRIVATE. Nothing — published or draft — can be read
   without a token, which is why SANITY_API_READ_TOKEN is required in
   every environment that builds the site, Production included. A public
   dataset would expose every field on every published document to
   anyone holding the project id, including fields the site never
   renders (the `notes` field on talent carries internal editorial
   commentary). See docs/SANITY.md.

   Perspective: published only, unless SANITY_PREVIEW_DRAFTS says
   otherwise. Drafts are an explicit opt-in and NOT inferred from the
   presence of a token — the token is mandatory in every environment now
   that the dataset is private, so "a token exists" no longer
   distinguishes an editor's laptop from a deployment.

   Getting that wrong is not cosmetic: draft reads are deliberately
   untagged (see lib/sanity/talent.ts), so any environment that silently
   fell into draft mode would have nothing for revalidateTag() to
   invalidate. The webhook would answer 200 and the page would never
   change. A staging deployment must therefore leave this unset, so it
   behaves exactly as Production does and is a true rehearsal for it. */
const token = process.env.SANITY_API_READ_TOKEN;

export const previewDrafts = process.env.SANITY_PREVIEW_DRAFTS === "true";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  /* The CDN is the right default for published reads on a static site.
     Draft reads bypass it — a draft that arrives one edit stale is worse
     than a slightly slower preview. */
  useCdn: !previewDrafts,
  token,
  perspective: previewDrafts ? "drafts" : "published",
});

/* Draft reads for an editor previewing from the Studio (see
   app/api/draft-mode). Same token, drafts perspective, never the CDN. */
const draftClient = client.withConfig({ perspective: "drafts", useCdn: false });

/** True only for a request that carries Next's draft-mode cookie. There is
    no request during generateStaticParams or the sitemap, where
    draftMode() throws — that is simply "not previewing". */
async function isPreviewing(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/**
 * Every Sanity read on the site goes through here.
 *
 * - An editor previewing (draft mode): drafts, uncached. Next already
 *   renders a draft-mode request fresh and serves it `private, no-store`,
 *   so a draft can never land in a cache another visitor is served from.
 * - Everyone else: published content, cached and tagged with the document
 *   types the read depends on, so the publish webhook (app/api/revalidate)
 *   invalidates exactly the pages it should. The one-hour TTL is a safety
 *   net, never the mechanism — see docs/SANITY.md.
 * - SANITY_PREVIEW_DRAFTS (local only): drafts for the whole build.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams,
  tags: string[],
): Promise<T> {
  if (await isPreviewing()) {
    return draftClient.fetch<T>(query, params, { cache: "no-store" });
  }
  return client.fetch<T>(
    query,
    params,
    previewDrafts ? {} : { next: { revalidate: 3600, tags } },
  );
}

/* A private dataset does not reject an unauthorised read — it returns an
   empty result set. So a build with a missing or wrong
   SANITY_API_READ_TOKEN succeeds and silently ships a site with no
   content at all: green build, no error anywhere. For the collections
   that are never legitimately empty, treat it as the misconfiguration it
   always is and fail the build loudly. */
export function assertPopulated<T>(rows: T[], what: string): T[] {
  if (!rows.length) {
    throw new Error(
      `Sanity returned no ${what}. This is almost always a missing or ` +
        `invalid SANITY_API_READ_TOKEN — the dataset is private, and an ` +
        `unauthorised read comes back empty rather than failing. See docs/SANITY.md.`,
    );
  }
  return rows;
}

/** The singleton counterpart to assertPopulated: a missing site-wide
    document is never a legitimate state, and letting the build ship a
    site with no navigation would be worse than failing it. */
export function assertPresent<T>(doc: T | null, what: string): T {
  if (!doc) {
    throw new Error(
      `Sanity returned no ${what}. Either the document has not been ` +
        `created (run the seed) or SANITY_API_READ_TOKEN is missing or ` +
        `invalid — the dataset is private, and an unauthorised read comes ` +
        `back empty rather than failing. See docs/SANITY.md.`,
    );
  }
  return doc;
}
