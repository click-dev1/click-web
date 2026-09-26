/**
 * Builds the legacy redirect map from the Wayback Machine's record of the
 * domain, so the URLs of the two earlier sites (WordPress to mid-2025, then
 * Wix) land on the right page of this one instead of a 404.
 *
 *   pnpm redirects:build            # report what it would write
 *   pnpm redirects:build --apply    # write lib/legacy-redirects.ts + docs/REDIRECTS.csv
 *
 * Needs SANITY_API_READ_TOKEN in .env.local — talent profiles are matched
 * against the PUBLISHED roster, so an old creator URL only points at a
 * profile that actually exists.
 *
 * Run by hand, never at build time: the build must not depend on
 * archive.org being up, and the output is reviewed in git before it ships.
 *
 * The archive is UNTRUSTED input. A path is only accepted if it is plain
 * lowercase slug segments — no dots, no percent-encoding, and none of the
 * characters path-to-regexp treats as syntax — so nothing it returns can
 * turn into a pattern in next.config.ts. Destinations are always internal
 * paths chosen here; nothing from the request is carried into them, so no
 * redirect can be steered off-site.
 *
 * Re-run when CLICK's Search Console or Wix export arrives (add its paths
 * to EXTRA_PATHS) or when the roster changes.
 */
import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN in .env.local");
  process.exit(1);
}
const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-01",
  useCdn: false,
  perspective: "published",
});
const apply = process.argv.includes("--apply");
const ROOT = join(import.meta.dirname, "..");

/* ------------------------------------------------------------------ */
/* rules                                                               */
/* ------------------------------------------------------------------ */

/** Plain lowercase slug segments only. Rejects dots (files, Wix bundles),
    percent-encoding, and every path-to-regexp metacharacter. */
const SAFE_PATH = /^\/[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*)*$/;

/** Paths known from outside the archive — CLICK's Search Console or Wix
    export goes here. Same validation applies. */
const EXTRA_PATHS: string[] = [];

/** Routes the new site serves itself; never redirected. CMS page slugs,
    talent and case-study slugs are added from Sanity. */
const APP_ROUTES = ["/", "/talent", "/work", "/privacy-policy", "/cookie-policy", "/terms-of-use", "/studio"];

/** One-off pages of the earlier sites, mapped by hand after reading each
    archived page's title. `review` marks a judgement call worth a second
    look from CLICK. */
const PAGES: Record<string, { to: string; note: string; review?: boolean }> = {
  "/about-1": { to: "/about", note: "Wix About page" },
  "/our-work": { to: "/work", note: "Wix case studies index" },
  "/case-studies": { to: "/work", note: "WordPress case studies index" },
  "/benefit-cosmetics": { to: "/work", note: "WordPress case study, not on the new site" },
  "/maybelline-through-their-eyes": { to: "/work", note: "WordPress case study; a different campaign from Eyes Up" },
  "/coke-mcdonalds-gamerfeeds": { to: "/work", note: "WordPress case study, not on the new site" },
  "/multiversus": { to: "/work", note: "WordPress case study, not on the new site" },
  "/youtube-game-on": { to: "/work", note: "WordPress case study, not on the new site" },
  "/youtube-shorts": { to: "/work", note: "WordPress case study, not on the new site" },
  "/contact-us": { to: "/contact", note: "WordPress contact page" },
  "/thank-you": { to: "/contact", note: "WordPress form confirmation" },
  "/terms-conditions": { to: "/terms-of-use", note: "Wix terms page" },
  "/services": { to: "/", note: "WordPress services overview", review: true },
  "/click-live-program": { to: "/talent-management", note: "WordPress creator programme page", review: true },
  "/our-maps": { to: "/", note: "WordPress page, purpose unclear", review: true },
  "/creator-highlights": { to: "/talent", note: "WordPress creator showcase" },
  "/our-creators": { to: "/talent", note: "WordPress roster index" },
  "/our-creators-demo": { to: "/talent", note: "WordPress roster draft" },
  "/our-creators-demo1": { to: "/talent", note: "WordPress roster draft" },
};

/** Old creator-profile prefixes. A slug that matches a published profile
    goes to it; anything else lands on the roster. */
const TALENT_PREFIXES = ["talentprofiles", "our-creators", "creator", "creators"];

