# click-website

Next.js 16 marketing site (App Router, React 19, Tailwind 4).

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

- `pnpm dev` – start dev server
- `pnpm build` – production build
- `pnpm start` – run production build
- `pnpm lint` – lint

## Environment

Copy `.env.example` to `.env.local` and fill in HubSpot values if you want the
contact questionnaire to submit for real (see `docs/HUBSPOT_SETUP.md`). Left
unset, the form runs in preview mode.
