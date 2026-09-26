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
| `contactForm` | Copy beside the HubSpot embed |
| `linkChips` | A row of outbound chips — the social profiles by default |
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

## Site-wide values

`siteSettings` and `navigation` are **singletons** — one of each, pinned
at the top of the Studio rather than shown as a list of one. Between them
they hold everything used in more than one place:

| | Where it shows |
| --- | --- |
| Enquiries email | nav, footer, structured data, the contact page |
| Social profiles | footer icons, the contact page's chip row |
| Main menu | the nav, one level of nesting, no deeper |
| Footer columns | the footer sitemap |
| Company name, tagline | the footer legal bar |

Both are fetched once in `app/(site)/layout.tsx` and handed down as
props. `Nav` is a client component and cannot read them itself, and the
footer would otherwise repeat the same two queries on every page.

**Social icons are not editable.** They are inline SVG, kept in
`components/Footer.tsx` and keyed by platform. Letting an editor paste
markup into a field is how a CMS becomes an XSS hole, so the platform is
a choice from a list and the mark stays in code. A platform with no mark
renders no icon rather than breaking the row.

`pnpm seed:settings` created both. One-time, like the others.

## The home page

A **singleton**, `homePage`, with one field group per section rather than
a blocks array. That was deliberate: nobody will ever assemble a second
home page, and a block canvas would hand an editor the ability to reorder
the argument the whole site rests on — intelligence, then the two
journeys, then proof, then the ecosystem behind it. The sections and
their order are fixed. Every word in them is editable.

Two things resolve rather than being typed:

- **Featured work** reads `caseStudy` documents. It is pinned to three by
  default because the hand-built page led with a specific three — which
  is not the same as the first three featured. Clear the picks and it
  follows the featured flag instead.
- `caseStudy.headline` is the longer editorial line the home page leads
  with ("Sending Pragmata into orbit with creator content"); `title` is
  the campaign's name ("Pragmata"), which is what `/work` shows. The site
  carried both before the migration, in two different files. Most case
  studies need only the name.

The GameSquare ecosystem is edited in the home page's **Ecosystem** group:
an eyebrow, a heading, labelled groups of names (each with a one-line
description shown in the side panel), and an optional footnote. With no
groups the section is left off the page.

The `/work` brand wall is edited on the **Work page** (Brand wall group).
List the clients there; brands with a CLICK case study are appended
automatically and become filter buttons. GameSquare-attributed brands are
never added — the wall is CLICK's own clients.

## Anchors

Every block that renders its own section can carry an **anchor** — a link
target, so `/contact#enquiry` lands on the right section. `globals.css`
gives `section[id]` a `scroll-margin-top`, which is why the id goes on
the section and not on a wrapper: without it the fixed nav covers the
target.

`/contact` is the page that needs this — its routing cards, its hero and
its in-page CTAs all point at `#enquiry` and `#creator-network`.

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
| Confirmed by CLICK | "Figures as confirmed by CLICK Influence." | yes |
| Published on clickmedia.group | "…as published on clickmedia.group. Insight line is an editorial interpretation…" | yes |
| Awaiting client confirmation | "Campaign details pending client confirmation." | **no** |

That last row is what `isCampaignPublishable()` used to do: the page
still renders for review, it just stays out of search.

**The `/work` disclosure is derived, not written.** It used to be a
sentence in `content/site.ts` naming four brands by hand. It was correct
the day it was written and would have started quietly lying the first
time CLICK published a fifth case study. `lib/sanity/disclosure.ts`
builds it from the documents instead.

**Deck case studies (Sep 2026).** CLICK's Narrative and Case Studies
decks added 13 CLICK Influence case studies and 8 GameSquare
activations. The fields that came with them:

- **Delivered by** (`attribution`) — CLICK Influence or GameSquare.
  GameSquare work shows a "GameSquare" badge on its card and a credit
  line on its page, so the site never claims work CLICK did not
  deliver. CLICK's own work leads the `/work` grid.
- **Engagement type** — how CLICK sold it (Mass Awareness, Kit
  Seeding, Onsite Support…). Filterable on `/work`.
