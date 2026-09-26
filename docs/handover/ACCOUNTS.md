# Third-party account inventory

Exhibit A §7 and §14: every account the Website depends on, confirming
CLICK owns it and controls its billing. "Confirmed" means seen during the
build; everything else is for CLICK to check and tick before acceptance.
Credentials and admin access are handed over separately, never in the
repository.

| Service | Account | Owner (per §7) | Status | To do before acceptance |
| --- | --- | --- | --- | --- |
| GitHub | Organisation `click-dev1`, repository `click-web` | CLICK | Confirmed — CLICK's organisation | Confirm CLICK admins; remove the Developer's access after the 30-day post-handover assistance window, if desired |
| Vercel | Team `click17`, project `click-web` | CLICK | Confirmed — CLICK-owned team | Confirm billing is on CLICK's card (~$20/month); decide how Chris reaches staging (team seat or Shareable Link) |
| Sanity | Organisation `obD2nbzQ8` under `click-dev1`, project `eclvbmom`, dataset `production` (private) | CLICK | Confirmed | Invite CLICK's editors (only 1 seat in use); choose Free or Growth plan |
| HubSpot | Portal 5918623 (shared with the GameSquare group) | CLICK — existing | Confirmed portal id | Add `clickmedia.group` under Tracking Code; disable HubSpot's own cookie banner and ad pixels for this domain (see `TRACKING_INVENTORY.md`) |
| Google Analytics 4 | Property `G-J6GF6EL37B` | CLICK | **To confirm** the property sits in a CLICK-owned Google account | Grant the Developer temporary access to validate conversions, then remove |
| Google Search Console | `clickmedia.group` | CLICK | **Not yet verified** | Verify the property, submit `/sitemap.xml` |
| Bing Webmaster Tools | `clickmedia.group` | CLICK | **Not yet verified** | Verify (can import from Search Console), submit the sitemap |
| Mux | Environment used by the /work reels | CLICK | **To confirm** it is a CLICK-owned account | Confirm owner; free tier |
| Domain `clickmedia.group` | Existing registrar | CLICK | Existing | DNS already points at Vercel |
| Old Vercel project `click-concept` | Developer's personal Vercel account | — | Outside CLICK's accounts | Delete, or confirm in writing it is out of scope (§6.3) |
| Microsoft Clarity, Peec, UptimeRobot | — | CLICK, if elected | Not elected | — |

Access for the Developer to remove at the end of the post-handover assistance period:
GitHub collaborator, Vercel team member, Sanity project member and any
temporary GA4/HubSpot access.
