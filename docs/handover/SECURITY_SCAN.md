# Vulnerability scan results

Agreement §8.8 (automated vulnerability scanning, results delivered,
critical and high findings remediated) and §8.1 (development and testing
against the OWASP Top 10). Exhibit A §14 lists these results in the
handover pack.

**Scanned:** 26 September 2026, branch `dev`.
**Result:** no critical or high finding remains. Two critical and six high
advisories in dependencies were found and fixed the same day (below).

## What was run

| Tool | Target | What it checks |
| --- | --- | --- |
| OWASP ZAP 2.17.0, baseline scan (passive) | Staging (`click-web-git-dev-click17.vercel.app`), 1,066 URLs | Headers, cookies, information leaks, mixed content, CSP, CORS and ~60 other passive rules against every page the spider reached |
| OWASP ZAP 2.17.0, baseline scan (passive) | Local production build of the current `dev` code, 1,084 URLs | The same, including the security headers added on 26 September that staging did not yet serve |
| `pnpm audit` | Every production dependency (937 packages) | Published advisories (GitHub Advisory Database) |
| Manual review | Source code | OWASP Top 10 categories, below |

The ZAP scans were passive: ZAP observed responses and sent no attack
payloads, and form submission was switched off, so nothing was submitted
to HubSpot. The staging bypass header was restricted to the staging host,
and the reports were checked to confirm the secret appears in none of
them.

## Dependency advisories — found and fixed

