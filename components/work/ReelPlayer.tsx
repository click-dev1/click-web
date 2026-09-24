"use client";

import { useEffect, useRef, useState, type ComponentRef } from "react";
/* The lazy build: the player is a sizeable web component and /work shows
   four of them below the fold, so each loads only as it nears the
   viewport, with the poster standing in until it arrives. */
import MuxPlayer from "@mux/mux-player-react/lazy";

type MuxPlayerElement = ComponentRef<typeof MuxPlayer>;

/* One reel with sound at a time: a reel that starts playing out loud
   tells the others to stop. */
const SOLO = "reel:solo";

/**
 * One industry reel: a muted, looping preview with three controls —
 * play/pause, restart, volume. The player's own chrome stays hidden; at
 * a quarter of the page width it would bury the film.
 *
 * - Until someone touches the controls it previews by itself: on a
 *   device with a mouse while the pointer is over it (four running at
 *   once would be noise), on touch while it is the reel in view.
 * - Once someone presses a control, they are in charge — the reel stops
 *   auto-pausing on its own.
 * - Unmuting one reel pauses any other that is playing with sound.
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
  /* True once the visitor has used a control — auto play/pause stops. */
  const driven = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);

  const posterUrl =
    poster ??
    `https://image.mux.com/${playbackId}/thumbnail.webp?time=1&width=720`;

  /* Automatic preview, until the visitor takes over. */
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      if (!driven.current) player.current?.play()?.catch(() => {});
    };
    const pause = () => {
      if (!driven.current) player.current?.pause();
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

  /* Another reel went loud — this one stops. */
  useEffect(() => {
    const onSolo = (e: Event) => {
      if ((e as CustomEvent<string>).detail === playbackId) return;
      const p = player.current;
      if (p && !p.muted && !p.paused) p.pause();
    };
    window.addEventListener(SOLO, onSolo);
    return () => window.removeEventListener(SOLO, onSolo);
  }, [playbackId]);

  const solo = () =>
    window.dispatchEvent(new CustomEvent(SOLO, { detail: playbackId }));

  const togglePlay = () => {
    const p = player.current;
    if (!p) return;
    driven.current = true;
    if (p.paused) {
      if (!p.muted) solo();
      p.play()?.catch(() => {});
    } else p.pause();
  };

  const restart = () => {
    const p = player.current;
    if (!p) return;
    driven.current = true;
    p.currentTime = 0;
    p.play()?.catch(() => {});
  };

  const toggleMute = () => {
    const p = player.current;
    if (!p) return;
    driven.current = true;
    p.muted = !p.muted;
    if (!p.muted) {
      if (p.volume === 0) p.volume = 1;
      solo();
      p.play()?.catch(() => {});
    }
  };

  const changeVolume = (value: number) => {
    const p = player.current;
    if (!p) return;
    driven.current = true;
    p.volume = value;
    p.muted = value === 0;
    if (value > 0) {
      solo();
      p.play()?.catch(() => {});
    }
  };

  const silent = muted || volume === 0;

  return (
    <div
      ref={frame}
      className="relative w-full overflow-hidden"
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
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={() => {
          const p = player.current;
          if (!p) return;
          setMuted(p.muted);
          setVolume(p.volume);
        }}
        className="absolute inset-0 h-full w-full"
        style={{
          aspectRatio: "9/16",
          "--media-object-fit": "cover",
          "--controls": "none",
        }}
      />

      <div
        className="reel-controls"
        role="group"
        aria-label={`${label} reel controls`}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={restart} aria-label="Restart" title="Restart">
          <RestartIcon />
        </button>
        <span className="reel-volume">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={silent ? "Unmute" : "Mute"}
            title={silent ? "Unmute" : "Mute"}
          >
            {silent ? <MutedIcon /> : <SoundIcon />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={silent ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </span>
      </div>
    </div>
  );
}

/* Icons: 20px, currentColor, so they take the control bar's ink. */
const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

function PlayIcon() {
  return (
    <svg {...icon}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg {...icon}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg
      {...icon}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg {...icon}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path
        d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg {...icon}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path
        d="m16.5 9.5 5 5m0-5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
