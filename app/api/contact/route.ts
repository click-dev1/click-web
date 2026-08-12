import { NextResponse } from "next/server";
import { normalize, validate } from "@/content/questionnaire";
import { submitToHubSpot } from "@/lib/hubspot";

/**
 * Contact questionnaire endpoint.
 *
 * The browser never talks to HubSpot directly. Going through the server
 * means: credentials stay server-side if the transport ever needs one,
 * validation runs somewhere the client can't skip, and swapping CRM is a
 * one-file change (lib/hubspot.ts) with no redeploy of the front end.
 *
 * Responses:
 *   200 { ok: true, mode: "hubspot" | "preview" }
 *   400 { ok: false, errors }  — per-field, rendered inline by the modal
 *   429 { ok: false, message } — rate limited
 *   5xx { ok: false, message } — upstream trouble
 */

export const runtime = "nodejs";

/* In-memory rate limit: enough to blunt a bored script, and it costs
   nothing. It resets on cold start and is per-instance, so if this ever
   matters for real, move it to Redis/Upstash or put HubSpot's own reCAPTCHA
   on the form. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  /* keep the map from growing without bound on a long-lived instance */
  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }

  /* Honeypot: a field hidden from humans that bots fill in anyway. Answer
     200 so the bot records a success and doesn't retry with variations. */
  const trap = (body as Record<string, unknown>)?.company;
  if (typeof trap === "string" && trap.trim()) {
    return NextResponse.json({ ok: true, mode: "preview" });
  }

  const answers = normalize(body);
  const errors = validate(answers);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const referer = request.headers.get("referer") ?? undefined;
  const hutk = readCookie(request.headers.get("cookie"), "hubspotutk");

  const result = await submitToHubSpot(answers, {
    pageUri: referer,
    pageName: "CLICK — Start the conversation",
    hutk,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true, mode: result.mode });
}

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}
