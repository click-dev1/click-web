"use client";

import { useEffect, useRef, useState, type ComponentRef } from "react";
/* The lazy build: the player is a sizeable web component and /work shows
   four of them below the fold, so each loads only as it nears the
   viewport, with the poster standing in until it arrives. */
import MuxPlayer from "@mux/mux-player-react/lazy";

type MuxPlayerElement = ComponentRef<typeof MuxPlayer>;

/**
 * One industry reel: a muted, looping preview that becomes the full film.
 *
 * - On a device with a mouse, a reel plays while the pointer is over it —
 *   four previews running at once in a row would be noise.
 * - On touch, the reel most in view plays by itself; scrolling on pauses
 *   it.
 * - "Watch with sound" unmutes and goes fullscreen with the player's own
 *   controls; leaving fullscreen puts it back to a silent preview.
 * - Reduced motion: nothing plays until asked.
 *
 * Mux's viewer analytics are switched off. The site only measures with
 * consent (components/consent), and a video player phoning home on its
 * own would go around that.
 */
export default function ReelPlayer({
  playbackId,
  label,
  poster,
}: {
  playbackId: string;
  label: string;
  /** Sanity poster URL; Mux's own thumbnail is used without one. */
  poster?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<MuxPlayerElement | null>(null);
  const [full, setFull] = useState(false);

  const posterUrl =
    poster ??
    `https://image.mux.com/${playbackId}/thumbnail.webp?time=1&width=720`;

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      const p = player.current;
      if (p && p.muted) p.play()?.catch(() => {});
    };
    const pause = () => {
      const p = player.current;
      if (p && p.muted) p.pause();
    };

    if (window.matchMedia("(hover: hover)").matches) {
      el.addEventListener("pointerenter", play);
      el.addEventListener("pointerleave", pause);
      return () => {
        el.removeEventListener("pointerenter", play);
        el.removeEventListener("pointerleave", pause);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.75 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Back to a silent preview whenever fullscreen ends, however it ends. */
  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement) return;
      const p = player.current;
      if (p) p.muted = true;
      setFull(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const watch = async () => {
    const p = player.current;
    if (!p) return;
    p.muted = false;
    setFull(true);
    try {
      await p.requestFullscreen();
    } catch {
      /* iOS Safari has no element fullscreen — it plays inline with
         sound and the controls instead. */
    }
    p.play()?.catch(() => {});
  };

  return (
    <div
      ref={frame}
      className="reel-frame relative w-full overflow-hidden"
      style={{ aspectRatio: "9/16" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- stand-in
          while the player loads; the player then paints its own poster. */}
      <img
        src={posterUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <MuxPlayer
        ref={player}
        loading="viewport"
        playbackId={playbackId}
        streamType="on-demand"
        poster={posterUrl}
        muted
        loop
        playsInline
        preload="metadata"
        disableTracking
        disableCookies
        title={label}
        accentColor="#186ffc"
        className="absolute inset-0 h-full w-full"
        style={{
          aspectRatio: "9/16",
          "--media-object-fit": "cover",
          /* Chrome-less while it previews; the player's own controls come
             back for the full film. */
          ...(full ? {} : { "--controls": "none" }),
        }}
      />
      {!full && (
        <button
          type="button"
          onClick={watch}
          className="btn-ghost reel-watch absolute bottom-3 left-3 px-3 py-1.5 text-xs"
          aria-label={`Watch the ${label} reel with sound`}
        >
          ▶ Watch with sound
        </button>
      )}
    </div>
  );
}