- **Gallery** — imagery beyond the lead image, laid out as a masonry
  wall where every picture keeps its own shape.
- **Client quote** — the client's own words, with name, role and photo.

`/work` shows six case studies and a "View more" button that adds six
at a time; the filters and the count live in the URL. Every case study
still has its own page in the sitemap.

**The Work page** (`workPage` singleton) holds the `/work` hero, the
closing CTA and the four **industry reels** (Beauty, Consumer Tech,
Sport & Lifestyle, Food & Bev). A reel's industry must match a case
study industry for its "See the work" link to appear. Video playback
arrives with the Mux integration; until then a reel shows its poster.

### Image display: Fill or Fit

Every image slot has a fixed shape — cards are 4:3, banners 21:9 — and
each image has a **Display** option:

- **Fill** (default) crops to the frame around the hotspot. Use it for
  photography, and set the hotspot on the face or subject.
- **Fit** shows the whole image on the brand Dark Blue. Use it for the
  deck collages (they are built on that same blue, so the edges vanish),
  key art and screenshots.

Images under ~600px wide belong in a gallery, never as a lead image.

`pnpm seed:case-studies` moved the five campaigns in. **Do not run it
again** once CLICK has edited anything in the Studio — it reads
`content/site.ts` and would overwrite their edits. It exists to move the
content once.

## Insights, news and press

**Insights & news** (`article`) is one type with a *kind*: an insight
lives at `/insights/<slug>`, a news story at `/news/<slug>`, and each
index lists its own kind, newest first. Title, excerpt (the card and the
search description), publication date, an optional lead image, an
optional author picked from the Team, and a body with headings, quotes,
lists, links and images. With no author the byline reads "CLICK".

**Press** (`pressItem`) is coverage in other outlets: headline, outlet,
date, link, and an optional line quoted from the piece. It has no page
of its own — `/press` lists it and links out to the original.

- **Empty is a real state.** Before anything is published each index
  says so plainly, is `noindex`, and stays out of the sitemap. The first
  published piece brings it into search.
- **Not in the menu by default.** Add `/insights`, `/news` or `/press`
  in *Navigation* when there is something to show.
- **Body links** accept `https://`, `mailto:` or a path on this site;
  anything else is refused in the Studio and dropped by the renderer.
- A Page cannot take the address `insights`, `news` or `press` (or any
  other built-in section) — the Studio refuses it, because the built
  route would hide the page.
- The index headings and ledes are written in code
  (`components/articles/routes.tsx`), like the page furniture on
  `/talent` and `/work`.

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
3. Run `pnpm swap:pages` (dry run) then `pnpm swap:pages --apply`. It
   copies `page-<slug>-cms` to `page-<slug>`, sets the real slug and
   clears `noIndex`. **Delete the hand-built route file in the same
   commit** — a static route wins, so until the file goes the CMS page
   builds and nobody can reach it.
4. **Remove the page from the hardcoded `statics` list in
   `app/sitemap.ts`.** Its entry now comes from Sanity with a real
   `lastModified`, and leaving it in both places puts the same `<loc>` in
   the sitemap twice. There is a dedupe at the bottom of that file as a
   backstop, but the list should still be correct.

Reversible: `git restore` the route file and re-run the page's seed
script. Note those scripts now point at the **live** slugs, so running
one overwrites whatever CLICK has edited.

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

`pnpm seed:deck` (`scripts/seed-deck.ts`) brought the Sep 2026 deck
content in: the deck case studies, the Work page, `/experiential` as a
block page, and new sections on Influencer Marketing and About, with
their images. Unlike the older seeds it is **additive**: it creates only
what does not exist yet and inserts page sections only when their
`deck-*` key is absent, so re-running it cannot overwrite Studio edits.
It reads images from `DECK_ASSETS_DIR`. Dry run by default; `--apply`
writes.

`pnpm seed:ecosystem` (`scripts/seed-ecosystem.ts`) moved the home
ecosystem lineup and the `/work` brand wall out of `content/manifest.ts`.
Every field is `setIfMissing`, so it never overwrites Studio edits. Dry
run by default; `--apply` writes.
