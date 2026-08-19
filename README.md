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

`NEXT_PUBLIC_SITE_URL` sets the absolute origin used by canonical tags,
Open Graph URLs, `robots.txt`, `sitemap.xml` and the JSON-LD `@id`s. On
Vercel it falls back to the project's production domain automatically, so
it only needs setting once a custom domain is live (or on another host).
See `lib/site.ts`.

The contact form is a HubSpot embed — nothing to configure locally; see
`docs/HUBSPOT_SETUP.md` for where its fields, copy and styling live.
