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
        /* scrub: 1 — the diagram strokes and labels are tied to this, and
           a full second of catch-up lets them glide after the wheel stops
           instead of stopping dead with it. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${beats.length * 90}%`,
            pin: true,
            scrub: 1,
          },
        });
        beats.forEach((b, i) => {
          if (i === 0) return;
          /* a short hand-off: the old headline is almost gone before the
             new one starts to rise, so the two never read on top of each
             other, but the left column is never empty for long */
          tl.to(
            beats[i - 1],
            { autoAlpha: 0, y: -24, duration: 0.3, ease: "power1.in" },
            i,
          );
          tl.fromTo(
            b,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
            i + 0.24,
          );
        });

        /* The loop diagram draws itself on the same timeline, so one scrub
           drives text and drawing together. Beat i owns the window
           [i + 0.1, i + 0.9]; each beat's drawing is spread across the
           whole of it so something is always in motion while the reader
           scrolls. The markup is the finished state, so every piece is
           hidden here first and drawn back in. */
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
        /* Words rise a little as they fade in. The labels are anchored to
           their dots with CSS percentage transforms (translate(-50%, -100%)
           and friends), and GSAP's x/y/scale rewrite the whole transform —
           baking those percentages into stale pixels and then replacing
           them. So the rise is done with the independent CSS `translate`
           property, which GSAP passes through as a plain style and which
           composes with `transform` without touching it. Only the dots and
           the hub — SVG groups with no CSS transform of their own — take a
           GSAP scale. */
        const words = q(
          "[data-diag-src-label], [data-diag-label], " +
            '[data-diag="billions"], [data-diag="pill"], ' +
            '[data-diag="hub-label"], [data-diag="return-label"]',
        );
        gsap.set(words, { autoAlpha: 0, translate: "0px 10px" });
        gsap.set(q("[data-diag-node]"), {
          autoAlpha: 0,
          scale: 0.4,
          transformOrigin: "50% 50%",
        });
        gsap.set(one('[data-diag="track"]') ?? [], { autoAlpha: 0 });
        gsap.set(one('[data-diag="hub"]') ?? [], {
          autoAlpha: 0,
          scale: 0.6,
          transformOrigin: "50% 50%",
        });

        const draw = { drawSVG: "0% 100%", ease: "none" as const };
        const rise = {
          autoAlpha: 1,
          translate: "0px 0px",
          ease: "power2.out" as const,
        };
        const pop = {
          autoAlpha: 1,
          scale: 1,
          ease: "back.out(1.6)" as const,
        };

        /* ---- arrival: the sources gather while the stage scrolls into
           place, so the drawing is already alive when the pin engages
           rather than blank beside the first headline. Its own scrub,
           mapped to the stage's top travelling from 70% of the viewport
           up to the top edge — where the pinned timeline takes over. ---- */
        const arrive = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 70%",
            end: "top top",
            scrub: 1,
          },
        });
        arrive.to(
          q("[data-diag-src-label]"),
          { ...rise, duration: 0.35, stagger: 0.12 },
          0,
        );
        arrive.to(q('[data-diag="src"] path'), { ...draw, duration: 0.5 }, 0.2);
        arrive.to(
          one('[data-diag="trunk"]') ?? [],
          { ...draw, duration: 0.1 },
          0.7,
        );
        arrive.to(
          one('[data-diag="billions"]') ?? [],
          { ...rise, duration: 0.25 },
          0.78,
        );
        arrive.to(
          one('[data-diag="pill"]') ?? [],
          { ...rise, duration: 0.3 },
          0.9,
        );

        /* beat 1 — the capability feeds the hub; the ring appears; step 01 */
        tl.to(
          one('[data-diag="trunk2"]') ?? [],
          { ...draw, duration: 0.08 },
          0.02,
        );
        tl.to(
          one('[data-diag="hub"]') ?? [],
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" },
          0.08,
        );
        tl.to(
          one('[data-diag="track"]') ?? [],
          { autoAlpha: 1, duration: 0.4, ease: "power1.inOut" },
          0.15,
        );
        tl.to(
          one('[data-diag="hub-label"]') ?? [],
          { ...rise, duration: 0.3 },
          0.3,
        );
        tl.to(nodes(1), { ...pop, duration: 0.25 }, 0.5);
        tl.to(labels(1), { ...rise, duration: 0.3 }, 0.55);

        /* beats 2 & 3 — one arc each, drawn across the whole beat, its
           step landing as the arc reaches the dot */
        [1, 2].forEach((i) => {
          const at = i + 0.15;
          tl.to(arcs(i), { ...draw, duration: 0.45 }, at);
          tl.to(nodes(i + 1), { ...pop, duration: 0.25 }, at + 0.35);
          tl.to(labels(i + 1), { ...rise, duration: 0.3 }, at + 0.42);
        });

        /* beat 4 — 04 → 06, the ring closes, performance returns */
        tl.to(
          arcs(3, 4, 5, 6),
          { ...draw, duration: 0.18, stagger: 0.16 },
          3.12,
        );
        [4, 5, 6].forEach((n, k) => {
          const at = 3.12 + 0.16 * k + 0.14;
          tl.to(nodes(n), { ...pop, duration: 0.22 }, at);
          tl.to(labels(n), { ...rise, duration: 0.28 }, at + 0.06);
        });
        tl.to(
          one('[data-diag="return-mask"]') ?? [],
          { ...draw, duration: 0.25 },
          3.62,
        );
        tl.to(
          one('[data-diag="return-label"]') ?? [],
          { ...rise, duration: 0.28 },
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
