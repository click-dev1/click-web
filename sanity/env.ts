/* Sanity connection details. Public by design — the project id and
   dataset ship in the page (the Content Lake is read-only without a
   token, and the production dataset is public per the Free plan).

   Both carry their real value as the default, for the same reason
   lib/site.ts defaults the site origin rather than demanding an env var:
   the project is stable, its id is already committed in .env.example,
   and a deploy environment that has not had the variable added by hand
   should not fail the build over a public constant. The env vars remain
   as overrides — point a preview at another project or dataset without
   touching code. `||`, not `??`: an empty string in a deploy environment
   means "unset", not "use nothing". */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eclvbmom";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/* Pinned so query semantics never change under us. Bump deliberately. */
export const apiVersion = "2026-08-01";

/* The Studio's mount point inside the Next app (SOW §2: "editing
   dashboard on a CLICK subdomain, e.g. clickmedia.group/studio"). */
export const studioBasePath = "/studio";
