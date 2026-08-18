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

Copy `.env.example` to `.env.local` for the preview-deployment Basic Auth
credentials (see `proxy.ts`).

The contact form is a HubSpot embed — nothing to configure locally; see
`docs/HUBSPOT_SETUP.md` for where its fields, copy and styling live.
