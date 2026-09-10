import { createClient } from "next-sanity";
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
