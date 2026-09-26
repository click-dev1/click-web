# Tracking technology inventory

Agreement §8.9 and Exhibit A §5: every cookie, pixel, tag and script the
Website deploys — vendor, purpose, data collected, jurisdictions — and a
demonstration that non-essential tracking is blocked until consent.

**As at:** 26 September 2026, branch `dev`. Observed, not just declared:
each scenario below was run in a fresh browser against staging and against
a local production build with a **placeholder** GA4 id (`G-TEST00000`,
so no test traffic reached CLICK's property — staging has no GA4 id by
design). Method at the end.

The declared cookie list is `lib/consent.ts`. It drives the cookie
banner, the preferences panel and the Cookie Policy's table, so those
three cannot disagree.

## Inventory

| Vendor | What loads | Purpose | Data | Jurisdiction | When |
| --- | --- | --- | --- | --- | --- |
| **CLICK** (the site) | Cookie `click_consent` | Remembers the visitor's cookie choice | The choice, a version number, a date | Vercel (US/global edge) | Set when a choice is made, or automatically as a refusal when the browser sends GPC. Essential. 12 months |
| **Google Analytics 4** (Google LLC) | `gtag.js` from googletagmanager.com; hits to google-analytics.com; cookies `_ga`, `_ga_<id>` | Visit and conversion measurement | Pages viewed, referrer, device and browser, approximate location from IP, a pseudonymous client id (cookies) | United States | Cookies only after analytics consent. **See finding 1 — the script and cookieless hits currently load for everyone.** Production only (no GA4 id on staging or local) |
| **HubSpot** (HubSpot, Inc.) — tracking code | `js.hs-scripts.com/5918623.js`, which pulls `js.hs-analytics.net`, `js.hs-banner.com`, `js.hsadspixel.net`, `track.hubspot.com`, `api.hubapi.com`, `cta-service-cms2.hubspot.com`; cookies `__hstc`, `hubspotutk`, `__hssc`, `__hssrc` | Joins an enquiry to the pages read before it | Pages viewed, a pseudonymous visitor id, and — on submission — the enquiry itself | United States (portal `na1`) | Only after analytics consent, and only where GA4 is configured. **See finding 2.** |
| **HubSpot** — form embed | `js.hsforms.net`, `forms.hsforms.com` (render definition, feature control, visitor lookup), `forms-na1.hsforms.com/embed/v3/counters.gif`, `static.hsappstatic.net`, a font from `cdn1.hubspot.net`; cookie `__cf_bm` | The contact form itself | What the visitor types and submits; a form-view counter; IP and browser details inherent to loading it | United States | When the visitor opens the contact form (modal) or visits `/contact`. The form is the service asked for, so it is treated as essential. See finding 4 |
| **Cloudflare** (for HubSpot) | Cookie `__cf_bm` on HubSpot's domains | Bot protection on HubSpot's servers | A bot-score token | Global | With the HubSpot form or tracking code. Essential. 30 minutes |
| **Mux** (Mux, Inc.) | Video from `stream.mux.com`, `*.fastly.mux.com`, `image.mux.com` | Streams the /work reels | IP and browser details inherent to streaming | United States (Fastly CDN) | When a reel's poster loads and when it plays. **Mux Data analytics is off** (`disableTracking`, `disableCookies`) — confirmed: no request to Mux's analytics host, no cookie |
| **Google Cast SDK** (Google LLC), via the Mux player | `www.gstatic.com/cv/js/sender/…`, `…/cast/sdk/…`, `…/eureka/…` | Lets a viewer cast a reel to a TV | IP and browser details inherent to the download | United States | When a visitor presses play. No cookie. See finding 3 |
| **Sanity** (Sanity AS) | Images from `cdn.sanity.io` | Serves the site's images | IP and browser details inherent to loading an image | Global CDN (Sanity: Norway/US) | Every page with CMS images. No cookie |
| **Vercel** (Vercel Inc.) | Hosting | Serves the site | Standard request logs | United States / global edge | Always. No cookie on production |

