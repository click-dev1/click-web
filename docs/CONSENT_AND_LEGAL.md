# Cookie consent, analytics and the legal pages

## One inventory drives everything

`lib/consent.ts` lists every cookie the site can set. Three things render
from it and therefore cannot disagree:

| Reads the inventory                        | Where                                  |
| ------------------------------------------ | -------------------------------------- |
| The Cookie Policy's table + processor list | `content/legal.ts` (generated blocks)  |
| The banner and the preferences panel       | `components/consent/*`                 |
| The version stamped into the stored choice | `CONSENT_VERSION` in `lib/consent.ts`  |

**Adding a vendor** (Clarity, a video player, an ad pixel): add its cookies
to `cookieInventory`, bump `CONSENT_VERSION`, gate its script on
`useConsent().choices?.<category>`. Every visitor is asked again — that is
the point, not a bug.

## How consent is stored

A first-party cookie, `click_consent`, holding `{ v, ts, id, analytics,
marketing }`, 12 months, `SameSite=Lax; Secure`. A record with an old `v` is
treated as absent. Withdrawing a category expires that category's cookies
in the browser, not just the record. Global Privacy Control is honoured as
a refusal.

## What loads, and when

Nothing, unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (Vercel: Production
only; redeploy after adding it — `NEXT_PUBLIC_*` is inlined at build time).

- `components/analytics/GoogleAnalytics.tsx` — a raw inline `<script>`
  sets Google Consent Mode v2 defaults from the consent cookie **before**
  gtag.js, then gtag.js loads for everyone, cookieless until analytics is
  granted. It must stay a raw script in a server component:
  `next/script beforeInteractive` inside a component is serialised into
  the RSC payload and never runs. Check `view-source` of a production
  build after touching it.
- `components/analytics/PageViews.tsx` owns pageviews (`send_page_view:
  false`). The GA4 stream's "Page changes based on browser history
  events" setting is therefore **off** — turning it on double-counts.
- `lib/analytics.ts` is the only module that calls `gtag`:
  `updateConsent()` (called by the consent provider), `pageview()`,
  `track()` for custom events.
- `components/analytics/HubSpotLoader.tsx` — HubSpot's tracking script
  (`js.hs-scripts.com/5918623.js`) is not rendered at all until analytics
  is granted. Without it an enquiry still lands in HubSpot, just with no
  browsing history.
- No Google Tag Manager. Exactly one thing owns GA4.

The HubSpot **form** embed (`js.hsforms.net`) is unchanged and loads with
the contact modal. Verified 2026-08-29: with consent refused it sets only
Cloudflare's `__cf_bm` on HubSpot's domains (listed as essential). Re-check
on staging whenever HubSpot changes the embed.

## Legal pages

`content/legal.ts` holds the Privacy Policy, Cookie Policy and Terms of
Use as typed blocks; `components/LegalPage.tsx` renders them. Each has a
`status`. The status is internal — nothing on the page shows it. Until it is
`client-confirmed` the route is `noindex` and left out of the sitemap;
flip the status when counsel signs off and both change at once. Search the file for `TO CONFIRM`
for the facts counsel still owes: ABN, privacy mailbox, retention periods,
EU/UK representative, the Creator Network age floor.

Do not hand-write cookie names in the policy text — they are generated.

## Launch checklist

- [ ] Counsel has signed off all three documents; statuses flipped.
- [ ] Browser audit on staging: no non-essential cookie before Accept;
      none after Reject; all removed after withdrawing; GPC browser sees
      no banner and no cookies.
- [ ] `view-source` of the built HTML: `#consent-defaults` precedes gtag.
- [ ] Tag Assistant / GA4 DebugView: consent denied → granted on Accept.
- [ ] HubSpot portal: `clickmedia.group` added under Tracking Code; HubSpot's
      own cookie banner **disabled** for this domain (two banners otherwise);
      the enquiry form's reCAPTCHA setting reviewed.
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel on Production only, then redeployed.
