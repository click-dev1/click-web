# Sanity — the CMS

## Two pieces, two places

| | Where it lives | What it is |
| --- | --- | --- |
| **Content Lake** | Sanity's servers, project `eclvbmom`, dataset `production` | The content itself. Nothing to deploy. |
| **Studio** | This repo — `sanity.config.ts`, `sanity/schemaTypes/` | The editing UI, served by Next at `/studio`. |

`sanity.io/manage` is the project's control panel — billing, members, tokens,
webhooks, usage. **No content is edited there.** Editors go to `/studio`.

Access to the Studio is Sanity's own login: anyone can load the URL, but
without a Sanity account that is a member of the project they get a login
screen and nothing else. `robots.ts` also keeps `/studio` out of search
results.

## The dataset is private

No document — published or draft — can be read without a token. This is
deliberate: a public dataset exposes every field on every published
document to anyone holding the project id, which ships in the page. That
includes fields the site never renders, such as the `notes` field on
`talent`, which carries internal editorial commentary.

The consequence is that **`SANITY_API_READ_TOKEN` is required in every
environment that builds the site, Production included.** A build without
it fails.

To confirm the setting: `npx sanity dataset visibility get production`.

## Publishing reaches the site through a webhook

The site is static HTML. Publishing in the Studio changes the Content
Lake and nothing else until something tells Next the pages are stale.
That is `app/api/revalidate/route.ts`.

```
Editor hits Publish
  → Sanity fires the webhook with the changed document
  → /api/revalidate verifies the signature, calls revalidateTag(_type)
  → the pages that read that type are marked stale
  → the next visitor gets a freshly rendered page
```

### The convention that makes it work

**A cached Sanity read is tagged with the document type it reads.**

`lib/sanity/talent.ts` tags its fetches `"talent"`; the webhook
revalidates `body._type`. So a new content type inherits revalidation for
free — it only has to tag its own reads:

```ts
const readOptions = previewDrafts
  ? {}
  : { next: { revalidate: false as const, tags: ["caseStudy"] } };
```

Two rules when adding a type:

1. **Tag with the exact `_type` string.** The webhook has no mapping
   table; the tag *is* the type name.
2. **Draft reads pass no cache directive at all.** Not `revalidate: 0` —
   that opts the route out of prerendering, and every page is required to
   ship as static HTML (SOW §2).
3. **Give published reads a finite `revalidate`, never `false`.** An
   indefinite entry is persisted in `.next/cache`, which Vercel restores
   between deployments — so a build can bake content captured at an
   earlier build and never correct itself. That is how a published page
   stayed out of a freshly built sitemap. One hour means a missed webhook
   self-heals instead of surviving deploys.

### Setting the webhook up

`manage.sanity.io` → project → **API** → **Webhooks** → Create webhook:

