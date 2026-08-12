"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * The /concept microsite: one self-contained scroll story.
 * Five acts — wordmark slam, manifesto read, method strip, proof
 * counters, finale. Reduced motion / no-JS gets the complete page
 * statically; every effect below only enhances.
 *
 * Choreography rules learned the hard way:
 * - every ScrollTrigger is created up-front in document order (a pin
 *   created late shifts every trigger below it);
 * - every act paints an opaque background (.c-act) so the incoming
 *   section covers the still-pinned one;
 * - pinned acts fade their content out at the end of the scrub so the
 *   handoff never shows two acts of text at once.
 */

const LETTERS = ["C", "L", "I", "C", "K"];

const PANELS = [
  {
    num: "01",
    title: "Found",
    copy: "Audience intelligence reads where culture is already moving. The insight comes before the idea — always.",
  },
  {
    num: "02",
    title: "Built",
    copy: "Creators and brands build inside that moment. Work made for the platform it lives on, never adapted to it.",
  },
  {
    num: "03",
    title: "Delivered",
    copy: "Campaigns the culture chooses to watch, share and keep — measured, reported, proven.",
  },
] as const;

interface Stat {
  value: number;
  decimals: number;
  suffix: string;
  locale?: boolean;
  label: string;
  source: string;
}

/* Verified figures only — as published on clickmedia.group. */
const STATS: Stat[] = [
  {
    value: 750,
    decimals: 0,
    suffix: "M",
    label: "content impressions",
    source: "Optus — Gaming on the Go",
  },
  {
    value: 51.93,
    decimals: 2,
    suffix: "%",
    label: "market share increase",
    source: "Optus — Gaming on the Go",
  },
  {
    value: 2.26,
    decimals: 2,
    suffix: "M",
    label: "total video views",
    source: "McDonald's — Summer '24",
  },
  {
    value: 16373,
    decimals: 0,
    suffix: "",
    locale: true,
    label: "stream hours watched",
    source: "McDonald's — Summer '24",
  },
];

const fmt = (s: Stat, v: number) =>
  (s.locale ? Math.round(v).toLocaleString("en-US") : v.toFixed(s.decimals)) +
  s.suffix;

const MARQUEE_WORDS = ["Science", "Culture", "Attention", "Signal"];

/* The scroll journey walks through all four Signal design directions —
   the page itself is the theme demo. Restored to the visitor's stored
   choice on exit. */
const THEMES = ["signal", "noir", "blue", "paper"] as const;
type ThemeName = (typeof THEMES)[number];

function storedTheme(): ThemeName {
  try {
    const t = localStorage.getItem("click-theme");
    if ((THEMES as readonly string[]).includes(t ?? "")) return t as ThemeName;
  } catch {
    /* private mode */
  }
  return "signal";
}

