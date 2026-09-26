# Delivery status

Where the CLICK website rebuild stands against the executed Website
Development Agreement and its Exhibit A Statement of Work.

**Last updated:** 26 September 2026
**Kickoff:** 13 August 2026 · **Launch-ready target:** ~8 October 2026
**Paid to date:** $4,000 of $8,000 (kickoff + design). The remaining
$4,000 releases on launch-ready acceptance (§11).

> Keep this file current. It is the single place that answers "what is
> left", and §14's handover pack is assembled from it.

---

## The short version

**About 76% of the way to launch-ready.** The build and the CMS are
largely done: every public page except the three legal pages renders from
Sanity, and CLICK's own decks are in — 24 case studies with figures
supplied by CLICK. The redirect map for the old sites and the structured
data are built. What remains: insights/news/press, legal pages in the CMS, analytics
verification, the §14 handover pack, the vulnerability scan and the Bill
of Materials.

| Workstream | Weight | Done | Where it stands |
| --- | --- | --- | --- |
| Design | 15% | 100% | Accepted and paid |
| Front-end build | 20% | ~97% | All core routes live on staging; Mux reels, work filters and paging |
| CMS (§4) | 25% | ~80% | Legal pages, `article`/`pressItem` + routes, draft preview, editor seats left |
| Content | 10% | ~60% | Case studies done; talent unverified, portraits missing, legal mailbox |
| SEO: schema + redirects | 10% | ~85% | 5 of 6 schema types (Article waits on articles); redirect map built and verified |
| Performance + accessibility (§6) | 5% | ~70% | Passes on 13 Sep baseline; not re-measured since video and galleries |
| Consent + analytics | 5% | ~55% | Consent built; verification and inventory outstanding |
| Security, BOM, pre-merge | 3% | ~10% | Not started |
| Handover + training (§14) | 7% | ~10% | Internal docs only |

The weights are a judgement of each workstream's share of the SOW, not
contract figures.

---

## Pages

| Page | Renders from | CLICK can edit? |
| --- | --- | --- |
| `/` (home) | Sanity — `homePage` singleton | ✅ every section, including the ecosystem |
| `/influencer-marketing` | Sanity | ✅ fully |
| `/about` | Sanity | ✅ fully |
| `/talent-management` | Sanity | ✅ fully |
| `/contact` | Sanity | ✅ fully |
| `/experiential` | Sanity | ✅ fully (migrated 24 Sep) |
| `/work` | Sanity — `workPage` singleton + case studies | ✅ hero, reels, brand wall, CTA, every case study |
| `/work/[slug]` | Sanity | ✅ case studies (page furniture is code) |
| `/talent`, `/talent/[slug]` | Sanity | ✅ profiles (page furniture is code) |
| `/[slug]` — any CMS page | Sanity | ✅ fully |
| `/privacy-policy`, `/cookie-policy`, `/terms-of-use` | `content/legal.ts` | ❌ |
| `/insights`, `/news`, `/press` | — | ❌ routes do not exist (404) |

`Nav` and `Footer` read from Sanity (`navigation`, `siteSettings`), so
CLICK can change a menu item, a footer link, the enquiries address or a
social profile without a developer.

Every migrated page was verified by diffing its rendered text against the
hand-built page it replaced; see **Migrating a bespoke page** in
`docs/SANITY.md`. `content/manifest.ts` and `content/site.ts` are no longer
read by any page — only `app/sitemap.ts`, `StructuredData`, `Footer`, the
contact components and `lib/sanity/queries.ts` still import constants from
them.

### What came in from CLICK's decks (24 Sep)

`pnpm seed:deck` brought CLICK's Aug–Sep 2026 Narrative and Case Studies
decks into the CMS: **13 CLICK Influence case studies and 8 GameSquare
activations**, the Work page, `/experiential` as a block page, and new
sections on Influencer Marketing and About, with their imagery. Figures
are the decks' own, marked "as confirmed by CLICK Influence". GameSquare
work carries a badge and a credit line so the site never claims work CLICK
did not deliver. The unconfirmed Australian Government campaign was
withdrawn.

The seed is **additive** — re-running it cannot overwrite Studio edits.

### Video

The four industry reels on `/work` play through **Mux**
(`@mux/mux-player-react`, `mux.video` fields on `workPage`), with custom
controls in `components/work/ReelPlayer.tsx`. Mux is listed as optional in
the SOW; it is wired and working, and belongs in the §15 Bill of Materials
and the §8.9 tracking inventory.

