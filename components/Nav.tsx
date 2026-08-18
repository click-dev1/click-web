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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8"
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
