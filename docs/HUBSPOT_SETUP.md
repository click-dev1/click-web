# The contact form — HubSpot embed

The "Start the Conversation" modal shows a **HubSpot form**, embedded with
HubSpot's own loader. Submissions go straight to HubSpot; the site never
handles them.

## What lives where

| Thing                                            | Where to change it                                   |
| ------------------------------------------------ | ---------------------------------------------------- |
| Fields, labels, required-ness, validation        | HubSpot → Marketing → Forms → the form's editor      |
| Title, intro copy, thank-you message, redirect   | HubSpot form editor                                  |
| Colours, fonts, button style of the form itself  | HubSpot form editor (**Style** tab)                  |
| Which form is embedded (portal id, form id)      | `components/contact/hubspot.ts`                      |
| The frame around it — panel, corner brackets, close, loading and fallback states | `components/contact/ContactModal.tsx` + the `CONTACT MODAL` block in `app/globals.css` |
| Where the CTAs are                               | `<ContactButton>` in `components/Nav.tsx`, `components/Sections.tsx` |

Everything in the first three rows publishes from HubSpot with no deploy.
The form renders in an iframe, so site CSS cannot reach into it — if a
colour or font in the form looks off, it's fixed in HubSpot's Style tab.

## How it works

`ContactModal` loads `https://js.hsforms.net/forms/embed/<portalId>.js`
once the page is interactive. When the modal is first opened it renders

```html
<div class="hs-form-frame" data-region="na1" data-form-id="…" data-portal-id="…"></div>
```

HubSpot's loader watches the DOM, turns that div into an iframe and keeps
its height in step with the form. The frame is created on the first open
and kept mounted, so closing and reopening keeps a half-filled form (and
doesn't count another form view).

Two states are the site's own:

- **Loading** — while the div is still empty, the panel shows a small
  "Loading form" label (`.hs-form-frame:empty` in CSS, no JS involved).
- **Fallback** — if the loader errors, or no iframe has appeared after
  10 s (content blockers commonly stop `js.hsforms.net`), the panel swaps
  to a short message with the contact email from `content/manifest.ts`.

## Swapping the form

Create the new form in HubSpot as an **embedded** form, open its embed
code, and copy the `data-form-id` (and `data-portal-id` / `data-region`
if the account changed) into `components/contact/hubspot.ts`.

## Notes

- HubSpot's tracking script (`js.hs-scripts.com`) — the thing that sets
  `hubspotutk` and joins a submission to the pages read beforehand — is
  loaded only after the visitor grants analytics consent; see
  `docs/CONSENT_AND_LEGAL.md`. The form embed itself is not consent-gated —
  verified in a browser: with consent refused, the only cookie it produces
  is Cloudflare's `__cf_bm` on HubSpot's own domains, which is listed as
  essential in `lib/consent.ts`.
- No environment variables are involved — portal id and form id are public
  (they're in every HubSpot embed snippet), so they're committed.
