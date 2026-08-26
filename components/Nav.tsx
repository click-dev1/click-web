"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ContactButton from "./contact/ContactButton";
import { useContactModal } from "./contact/ContactModalProvider";
import { contact } from "@/content/manifest";

type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

/* The flat link set from the blueprint: Influencer Marketing / Talent ▾
   (Talent Management, Talent Directory) / Work / About / Contact. */
const LINKS: NavItem[] = [
  { href: "/influencer-marketing", label: "Influencer Marketing" },
  {
    label: "Talent",
    children: [
      { href: "/talent-management", label: "Talent Management" },
      { href: "/talent", label: "Talent Directory" },
    ],
  },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  /* The overlay remembers which route it was opened on, so navigating
     closes it by construction — no effect, no extra render. */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { open: openContact } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Overlay: lock the page behind it, trap focus inside it, close on
     Escape, hand focus back to the button that opened it. */
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const burger = burgerRef.current;
    if (!overlay) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = overlay.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenOn(null);
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    /* the overlay only exists below lg — if the viewport grows past it
       while open, drop the lock rather than leave the page frozen */
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpenOn(null);
    mq.addEventListener("change", onChange);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = prevOverflow;
      burger?.focus();
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );
  const linkStyle = (href: string) => ({
    color: isActive(href) ? "var(--ink)" : "var(--ink-muted)",
    opacity: isActive(href) ? 1 : 0.8,
  });

  return (
    /* Gutter on the header, container inside it — the same order every
       section uses (px-5 md:px-8 on the section, max-w-7xl within), so the
       logo and CTA share the content's edge at every width. */
    <header
      className={`fixed top-0 inset-x-0 z-50 px-5 transition-colors duration-300 md:px-8 ${
        scrolled || open ? "nav-scrolled" : ""
      }`}
    >
      <nav
        aria-label="Main"
        className="relative z-50 mx-auto flex max-w-7xl items-center justify-between gap-4 py-4"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="logo-mark h-6 md:h-8" aria-hidden="true" />
          <span className="visually-hidden">CLICK — home</span>
        </Link>

        <div className="flex items-center gap-3 lg:gap-7">
          {/* desktop links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) =>
              "children" in l ? (
                <li key={l.label} className="nav-drop relative">
                  <button
                    type="button"
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{
                      color: "var(--ink)",
                      opacity: l.children.some((c) => isActive(c.href)) ? 1 : 0.8,
                    }}
                    aria-haspopup="true"
                  >
                    {l.label} <span aria-hidden="true">▾</span>
                  </button>
                  <div className="nav-drop-panel">
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-4 py-2.5 text-sm transition-opacity hover:opacity-100"
                        style={linkStyle(c.href)}
                        aria-current={isActive(c.href) ? "page" : undefined}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={linkStyle(l.href)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <ContactButton className="btn-primary shrink-0 px-4 py-2.5 text-xs md:px-6 md:py-3 md:text-sm">
            <span className="hidden sm:inline">Start the Conversation</span>
            <span className="sm:hidden">Start</span>{" "}
            <span className="btn-arrow">→</span>
          </ContactButton>

          <button
            ref={burgerRef}
            type="button"
            className="nav-burger lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* mobile: full-screen overlay, focus-trapped, below lg only */}
      {open && (
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="nav-overlay lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto w-full max-w-7xl">
            <ul className="flex flex-col">
              {LINKS.map((l) =>
                "children" in l ? (
                  <li key={l.label} className="py-1">
                    <p className="eyebrow pill mb-2">
                      <span className="tick">●</span> {l.label}
                    </p>
                    <ul className="nav-overlay-sub flex flex-col">
                      {l.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="nav-overlay-link"
                            aria-current={isActive(c.href) ? "page" : undefined}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="nav-overlay-link"
                      aria-current={isActive(l.href) ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hairline-t mx-auto mt-auto w-full max-w-7xl pt-6">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setOpen(false);
                openContact();
              }}
            >
              Start the Conversation <span className="btn-arrow">→</span>
            </button>
            <a
              href={`mailto:${contact.email}`}
              className="mt-5 block text-sm underline underline-offset-4"
            >
              {contact.email}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
