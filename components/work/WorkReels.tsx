import BlockImage from "@/components/blocks/BlockImage";
import Placeholder from "@/components/Placeholder";
import ReelPlayer from "./ReelPlayer";
import { urlFor } from "@/lib/sanity/image";
import type { Reel } from "@/lib/sanity/types";

/**
 * CLICK's vertical industry films, four across.
 *
 * 9:16 is the films' native shape, so the frames keep it at every width:
 * four in a row on desktop, a swipeable strip on a phone (snap scrolling,
 * each frame most of the viewport wide so the next one peeks in and says
 * "there's more"). Each reel's link filters the grid below to its
 * industry — the films are the way into the work, not a separate gallery.
 *
 * A reel with a film uploaded (Mux, from the Studio) plays it — see
 * ReelPlayer. Without one it shows its poster, or an honest
 * awaiting-footage frame.
 */
export default function WorkReels({
  eyebrow,
  heading,
  reels,
  onSelect,
  available,
}: {
  eyebrow?: string;
  heading?: string;
  reels: Reel[];
  /** Filter the grid to this industry and bring it into view. */
  onSelect: (industry: string) => void;
  /** Industries that have at least one case study — a link to an empty
      filter would be a dead end, so those reels show no link. */
  available: Set<string>;
}) {
  if (!reels.length) return null;

  return (
    <section
      data-signal="flow"
      className="hairline-t relative z-10 py-20"
      aria-labelledby="reels-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {eyebrow && (
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> {eyebrow}
          </p>
        )}
        <h2 id="reels-heading" data-split className="font-display text-h2 max-w-3xl">
          {heading ?? "Work, by industry."}
        </h2>
      </div>

      <ul
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-auto md:grid md:max-w-7xl md:grid-cols-4 md:overflow-visible md:px-8 md:pb-0"
        aria-label="Industry reels"
      >
        {reels.map((reel) => {
          const linked = reel.industry && available.has(reel.industry);
          return (
            <li
              key={reel._key}
              className="flex w-[72vw] max-w-xs shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <figure className="card-surface flex w-full flex-col overflow-hidden rounded-xl">
                {reel.playbackId ? (
                  <ReelPlayer
                    playbackId={reel.playbackId}
                    label={reel.label}
                    poster={
                      reel.poster?.asset
                        ? urlFor(reel.poster).width(720).height(1280).url()
                        : undefined
                    }
                  />
                ) : reel.poster?.asset ? (
                  <BlockImage
                    image={reel.poster}
                    ratio="9/16"
                    width={900}
                    sizes="(min-width: 768px) 25vw, 72vw"
                    className="rounded-none"
                  />
                ) : (
                  <Placeholder
                    label="Reel · coming soon"
                    ratio="9/16"
                    className="rounded-none border-0"
                  />
                )}
                {/* Label above the link, never beside it: at four across the
                    frames are too narrow for a long label ("Sport &
                    Lifestyle") and a button to share a line. */}
                <figcaption className="flex flex-1 flex-col items-start gap-4 p-5">
                  <span className="font-display text-h3 text-balance leading-none">
                    {/* Keep "&" with the word before it, so "Food & Bev"
                        breaks as "Food & / Bev", never with a lone "&". */}
                    {reel.label.replace(/ &/g, "\u00a0&")}
                  </span>
                  {linked && (
                    <button
                      type="button"
                      className="btn-ghost mt-auto px-3 py-1.5 text-xs"
                      onClick={() => onSelect(reel.industry!)}
                    >
                      See the work <span className="btn-arrow">→</span>
                    </button>
                  )}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
