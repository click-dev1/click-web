import type { ReactNode } from "react";

/**
 * The framed insight that closes a section.
 *
 * On its own it reads as a pull quote and is set large. Give it a label
 * and it becomes a stated finding — smaller type, provenance underneath —
 * because a finding that carries its sources should not be set like a
 * slogan. Shared by every block that can end on one, so the two styles
 * stay identical wherever they appear.
 */
export default function InsightFrame({
  text,
  label,
  footnote,
}: {
  text?: string;
  label?: string;
  footnote?: string;
}): ReactNode {
  if (!text) return null;

  return label ? (
    <div data-reveal className="insight-frame mt-10 max-w-2xl">
      <p className="eyebrow mb-2">
        <span className="tick">◉</span> {label}
      </p>
      <p className="leading-body">{text}</p>
      {footnote && <p className="eyebrow mt-3">{footnote}</p>}
    </div>
  ) : (
    <div data-reveal className="insight-frame mt-8 max-w-md">
      <p className="font-display text-h3">{text}</p>
      {footnote && <p className="eyebrow mt-3">{footnote}</p>}
    </div>
  );
}