---

## Content types

| Type | Status |
| --- | --- |
| `talent` | ✅ 11 creators, portraits on the CDN |
| `caseStudy` | ✅ 24 published (20 from CLICK's decks) |
| `person` | ✅ 12 team members |
| `page` | ✅ |
| `homePage` | ✅ singleton — incl. ecosystem groups |
| `workPage` | ✅ singleton — hero, reels, brand wall, CTA |
| `navigation` | ✅ singleton — main menu and footer columns |
| `siteSettings` | ✅ singleton — email, socials, company name |
| `article` (insight \| news) | ❌ |
| `pressItem` | ❌ |
| `legalPage` | ❌ |

## Block library — 18 delivered

`pageHero` · `copyMedia` · `metricRow` · `capabilityList` · `cardGrid` ·
`featuredWork` · `featuredTalent` · `mediaBlock` · `teamGrid` ·
`timeline` · `recognition` · `activationScorecard` · `splitCopy` ·
`journeySequence` · `journeyPanels` · `contactForm` · `linkChips` ·
`ctaBanner`

Every image slot has a **Fill / Fit** display option (`imageDisplay`).

`logoWall` is **no longer needed**: the `/work` brand wall is edited on the
`workPage` singleton, and case-study brands are appended automatically.

This list is the **SOW §4 scope boundary**. §4 says designing a new
section type is development work, so anything outside it is a §3 change
at $50/h. Worth having Chris agree it in writing.

### Known gaps in the delivered blocks

- `cardGrid` renders its CTA as a button inside the card; `/contact`'s
  routing cards were links across the whole card surface.
- `copyMedia` stacks its paragraphs; two built sections set them in two
  columns.

---

## Still to build — no CLICK input needed

In order. Each is ours to finish; none waits on CLICK.

1. ~~**Redirect map.**~~ **Done 26 Sep** — 504 old WordPress and Wix
   URLs from the Internet Archive map to the new site in 57 rules, all
   verified locally and on staging. See `docs/REDIRECTS.md`. Left: CLICK to confirm three `review` rows, and fold in their
   Search Console / Wix export when it arrives.
2. ~~**Structured data.**~~ **Done 26 Sep** — `BreadcrumbList`,
   `Person` (via `ProfilePage`), `CreativeWork`, plus the existing
   `Organization` and `WebSite`: 5 of the 6 §5 types. Zero validator
   errors. See `docs/STRUCTURED_DATA.md`. Left: Rich Results Test on
   staging; `Article` comes with item 3.
3. **`article` + `pressItem` and `/insights`, `/news`, `/press`.** Schema,
   index and detail routes, sitemap, `Article` JSON-LD. Launch with the
   routes empty-state-safe; CLICK populates.
4. **`legalPage` type.** Move the three legal pages into Sanity; the cookie
   table stays generated from `lib/consent.ts`.
5. **Draft preview** (`draftMode` + Studio preview link).
6. **Pre-merge hardening** — see below.
7. **§6 evidence.** Median-of-three Lighthouse runs against staging for all
   six configurations, re-measured now that video and galleries are in.
8. **§8.8 vulnerability scan** (`pnpm audit`, headers, CSP review) and
   **§15 Bill of Materials** — check GSAP's licence and Mux's terms.
9. **§8.9 tracking inventory** — GA4, HubSpot (loader gated to the contact
   modal), Mux, Vercel; generated from `lib/consent.ts` where possible.
10. **§14 handover pack** — draft everything except the recorded training.

---

## Performance and accessibility

Baseline measured 13 September — see `docs/PERFORMANCE.md`. Every §6
category threshold passed on all six configurations; CLS was 0. **Not
re-measured since the Mux reels, galleries and deck imagery landed.**

Two items remain, both needing a decision from CLICK:

1. **Contrast misses WCAG AA by 0.049.** Brand Electric Blue `#186ffc`
   gives white text 4.451:1 against AA's 4.5:1. Lighthouse still scores
   96, so the §6 *score* passes — but §6 also requires WCAG 2.1 AA, and
   that claim cannot be made while contrast fails.
2. **Mobile LCP is 3.2–4.1s against §6's ≤2.5s.** The LCP element is the
   hero `<h1>` and ~88% of its time is render delay from the split-text
   animation, not network.

---

## A deliberate change from `main`

HubSpot's loader used to fetch on **every pageview of every route**,
setting its `__cf_bm` cookie before the visitor consented to anything and
whether or not they ever opened the form. It now loads on the first time
someone opens the contact modal; on `/contact` it still loads up front,
because there the form is the page. Same portal, same form id, same
embed — only *when* the script fetches changed.

This belongs in the §8.9 tracking inventory, and Chris should know it is
a deliberate difference from what `main` serves. Reverting it would put a
third-party cookie back on every pre-consent pageview and drop the Best
Practices score below the §6 threshold of 90.

---

## Waiting on CLICK

**Overdue (§10):**
- Geographic consent restrictions and the Clarity/Peec election — due at
  kickoff. Recommended written answer: strict opt-in globally, which is
  what is built and is defensible everywhere.
- Brand assets, the portrait shoot, logo approval and GameSquare naming —
  due week 3.

**Blocking specific work:**
- **Search Console export or Wix access** — Indexing → Pages and
  Performance → Pages exports from Search Console, or a Wix collaborator
  invite. Fills any gaps in the archive-based redirect map
  (`docs/REDIRECTS.md`).
- **Three redirect judgement calls** marked `review` in
  `docs/REDIRECTS.csv`.
- **Search Console and Bing access** to verify the properties and submit
  the sitemap.
- **Licensed brand webfonts** (Helvetica Now Display Condensed, Matter) —
  the `@font-face` block in `globals.css` is written and commented out,
  waiting on a *webfont* licence. Free OFL stand-ins carry the page.
- **Team portraits** and **perspective lines** — collected from each person
  in their own voice, never written for them.
- **Talent verification** and **the 12th profile.** The 11 on file were
  drafted from public sources on 1 September 2026 and are **unverified by
  CLICK**.
- **Legal go-live.** Counsel's review landed 2 September (ABN, retention,
  age floor, authorised agents settled). Still open — search `TO CONFIRM`
  in `content/legal.ts`: the EU/UK representative, and
  `privacy@clickmedia.group` must exist and receive mail before the pages
  drop `noindex`.
