"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { setSignalMode, type SignalMode } from "@/lib/signal";

/**
 * Progressive-enhancement layer. The page is fully readable without this
 * component: reveals only hide content after JS confirms motion is allowed,
 * SplitText waits for fonts, reduced-motion gets none of it.
 */
export default function Fx() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* ---- signal mode: sections drive the canvas ---- */
    const signalSections =
      document.querySelectorAll<HTMLElement>("[data-signal]");
    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible signal section
        let best: { ratio: number; mode: SignalMode } | null = null;
        for (const e of entries) {
          if (e.isIntersecting) {
            const mode = e.target.getAttribute("data-signal") as SignalMode;
            if (!best || e.intersectionRatio > best.ratio) {
              best = { ratio: e.intersectionRatio, mode };
            }
          }
        }
        if (best) {
          setSignalMode(best.mode);
          window.dispatchEvent(new CustomEvent("click-signal-change"));
        }
      },
      { threshold: [0.25, 0.5] }
    );
    signalSections.forEach((s) => io.observe(s));

    if (reduced) {
      return () => io.disconnect();
    }

    /* ---- smooth scroll: single RAF via GSAP ticker ---- */
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---- reveals ---- */
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });

      /* headline line-splits after fonts are ready */
      document.fonts.ready.then(() => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "split-line",
            autoSplit: true,
            mask: "lines",
          });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.05,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        ScrollTrigger.refresh();
      });

      /* intelligence beats: pinned scrub on desktop only */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const beats = gsap.utils.toArray<HTMLElement>("[data-beat]");
        if (beats.length < 2) return;
        const stage = document.querySelector<HTMLElement>("#intel-stage");
        if (!stage) return;
        gsap.set(beats, { position: "absolute", inset: 0, autoAlpha: 0 });
        gsap.set(beats[0], { autoAlpha: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${beats.length * 90}%`,
            pin: true,
            scrub: 0.6,
          },
        });
        beats.forEach((b, i) => {
          if (i === 0) return;
          tl.to(beats[i - 1], { autoAlpha: 0, y: -30, duration: 0.4 }, i);
          tl.fromTo(
            b,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            i + 0.15
          );
        });
      });
    });

    return () => {
      io.disconnect();
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
