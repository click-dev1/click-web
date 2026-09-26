import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Leaves draft mode and returns to the page the editor was on.
 *
 * `to` is only honoured as a path on this site: anything that is not a
 * single-slash path (an absolute URL, `//host`, `/\host`) falls back to
 * the home page, so this cannot be used as an open redirect.
 */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const to = request.nextUrl.searchParams.get("to") ?? "/";
  const safe = /^\/(?![/\\])/.test(to) ? to : "/";
  return NextResponse.redirect(new URL(safe, request.nextUrl.origin));
}