- **One real insight** for the payoff frame on `/influencer-marketing`.

**Decisions:**
- The two in `docs/PERFORMANCE.md` (contrast, hero animation).
- **Sanity plan.** On Free there are only Administrator and Viewer roles
  and 3 days of history; Growth is $15/seat/month. Chris should accept
  this knowingly.
- **How Chris reaches staging** — a Vercel Shareable Link, or adding him to
  the `click17` team. §11 ties the final $4,000 to acceptance "on the
  staging URL", which has never been named in writing.
- Confirmation in writing that `/insights`, `/news` and `/press` are
  included as goodwill rather than §13 chargeable pages.

---

## Before merging `dev` to `main`

- `main`'s three own commits (favicon, the hand-assembled consent/legal
  layer, the intelligence headline trim) are merged into `dev` with the
  `ours` strategy: `dev` already carried all three, newer. The final
  `dev` → `main` merge is therefore a fast-forward.
- Gate or trim the `GET` readiness handler on `/api/revalidate` — it is
  publicly readable on production. Key names and booleans only.
- Remove the staging CORS origin; consider registering the Studio for
  `www.clickmedia.group`.
- Confirm `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET` and the Mux
  variables are set on **Production**. The build fails loudly without the
  Sanity pair, by design.
- Only **1 Sanity seat is in use.** §9 requires a CLICK person to perform
  every §4 operation unaided during training, so they need inviting.
- Delete or explicitly scope out the old `click-concept` project on the
  personal Vercel account (§6.3, §14 inventory).

---

## Environments

| | |
| --- | --- |
| Staging | `https://click-web-git-dev-click17.vercel.app` — the `dev` branch alias |
| Production | `www.clickmedia.group` — still serving old `main` (landing page) |
| Studio | `/studio` on any deployed origin |
| Sanity | project `eclvbmom`, dataset `production` (**private**) |
| Vercel | project `click-web`, team `click17` (CLICK-owned) |

Staging sits behind Vercel Authentication. Sanity's webhook gets through
with a Protection Bypass secret sent as `x-vercel-protection-bypass`.

## Related documents

- `docs/SANITY.md` — how the CMS works, conventions, migration procedure
- `docs/PERFORMANCE.md` — §6 baseline and the two open decisions
- `docs/CONSENT_AND_LEGAL.md` — consent layer, legal pages, launch checklist
- `docs/HUBSPOT_SETUP.md` — where the form's fields and copy live
- `docs/REDIRECTS.md` — the legacy redirect map
- `docs/STRUCTURED_DATA.md` — JSON-LD per page and its rules
