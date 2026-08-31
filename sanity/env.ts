/* Sanity connection details. Public by design — the project id and
   dataset ship in the page (the Content Lake is read-only without a
   token, and the production dataset is public per the Free plan). */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy it from .env.example into .env.local (or Vercel).`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/* Pinned so query semantics never change under us. Bump deliberately. */
export const apiVersion = "2026-08-01";

/* The Studio's mount point inside the Next app (SOW §2: "editing
   dashboard on a CLICK subdomain, e.g. clickmedia.group/studio"). */
export const studioBasePath = "/studio";
