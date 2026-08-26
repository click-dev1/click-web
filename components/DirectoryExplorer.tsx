"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";
import { roster, rosterDisclosure } from "@/content/site";

/**
 * Directory with live search + Category / Platform / Region filters.
 * Filter options are generated from the data, so empty values never render.
 */
export default function DirectoryExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const options = useMemo(
    () => ({
      categories: [...new Set(roster.map((t) => t.category))].sort(),
      platforms: [...new Set(roster.flatMap((t) => t.platforms))].sort(),
      regions: [...new Set(roster.map((t) => t.region))].sort(),
    }),
    [],
  );

  const results = roster.filter((t) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.platforms.some((p) => p.toLowerCase().includes(q));
    return (
      matchesQuery &&
      (!category || t.category === category) &&
      (!platform || t.platforms.includes(platform)) &&
      (!region || t.region === region)
    );
  });

  const chipRow = (
    label: string,
    values: string[],
    active: string | null,
    set: (v: string | null) => void,
  ) =>
    values.length > 1 ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-2 w-20 shrink-0">{label}</span>
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className="chip"
            aria-pressed={active === v}
            onClick={() => set(active === v ? null : v)}
          >
            {v}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <section
      id="directory"
      data-signal="quiet"
      className="hairline-t relative z-10 px-5 py-20 md:px-8"
      aria-labelledby="directory-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="directory-heading" className="visually-hidden">
          Discover talent
        </h2>

        {/* search + filters */}
        <div className="flex flex-col gap-5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, platform or category…"
            aria-label="Search talent"
            className="card-surface w-full max-w-xl rounded-full px-6 py-3.5 outline-none"
          />
          {chipRow("Category", options.categories, category, setCategory)}
          {chipRow("Platform", options.platforms, platform, setPlatform)}
          {chipRow("Region", options.regions, region, setRegion)}
        </div>

        <p className="eyebrow mt-8" aria-live="polite">
          <span className="tick">●</span> {results.length}{" "}
          {results.length === 1 ? "creator" : "creators"}
        </p>

        {/* card grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <Link
              key={t.slug}
              href={`/talent/${t.slug}`}
              className="talent-card card-surface group relative block overflow-hidden rounded-xl"
            >
              <Placeholder
                label={`${t.name} · hero image or loop`}
                ratio="4/5"
                className="rounded-none border-0"
              />
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{t.name}</h3>
                  {t.managed && (
                    <span className="eyebrow shrink-0">◆ CLICK Talent</span>
                  )}
                </div>
                <p className="eyebrow mt-2">
                  {t.category} · {t.platforms.join(" / ")} · {t.location}
                </p>
                <p className="tnum mt-2 text-sm">{t.audience} audience</p>
              </div>
              {/* hover reveal */}
              <div className="talent-card-reveal">
                <p className="text-sm leading-body">{t.bio}</p>
                {t.partners.length > 0 && (
                  <p className="eyebrow mt-3">
                    Partners · {t.partners.join(" · ")}
                  </p>
                )}
                {t.ventures.length > 0 && (
                  <p className="eyebrow mt-1.5">
                    Ventures · {t.ventures.join(" · ")}
                  </p>
                )}
                <span className="btn-ghost mt-4 inline-flex px-4 py-2 text-xs">
                  View Profile <span className="btn-arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="insight-frame mt-6 max-w-md">
            <p className="leading-body">
              {roster.length === 0
                ? "The directory is being populated — talk to our team about the creators you're looking for."
                : "No creators match that combination — try clearing a filter."}
            </p>
          </div>
        )}

        <p className="mt-10 text-sm" style={{ color: "var(--ink-muted)" }}>
          {rosterDisclosure}
        </p>
      </div>
    </section>
  );
}