| Field | Value |
| --- | --- |
| URL | `https://<your-domain>/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | `POST` |
| Projection | `{_type}` |
| Secret | the value of `SANITY_REVALIDATE_SECRET` |

The webhook must point at a **deployed** URL — it cannot reach
localhost. Test it by publishing a change in the Studio and reloading the
live page.

## Drafts

Set `SANITY_PREVIEW_DRAFTS=true` and the site renders drafts as well as
published documents, so unpublished work stays reviewable without ever
being publishable. **Local development only.**

> **Never set it on a deployment.** Draft reads are uncached and
> untagged, so an environment in draft mode has nothing for
> `revalidateTag()` to invalidate: the webhook answers `200` and the page
> never changes. A staging deployment must leave it unset so it behaves
> exactly as Production does — that is the whole point of staging.

Note that with drafts on, **localhost cannot show you the
published/unpublished distinction** — a draft edit appears on the local
site whether or not you pressed Publish. The document's own status in the
Studio is the truth.

## Staging

The webhook cannot reach localhost, so the publish loop can only be
tested on a deployment. For that deployment to be a valid rehearsal it
must match Production in two ways:

1. `SANITY_PREVIEW_DRAFTS` unset — otherwise reads are untagged and
   revalidation silently does nothing.
2. Reachable by Sanity's webhook. If Vercel Deployment Protection is on,
   every request is redirected to Vercel SSO and the webhook never
   arrives. Either disable protection for that environment, or generate a
   Protection Bypass for Automation secret and send it from the webhook
   as the `x-vercel-protection-bypass` header.

Point the webhook at a **stable branch alias**, never at a
deployment-pinned URL (`click-<hash>-<team>.vercel.app`) — those are
frozen to a single build, so revalidating one has no effect on what
anybody is looking at.

## Pages and section blocks

A **Page** document is a list of sections. Editors add, reorder and remove
them; the page's vertical rhythm, hairlines and background-canvas signals
are derived from position, not chosen — editors control copy, images and
calls to action (SOW §4), not layout.

Delivered blocks:

| Block | What it is |
| --- | --- |
| `pageHero` | Eyebrow, headline, kicker, lede, up to two buttons, optional image |
| `copyMedia` | Eyebrow, heading, body copy, up to 3 images (left/right/below), optional framed insight |
| `metricRow` | Two to four measured figures, optional heading and provenance footnote |
| `capabilityList` | One to four groups of capability chips |
| `cardGrid` | Two to eight short cards, optionally numbered and imaged, optional link below |
| `featuredWork` | A row of case studies — chosen, or the featured ones automatically |
| `featuredTalent` | A row of creators — chosen, or the featured ones automatically |
| `mediaBlock` | A band of images on their own — one banner, or 2–4 portraits |
| `teamGrid` | The team — chosen people, or everyone, from the `person` type |
| `timeline` | Signature block: copy beside a dated list of milestones |
| `recognition` | Awards and listings, centred and stacked |
| `activationScorecard` | Signature block: copy beside a framed scorecard of 2–4 figures |
| `splitCopy` | Two short arguments side by side, each with its own heading |
| `journeySequence` | One word per stage, arrows between, the last set larger |
| `journeyPanels` | Signature block: two full-bleed routes, the second outlined |
| `ctaBanner` | Closing call to action, optionally with a second button |

Anything derived from the *number* of items an editor adds is derived on
purpose. Column counts come from the item count so a grid never ends in a
ragged row, and `cardGrid`'s 01/02/03 marks come from position so
reordering the cards renumbers them. Hand-typed numbering survives
exactly until someone drags a card.

The two `featured*` blocks take an optional list of picks. Left empty
they show whatever is currently marked **Featured**, so a service page
keeps showing current work without anyone remembering to go back and
edit it; name specific items and those appear, in the order given. "How
many to show" applies only to the automatic list — an editor who named
four meant four.

`copyMedia`'s images arrange themselves too: one fills the slot, two or
three become the collage. And its framed insight takes the large
pull-quote style on its own, or the smaller stated-finding style once it
carries a label — a finding that cites its sources should not be set like
a slogan.

Blocks that show an image also take **awaiting-image captions**. With no
image on file they render the same empty frames the hand-built pages use —
one caption per image that is coming, in the arrangement the images will
take — so a section waiting on photography says so instead of quietly
collapsing. Remove them once the images are in. The one exception is
`featuredWork`, which stays a compact text card without an image:
placeholder rectangles in the middle of an argument read as broken rather
than as honest.

`copyMedia` with images on the **left** puts them first in the markup
rather than reordering with CSS. Reading order is DOM order and a narrow
screen stacks in that order, so a CSS-only swap would put the copy above
the pictures on a phone — which is not what the hand-built section does.

A CMS page lives at `/<slug>` via `app/(site)/[slug]/page.tsx`. Every
hand-built route is static and therefore wins over it, so a CMS page can
never shadow `/about` or `/work` — but a page given one of those slugs
will build and be unreachable.

### Adding a block

Three places, all required. A block missing from any one of them is
either invisible to editors or renders as nothing:

1. **Schema** — `sanity/schemaTypes/objects/blocks/<name>.ts`, registered
   in `sanity/schemaTypes/index.ts`
2. **Page** — add it to the `blocks` array in `sanity/schemaTypes/page.ts`
3. **Renderer** — a component in `components/blocks/`, wired into the
   `switch` in `components/blocks/registry.tsx`

If the block resolves a reference or an image, add its projection to
`pageFields` in `lib/sanity/queries.ts`.

> Per SOW §4, *designing a new section type is development work and falls
> outside the self-service scope*. Assembling a new page from the blocks
> above is within it.

## The team

`/about`'s grid renders from the `person` type, so CLICK can add someone
to the team without a developer. `teamGrid` with no picks shows everyone
in their sort order — add a person and they appear on the page.

Two editorial rules are built into the type rather than left to habit:

- **Nobody gets an invented quote.** `perspective` is collected from that
  person in their own voice. Empty renders "Perspective line · collected
  in their own voice", not filler.
- **No stock headshots.** An empty `photo` renders the awaiting-portrait
  frame. Ten of the twelve are in that state today, by design.

`pnpm seed:team` moved the twelve across. As with the other seeds, it
reads `content/site.ts`, so stop running it once CLICK has edited anyone.

## Case studies

`/work` and `/work/[slug]` render from the `caseStudy` type. Two things
about the migration from `content/site.ts` are worth knowing:

**`VerificationStatus` split in two.** Whether a case study is fit to
publish is now draft vs published — that is what the draft state is for.
Where its *figures* came from stays as a field, `figuresSource`, because
it drives a disclosure line the reader sees. Truth discipline is the
site's whole premise and it does not survive being folded into a publish
button.

| `figuresSource` | Disclosure under the results | In the sitemap? |
| --- | --- | --- |
| Confirmed by CLICK | "Figures as confirmed by CLICK." | yes |
| Published on clickmedia.group | "…as published on clickmedia.group. Insight line is an editorial interpretation…" | yes |
| Awaiting client confirmation | "Campaign details pending client confirmation." | **no** |

That last row is what `isCampaignPublishable()` used to do: the page
still renders for review, it just stays out of search.

**The `/work` disclosure is derived, not written.** It used to be a
sentence in `content/site.ts` naming four brands by hand. It was correct
the day it was written and would have started quietly lying the first
time CLICK published a fifth case study. `lib/sanity/disclosure.ts`
builds it from the documents instead.

`pnpm seed:case-studies` moved the five campaigns in. **Do not run it
again** once CLICK has edited anything in the Studio — it reads
`content/site.ts` and would overwrite their edits. It exists to move the
content once.

## Migrating a bespoke page

A static route **wins over** a CMS page with the same slug. So a page
migrated straight to its real slug is invisible until the hand-built file
is deleted — which is the one step here that is hard to walk back.

The sequence that avoids that:

1. Seed the page to a temporary slug (`<name>-cms`) with SEO →
   "Hide from search engines" set. Two addresses serving the same copy is
   a duplicate-content problem, not a staging detail.
2. Compare the two rendered pages. Stripping the tags out of both builds
   and diffing the text is the fastest way to prove nothing was dropped.
3. Delete the hand-built route, change the slug to the real one, clear
   the `noIndex` flag.

`pnpm seed:im` did step 1 for `/influencer-marketing`. The two pages'
rendered text is **identical** — the only line the diff reports is the
scorecard source, which the original builds from two JSX expressions and
so splits across two text nodes. Same characters.

## Environment variables

| Variable | Needed where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | optional | Overrides the committed default `eclvbmom` |
| `NEXT_PUBLIC_SANITY_DATASET` | optional | Overrides the committed default `production` |
| `SANITY_API_READ_TOKEN` | **everywhere** | Viewer token. Required — the dataset is private |
| `SANITY_API_WRITE_TOKEN` | local only | `pnpm seed:roster` only. Never set in Vercel |
| `SANITY_REVALIDATE_SECRET` | **everywhere** | Signs the webhook. Without it, publishing never reaches the site |
| `SANITY_PREVIEW_DRAFTS` | **local only** | `"true"` renders drafts. Never set on a deployment — it disables revalidation |

## Seeding

`pnpm seed:roster` (`scripts/seed-roster.ts`) is the canonical roster
seed and is idempotent. Do **not** run `pnpm seed:sanity` — it recreates
placeholder creators that were deliberately deleted.

`pnpm seed:case-studies` migrated the five campaigns out of
`content/site.ts`. It was a one-time move; see **Case studies** above
before ever running it again.
