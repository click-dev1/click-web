import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity → Next revalidation.
 *
 * The site is statically generated, so publishing in the Studio changes
 * the Content Lake and nothing else until something tells Next the pages
 * are stale. That is this route.
 *
 * THE CONVENTION IT DEPENDS ON: a cached Sanity read is tagged with the
 * document type it reads — `lib/sanity/talent.ts` tags its fetches
 * "talent". The webhook sends the document that changed, so revalidating
 * `_type` invalidates exactly the pages that read that type. Every
 * content type added later (caseStudy, article, pressItem, page,
 * navigation, siteSettings) inherits this without touching this file —
 * it only has to tag its reads with its own type name.
 *
 * Configure in Sanity: manage → API → Webhooks
 *   URL         <origin>/api/revalidate
 *   Dataset     production
 *   Trigger on  create · update · delete
 *   HTTP method POST
 *   Projection  {_type}
 *   Secret      the value of SANITY_REVALIDATE_SECRET
 */

type WebhookPayload = { _type: string };

/* The variables this route needs in order to do anything. */
const REQUIRED = ["SANITY_API_READ_TOKEN", "SANITY_REVALIDATE_SECRET"] as const;

/**
 * Readiness check — GET /api/revalidate.
 *
 * Answers "is this deployment configured to receive publishes?" without
 * disclosing a value. `unexpected` lists any other SANITY_* key the
 * runtime can see, which is what catches the failure this was written
 * for: a variable whose NAME carries a stray space or typo looks correct
 * in the Vercel dashboard but is a different key to the process.
 */
export function GET() {
  const present = Object.fromEntries(
    REQUIRED.map((k) => [k, Boolean(process.env[k])]),
  );
  const unexpected = Object.keys(process.env)
    .filter((k) => k.startsWith("SANITY") && !REQUIRED.includes(k as never))
    .sort();

  return NextResponse.json({
    ok: REQUIRED.every((k) => Boolean(process.env[k])),
    present,
    unexpected,
    /* Distinguishes "the value is empty" from "the key is absent". */
    secretLength: (process.env.SANITY_REVALIDATE_SECRET ?? "").length,
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  /* Refuse rather than accept unsigned requests: without a secret this
     endpoint would let anyone force a rebuild of every page. */
  if (!secret) {
    return new NextResponse("SANITY_REVALIDATE_SECRET is not set", {
      status: 500,
    });
  }

  /* `true` waits for the Content Lake to be consistent, so the refetch
     that follows cannot read the document as it was before the edit. */
  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    secret,
    true,
  );

  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  if (!body?._type) {
    return new NextResponse("Payload is missing _type", { status: 400 });
  }

  /* "max" is stale-while-revalidate: the tag is marked stale and the
     fresh copy is fetched when a visitor next asks for one of those
     pages. The single-argument form is deprecated in Next 16. */
  revalidateTag(body._type, "max");

  return NextResponse.json({
    revalidated: true,
    tag: body._type,
    now: Date.now(),
  });
}
