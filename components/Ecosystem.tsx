"use client";

import { useState } from "react";
import type { HomePage } from "@/lib/sanity/types";

/**
 * GameSquare ecosystem — the signal field's final transformation.
 * Nodes are real buttons: keyboard reachable, focus visible, description
 * shown for hover, focus and touch alike. Mobile reflows to a list.
 *
 * The lineup is edited on the home page document (Ecosystem group).
 * Without any groups the section is left out rather than drawn empty.
 */
export default function Ecosystem({ home }: { home: HomePage }) {
  const groups = (home.ecosystemGroups ?? []).filter((g) => g.nodes?.length);
  const [active, setActive] = useState<{ name: string; blurb: string } | null>(
    groups[0]?.nodes[0] ?? null,
  );
  if (!active) return null;

  return (
    <section
      id="ecosystem"
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby="eco-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="eco-heading" className="font-display text-h2 max-w-2xl">
          <span className="eyebrow pill mb-5">
            <span className="tick" aria-hidden="true">
              ●
            </span>{" "}
            {home.ecosystemEyebrow}
          </span>
          <span className="visually-hidden"> — </span>
          <span data-split className="block">
            {home.ecosystemHeading}
          </span>
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            {groups.map((g) => (
              <div key={g._key ?? g.label}>
                <p className="eyebrow mb-3">{g.label}</p>
                {/* A real list of real buttons. These used to be buttons
                    carrying role="listitem", which overrode the button
                    role and left aria-pressed on an element that cannot
                    take it. */}
                <ul className="flex flex-wrap gap-3">
                  {g.nodes.map((n) => (
                    <li key={n.name}>
                      <button
                        type="button"
                        className="card-surface rounded-full px-5 py-2.5 text-sm transition-transform hover:-translate-y-0.5"
                        style={
                          active.name === n.name
                            ? { borderColor: "var(--signal)" }
                            : undefined
                        }
                        aria-pressed={active.name === n.name}
                        onClick={() => setActive(n)}
                        onMouseEnter={() => setActive(n)}
                        onFocus={() => setActive(n)}
                      >
                        {n.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="insight-frame self-start lg:sticky lg:top-28">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> {active.name}
            </p>
            <p className="leading-body" style={{ color: "var(--ink-muted)" }}>
              {active.blurb}
            </p>
            {home.ecosystemNote && (
              <p className="eyebrow mt-4">{home.ecosystemNote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