/** Old taxonomy archives (WordPress creator filters). */
const TAXONOMY_PREFIXES = ["genre", "primary-platform", "primary-content", "primary-deliverable", "contents"];

/** Old creator slugs that do not normalise to a current profile but
    belong to it: a creator's second channel lands on their profile, which
    is the closest page the new site has. Checked against each archived
    page's channel link — add an alias only on that evidence. */
const TALENT_ALIASES: Record<string, string> = {
  theboysgaming: "the-boys", // @yeptheboysgaming, the group's second channel
  moremuselk: "muselk", // Muselk's second channel
};

/** Left to 404 on purpose: WordPress defaults, author archives, Wix
    lightboxes and image-transform fragments. A redirect would pretend
    they were content. */
const DROP = [
  /^\/(hello-world|sample-page)$/,
  /^\/author(\/|$)/,
  /^\/popup-/,
  /^\/wp-/,
  /^\/(h|w|q|y|al|enc|quality|usm)_/,
];

/* ------------------------------------------------------------------ */
/* inputs                                                              */
/* ------------------------------------------------------------------ */

type Row = { path: string; action: "redirect" | "live" | "drop" | "invalid"; to: string; rule: string; review: boolean };

async function waybackPaths(): Promise<{ raw: number; paths: Map<string, string> }> {
  const url =
    "https://web.archive.org/cdx/search/cdx?url=clickmedia.group/*&output=json" +
    "&fl=original,statuscode,mimetype&collapse=urlkey";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wayback CDX returned ${res.status}`);
  const rows = (await res.json()) as string[][];
  const paths = new Map<string, string>(); // normalised path -> first raw original
  for (const [original, status, mime] of rows.slice(1)) {
    if (mime !== "text/html" || !/^(200|301|302)$/.test(status)) continue;
    const path = normalise(original);
    if (path !== null && !paths.has(path)) paths.set(path, original);
  }
  return { raw: rows.length - 1, paths };
}

/** Host, query and fragment stripped; lowercased; trailing slash removed.
    Returns null for anything that is not a URL on this domain. */
function normalise(original: string): string | null {
  let u: URL;
  try {
    u = new URL(original.startsWith("http") ? original : `https://${original}`);
  } catch {
    return null;
  }
  if (!/^(www\.)?clickmedia\.group$/i.test(u.hostname)) return null;
  const p = u.pathname.toLowerCase().replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

async function liveSlugs() {
  const [talent, work, pages] = await Promise.all([
    client.fetch<string[]>(`*[_type == "talent" && defined(slug.current)].slug.current`),
    client.fetch<string[]>(`*[_type == "caseStudy" && defined(slug.current)].slug.current`),
    client.fetch<string[]>(`*[_type == "page" && defined(slug.current)].slug.current`),
  ]);
  if (talent.length === 0) throw new Error("Sanity returned no talent — is SANITY_API_READ_TOKEN valid?");
  for (const s of [...talent, ...work, ...pages]) {
    if (!SAFE_PATH.test(`/${s}`)) throw new Error(`Unexpected slug shape in Sanity: ${JSON.stringify(s)}`);
  }
  return { talent, work, pages };
}

/* ------------------------------------------------------------------ */
/* classify                                                            */
/* ------------------------------------------------------------------ */

const key = (s: string) => s.replace(/-(new-format|\d+)$/, "").replace(/[^a-z0-9]/g, "");

function classify(path: string, live: Set<string>, roster: Map<string, string>): Row {
  const row = (action: Row["action"], to: string, rule: string, review = false): Row => ({ path, action, to, rule, review });

  if (!SAFE_PATH.test(path) && path !== "/") return row("invalid", "", "not a plain slug path");
  if (live.has(path)) return row("live", path, "served by the new site");
  if (DROP.some((re) => re.test(path))) return row("drop", "", "not content — left to 404");

  const page = PAGES[path];
  if (page) return row("redirect", page.to, page.note, page.review);

  const [, first, second, ...rest] = path.split("/");
  if (TALENT_PREFIXES.includes(first)) {
    if (!second || rest.length) return row("redirect", "/talent", "old roster path");
    const k = key(second);
    const slug = roster.get(k) ?? TALENT_ALIASES[k];
    return slug
      ? row("redirect", `/talent/${slug}`, "old profile of a current creator")
      : row("redirect", "/talent", "old profile, creator not on the current roster");
  }
  if (TAXONOMY_PREFIXES.includes(first)) return row("redirect", "/talent", "old creator filter archive");

  return row("drop", "", "unrecognised — review", true);
}

