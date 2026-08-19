/**
 * Absolute origin for canonical + Open Graph URLs, robots.txt, sitemap.xml
 * and the JSON-LD @ids. Every one of those must be absolute, so a wrong
 * value here is wrong everywhere — hence one resolution, shared.
 *
 * The live domain is known and stable, so it is the default rather than
 * something a deploy environment has to supply: a missing env var can no
 * longer silently ship canonicals pointing at a preview host. www, not
 * the apex — canonicals must name the host the site is actually served
 * from, and the apex redirects to www.
 */
const PRODUCTION_ORIGIN = "https://www.clickmedia.group";

/**
 * Order:
 *  1. NEXT_PUBLIC_SITE_URL — an escape hatch for a staging host or a
 *     domain change, without a code edit.
 *  2. localhost in development, so dev never emits production URLs.
 *  3. The live domain.
 *
 * Read on the server only (metadata, robots, sitemap, JSON-LD).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_ORIGIN;
}

export const siteUrl = resolveSiteUrl();
