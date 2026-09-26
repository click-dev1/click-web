# Operating the Website

For a developer taking the site over (Agreement §6.4, Exhibit A §14):
how it is built and released, every environment variable, and how code
and content are backed up and restored. How the CMS works is in
`docs/SANITY.md`; editors' instructions are in the quick-start guide.

## What it is

- **Next.js 16** (App Router, React 19, Tailwind 4), TypeScript. Every
  page is prerendered as static HTML; CMS edits reach it through a
  webhook (below).
- **Sanity** for content, with the Studio embedded at `/studio` — same
  deployment, same domain.
- **Vercel** hosting. **pnpm 11** (pinned in `package.json`).
- Repository: GitHub `click-dev1/click-web`.

## Running it locally

```
pnpm install
cp .env.example .env.local     # then fill in the values
pnpm dev                       # http://localhost:3000
```

`SANITY_PREVIEW_DRAFTS=true` in `.env.local` shows drafts locally. To see
the site exactly as staging and production do, build and start with it
off: `SANITY_PREVIEW_DRAFTS=false pnpm build && SANITY_PREVIEW_DRAFTS=false pnpm start`.

Checks before any release: `pnpm lint`, `pnpm exec tsc --noEmit`,
`pnpm build`.

## Release process

| Branch | Deploys to | Notes |
| --- | --- | --- |
| `dev` | Staging — `click-web-git-dev-click17.vercel.app` | Every push. Behind Vercel Authentication |
| `main` | Production — `www.clickmedia.group` | Every push. **Launch = merging `dev` into `main`** |

Vercel builds each push automatically (project `click-web`, team
`click17`); a failed build never replaces the live deployment. To roll
back, promote the previous deployment in Vercel (Deployments → ⋯ →
Promote to Production) or revert the commit.

Before the launch merge, work through **Before merging `dev` to `main`**
in `docs/STATUS.md` (staging CORS origin, Production variables, editor
seats).

### Publishing content

Content does not need a deployment. Publishing in the Studio fires the
Sanity webhook to `/api/revalidate`, which refreshes the pages that read
that document type within seconds. Webhook setup: `docs/SANITY.md` →
"Publishing reaches the site through a webhook". The one-hour cache is a
safety net if a webhook is missed.

## Environment variables

Values are delivered separately and securely, never in the repository.

| Variable | Where | Purpose |
| --- | --- | --- |
| `SANITY_API_READ_TOKEN` | Vercel: Production **and** Preview; local | Viewer token. The dataset is private, so the build fails without it. Also verifies Studio preview secrets |
| `SANITY_REVALIDATE_SECRET` | Vercel: Production and Preview; Sanity webhook | Signs the publish webhook. Also unlocks `GET /api/revalidate` (readiness check): `curl -H "Authorization: Bearer <secret>" <origin>/api/revalidate` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Vercel: **Production only** | GA4 id (`G-J6GF6EL37B`). Unset = no GA4 and no HubSpot tracking code, which keeps staging out of the analytics |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | optional | Defaults to `eclvbmom` |
| `NEXT_PUBLIC_SANITY_DATASET` | optional | Defaults to `production` |
| `NEXT_PUBLIC_SITE_URL` | optional | Overrides the canonical origin (defaults to `https://www.clickmedia.group`) |
| `SANITY_API_WRITE_TOKEN` | **local only** | Editor token for the scripts in `scripts/`. Never in Vercel |
| `SANITY_PREVIEW_DRAFTS` | **local only** | `true` renders drafts for the whole local build. Never on a deployment — it disables publish revalidation |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | local only | Lets scripts reach staging behind Vercel Authentication |
| `DECK_ASSETS_DIR` | local only | Image folder for `scripts/seed-deck.ts` |

`.env.example` carries the same list with longer notes.

Not environment variables: the Mux API key is entered once in the Studio
and stored in the dataset (`secrets.mux`); the HubSpot portal and form
ids are in `components/contact/hubspot.ts`.

## Backup and restore

### Code

GitHub holds the full history. A backup is a clone:
`git clone --mirror https://github.com/click-dev1/click-web.git`. Restore by
pushing the mirror to a new repository and connecting it to Vercel.

### Content (Sanity)

Sanity keeps document history (3 days on the Free plan). For a full
backup, export the dataset — every document and every image:

```
SANITY_AUTH_TOKEN=<read token> pnpm exec sanity dataset export production backup-YYYY-MM-DD.tar.gz
```

Tested 26 September 2026: 78 MB, all documents and 98 images, in 17
seconds.

> **Treat the export as confidential.** It contains everything in the
> private dataset — including the Mux API key stored by the video plugin
> and the internal notes on talent profiles. Store it where only CLICK's
> administrators can read it.

Suggested cadence: monthly, and before any large content change or
schema migration. Videos are not in the export; they live in Mux.

**Restore** (needs an Editor/Administrator token):

1. Import into a *new* dataset first, and check it:
   `pnpm exec sanity dataset create restore-check` then
   `pnpm exec sanity dataset import backup.tar.gz restore-check`.
2. Point a local build at it (`NEXT_PUBLIC_SANITY_DATASET=restore-check`)
   and look over the site.
3. Then either import into `production` with `--replace` (overwrites
   documents with the same ids) or switch the site's dataset variable to
   the restored one and redeploy.

The restore path has not been run against this project — creating a
second dataset is a change to CLICK's Sanity project, so it is left for
CLICK to rehearse once, with a developer, before relying on it.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm redirects:build [--apply]` | Rebuilds the legacy redirect map (`docs/REDIRECTS.md`) |
| `pnpm redirects:verify [url]` | Checks every legacy URL resolves |
| `pnpm seed:*` | One-time content migrations, kept for the record. **Several overwrite live documents** — read each script's header before running anything |
