import type { Attribution } from "@/lib/sanity/types";

/**
 * The credit on work CLICK Influence did not deliver itself.
 *
 * GameSquare activations appear on the site with CLICK's approval, and
 * the badge is what keeps that honest: a reader can always tell CLICK's
 * own case studies from the wider group's. CLICK's own work carries no
 * badge — it is the default, and labelling the default is noise.
 *
 * `overlay` pins it to the corner of a card image; otherwise it sits
 * inline with the other eyebrows.
 */
export default function AttributionBadge({
  attribution,
  overlay = false,
}: {
  attribution: Attribution;
  overlay?: boolean;
}) {
  if (attribution !== "gamesquare") return null;
  return (
    <span
      className={`eyebrow pill ${overlay ? "attribution-overlay" : ""}`}
      title="Delivered by the GameSquare group, of which CLICK Influence is part"
    >
      GameSquare
    </span>
  );
}

/** The sentence under a GameSquare case study's hero. */
export const GAMESQUARE_CREDIT =
  "A GameSquare activation — delivered across the GameSquare group, of which CLICK Influence is part.";