/* ------------------------------------------------------------------ */
/* output                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  const { raw, paths } = await waybackPaths();
  const { talent, work, pages } = await liveSlugs();
  for (const p of EXTRA_PATHS) if (!paths.has(p)) paths.set(p, p);

  const live = new Set([
    ...APP_ROUTES,
    ...pages.map((s) => `/${s}`),
    ...talent.map((s) => `/talent/${s}`),
    ...work.map((s) => `/work/${s}`),
  ]);
  const roster = new Map(talent.map((s) => [key(s), s]));

  const rows = [...paths.keys()].sort().map((p) => classify(p, live, roster));

  /* Explicit entries first (exact pages and matched profiles), then one
     catch-all per old prefix. Order is priority in next.config.ts. */
  const explicit = rows
    .filter((r) => r.action === "redirect" && !(r.to === "/talent" && isUnderPrefix(r.path)))
    .map((r) => ({ source: r.path, destination: r.to }));
  const catchAlls = [...TALENT_PREFIXES, ...TAXONOMY_PREFIXES].map((p) => ({
    source: `/${p}/:path*`,
    destination: "/talent",
  }));
  const redirects = [...explicit, ...catchAlls];

  for (const r of redirects) {
    if (!/^\/[a-z0-9/_-]*$/.test(r.destination) || r.destination.startsWith("//"))
      throw new Error(`Refusing non-internal destination ${r.destination}`);
    if (live.has(r.source)) throw new Error(`Refusing to shadow a live route: ${r.source}`);
  }

  /* Page slugs an editor must not take: a redirect is checked before the
     filesystem, so a CMS page at one of these addresses would never be
     reachable. Enforced in the Studio (sanity/schemaTypes/page.ts). */
  const reserved = [
    ...new Set([
      ...explicit.map((r) => r.source.split("/")[1]),
      ...TALENT_PREFIXES,
      ...TAXONOMY_PREFIXES,
    ]),
  ].sort();

  const count = (a: Row["action"]) => rows.filter((r) => r.action === a).length;
  console.log(`Archive: ${raw} captures -> ${paths.size} distinct HTML paths`);
  console.log(`  redirect ${count("redirect")} · live ${count("live")} · drop ${count("drop")} · invalid ${count("invalid")}`);
  console.log(`next.config.ts entries: ${explicit.length} explicit + ${catchAlls.length} catch-all = ${redirects.length}`);
  for (const r of rows.filter((r) => r.review)) console.log(`  REVIEW ${r.path} -> ${r.to || "(404)"}  ${r.rule}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write the files.");
    return;
  }

  const ts =
    `/* GENERATED by scripts/build-redirects.ts — do not edit by hand.\n` +
    `   Re-run \`pnpm redirects:build --apply\` and review the diff.\n` +
    `   Every legacy URL and where it goes: docs/REDIRECTS.csv. */\n\n` +
    `export type LegacyRedirect = { source: string; destination: string };\n\n` +
    `export const legacyRedirects: LegacyRedirect[] = ${JSON.stringify(redirects, null, 2)};\n\n` +
    `/** First path segments a CMS page must not use. */\n` +
    `export const reservedSlugs: string[] = ${JSON.stringify(reserved, null, 2)};\n`;
  writeFileSync(join(ROOT, "lib/legacy-redirects.ts"), ts);

  const csv = [
    "legacy_path,action,destination,rule,review",
    ...rows.map((r) => [r.path, r.action, r.to, r.rule, r.review ? "yes" : ""].map(csvCell).join(",")),
  ].join("\n");
  writeFileSync(join(ROOT, "docs/REDIRECTS.csv"), csv + "\n");
  console.log("\nWrote lib/legacy-redirects.ts and docs/REDIRECTS.csv");
}

function isUnderPrefix(path: string) {
  const first = path.split("/")[1];
  return [...TALENT_PREFIXES, ...TAXONOMY_PREFIXES].includes(first);
}

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