export default function ConceptExperience() {
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const manifestoInnerRef = useRef<HTMLDivElement>(null);
  const manifestoTextRef = useRef<HTMLParagraphElement>(null);
  const methodRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { motion, desktop, fine } = context.conditions as {
            motion: boolean;
            desktop: boolean;
            fine: boolean;
          };
          if (!motion) return;

          /* ---- smooth scroll: single RAF via GSAP ticker ---- */
          const lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
          lenis.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);

          /* ---- progress hairline ---- */
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          });

          /* =====================================================
             Scroll triggers, strictly in document order.
             ===================================================== */

          /* ---- act 1: wordmark slam, then blown apart on scroll ---- */
          gsap.set(".c-letter", { yPercent: 110 });
          gsap.set([".c-hero-eyebrow", ".c-hero-tag", ".c-hero-hint"], {
            autoAlpha: 0,
            y: 16,
          });
          gsap
            .timeline({ delay: 0.15 })
            .to(".c-letter", {
              yPercent: 0,
              duration: 1.15,
              stagger: 0.07,
              ease: "power4.out",
            })
            .to(
              [".c-hero-eyebrow", ".c-hero-tag", ".c-hero-hint"],
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
              },
              "-=0.55"
            );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "+=120%",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            })
            .to(".c-letter", {
              xPercent: (i: number) => (i - 2) * 130,
              autoAlpha: 0,
              ease: "power1.in",
            })
            .to(
              [".c-hero-eyebrow", ".c-hero-tag", ".c-hero-hint"],
              { autoAlpha: 0, y: -40, ease: "power1.in" },
              "<"
            );

          /* ---- act 2: manifesto — words read in, then hand off ----
             Word-level splits don't depend on font metrics, so this is
             safe to build immediately (no fonts.ready dance). */
          let manifestoSplit: SplitText | null = null;
          if (manifestoTextRef.current && manifestoRef.current) {
            manifestoSplit = SplitText.create(manifestoTextRef.current, {
              type: "words",
            });
            gsap.set(manifestoSplit.words, { opacity: 0.12 });
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: manifestoRef.current,
                  start: "top top",
                  end: "+=130%",
                  pin: true,
                  scrub: 0.4,
                  anticipatePin: 1,
                },
              })
              /* read: bulk of the scrub */
              .to(manifestoSplit.words, {
                opacity: 1,
                stagger: 0.15,
                duration: 0.3,
                ease: "none",
              })
              /* hold, so the full statement sits for a beat */
              .to({}, { duration: 1.6 })
              /* hand off: leave the act empty before the next arrives */
              .to(manifestoInnerRef.current, {
                autoAlpha: 0,
                y: -40,
                duration: 1.4,
                ease: "power1.in",
              });
          }

          /* ---- act 3: method strip — pinned horizontal on desktop ----
             Track is 300vw; -66.667% of its own width shows panel 3.
             Viewport-relative end keeps the math immune to layout. */
          if (desktop && trackRef.current && methodRef.current) {
            gsap.to(trackRef.current, {
              xPercent: -66.667,
              ease: "none",
              scrollTrigger: {
                trigger: methodRef.current,
                start: "top top",
                end: "+=250%",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
              },
            });
          }

          /* ---- generic reveals ---- */
          gsap.utils.toArray<HTMLElement>("[data-creveal]").forEach((el) => {
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

          /* ---- act 4: counters tick up from zero ---- */
          gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((el) => {
            const s = STATS[Number(el.dataset.stat)];
            if (!s) return;
            const proxy = { v: 0 };
            el.textContent = fmt(s, 0);
            gsap.to(proxy, {
              v: s.value,
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
              onUpdate: () => {
                el.textContent = fmt(s, proxy.v);
              },
            });
          });

          /* ---- act 5: finale headline — line split re-splits itself
             when fonts land (autoSplit), animation rebuilt via onSplit */
          const finaleSplit = SplitText.create(".c-finale-title", {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.05,
                stagger: 0.09,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: ".c-finale-title",
                  start: "top 82%",
                  once: true,
                },
              }),
          });

          /* ---- chapter journey: wayfinding readout + theme per act ----
             Created after all pins so initial sort sees final layout;
             ranges are pin-aware on refresh. */
          gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 50%",
              end: "bottom 50%",
              onToggle: (self) => {
                if (!self.isActive) return;
                const theme = el.dataset.chapterTheme;
                if (theme) document.documentElement.dataset.theme = theme;
                if (chapterRef.current && el.dataset.chapterLabel) {
                  chapterRef.current.textContent = el.dataset.chapterLabel;
                  gsap.fromTo(
                    chapterRef.current,
                    { autoAlpha: 0.3 },
                    { autoAlpha: 1, duration: 0.5, ease: "power2.out" }
                  );
                }
              },
            });
          });

          /* ---- re-measure once everything has settled ---- */
          const refresh = () => ScrollTrigger.refresh();
          document.fonts.ready.then(refresh);
          window.addEventListener("load", refresh);

          /* ---- fine pointers: blend cursor + magnetic CTAs ---- */
          const cleanups: (() => void)[] = [
            () => window.removeEventListener("load", refresh),
          ];
          if (fine && dotRef.current && ringRef.current) {
            const dotX = gsap.quickTo(dotRef.current, "x", {
              duration: 0.12,
              ease: "power3",
            });
            const dotY = gsap.quickTo(dotRef.current, "y", {
              duration: 0.12,
              ease: "power3",
            });
            const ringX = gsap.quickTo(ringRef.current, "x", {
              duration: 0.45,
              ease: "power3",
            });
            const ringY = gsap.quickTo(ringRef.current, "y", {
              duration: 0.45,
              ease: "power3",
            });
            const onMove = (e: PointerEvent) => {
              dotX(e.clientX);
              dotY(e.clientY);
              ringX(e.clientX);
              ringY(e.clientY);
            };
            const onOver = (e: PointerEvent) => {
              const hot = (e.target as Element | null)?.closest?.(
                "a, button"
              );
              ringRef.current?.setAttribute(
                "data-hover",
                hot ? "true" : "false"
              );
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            window.addEventListener("pointerover", onOver, { passive: true });
            cleanups.push(() => {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerover", onOver);
            });

            gsap.utils.toArray<HTMLElement>(".c-magnetic").forEach((btn) => {
              const xTo = gsap.quickTo(btn, "x", {
                duration: 0.4,
                ease: "power3",
              });
              const yTo = gsap.quickTo(btn, "y", {
                duration: 0.4,
                ease: "power3",
              });
              const move = (e: PointerEvent) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
              };
              const leave = () => {
                xTo(0);
                yTo(0);
              };
              btn.addEventListener("pointermove", move);
              btn.addEventListener("pointerleave", leave);
              cleanups.push(() => {
                btn.removeEventListener("pointermove", move);
                btn.removeEventListener("pointerleave", leave);
              });
            });
          }

          return () => {
            cleanups.forEach((fn) => fn());
            manifestoSplit?.revert();
            finaleSplit.revert();
            gsap.ticker.remove(tick);
            lenis.destroy();
            document.documentElement.dataset.theme = storedTheme();
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative overflow-x-clip">
      <span ref={progressRef} className="c-progress" aria-hidden="true" />
      <span ref={dotRef} className="c-cursor-dot" aria-hidden="true" />
      <span ref={ringRef} className="c-cursor-ring" aria-hidden="true" />
      <span ref={chapterRef} className="c-chapter" aria-hidden="true">
        01 / 05 — Welcome
      </span>

      {/* ---- act 1: the wordmark ---- */}
      <section
        ref={heroRef}
        data-chapter
        data-chapter-theme="signal"
        data-chapter-label="01 / 05 — Welcome"
        className="c-act relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center md:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 55%, var(--glow), transparent 70%)",
            opacity: 0.5,
          }}
        />
        <p className="c-hero-eyebrow eyebrow relative mb-8">
          <span className="tick">◉</span> Concept 001 — Welcome
        </p>
        <h1
          aria-label="CLICK"
          className="c-hero-title font-display relative w-full"
        >
          {LETTERS.map((l, i) => (
            <span key={i} className="c-letter-mask" aria-hidden="true">
              <span className="c-letter">{l}</span>
            </span>
          ))}
        </h1>
        <p
          className="c-hero-tag relative mt-8 text-lg md:text-xl"
          style={{ color: "var(--ink-muted)" }}
        >
          Where science meets culture.
        </p>
        <p className="c-hero-hint eyebrow absolute bottom-8">
          <span className="tick">▾</span> Scroll
        </p>
      </section>

      {/* ---- act 2: manifesto ---- */}
      <section
        ref={manifestoRef}
        data-chapter
        data-chapter-theme="noir"
        data-chapter-label="02 / 05 — The Idea"
        className="c-act relative flex min-h-[100svh] items-center px-5 md:px-8"
      >
        <div ref={manifestoInnerRef} className="mx-auto w-full max-w-5xl">
          <p className="eyebrow mb-8">
            <span className="tick">01</span> The idea
          </p>
          <p ref={manifestoTextRef} className="c-manifesto-text">
            Attention can&apos;t be bought. It has to be found. We read culture
            like scientists — and build inside it like fans. That is the whole
            method, and it is why the work gets watched instead of skipped.
          </p>
        </div>
      </section>

      {/* ---- act 3: the method, three beats ---- */}
      <section
        ref={methodRef}
        data-chapter
        data-chapter-theme="blue"
        data-chapter-label="03 / 05 — The Method"
        className="c-act relative lg:h-svh lg:overflow-hidden"
      >
        <div ref={trackRef} className="c-track">
          {PANELS.map((p) => (
            <article
              key={p.num}
              className="c-panel flex min-h-[85svh] items-center px-5 py-16 md:px-8 lg:h-svh lg:min-h-0"
            >
              <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[auto_1fr] md:gap-16">
                <span
                  className="c-panel-num font-display tnum"
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <div className="max-w-xl">
                  <p className="eyebrow mb-4">
                    <span className="tick">{p.num}</span> / 03 — The method
                  </p>
                  <h2 className="font-display text-h2">{p.title}</h2>
                  <p
                    className="mt-6 text-lg leading-relaxed"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {p.copy}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- interlude: culture marquee ---- */}
      <div
        className="c-act c-marquee-band hairline-t hairline-b relative py-7"
        aria-hidden="true"
      >
        <div className="marquee">
          {[0, 1].map((copy) => (
            <div className="marquee-track" key={copy}>
              {Array.from({ length: 3 }).flatMap((_, rep) =>
                MARQUEE_WORDS.map((w, i) => (
                  <span
                    key={`${rep}-${i}`}
                    className={`c-marquee-word font-display ${
                      (rep * MARQUEE_WORDS.length + i) % 2
                        ? "display-outline"
                        : ""
                    }`}
                  >
                    {w} <span style={{ color: "var(--signal)" }}>✕</span>
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---- act 4: the proof ---- */}
      <section
        data-chapter
        data-chapter-theme="paper"
        data-chapter-label="04 / 05 — The Proof"
        className="c-act relative px-5 py-28 md:px-8 md:py-36"
      >
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow mb-16" data-creveal>
            <span className="tick">02</span> The proof
          </p>
          <div className="grid gap-14 sm:grid-cols-2">
            {STATS.map((s, i) => (
              <div key={s.label} data-creveal>
                <p className="c-stat-value font-display tnum">
                  <span data-stat={i} aria-hidden="true">
                    {fmt(s, s.value)}
                  </span>
                  <span className="visually-hidden">{fmt(s, s.value)}</span>
                </p>
                <p className="mt-3 text-lg">{s.label}</p>
                <p className="eyebrow mt-2">
                  <span className="tick">·</span> {s.source}
                </p>
              </div>
            ))}
          </div>
          <div
            className="hairline-t mt-20 flex flex-wrap items-baseline gap-x-12 gap-y-4 pt-8"
            data-creveal
          >
            <p className="text-lg">
              Cannes Lions Silver{" "}
              <span className="eyebrow">
                <span className="tick">·</span> Maybelline — Eyes Up
              </span>
            </p>
            <p className="text-lg">
              AiMCO Talent Agency of the Year{" "}
              <span className="eyebrow">
                <span className="tick">·</span> 2024 &amp; 2025
              </span>
            </p>
          </div>
          <p
            className="mt-10 text-xs leading-relaxed"
            style={{ color: "var(--ink-muted)" }}
            data-creveal
          >
            Figures as published on clickmedia.group.
          </p>
        </div>
      </section>

      {/* ---- act 5: finale ---- */}
      <section
        data-chapter
        data-chapter-theme="signal"
        data-chapter-label="05 / 05 — The Signal"
        className="c-act relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center md:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 60%, var(--glow), transparent 70%)",
            opacity: 0.4,
          }}
        />
        <p className="eyebrow relative mb-8" data-creveal>
          <span className="tick">03</span> The signal
        </p>
        <h2 className="c-finale-title font-display text-hero relative">
          This Is
          <br />
          Your <span className="display-outline">Signal</span>
        </h2>
        <div className="relative mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary c-magnetic">
            Enter the Site <span className="btn-arrow">→</span>
          </Link>
          <Link href="/contact" className="btn-ghost c-magnetic">
            Start the Conversation <span className="btn-arrow">→</span>
          </Link>
        </div>
        <p
          className="font-mono-data relative mt-20 text-[0.62rem]"
          style={{ color: "var(--ink-muted)" }}
        >
          CLICK · Concept 001 · Independent design concept — not the official
          CLICK site
        </p>
      </section>
    </div>
  );
}
