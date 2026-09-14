# Delivery status

Where the CLICK website rebuild stands against the executed Website
Development Agreement and its Exhibit A Statement of Work.

**Last updated:** 14 September 2026
**Kickoff:** 13 August 2026 · **Launch-ready target:** ~8 October 2026
**Paid to date:** $4,000 of $8,000 (kickoff + design). The remaining
$4,000 releases on launch-ready acceptance (§11).

> Keep this file current. It is the single place that answers "what is
> left", and §14's handover pack is assembled from it.

---

## The short version

The CMS foundation is finished and proven: the publish loop works, the
block architecture is settled, and two pages have been rebuilt from
blocks with their rendered text diffed to zero against the originals.

**Roughly a third of the content is editable by CLICK.** Six pages, six
content types and three routes remain. Separately, several contractual
items outside the CMS have not started at all — the Wix redirect map is
the most schedule-critical of them.

---

## Pages

| Page | Renders from | CLICK can edit? |
| --- | --- | --- |
| `/talent`, `/talent/[slug]` | Sanity | ✅ profiles (page furniture is code) |
| `/work`, `/work/[slug]` | Sanity | ✅ case studies (page furniture is code) |
| `/[slug]` — any CMS page | Sanity | ✅ fully |
| `/influencer-marketing` | `content/site.ts` | ⏳ rebuilt as `influencer-marketing-cms`, awaiting swap |
| `/about` | `content/site.ts` | ⏳ rebuilt as `about-cms`, awaiting swap |
| `/talent-management` | page copy in code | ⏳ rebuilt as `talent-management-cms`, awaiting swap |
| `/` (home) | `content/manifest.ts` | ❌ singleton, not started |
| `/experiential` | `content/site.ts` | ❌ |
| `/contact` | `content/manifest.ts` | ❌ |
| `/privacy-policy`, `/cookie-policy`, `/terms-of-use` | `content/legal.ts` | ❌ |
| `/insights`, `/news`, `/press` | — | ❌ routes do not exist |

Nine components still read hand-authored content, including **`Nav` and
`Footer`** — so CLICK cannot currently change a menu item or a footer
link. `content/site.ts`, `content/manifest.ts` and `content/legal.ts`
total ~1,300 lines and retire as the pages above migrate.

### Swapping a rebuilt page in

A static route wins over a CMS page with the same slug, so each rebuild
is seeded to a temporary `-cms` slug with `noIndex` and compared
side by side first. To finish one: delete the hand-built route file,
change the slug to the real one, clear `noIndex`. See
**Migrating a bespoke page** in `docs/SANITY.md`.

`/about` and `/talent-management` diff to **zero** against their
originals. `/influencer-marketing` differs by a single non-difference:
the scorecard source splits across two text nodes in the original and
renders the same characters.

---

### `/contact` is blocked on anchors, not on the form

That page routes on `#enquiry` and `#creator-network` — its cards, its
hero and its in-page CTAs all point at them. No block can carry an
anchor id today, so it cannot be assembled yet whatever else is built.

Most of its remaining content is not page content at all. The email
address is used in `Nav`, `Footer`, `StructuredData` and on the page
itself, and the socials row is duplicated between `Footer` and the page.
Those belong in **`siteSettings`**, which also happens to be what lets
CLICK edit the footer and the menu. Build that before finishing
`/contact`, or the same values get typed into three places.

## Content types

| Type | Status |
| --- | --- |
| `talent` | ✅ 11 creators, portraits on the CDN |
| `caseStudy` | ✅ 5 campaigns migrated |
| `person` | ✅ 12 team members (2 portraits, 10 awaiting) |
| `page` | ✅ |
| `article` (insight \| news) | ❌ |
| `pressItem` | ❌ |
| `navigation` | ❌ — blocks CLICK editing the menu |
| `siteSettings` | ❌ |
| `legalPage` | ❌ |

## Block library — 16 delivered

`pageHero` · `copyMedia` · `metricRow` · `capabilityList` · `cardGrid` ·
`featuredWork` · `featuredTalent` · `mediaBlock` · `teamGrid` ·
`timeline` · `recognition` · `activationScorecard` · `splitCopy` ·
`journeySequence` · `journeyPanels` · `ctaBanner`

**Still to build**, with the page that needs each:

| Block | Needed by |
| --- | --- |
| `contactForm` | `/contact` — the HubSpot embed |
| `linkChips` | `/contact` — the socials row |
| `logoWall` | home, `/work` brand wall |
| `homeHero` | home |
| `intelligenceDiagram` | home |
| `ecosystem` | home |

This list is the **SOW §4 scope boundary**. §4 says designing a new
section type is development work, so anything outside it is a §3 change
at $50/h. Worth having Chris agree it in writing.

### Known gaps in the delivered blocks

- **No block can carry an anchor id.** `/contact` routes on `#enquiry`
  and `#creator-network`, so it cannot be assembled until blocks can be
  given a target. This is the blocker on that page, not the form.
- `pageHero`'s `asideNote` is plain text and cannot hold a link —
  `/contact`'s hero aside is a large mailto.
