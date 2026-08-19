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

Nothing is required to deploy. `lib/site.ts` resolves the absolute origin
used by canonical tags, Open Graph URLs, `robots.txt`, `sitemap.xml` and
the JSON-LD `@id`s: `https://www.clickmedia.group` in production,
`http://localhost:3000` in development. Set `NEXT_PUBLIC_SITE_URL` only to
override that — a staging host, or a domain change.

The contact form is a HubSpot embed — nothing to configure locally; see
`docs/HUBSPOT_SETUP.md` for where its fields, copy and styling live.
