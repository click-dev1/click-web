# Handover pack

Exhibit A §14 (Agreement §6.4): delivered in full as a condition of final
acceptance. One row per required item.

| # | §14 item | Where | Status |
| --- | --- | --- | --- |
| 1 | Complete, buildable source code, commit history intact | GitHub `click-dev1/click-web` | ✅ In CLICK's repository. Final state lands on `main` at launch |
| 2 | All design working and source files, incl. unused concepts | — | ⬜ Developer to hand over (Figma/source files) |
| 3 | Technical documentation + quick-start guide covering every §4 operation | `docs/SANITY.md`, `OPERATIONS.md`, `QUICK_START.md` | 🟨 Technical docs done. Quick-start guide to be written once the §4 SEO gaps are closed (see `docs/STATUS.md`) |
| 4 | One live CMS training session + recording retained by CLICK | — | ⬜ To schedule. §9: a CLICK person performs every §4 operation unaided |
| 5 | Deployment instructions, incl. build and release process | `OPERATIONS.md` | ✅ |
| 6 | Environment variables and their purpose (values delivered securely) | `OPERATIONS.md`, `.env.example` | ✅ List done. Values to be delivered through a secure channel, not email |
| 7 | Backup and restore procedures for code and content | `OPERATIONS.md` | ✅ Export tested 26 Sep. Restore documented; CLICK to rehearse once |
| 8 | Credentials and administrative access for every §7 account | — | ⬜ At acceptance, through a secure channel |
| 9 | Third-party account inventory confirming CLICK ownership and billing | `ACCOUNTS.md` | 🟨 Done; three owners to confirm (GA4, Mux) and two properties to verify (Search Console, Bing) |
| 10 | Bill of Materials (§5.2) | `BILL_OF_MATERIALS.md`, `bom-packages.csv` | ✅ Regenerate if dependencies change |
| 11 | Tracking technology inventory (§8.9) | `TRACKING_INVENTORY.md` | 🟨 Done; findings 1, 2 and 5 need decisions before it can be signed off |
| 12 | Vulnerability scan results (§8.8) | `SECURITY_SCAN.md` | ✅ No critical/high remaining. Re-run on staging once the header change is pushed |

Related: `docs/REDIRECTS.md` + `REDIRECTS.csv` (1:1 redirect map),
`docs/STRUCTURED_DATA.md` (schema), `docs/PERFORMANCE.md` (§6 evidence),
`docs/CONSENT_AND_LEGAL.md` (consent and legal pages).
