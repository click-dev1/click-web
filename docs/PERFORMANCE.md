# Performance & accessibility baseline

First measurement against the SOW §6 thresholds, 13 September 2026.

Run with Lighthouse 12 against a local production build (`next start`),
one run per configuration. **§6 asks for the median of three** — these are
single runs and are a working baseline, not the acceptance evidence. Re-run
as median-of-three against the staging URL before sign-off.

## Acceptance run — staging, median of three (26 September 2026)

The §6 method: Lighthouse 12.8.2 in Chrome 153 (current stable), against
the staging deployment, three consecutive runs per page and form factor,
median reported. Each run is a cold load (browser cache cleared). Staging
sits behind Vercel Authentication; the bypass was set as a cookie scoped
to the staging host only, so it never reached a third party.

| Page | Form | Perf | A11y | BP | SEO* | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| home | desktop | 100 | 96 | 100 | 100 | 0.58s | 0 | 0ms |
| talent profile (`/talent/steak`) | desktop | 99 | 96 | 100 | 100 | 0.88s | 0 | 0ms |
| case study (`/work/capcom-pragmata`) | desktop | 100 | 96 | 100 | 100 | 0.47s | 0 | 0ms |
| case study, image-heavy (`/work/ea-golf-clash`) | desktop | 100 | 96 | 100 | 100 | 0.47s | 0 | 0ms |
| home | mobile | 99 | 96 | 100 | 100 | 2.15s | 0 | 0ms |
| talent profile | mobile | 92 | 96 | 100 | 100 | **3.33s** | 0 | 0ms |
| case study | mobile | 100 | 96 | 100 | 100 | 1.92s | 0 | 9ms |
| case study, image-heavy | mobile | 100 | 96 | 100 | 100 | 1.93s | 0 | 0ms |

**Every Lighthouse category threshold passes on every page and form
factor.** Two things to read with it:

- \*SEO scores **66–69 as measured on staging**. The only failing audit is
  "Page is blocked from indexing": Vercel adds `x-robots-tag: noindex`
  to every preview deployment, and production does not (checked). With
  that one audit excluded, SEO is 100 everywhere. The SEO evidence should
  be re-run on production after launch.
- The only accessibility audit failing is colour contrast — the open
  decision below.

**LCP (§6: ≤2.5s)** now passes on mobile for the home page and case
studies; the **talent profile (3.33s) is the one miss**. §6 measures LCP,
INP and CLS at the 75th percentile of real visits, which only exists once
the site has traffic: confirm it in Search Console's Core Web Vitals
report after launch. Lab values above are the pre-launch proxy (TBT for
INP).

## Thresholds

| | Target |
| --- | --- |
| Performance | ≥90 desktop, ≥80 mobile |
| Accessibility | ≥95 |
| Best practices | ≥90 |
| SEO | ≥95 |
| LCP | ≤2.5s |
| INP | ≤200ms (TBT used as the lab proxy) |
| CLS | ≤0.1 |

## Where we are

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home · desktop | 100 | 96 | 100 | 100 | 0.7s | 0 | 0ms |
| home · mobile | 92 | 96 | 100 | 100 | **3.3s** | 0 | 10ms |
| talent profile · desktop | 99 | 96 | 100 | 100 | 0.9s | 0 | 0ms |
| talent profile · mobile | 87 | 96 | 100 | 100 | **4.1s** | 0 | 10ms |
| case study · desktop | 100 | 96 | 100 | 100 | 0.6s | 0 | 0ms |
| case study · mobile | 94 | 96 | 100 | 100 | **3.2s** | 0 | 0ms |

Every category threshold passes. **LCP on mobile is the one metric still
outside §6**, and contrast is the one WCAG issue left — see below.

## What the first measurement found

Three defects, all fixed:

1. **HubSpot's loader ran on every pageview of every route.** The contact
   modal already gated its form frame on first open, precisely so a form
   view was not counted per pageview — but the `<Script>` sat outside that
   gate. So `js.hsforms.net` was fetched, and its `__cf_bm` cookie set, on
   every page, before the visitor consented to anything and whether or not
   they ever opened the form. This was a consent problem before it was a
   score. Best practices 79 → 100.
2. **GSAP `SplitText` put `aria-label` on bare `<span>`s.** Its default
   (`aria: "auto"`) labels the split element and hides the generated
   lines, which is correct on an `<h1>` but prohibited ARIA on a `<span>`
   with no role. Splitting by *lines* keeps whole words together, so the
   plain DOM text reads fine in order: `aria: "none"`.
3. **Footer legal links were under the minimum tap target** — 12px text,
   4px apart. Padding grows the hit area to ~28px without moving the text.

Accessibility 88 → 96, best practices 79 → 100, LCP 3.8s → 3.3s,
TBT 50ms → 10ms.

## The two open decisions

### Contrast — a 0.049 miss

Brand Electric Blue `#186ffc` gives white text **4.451:1**. WCAG AA needs
**4.5:1** for normal text. The site misses AA by 0.049, and `globals.css`
already documents the bind: no published brand colour does better on this
background, which is why secondary copy is white too.

Lighthouse scores 96 with this outstanding, so the **§6 score threshold
passes either way**. But §6 also requires WCAG 2.1 AA, and that claim
cannot be made while contrast fails.

| `--bg` | white on page | card surface | white on card |
| --- | --- | --- | --- |
| `#186ffc` (today) | 4.451 ✗ | `#2f7dfc` | 3.846 ✗ |
| `#176efa` | **4.519** ✓ | `#2e7cfa` | 3.904 ✗ |

One step darker clears the page background and is imperceptible. Card
surfaces are a separate problem: `--card` is a 10% **white** tint, so it
lightens the ground under white text. Swapping it for brand Dark Blue
`#00234a` at 8% gives **4.972:1** — but it makes cards read as recessed
rather than raised, which is a visible design change and CLICK's call.

### LCP on mobile — the hero animation

*Update 26 September: on staging, home and case studies now pass; the
talent profile (3.33s) is the one page still over.*

The LCP element is the hero `<h1>`, and ~88% of its time is *render
delay*, not network (TTFB is 456ms). The split-text animation waits on
`document.fonts.ready`, then masks the heading and animates it in over
~1s, so the largest text does not reach its final paint until that
finishes. Nothing else on the page is slow: TBT is 10ms and CLS is 0.

Options, in rough order of how much they cost the design: shorten the
hero tween; start above-the-fold splits without waiting for
`document.fonts.ready`; exclude the hero `<h1>` from `data-split`
altogether. The last one certainly fixes it and costs the most.

## Reproducing

```
pnpm build && npx next start -p 3100
npx lighthouse@12 http://localhost:3100/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile \
  --chrome-flags="--headless=new"
```

Desktop uses `--preset=desktop`. The three §6 pages are the home page, a
talent profile (`/talent/sypherpk`) and a case study
(`/work/capcom-pragmata`).
