/**
 * Hand-drawn marks — a core CLICK brand device (Guidelines p.22): they
 * "soften our digital aesthetic and add personality, reflecting our brand
 * positioning of being 'in good hands'."
 *
 * The guidelines are strict about dosage, and the page is held to it:
 *   - "used very sparingly to maintain a clean look" — two on the homepage
 *   - "should only accompany text, not images"
 *
 * Both marks are decorative, so they are aria-hidden and sit behind the
 * text they annotate. Strokes are drawn slightly off-true on purpose: a
 * geometrically perfect ellipse reads as a border, not a hand.
 */

type Props = { className?: string };

/** Loose ellipse, as if circled by hand. Overshoots where it closes. */
export function ScribbleCircle({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M148 8C86 6 22 26 10 58c-11 30 44 54 128 55 79 1 148-19 152-51 4-27-46-49-118-53"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Single underline swash with a slight rise, drawn left to right. */
export function ScribbleUnderline({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 300 24"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M4 17c52-7 104-11 156-11 46 0 100 3 140 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
