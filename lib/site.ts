/**
 * Absolute origin for canonical + Open Graph URLs, robots.txt, sitemap.xml
 * and the JSON-LD @ids. Every one of those must be absolute, so a wrong
 * value here is wrong everywhere — hence one resolution, shared.
 *
 * Order:
 *  1. NEXT_PUBLIC_SITE_URL — set this once the custom domain is live; it
 *     is the only value that survives a domain change.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's own production host (no
 *     protocol), injected automatically. Means a Vercel deploy is correct
 *     with zero configuration. It always names the *production* domain,
 *     including on preview builds, which is what canonicals want.
 *  3. localhost, for dev.
 *
 * Read on the server only (metadata, robots, sitemap, JSON-LD), so the
 * unprefixed Vercel variable is readable — no NEXT_PUBLIC_ needed.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
