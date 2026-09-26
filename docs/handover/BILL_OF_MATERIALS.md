# Bill of Materials

Agreement §5.2 and Exhibit A §15. Every third-party and open-source
component the Website incorporates or needs, with version, licensor,
licence and any recurring fee, and who holds each account or licence.

**As at:** 26 September 2026, branch `dev`.
**Complete package list:** `bom-packages.csv` (1,147 packages: 937 that
ship with or run the site, 210 used only to build and check it). It is
generated from the lockfile with `pnpm licenses list --json`. Re-generate
it whenever dependencies change.

## Summary

- **No AGPL, GPL or other licence** that would require CLICK to disclose
  or license its own code, or restrict its use of the Website (§5.2(a)).
- **No component owned by the Developer** or an affiliate (§5.2(b)).
  Everything written for this project is Work Product in CLICK's
  repository.
- **No paid, subscription, seat-limited or non-transferable software
  licence.** The only non-open-source component, GSAP, is free (see
  below).
- The recurring costs are the **services** in the last table, and they
  match Exhibit A §12.

## Components outside the pre-approved licences

§5.2 pre-approves MIT, BSD, Apache 2.0 and ISC. These are the others,
named here as §5.2 requires:

| Component | Version | Licence | What it means for CLICK |
| --- | --- | --- | --- |
| `gsap`, `@gsap/react` (GreenSock, now Webflow) | 3.15.0, 2.1.2 | GSAP Standard "no charge" licence | **Proprietary, free — including commercial use.** Drives the site's motion. No fee and no account. CLICK should read the terms at gsap.com/standard-license, which restrict certain uses (e.g. building tools that compete with Webflow); a marketing website is the use it is written for. |
| `@img/sharp-libvips-*` (via Next.js image optimisation) | 1.3.2 | LGPL-3.0-or-later | Weak copyleft. Loaded as a separate native library, so CLICK's code does not have to be disclosed. |
| `lightningcss` (build only), `@vercel/stega`, `dompurify` | 1.33.0, 1.1.0, 3.4.14 | MPL-2.0 (dompurify: MPL-2.0 or Apache-2.0) | File-level copyleft: only changes made *to those files* would have to be shared. None are modified. |
| 8 packages (`lru-cache`, `minimatch`, `tar`, …) | various | BlueOak-1.0.0 | Permissive, MIT-equivalent. |
| `caniuse-lite` (build data) | 1.0.30001809 | CC-BY-4.0 | Browser-support data used at build time; attribution licence. |
| 5 packages | various | CC0, 0BSD, MIT-0, Public Domain, MIT-or-CC0 | Public-domain equivalent. |

## Direct dependencies

The packages the project names in `package.json`. Everything else in
the CSV is pulled in by these.

| Package | Version | Licence | Licensor | Scope |
| --- | --- | --- | --- | --- |
| next | 16.3.0 | MIT | Vercel | Runtime |
| react, react-dom | 19.2.8 | MIT | Meta | Runtime |
| sanity (embedded Studio) | 6.11.0 | MIT | Sanity.io | Runtime |
| next-sanity | 13.3.3 | MIT | Sanity.io | Runtime |
| @sanity/client | 8.4.0 | MIT | Sanity.io | Runtime |
| @sanity/image-url | 2.1.1 | MIT | Sanity.io | Runtime |
| @sanity/vision | 6.11.0 | MIT | Sanity.io | Runtime |
| sanity-plugin-mux-input | 5.0.12 | MIT | Sanity.io | Runtime |
| @mux/mux-player-react | 3.13.4 | MIT | Mux, Inc. | Runtime |
| gsap | 3.15.0 | GSAP Standard "no charge" | GreenSock / Webflow | Runtime |
| @gsap/react | 2.1.2 | GSAP Standard "no charge" | GreenSock / Webflow | Runtime |
| lenis | 1.3.26 | MIT | darkroom.engineering | Runtime |
| styled-components | 6.5.3 | MIT | styled-components contributors | Runtime (Studio) |
| tailwindcss, @tailwindcss/postcss | 4.3.3 | MIT | Tailwind Labs | Build |
| typescript | 5.9.3 | Apache-2.0 | Microsoft | Build |
| eslint | 9.39.5 | MIT | OpenJS Foundation | Build |
| eslint-config-next | 16.3.0 | MIT | Vercel | Build |
| tsx | 4.23.12 | MIT | Hiroki Osame | Build (seed scripts) |
| @types/node, @types/react, @types/react-dom | 20.19.43, 19.2.18, 19.2.4 | MIT | DefinitelyTyped | Build |

Package manager: pnpm 11.10.0 (pinned in `package.json`). Runtime:
Node.js on Vercel.

## Fonts

| Font | Licence | Served from |
| --- | --- | --- |
| Archivo | SIL Open Font License 1.1 | This site (self-hosted at build by `next/font`; no request to Google at runtime) |
| Hanken Grotesk | SIL Open Font License 1.1 | This site (as above) |

These stand in for the brand fonts, Helvetica Now Display Condensed and
Matter. Those need a **webfont** licence bought by CLICK before they can
replace them. That licence would be a new paid item for this table and
Exhibit A §12.

## Services

Every external service the Website uses. Exhibit A §7 requires each to be
held in CLICK's own account; two are marked to confirm below. None is
payable to the Developer.

| Service | Purpose | Held by | Recurring cost | Needed to run? |
| --- | --- | --- | --- | --- |
| GitHub (`click-dev1`) | Source code | CLICK | $0 | Yes |
| Vercel (team `click17`, project `click-web`) | Hosting, builds, CDN, SSL | CLICK | ~$20/month | Yes |
| Sanity (project `eclvbmom`) | Content management | CLICK | $0 Free plan (Growth $15/seat/month, optional) | Yes |
| HubSpot (portal 5918623) | Contact form, CRM | CLICK (existing, shared with the GameSquare group) | Existing | Yes |
| Google Analytics 4 (`G-J6GF6EL37B`) | Analytics, after consent | CLICK — **to confirm** the property sits in a CLICK-owned account | $0 | No |
| Mux | Video for the /work reels | **To confirm** — must be a CLICK-owned account | $0 free tier | Only while reels are used |
| Google Search Console, Bing Webmaster Tools | Search monitoring | CLICK | $0 | No |
| Domain `clickmedia.group` | Address | CLICK (existing registrar) | Existing | Yes |

Not in use: Microsoft Clarity, Peec (CLICK has not elected either),
UptimeRobot (optional), a third-party consent platform (the consent
banner is built into the site; no fee).