| Severity | Package | Advisory | Applies here? | Fix |
| --- | --- | --- | --- | --- |
| Critical | next 16.3.0 | GHSA-2xp9-vwfh-vxw4 — RCE in the Image Optimization API when AVIF files are optimised (via `sharp`/`libheif`) | Hard to exploit: only images from `cdn.sanity.io` (CLICK's editors upload) and the site's own files are optimised | Upgraded to **next 16.3.6** (sharp 0.35.4) |
| Critical | next 16.3.0 | GHSA-p293-qw3h-jr36 — RCE on Windows-hosted servers | No — Vercel runs Linux | Same upgrade |
| High | sharp 0.35.3 | GHSA-rgj7-g3m4-5g8c — libheif vulnerabilities | As the first row | sharp 0.35.4 with Next 16.3.6 |
| High ×3, moderate ×2 | js-yaml 3.13.1 | CPU-exhaustion and prototype-pollution advisories | No — used by the Sanity CLI's framework detection, not by the site at runtime, and never on visitor input | Pinned **3.15.2** (pnpm override) |
| High, moderate | smol-toml 1.5.2 | Denial of service on malformed TOML | No — Sanity CLI only | Pinned **^1.7.1** |
| High, moderate | adm-zip 0.6.0 | Memory exhaustion; extraction follows symlinks | No — Sanity CLI build tooling only | Pinned **0.6.1** |
| Moderate | uuid 10.0.0 | GHSA — missing bounds check when a buffer is passed to v3/v5/v6 | Not reachable from the site — Sanity CLI only | **Not fixed**: the fix is a major version (11) inside Sanity's CLI. §8.8 requires critical and high only. Clears when `sanity` updates it. |

The overrides live in `pnpm-workspace.yaml`, with a note to remove each
once `sanity` ships the patched version itself. After the fix,
`pnpm audit --prod` reports **0 critical, 0 high, 1 moderate**.

Verified after the upgrade: build, lint and types clean; all 504 legacy
redirects resolve; no console errors; and the rendered markup and text
of seven key pages are identical before and after.

> **`main` (the live site) is still on next 16.3.0.** It uses no remote
> images, so the AVIF path is harder still to reach, but the advisory is
> critical. Whether to patch `main` before launch is CLICK's call.

## ZAP findings

**No High or Critical alert on either target.** On the current `dev`
code:

| Risk | Alert | Status |
| --- | --- | --- |
| Medium | CSP: wildcard / `unsafe-inline` / no fallback directive | **Accepted for launch.** The site sends only `frame-ancestors 'self'`. A full Content-Security-Policy has to allow GA4, HubSpot's form, Mux, Sanity's CDN and the Studio, and needs care to avoid breaking them; recommended as post-launch hardening, rolled out in report-only mode first. |
| Medium | Sub-Resource Integrity missing | **Accepted.** Applies to Google's and HubSpot's scripts, which their vendors change without notice; an integrity hash would break them. |
| Low | Cross-Origin-Embedder/Opener/Resource-Policy missing | **Accepted.** Enforcing these would block the HubSpot and Mux embeds. |
| Low | Cross-domain JavaScript inclusion (`/studio`) | Expected: the Studio loads Sanity's own scripts. |
| Info | Modern web app, cacheable content | Informational. |

Staging, scanned before the header change was deployed, additionally
showed the alerts that change fixes — no anti-clickjacking header, no
`X-Content-Type-Options`, no `Permissions-Policy`, `X-Powered-By`
disclosed — plus three that belong to the staging environment only:

- `Access-Control-Allow-Origin: *` on `/_next/static/*` — Vercel's
  default for public, immutable build files; no credentials involved.
- Cookies `_v-consent`, `_v-visitor-id`, `_vercel_sso_nonce` — traced to
  Vercel's login wall in front of staging. A real browser session on
  staging (with the bypass) received no such cookie, and production sets
  none. Not visitor-facing.
- "Source code disclosure — Java" — false positive on minified JavaScript
  class syntax.

**Re-run against staging after the header change is pushed**, so the
delivered result is from the deployment itself.

## Remediation made on 26 September

- **Security headers** on every response (`next.config.ts`): 
  `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` (camera,
  microphone, geolocation, payment, USB off), `X-Frame-Options:
  SAMEORIGIN` and `Content-Security-Policy: frame-ancestors 'self'`
  (the Studio's Preview is same-origin, so it still works),
  `X-Powered-By` removed. HSTS and HTTP→HTTPS come from Vercel. No
  visible change: markup and text of seven key pages were diffed
  identical, and no page logs a console error.
- **`GET /api/revalidate`** (the readiness check) now answers 404 unless
  the caller presents the webhook secret, compared in constant time.
- **Dependencies** as above.

## OWASP Top 10 review

| Category | How the site stands |
| --- | --- |
| A01 Broken access control | No user accounts on the site. The Studio requires a Sanity login; the dataset is private. Draft preview requires a secret Sanity issues and checks (`/api/draft-mode/enable`); a forged cookie or bogus secret shows nothing (tested). |
| A02 Cryptographic failures | HTTPS everywhere, HSTS with preload on the Vercel domain. No secrets in client code: only the public Sanity project id and GA id ship to the browser. |
| A03 Injection | No SQL. GROQ queries take user-facing values as parameters, never string-built. Every CMS string in a `<script>` (JSON-LD) is escaped; rich-text links accept only http(s), mailto and on-site paths, checked in the Studio and again when rendered. |
| A04 Insecure design | Redirect targets are fixed paths; draft-mode entry and exit redirect only within the site; the legacy redirect generator refuses non-internal destinations. |
| A05 Security misconfiguration | Headers as above. Dataset private. `SANITY_PREVIEW_DRAFTS` is local-only and documented as such. |
| A06 Vulnerable components | `pnpm audit` clean of critical and high. Re-run before launch and after any dependency change. |
| A07 Identification and authentication | Delegated to Sanity (Studio) and Vercel (deployments). |
| A08 Software and data integrity | The publish webhook is verified by signature (`SANITY_REVALIDATE_SECRET`). The lockfile pins every version. |
| A09 Logging and monitoring | Vercel request and function logs; Sanity's document history (3 days on the Free plan). Uptime monitoring (UptimeRobot) is optional in Exhibit A §7 and not yet set up. |
| A10 SSRF | The server never fetches a URL a visitor supplies. Image optimisation is limited to `cdn.sanity.io`. |

Forms are HubSpot's embed (validation and reCAPTCHA spam protection are
HubSpot's), so the site handles no form input itself.

## Re-running

```
pnpm audit --prod
docker run --rm -v "$PWD/zap:/zap/wrk" ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t <url> -m 3 -I -J report.json -r report.html \
  -z "-config spider.processform=false"
```

Staging sits behind Vercel Authentication; add the protection-bypass
header with ZAP's replacer, restricted to the staging host, and check
the reports for the secret before sharing them.
