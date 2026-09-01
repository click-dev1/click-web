"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Smooth scroll, and the scroll position on navigation.
 *
 * Lenis owns the scroll position: it keeps its own target and writes it
 * back every frame, which means a plain `window.scrollTo` is undone on
 * the next tick. Next resets the scroll to the top on navigation exactly
 * that way — so while Lenis was created inside <Fx>, which remounts per
 * route, the outgoing instance would restore the position the reader had
 * on the previous page and the new page opened part-way down. Hence one
 * Lenis for the life of the app, mounted above the router, and a reset
 * that goes *through* it.
 *
 * Reduced motion gets no Lenis at all — the browser's own scrolling is
 * already the right behaviour — so every path here falls back to the
 * native API when there is no instance.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);
  /* The first pathname this component sees is the initial page load; the
     browser has already put us where the URL asked. Only navigations
     after that are ours to reset. */
  const mounted = useRef(false);
  /* Back/forward: Next restores the previous scroll position and that is
     what the reader expects, so the next reset stands down. */
  const restoring = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const instance = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenis.current = instance;
    /* one RAF for the whole page: GSAP's ticker drives Lenis */
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      restoring.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const first = !mounted.current;
    mounted.current = true;
    if (restoring.current) {
      restoring.current = false;
      return;
    }

    const { hash } = window.location;
    /* A link like /contact#creator-network still means "the top of that
       section", not the top of the page. The fixed nav would otherwise
       sit over the heading — the same 5.5rem the :target CSS allows. */
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    const offset = -88;

    /* On the very first render the browser has already placed us: the
       anchor of a deep-linked URL, or the position it restored on a
       reload. Only the anchor needs help, because Lenis starts from
       whatever the scroll was when it was constructed and would drag the
       page back to the top; a restored position is left alone. */
    if (first && !target) return;

    if (lenis.current) {
      if (target) {
        lenis.current.scrollTo(target, { immediate: true, offset, force: true });
      } else {
        lenis.current.scrollTo(0, { immediate: true, force: true });
      }
    } else if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
    } else {
      window.scrollTo({ top: 0 });
    }

    /* The new page's triggers are measured from a scroll position that
       only just changed. */
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
