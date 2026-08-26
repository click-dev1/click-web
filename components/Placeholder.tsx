/**
 * Media placeholder — an intentional design element, not a missing image.
 * Marks the exact slots where client-supplied photography, film or creator
 * media lands. Swap for <Image>/<video> as assets arrive; the wrapper's
 * aspect ratio is the slot's.
 */
export default function Placeholder({
  label,
  ratio = "16/9",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`placeholder-media ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <span className="eyebrow placeholder-label">
        <span className="tick">▣</span> {label}
      </span>
    </div>
  );
}
