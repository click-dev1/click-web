"use client";

import { useEffect, useRef } from "react";
import { getSignalMode, type SignalMode } from "@/lib/signal";

/**
 * The persistent signal system: one fixed canvas, one RAF loop.
 * A lightweight custom force simulation — particles seek mode-dependent
 * community foci; proximity lines; overlap regions light up in the theme
 * accent. Quality scales with viewport; reduced motion renders one static
 * resolved frame.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  cluster: number;
  r: number;
  seed: number;
}

interface Focus {
  x: number; // viewport fraction
  y: number;
  pull: number;
  spread: number;
}

interface ModeConfig {
  foci: Focus[];
  alpha: number; // global particle alpha multiplier
  lines: number; // line alpha multiplier
  drift: number; // wander strength
  accent: boolean; // light up overlap between foci 0 & 1
}

const MODES: Record<SignalMode, (portrait: boolean) => ModeConfig> = {
  dormant: () => ({
    foci: [{ x: 0.5, y: 0.45, pull: 0.004, spread: 0.65 }],
    alpha: 0.55,
    lines: 0.5,
    drift: 1.1,
    accent: false,
  }),
  overlap: (portrait) => ({
    foci: portrait
      ? [
          { x: 0.38, y: 0.32, pull: 0.014, spread: 0.2 },
          { x: 0.62, y: 0.38, pull: 0.014, spread: 0.2 },
          { x: 0.5, y: 0.62, pull: 0.01, spread: 0.16 },
        ]
      : [
          { x: 0.66, y: 0.38, pull: 0.014, spread: 0.15 },
          { x: 0.8, y: 0.5, pull: 0.014, spread: 0.15 },
          { x: 0.7, y: 0.68, pull: 0.01, spread: 0.12 },
        ],
    alpha: 1,
    lines: 1,
    drift: 0.6,
    accent: true,
  }),
  divide: () => ({
    foci: [
      { x: 0.24, y: 0.5, pull: 0.012, spread: 0.22 },
      { x: 0.76, y: 0.5, pull: 0.012, spread: 0.22 },
    ],
    alpha: 0.85,
    lines: 0.8,
    drift: 0.7,
    accent: false,
  }),
  flow: () => ({
    foci: [
      { x: 0.3, y: 0.3, pull: 0.011, spread: 0.2 },
      { x: 0.7, y: 0.7, pull: 0.011, spread: 0.2 },
      { x: 0.5, y: 0.5, pull: 0.008, spread: 0.3 },
    ],
    alpha: 0.9,
    lines: 0.9,
    drift: 0.9,
    accent: true,
  }),
  quiet: () => ({
    foci: [{ x: 0.5, y: 0.5, pull: 0.003, spread: 0.8 }],
    alpha: 0.16,
    lines: 0.15,
    drift: 0.5,
    accent: false,
  }),
  settle: () => ({
    foci: [{ x: 0.5, y: 0.6, pull: 0.005, spread: 0.55 }],
    alpha: 0.4,
    lines: 0.4,
    drift: 0.55,
    accent: false,
  }),
};

function readThemeParams() {
  const s = getComputedStyle(document.documentElement);
  const parse = (v: string, fallback: [number, number, number]) => {
    const parts = v.split(",").map((n) => parseInt(n.trim(), 10));
    return parts.length === 3 && parts.every((n) => !isNaN(n))
      ? (parts as [number, number, number])
      : fallback;
  };
  return {
    color: parse(s.getPropertyValue("--p-color"), [145, 200, 255]),
    accent: parse(s.getPropertyValue("--p-accent"), [46, 127, 255]),
    lineAlpha: parseFloat(s.getPropertyValue("--p-line-alpha")) || 0.14,
    glowAlpha: parseFloat(s.getPropertyValue("--p-glow-alpha")) || 0.4,
    dotAlpha: parseFloat(s.getPropertyValue("--p-dot-alpha")) || 0.65,
    accentAlpha: parseFloat(s.getPropertyValue("--p-accent-alpha")) || 0.95,
  };
}

function makeGlowSprite(rgb: [number, number, number], alpha: number) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`);
  grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function SignalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let theme = readThemeParams();
    let glow = makeGlowSprite(theme.accent, theme.glowAlpha);
    let raf = 0;
    let last = performance.now();
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const particleCount = () =>
      W < 640 ? 60 : W < 1024 ? 110 : Math.min(210, Math.round(W / 9));

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const n = particleCount();
      particles = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        cluster: i % 3,
        r: 1 + Math.random() * 1.6,
        seed: Math.random() * 1000,
      }));
    }

    function step(dt: number, t: number) {
      const portrait = H > W;
      const cfg = MODES[getSignalMode()](portrait);
      const foci = cfg.foci;
      const k = Math.min(dt / 16.7, 2); // delta-time normalization

      for (const p of particles) {
        const f = foci[p.cluster % foci.length];
        const fx = f.x * W;
        const fy = f.y * H;
        // spring toward focus with per-particle offset ring
        const angle = p.seed + t * 0.00006 * (1 + (p.seed % 1));
        const ring = f.spread * Math.min(W, H) * (0.35 + (p.seed % 0.65));
        const tx = fx + Math.cos(angle) * ring;
        const ty = fy + Math.sin(angle * 0.9) * ring * 0.8;
        p.vx += (tx - p.x) * f.pull * k;
        p.vy += (ty - p.y) * f.pull * k;
        // gentle wander
        p.vx += Math.sin(t * 0.001 + p.seed) * 0.01 * cfg.drift * k;
        p.vy += Math.cos(t * 0.0012 + p.seed * 2) * 0.01 * cfg.drift * k;
        // cursor influence (desktop fine pointers only, subtle)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = ((130 - d) / 130) * 0.5;
            p.vx += (dx / d) * push * k;
            p.vy += (dy / d) * push * k;
          }
        }
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx * k;
        p.y += p.vy * k;
      }
    }

    function draw() {
      const portrait = H > W;
      const cfg = MODES[getSignalMode()](portrait);
      ctx!.clearRect(0, 0, W, H);
      if (cfg.alpha <= 0.01) return;

      const [cr, cg, cb] = theme.color;
      const [ar, ag, ab] = theme.accent;
      const lineBase = theme.lineAlpha * cfg.lines;
      const foci = cfg.foci;

      // proximity lines
      const linkDist = W < 640 ? 70 : 90;
      const ld2 = linkDist * linkDist;
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < ld2) {
            const alpha = (1 - d2 / ld2) * lineBase * cfg.alpha;
            ctx!.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // particles (+ accent for the overlap region between foci 0 & 1)
      const overlapR = Math.min(W, H) * 0.22;
      const or2 = overlapR * overlapR;
      for (const p of particles) {
        let accent = false;
        if (cfg.accent && foci.length >= 2) {
          const d0x = p.x - foci[0].x * W;
          const d0y = p.y - foci[0].y * H;
          const d1x = p.x - foci[1].x * W;
          const d1y = p.y - foci[1].y * H;
          accent =
            d0x * d0x + d0y * d0y < or2 && d1x * d1x + d1y * d1y < or2;
        }
        if (accent) {
          const s = p.r * 14;
          ctx!.globalAlpha = cfg.alpha;
          ctx!.drawImage(glow, p.x - s / 2, p.y - s / 2, s, s);
          ctx!.globalAlpha = 1;
          ctx!.fillStyle = `rgba(${ar},${ag},${ab},${
            theme.accentAlpha * cfg.alpha
          })`;
        } else {
          ctx!.fillStyle = `rgba(${cr},${cg},${cb},${
            theme.dotAlpha * cfg.alpha
          })`;
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop(now: number) {
      if (!running) return;
      const dt = now - last;
      last = now;
      step(dt, now);
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }
    function onTheme() {
      theme = readThemeParams();
      glow = makeGlowSprite(theme.accent, theme.glowAlpha);
      if (reduced) staticFrame();
    }

    function staticFrame() {
      // settle the simulation invisibly, then draw once
      const t0 = performance.now();
      for (let i = 0; i < 320; i++) step(16.7, t0 + i * 16.7);
      draw();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click-theme-change", onTheme as EventListener);

    if (reduced) {
      staticFrame();
      // re-render static frame when the section mode changes
      const modeRedraw = () => staticFrame();
      window.addEventListener(
        "click-signal-change",
        modeRedraw as EventListener
      );
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener(
          "click-theme-change",
          onTheme as EventListener
        );
        window.removeEventListener(
          "click-signal-change",
          modeRedraw as EventListener
        );
      };
    }

    if (finePointer) {
      window.addEventListener("mousemove", onMouse, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click-theme-change", onTheme as EventListener);
      if (finePointer) {
        window.removeEventListener("mousemove", onMouse);
        document.documentElement.removeEventListener("mouseleave", onLeave);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
