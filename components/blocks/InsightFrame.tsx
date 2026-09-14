import type { ReactNode } from "react";

/**
 * The framed insight — at the foot of a section, or in a page hero's
 * right-hand column.
 *
 * Three things vary, and each is derived from what the editor filled in
 * rather than chosen:
 *
 * - A **label** turns a pull quote into a stated finding: smaller type,
 *   provenance underneath. A finding that cites its sources should not be
 *   set like a slogan.
 * - An **href** makes the text the point — an address you can tap — so it
 *   takes display scale whether or not there is a label.
 * - **Items** render as a marked list, on their own or under the text.
 *
 * Shared by `copyMedia`, `cardGrid` and the `pageHero` aside so the same
 * frame cannot drift into three slightly different frames.
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
  items,
  href,
  className,
}: {
  text?: string;
  label?: string;
  footnote?: string;
  items?: string[];
  href?: string;
  /** Overrides the default spacing. The hero aside sits in its own
      column and wants neither the top margin nor the width cap. */
  className?: string;
}): ReactNode {
  if (!text && !items?.length) return null;

  /* Linked text is the frame's subject, so it keeps display scale even
     when a label sits above it. Unlabelled text is a pull quote and gets
     the same treatment. Everything else is body copy. */
  const display = Boolean(href) || !label;

  const body = !text ? null : href ? (
    <a
      href={href}
      className="font-display text-h3 break-all transition-opacity hover:opacity-70"
    >
      {text}
    </a>
  ) : display ? (
    <p className="font-display text-h3">{text}</p>
  ) : (
    <p className="leading-body">{text}</p>
  );

  const list = items?.length ? (
    <ul className={`flex flex-col gap-3${text ? " mt-4" : ""}`}>
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-sm leading-body">
          <span aria-hidden="true">▸</span>
          {i}
        </li>
      ))}
    </ul>
  ) : null;

  const spacing = label ? "insight-frame mt-10 max-w-2xl" : "insight-frame mt-8 max-w-md";

  return (
    <div data-reveal className={className ?? spacing}>
      {label && (
        <p className={`eyebrow ${items?.length && !text ? "mb-4" : "mb-2"}`}>
          <span className="tick">◉</span> {label}
        </p>
      )}
      {body}
      {list}
      {footnote && <p className="eyebrow mt-3">{withTick(footnote)}</p>}
    </div>
  );
}
