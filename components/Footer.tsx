import Link from "next/link";
import { contact } from "@/content/manifest";
import ThemeSwitcher from "./ThemeSwitcher";

/* Only routes that exist today; the full Solutions / Talent / Company
   column set returns as those pages are built. */
const COLUMNS = [
  {
    label: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/concept", label: "Concept 001" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      data-signal="settle"
      className="hairline-t relative z-10 px-5 py-14 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
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
          <div className="mt-6 md:hidden">
            <ThemeSwitcher />
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
          className="max-w-sm text-xs leading-relaxed"
          style={{ color: "var(--ink-muted)" }}
        >
          <p>
            Independent homepage concept, created for evaluation. This is not
            CLICK Media Group&apos;s official website; campaign figures are as
            published on clickmedia.group.
          </p>
          <p className="font-mono-data mt-3 text-[0.62rem]">
            Concept · {new Date().getFullYear()} · No tracking on this page
          </p>
        </div>
      </div>
    </footer>
  );
}
