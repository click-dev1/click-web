import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gates the whole site behind HTTP Basic Auth while it is unlaunched.
 * Credentials come from env vars (set in .env.local, never committed)
 * with a fallback so local dev works out of the box.
 */
const SITE_USER = process.env.SITE_AUTH_USER || "admin";
const SITE_PASS = process.env.SITE_AUTH_PASS || "click26";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CLICK", charset="UTF-8"' },
  });
}

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === SITE_USER && pass === SITE_PASS) {
        return NextResponse.next();
      }
    }
  }

  return unauthorized();
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets, so Basic Auth doesn't
     * block CSS/JS/images from loading once authenticated.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
