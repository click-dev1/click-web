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
/* The built frames set a leading glyph (◆, ◉, ▸) in a .tick span, which
   takes var(--signal). Today that resolves to the same white as the text
   around it, so writing the glyph into the string looks identical — but
   only by accident of the Electric Blue palette. Pull it out so the
   markup is right if --signal ever stops being white. Editors just type
   "◆ 2024 · 2025". */
function withTick(text: string) {
  const m = /^([^\w\s])\s+(.+)$/.exec(text);
  if (!m) return text;
  return (
    <>
      <span className="tick">{m[1]}</span> {m[2]}
    </>
  );
}

export default function InsightFrame({
  text,
  label,
  footnote,
  className,
}: {
  text?: string;
  label?: string;
  footnote?: string;
  /** Overrides the default spacing. The hero aside sits in its own
      column and wants neither the top margin nor the width cap. */
  className?: string;
}): ReactNode {
  if (!text) return null;

  return label ? (
    <div data-reveal className={className ?? "insight-frame mt-10 max-w-2xl"}>
      <p className="eyebrow mb-2">
        <span className="tick">◉</span> {label}
      </p>
      <p className="leading-body">{text}</p>
      {footnote && <p className="eyebrow mt-3">{withTick(footnote)}</p>}
    </div>
  ) : (
    <div data-reveal className={className ?? "insight-frame mt-8 max-w-md"}>
      <p className="font-display text-h3">{text}</p>
      {footnote && <p className="eyebrow mt-3">{withTick(footnote)}</p>}
    </div>
  );
}