- `cardGrid` renders its CTA as a button inside the card; `/contact`'s
  routing cards are links across the whole card surface.
- `copyMedia`'s aside is an image; `/contact`'s creator-network section
  puts a framed list there.
- `copyMedia` stacks its paragraphs; two built sections set them in two
  columns.
- `copyMedia`'s collage fixes its frames at 4/3 + 1/1; `/experiential`'s
  is 16/9 + two 4/3.

---

## Performance and accessibility

Measured for the first time on 13 September — see `docs/PERFORMANCE.md`.
**Every §6 category threshold passes on all six configurations.** CLS is
0 everywhere.

Two items remain, both documented there and both needing a decision from
CLICK:

1. **Contrast misses WCAG AA by 0.049.** Brand Electric Blue `#186ffc`
   gives white text 4.451:1 against AA's 4.5:1. Lighthouse still scores
   96, so the §6 *score* passes — but §6 also requires WCAG 2.1 AA, and
   that claim cannot be made while contrast fails.
2. **Mobile LCP is 3.2–4.1s against §6's ≤2.5s.** The LCP element is the
   hero `<h1>` and ~88% of its time is render delay from the split-text
   animation, not network.

---

## Not started

Ranked by schedule risk.

1. **Wix redirect map** — a week-7 deliverable. Needs a full crawl of the
   live Wix URL set and a 1:1 map in `next.config.ts`, verified for
   unintended 404s, with images moved off Wix. **Blocked: the current Wix
   URL set has not been supplied.**
2. **Schema markup** — only `Organization` and `WebSite` exist. Still
   needed: `Person` (talent), `CreativeWork` (case studies), `Article`
   (insights/news), `BreadcrumbList` site-wide. All six need validating.
3. **Analytics verification** — Google Search Console and Bing property
   verification, sitemap submission, and conversion events proven to fire
   in **both** GA4 and HubSpot. Consent state exportable (§5).
4. **§14 handover pack** — 12 items, none delivered.
5. **§15 Bill of Materials** — check GSAP's licence explicitly.
6. **§8.8 vulnerability scan** and **§8.9 tracking inventory.**
7. **Median-of-three Lighthouse runs against staging** for acceptance
   evidence. The current numbers are single runs.

---

## Waiting on CLICK

Content and decisions the build cannot proceed without.

**Overdue (§10):**
- Geographic consent restrictions and the Clarity/Peec election — due at
  kickoff. Recommended written answer: strict opt-in globally, which is
  what is built and is defensible everywhere.
- Brand assets, the portrait shoot, logo approval and GameSquare naming —
  due week 3.

**Blocking specific work:**
- The live **Wix URL set** — blocks the redirect map entirely.
- **Licensed brand webfonts** (Helvetica Now Display Condensed, Matter) —
  the `@font-face` block in `globals.css` is written and commented out,
  waiting on a *webfont* licence. Free OFL stand-ins carry the page.
- **Team portraits** — 10 of 12 people render the awaiting-portrait frame.
- **Perspective lines** — collected from each person in their own voice.
  Never written for them.
- **Case-study data** — only Capcom is client-confirmed. The Australian
  Government campaign is unconfirmed and correctly excluded from the
  sitemap.
- **A real experiential activation** — the activation scorecard on
  `/experiential` is a shaped placeholder and says so.
- **The 12th talent profile.** The 11 on file were drafted from public
  sources on 1 September 2026 and are **unverified by CLICK**.
- **Legal copy** — all three legal pages are `noindex` drafts. Search
  `content/legal.ts` for "TO CONFIRM".
- **One real insight** for the payoff frame on `/influencer-marketing`.

**Decisions:**
- The two in `docs/PERFORMANCE.md` (contrast, hero animation).
- Sanity plan. The Growth trial lapses around now (~14 September).
  On **Free** there are only
  Administrator and Viewer roles — every CLICK editor is a full admin —
  and history is 3 days. Growth is $15/seat/month. Chris should accept
  this knowingly.
- How Chris reaches staging — a Vercel Shareable Link, or adding him to
  the `click17` team. §11 ties the final $4,000 to acceptance "on the
  staging URL", which has never been named in writing.
- Confirmation in writing that `/insights`, `/news` and `/press` are
  included as goodwill rather than §13 chargeable pages.

---

## Before merging `dev` to `main`

- Gate or trim the `GET` readiness handler on `/api/revalidate` — it is
  publicly readable on production. Key names and booleans only.
- Remove the staging CORS origin; consider registering the Studio for
  `www.clickmedia.group`.
- Confirm `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are set
  on **Production**. The build now fails loudly without them, by design —
  a private dataset returns empty rather than 401, so a tokenless build
  would otherwise ship an empty site with a green build.
- Only **1 Sanity seat is in use.** §9 requires a CLICK person to perform
  every §4 operation unaided during training, so they need inviting.
- Delete or explicitly scope out the old `click-concept` project on the
  personal Vercel account (§6.3, §14 inventory).

---

## Environments

| | |
| --- | --- |
| Staging | `https://click-web-git-dev-click17.vercel.app` — the `dev` branch alias |
| Production | `www.clickmedia.group` — still serving old `main` |
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
