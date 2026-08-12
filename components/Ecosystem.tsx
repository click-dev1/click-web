"use client";

import { useState } from "react";
import { ecosystem } from "@/content/manifest";

/**
 * GameSquare ecosystem — the signal field's final transformation.
 * Nodes are real buttons: keyboard reachable, focus visible, description
 * shown for hover, focus and touch alike. Mobile reflows to a list.
 */
export default function Ecosystem() {
  const first = ecosystem.groups[0].nodes[0];
  const [active, setActive] = useState<{ name: string; blurb: string }>(first);

  return (
    <section
      id="ecosystem"
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-24 md:px-8"
      aria-labelledby="eco-heading"
    >
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-4">
          <span className="tick">●</span> Backed by the GameSquare ecosystem
        </p>
        <h2 id="eco-heading" data-split className="font-display text-h2 max-w-2xl">
          One ecosystem. Endless possibilities.
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            {ecosystem.groups.map((g) => (
              <div key={g.label}>
                <p className="eyebrow mb-3">{g.label}</p>
                <div className="flex flex-wrap gap-3" role="list">
                  {g.nodes.map((n) => (
                    <button
                      key={n.name}
                      type="button"
                      role="listitem"
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
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="insight-frame self-start lg:sticky lg:top-28">
            <p className="eyebrow mb-2">
              <span className="tick">◉</span> {active.name}
            </p>
            <p className="leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              {active.blurb}
            </p>
            <p className="eyebrow mt-4">
              Ecosystem lineup verified at build time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
