"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactButton from "./contact/ContactButton";

/* Deliberately sparse for now: only Home exists. The full link set
   (Influencer Marketing / Talent / Work / About / Contact) returns as
   those pages are built. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* Gutter on the header, container inside it — the same order every
       section uses (px-5 md:px-8 on the section, max-w-7xl within), so the
       logo and CTA share the content's edge at every width. With the
       gutter inside the container the nav sat 2rem further in than the
       page on displays wider than 1344px. */
    <header
      className={`fixed top-0 inset-x-0 z-50 px-5 transition-colors duration-300 md:px-8 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-4"
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="logo-mark h-6 md:h-8" aria-hidden="true" />
          <span className="visually-hidden">CLICK — home</span>
        </Link>

        <ContactButton className="btn-primary shrink-0 px-4 py-2.5 text-xs md:px-6 md:py-3 md:text-sm">
          <span className="hidden sm:inline">Start the Conversation</span>
          <span className="sm:hidden">Start</span>{" "}
          <span className="btn-arrow">→</span>
        </ContactButton>
      </nav>
    </header>
  );
}
