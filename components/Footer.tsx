import Link from "next/link";
import ContactButton from "@/components/contact/ContactButton";
import { contact, recognition } from "@/content/manifest";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: { label: string; links: FooterLink[] }[] = [
  {
    label: "Solutions",
    links: [
      { href: "/influencer-marketing", label: "Influencer Marketing" },
      { href: "/influencer-marketing#experiential", label: "Experiential" },
    ],
  },
  {
    label: "Talent",
    links: [
      { href: "/talent-management", label: "Talent Management" },
      { href: "/talent", label: "Talent Directory" },
      { href: "/contact#creator-network", label: "Creator Network" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/work", label: "Work" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: `mailto:${contact.email}`, label: "General enquiries" },
      {
        href: "https://www.linkedin.com/company/clickmediagroup/",
        label: "LinkedIn",
        external: true,
      },
      {
        href: "https://www.instagram.com/weareclicktalent",
        label: "Instagram",
        external: true,
      },
      {
        href: "https://www.tiktok.com/@clickmgmt",
        label: "TikTok",
        external: true,
      },
    ],
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
  const year = new Date().getFullYear();

  return (
    <footer
      data-signal="settle"
      className="hairline-t relative z-10 px-5 py-14 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p>
              <span className="logo-mark h-11" aria-hidden="true" />
              <span className="visually-hidden">CLICK</span>
            </p>
            <p className="eyebrow mt-3">
              <span className="tick">●</span> Part of the GameSquare ecosystem
            </p>
            <p
              className="mt-4 text-sm leading-body"
              style={{ color: "var(--ink-muted)" }}
            >
              Influencer marketing, experiential and talent management —
              mapping where brand audiences and creator communities overlap,
              then building the partnerships that move culture.
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
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10"
          >
            {COLUMNS.map((col) => (
              <div key={col.label}>
                <p className="eyebrow mb-3">{col.label}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => {
                    const linkClass =
                      "text-sm transition-colors hover:text-[var(--signal)]";
                    const linkStyle = { color: "var(--ink-muted)" };
                    /* mailto and off-site links are plain anchors — only
                       the in-app routes go through <Link>. */
                    const isAnchor =
                      l.external || l.href.startsWith("mailto:");
                    return (
                      <li key={l.href}>
                        {isAnchor ? (
                          <a
                            href={l.href}
                            className={linkClass}
                            style={linkStyle}
                            {...(l.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className={linkClass}
                            style={linkStyle}
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* The footer keeps its own call to action: by the time a visitor
              is this far down the page the CTA section has scrolled past. */}
          <div className="lg:text-right">
            <p className="eyebrow mb-3">Work with us</p>
            <ContactButton className="btn-primary px-5 py-3 text-sm">
              Start the Conversation <span className="btn-arrow">→</span>
            </ContactButton>
            <p className="eyebrow mt-5">
              <span className="tick">◆</span> {recognition.line}
            </p>
          </div>
        </div>

        <div
          className="hairline-t mt-12 flex flex-col gap-2 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ color: "var(--ink-muted)" }}
        >
          <p>
            © {year} CLICK Media Group. All rights reserved.
          </p>
          <p className="font-data text-[0.62rem]">
            Influencer Marketing · Talent · Experiential
          </p>
        </div>
      </div>
    </footer>
  );
}