Staging only, not on production: `vercel.live` feedback script (Vercel's
preview toolbar) and Vercel's login-wall cookies (`_vercel_jwt`,
`_vercel_sso_nonce`, `_v-*`).

## Blocking demonstration

| Scenario | Cookies set | Third-party requests |
| --- | --- | --- |
| First visit, no choice | **none** | Sanity images. With GA4 configured: `gtag.js` and google-analytics.com hits (finding 1) |
| "Reject All" | `click_consent` only | As above |
| Browser sends GPC | `click_consent` (recorded refusal); **no banner shown** | As above |
| "Accept All" | `click_consent`, `_ga`, `_ga_<id>`, `__hstc`, `hubspotutk`, `__hssc`, `__hssrc`, `__cf_bm` | GA4, HubSpot tracking code incl. its ads script, `pagead2.googlesyndication.com` (findings 1–2) |
| Analytics allowed via preferences | Same as Accept All — the panel offers only Essential and Analytics | Same as Accept All |
| Contact form opened, no choice | `__cf_bm` (HubSpot domains) | HubSpot form embed only |
| Reel played, no choice | **none** | Mux streaming, Google Cast SDK |

**Cookies are correctly blocked**: none but `click_consent` and HubSpot's
essential `__cf_bm` before consent, after Reject, or with GPC; every
cookie seen after consent is declared in `lib/consent.ts`.

## Findings that need a decision

1. **GA4 sends cookieless hits before consent, after Reject and under
   GPC.** GA4 runs in Google's "advanced" Consent Mode: `gtag.js` loads
   for every visitor with storage denied, and each page view sends a
   cookieless hit to Google (IP address, page, browser). No cookie is
   set. Exhibit A §5 asks for a consent solution that "genuinely blocks
   all non-essential tags … until affirmative consent", and the Privacy
   Policy promises GPC is honoured — hits after an explicit refusal are
   hard to square with either. **Recommended:** switch to basic mode —
   load `gtag.js` and send page views only once analytics is allowed.
   A code-only change, invisible on the page. The trade-off: GA4 loses
   its modelled estimates of refusing visitors.
2. **HubSpot's tracking code brings HubSpot's ads-pixel script, and GA4
   reaches Google's ads endpoint, under *analytics* consent** — the site
   has no marketing category, so no visitor is ever asked about
   advertising. Whether an ad pixel actually fires depends on the ads
   settings of HubSpot portal 5918623, which the GameSquare group shares.
   The Cookie Policy says "We do not currently place advertising pixels
   on the Site". **Recommended:** turn off ad pixels for
   `clickmedia.group` in the HubSpot portal and set GA4's
   `allow_google_signals` / ad personalisation off — or, if CLICK wants
   advertising measurement, add a Marketing category and gate those on
   it. Either way the policy text and the behaviour must match.
3. **The Mux player downloads Google's Cast SDK when a reel is played.**
   No cookie; a request to Google triggered by the visitor's own action.
   The player offers no switch to turn casting off. Listed so the
   inventory is complete; acceptable in our view.
4. **The HubSpot form embed sends a form-view counter and a visitor
   lookup when opened**, before any consent. It is HubSpot's own form
   behaviour and only follows the visitor opening the form. Listed for
   completeness.
5. **"Consent state recorded and exportable" (Exhibit A §5) is not yet
   met.** The choice is stored only in the visitor's own cookie; nothing
   on CLICK's side records or can export it. Needs a design decision
   (for example, recording each choice server-side with a timestamp and
   policy version).

Still to demonstrate before launch (§8.9): the same scenarios on the
production deployment with the real GA4 id, and CLICK's geographic
restrictions — not yet specified (Exhibit A §5; strict opt-in everywhere
is what is built).

## Method

Headless Chrome 153 (Puppeteer), a fresh incognito context per scenario,
every request logged by host and path, every cookie read from the browser
after the scenario (names and domains only). Re-run after any change to
analytics, embeds or `lib/consent.ts`, and whenever CLICK adds a tool.
