"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import { setSignalMode, type SignalMode } from "@/lib/signal";

/**
 * Progressive-enhancement layer. The page is fully readable without this
 * component: reveals only hide content after JS confirms motion is allowed,
 * SplitText waits for fonts, reduced-motion gets none of it.
 */
export default function Fx() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
      { threshold: [0.25, 0.5] },
    );
    signalSections.forEach((s) => io.observe(s));

    if (reduced) {
      return () => io.disconnect();
    }

    /* ---- smooth scroll: single RAF via GSAP ticker ---- */
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
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
          },
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
            i + 0.15,
          );
        });

        /* The loop diagram draws itself on the same timeline, so one
           scrub drives text and drawing together. Beat i owns the window
           [i + 0.15, i + 0.85]; the markup is the finished state, so every
           piece is hidden here first and drawn back in. */
        const diagram = document.querySelector<HTMLElement>("[data-diagram]");
        if (!diagram) return;
        const q = gsap.utils.selector(diagram);
        const one = (sel: string) => q(sel)[0] as Element | undefined;
        const arcs = (...n: number[]) =>
          n.map((i) => one(`[data-diag-arc="${i}"]`)).filter(Boolean);
        const nodes = (...n: number[]) =>
          n.map((i) => one(`[data-diag-node="${i}"]`)).filter(Boolean);
        const labels = (...n: number[]) =>
          n.map((i) => one(`[data-diag-label="${i}"]`)).filter(Boolean);

        const strokes = q(
          '[data-diag="src"] path, [data-diag="trunk"], [data-diag="trunk2"], [data-diag-arc], [data-diag="return-mask"]',
        );
        gsap.set(strokes, { drawSVG: "0%" });
        gsap.set(
          q(
            "[data-diag-src-label], [data-diag-node], [data-diag-label], " +
              '[data-diag="converge"], [data-diag="pill"], [data-diag="hub"], ' +
              '[data-diag="hub-label"], [data-diag="track"], [data-diag="return-label"]',
          ),
          { autoAlpha: 0 },
        );
        gsap.set(one('[data-diag="hub"]') ?? [], {
          scale: 0.6,
          transformOrigin: "50% 50%",
        });

        const draw = { drawSVG: "0% 100%", ease: "none" as const };
        const show = { autoAlpha: 1, ease: "power2.out" as const };

        /* beat 1 — sources converge, capability, hub, step 01 */
        tl.to(
          q("[data-diag-src-label]"),
          { ...show, duration: 0.15, stagger: 0.05 },
          0.02,
        );
        tl.to(
          one('[data-diag="converge"]') ?? [],
          { ...show, duration: 0.15 },
          0.15,
        );
        tl.to(q('[data-diag="src"] path'), { ...draw, duration: 0.3 }, 0.12);
        tl.to(
          one('[data-diag="trunk"]') ?? [],
          { ...draw, duration: 0.08 },
          0.42,
        );
        tl.to(
          one('[data-diag="pill"]') ?? [],
          { ...show, duration: 0.12 },
          0.48,
        );
        tl.to(
          one('[data-diag="trunk2"]') ?? [],
          { ...draw, duration: 0.08 },
          0.56,
        );
        tl.to(
          one('[data-diag="hub"]') ?? [],
          { ...show, scale: 1, duration: 0.2 },
          0.6,
        );
        tl.to(
          one('[data-diag="track"]') ?? [],
          { ...show, duration: 0.2 },
          0.62,
        );
        tl.to(
          one('[data-diag="hub-label"]') ?? [],
          { ...show, duration: 0.15 },
          0.68,
        );
        tl.to([...nodes(1), ...labels(1)], { ...show, duration: 0.15 }, 0.66);

        /* beat 2 — 02 Discover */
        tl.to(arcs(1), { ...draw, duration: 0.3 }, 1.15);
        tl.to([...nodes(2), ...labels(2)], { ...show, duration: 0.15 }, 1.4);

        /* beat 3 — 03 Create */
        tl.to(arcs(2), { ...draw, duration: 0.3 }, 2.15);
        tl.to([...nodes(3), ...labels(3)], { ...show, duration: 0.15 }, 2.4);

        /* beat 4 — 04 → 06, the ring closes, performance returns */
        tl.to(
          arcs(3, 4, 5, 6),
          { ...draw, duration: 0.14, stagger: 0.14 },
          3.15,
        );
        tl.to([...nodes(4), ...labels(4)], { ...show, duration: 0.12 }, 3.27);
        tl.to([...nodes(5), ...labels(5)], { ...show, duration: 0.12 }, 3.41);
        tl.to([...nodes(6), ...labels(6)], { ...show, duration: 0.12 }, 3.55);
        tl.to(
          one('[data-diag="return-mask"]') ?? [],
          { ...draw, duration: 0.2 },
          3.62,
        );
        tl.to(
          one('[data-diag="return-label"]') ?? [],
          { ...show, duration: 0.15 },
          3.72,
        );
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
