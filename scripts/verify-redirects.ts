/**
 * Proves the legacy redirect map against a running site: every old URL in
 * docs/REDIRECTS.csv is requested, redirects are followed by hand, and the
 * run fails unless each one ends on its expected page with a 200.
 *
 *   pnpm redirects:verify                         # http://localhost:3000 (pnpm build && pnpm start)
 *   pnpm redirects:verify https://<staging host>  # a deployment
 *
 * Each URL is tried as archived (with its trailing slash, where the old
 * site used one) and without. Next strips a trailing slash with its own
 * 308 before the redirect applies, so two hops is the ceiling.
 *
 * The Vercel protection-bypass secret is sent only to this project's own
 * *.vercel.app deployments, never to any other host.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");
const host = new URL(base).hostname;
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const headers: Record<string, string> =
  bypass && /^click-[a-z0-9-]+-click17\.vercel\.app$/.test(host)
    ? { "x-vercel-protection-bypass": bypass }
    : {};
const MAX_HOPS = 2;
const CONCURRENCY = 8;

type Case = { path: string; action: string; expected: string };

const rows: Case[] = readFileSync(join(import.meta.dirname, "../docs/REDIRECTS.csv"), "utf8")
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [path, action, expected] = line.split(",");
    return { path, action, expected };
  })
  .filter((r) => r.action === "redirect" || r.action === "live");

async function follow(path: string) {
  let url = new URL(path, base);
  const hops: string[] = [];
  for (let i = 0; i <= MAX_HOPS + 3; i++) {
    const res = await fetch(url, { redirect: "manual", headers });
    if (res.status >= 300 && res.status < 400) {
      const next = new URL(res.headers.get("location") ?? "", url);
      if (next.origin !== url.origin) return { status: res.status, final: next.href, hops, offsite: true };
      hops.push(`${res.status} ${next.pathname}`);
      url = next;
      continue;
    }
    return { status: res.status, final: url.pathname, hops, offsite: false };
  }
  return { status: 0, final: url.pathname, hops, offsite: false };
}

async function check(c: Case): Promise<string[]> {
  const failures: string[] = [];
  const variants = c.path === "/" ? ["/"] : [c.path, `${c.path}/`];
  for (const v of variants) {
    const r = await follow(v);
    const ok = !r.offsite && r.status === 200 && r.final === c.expected && r.hops.length <= MAX_HOPS;
    if (!ok)
      failures.push(
        `${v} -> ${r.final} (${r.status}${r.offsite ? ", OFF-SITE" : ""}, ${r.hops.length} hops) expected ${c.expected}`,
      );
  }
  return failures;
}

async function main() {
  console.log(`Verifying ${rows.length} legacy URLs against ${base}`);

  /* A deployment without the map fails every row as a 0-hop 404, which
     reads as a broken map when it is only a build still in progress. */
  const canary = rows.find((r) => r.action === "redirect");
  if (canary && (await follow(canary.path)).hops.length === 0) {
    console.error(
      `\n${canary.path} does not redirect at all — this deployment does not serve the map yet.\n` +
        `If you just pushed, wait for the Vercel deployment to finish and run again.`,
    );
    process.exit(1);
  }

  const failures: string[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < rows.length) failures.push(...(await check(rows[i++])));
    }),
  );
  if (failures.length) {
    console.error(`\n${failures.length} FAILED:`);
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log(`All ${rows.length} resolve to their expected page (200, ≤${MAX_HOPS} hops, on-site).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
