# Structured data

SOW §5's schema set: `Organization`, `WebSite`, `BreadcrumbList`,
`Person`, `Article`, `CreativeWork`. All six are live.

## What each page carries

| Page | JSON-LD |
| --- | --- |
| Every page | `Organization` (CLICK) + `WebSite` — `components/StructuredData.tsx`, in the site layout |
| `/talent/[slug]` | `ProfilePage` → `Person`, or `Organization` for a group, + `BreadcrumbList` |
| `/work/[slug]` | `WebPage` → `CreativeWork` + `BreadcrumbList` |
| `/insights/[slug]`, `/news/[slug]` | `WebPage` → `Article` (insight) or `NewsArticle` (news) + `BreadcrumbList`; author is the named team member, or CLICK |
| `/talent`, `/work`, `/insights`, `/news`, `/press`, every CMS page | `BreadcrumbList` |
| Legal pages | `BreadcrumbList` once published (not while they are `noindex` drafts) |
| Home | none beyond the site-wide pair — it is the root of every trail |

A page marked **Hide from search engines** in the Studio carries no page
JSON-LD.

## Rules

- **Only what the page shows.** Every value comes from the same Sanity
  document the page renders (`lib/jsonld.ts`), so a Studio edit changes
  both and they cannot drift. This is Google's rule for structured data.
- **Credit follows the page.** A case study's `creator` is CLICK for its
  own work and GameSquare for the group's activations — the same line the
  GameSquare badge draws for a reader. The client is the `sponsor`.
- **Individual or group.** Each talent profile has an *Individual or
  group* field (Profile tab). A group channel — The Boys — is described
  as an `Organization`, because a group is not a person.
- **Escaped for the `<script>` context.** Always render through
  `components/JsonLd.tsx`. `JSON.stringify` alone lets a CMS string
  containing `</script>` close the tag; `serializeJsonLd` escapes `<`,
  `>` and `&` so it cannot.
- Nodes link by `@id` (`#organization`, `#website`, `<url>#breadcrumb`,
  `<url>#creator`, `<url>#work`), so the CLICK a case study credits is
  the organisation the layout declares.

## Verified

26 September 2026: every built page's JSON-LD parses (49 pages); the
schema.org validator reports **zero errors** on a person profile, a group
profile, two case studies, `/about`, `/work` and `/talent`. Before
launch, run a profile and a case study through Google's Rich Results Test
against staging.
