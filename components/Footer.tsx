import Link from "next/link";
import { contact } from "@/content/manifest";

/* Only routes that exist today; the full Solutions / Talent / Company
   column set returns as those pages are built. */
const COLUMNS = [
  {
    label: "Explore",
    links: [{ href: "/", label: "Home" }],
  },
];

const SOCIALS = [
  {
    href: "https://www.instagram.com/weareclicktalent",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/clickmediagroup/",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7.5 10v6.2M7.5 7.8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M11 16.2V10M11 12.6c0-1.4 1-2.6 2.4-2.6S15.8 11.2 15.8 12.6v3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@clickmgmt",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 3.5c.5 2 2 3.4 4 3.6v2.7c-1.5 0-2.9-.4-4-1.2v6.1c0 3-2.4 5.3-5.3 5.3s-5.3-2.3-5.3-5.3 2.4-5.3 5.3-5.3c.3 0 .6 0 .9.1v2.8a2.5 2.5 0 1 0 1.7 2.4V3.5H14z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      data-signal="settle"
      className="hairline-t relative z-10 px-5 py-14 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p>
            <span className="logo-mark h-11" aria-hidden="true" />
            <span className="visually-hidden">CLICK</span>
          </p>
          <p className="eyebrow mt-3">
            <span className="tick">●</span> Part of the GameSquare ecosystem
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-4 inline-block text-sm underline underline-offset-4 transition-colors hover:text-[var(--signal)]"
          >
            {contact.email}
          </a>

          <div className="mt-5 flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="transition-colors hover:text-[var(--signal)]"
                style={{ color: "var(--ink-muted)" }}
              >
                <span className="block h-5 w-5">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 sm:grid-cols-3"
        >
          {COLUMNS.map((col) => (
            <div key={col.label}>
              <p className="eyebrow mb-3">{col.label}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-[var(--signal)]"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className="max-w-sm text-xs leading-body"
          style={{ color: "var(--ink-muted)" }}
        >
          <p>
            Independent homepage design, created for evaluation. This is not
            CLICK Media Group&apos;s official website; campaign figures are as
            published on clickmedia.group.
          </p>
          <p className="font-data mt-3 text-[0.62rem]">
            Independent design · {new Date().getFullYear()} · No tracking on
            this page
          </p>
        </div>
      </div>
    </footer>
  );
}
