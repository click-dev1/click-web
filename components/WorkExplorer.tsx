"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";
import { campaigns, workDisclosure } from "@/content/site";
import { brands } from "@/content/manifest";

/**
 * One curated grid, filterable by Service / Industry / Platform.
 * Options generate from the data so empty values never render; the brand
 * wall click-filters by brand.
 */
export default function WorkExplorer() {
  const [service, setService] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  const options = useMemo(
    () => ({
      services: [...new Set(campaigns.map((c) => c.service))].sort(),
      industries: [...new Set(campaigns.map((c) => c.industry))].sort(),
      platforms: [...new Set(campaigns.flatMap((c) => c.platforms))].sort(),
    }),
    [],
  );

  const results = campaigns.filter(
    (c) =>
      (!service || c.service === service) &&
      (!industry || c.industry === industry) &&
      (!platform || c.platforms.includes(platform)) &&
      (!brand || c.brand === brand),
  );

  const chipRow = (
    label: string,
    values: string[],
    active: string | null,
    set: (v: string | null) => void,
  ) =>
    /* a filter with one value can't filter anything — hide it */
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
    <>
      {/* ---- filters + grid ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="work-grid-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="work-grid-heading" className="visually-hidden">
            Featured work
          </h2>
          <div className="flex flex-col gap-4">
            {chipRow("Service", options.services, service, setService)}
            {chipRow("Industry", options.industries, industry, setIndustry)}
            {chipRow("Platform", options.platforms, platform, setPlatform)}
            {brand && (
              <p className="eyebrow flex flex-wrap items-center gap-2">
                <span>
                  <span className="tick">◉</span> Filtered by brand · {brand}
                </span>
                <button
                  type="button"
                  className="chip"
                  onClick={() => setBrand(null)}
                >
                  Clear
                </button>
              </p>
            )}
          </div>

          <p className="eyebrow mt-8" aria-live="polite">
            <span className="tick">●</span> {results.length}{" "}
            {results.length === 1 ? "campaign" : "campaigns"}
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {results.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="card-surface group block overflow-hidden rounded-xl"
              >
                <Placeholder
                  label={c.mediaLabel}
                  ratio="16/9"
                  className="rounded-none border-0"
                />
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="eyebrow">
                      <span className="tick">▸</span> {c.brand}
                    </p>
                    <p className="eyebrow">
                      {c.service} · {c.industry}
                    </p>
                  </div>
                  <h3 className="font-display text-h3 mt-2">{c.title}</h3>
                  {/* insight line — before anything else */}
                  <p className="mt-4 leading-body">
                    <span className="eyebrow mr-2">What we found</span>
                    {c.insight}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    {c.metrics.slice(0, 3).map((m) => (
                      <div key={m.label}>
                        <span className="tnum block text-xl font-bold">
                          {m.value}
                        </span>
                        <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
                          {m.label}
                        </span>
                      </div>
                    ))}
                    {c.metrics.length === 0 && c.proofLine && (
                      <span className="font-display text-xl">{c.proofLine}</span>
                    )}
                  </div>
                  <span className="btn-ghost mt-6 inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                    View Campaign <span className="btn-arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {results.length === 0 && (
            <div className="insight-frame mt-6 max-w-md">
              <p className="leading-body">
                No campaigns match that combination — try clearing a filter.
              </p>
            </div>
          )}

          <p className="mt-10 text-sm" style={{ color: "var(--ink-muted)" }}>
            {workDisclosure}
          </p>
        </div>
      </section>

      {/* ---- brand wall (click to filter) ---- */}
      <section
        data-signal="divide"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="brand-wall-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow pill mb-4">
            <span className="tick">●</span> Brands we&apos;ve partnered with
          </p>
          <h2 id="brand-wall-heading" data-split className="font-display text-h2 max-w-3xl">
            From global brands to emerging challengers.
          </h2>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {brands.clients.map((b) => {
              const hasWork = campaigns.some((c) => c.brand === b);
              return hasWork ? (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(brand === b ? null : b);
                    setService(null);
                    setIndustry(null);
                    setPlatform(null);
                    document
                      .getElementById("work-grid-heading")
                      ?.scrollIntoView({ block: "start" });
                  }}
                  aria-pressed={brand === b}
                  className="font-display text-3xl transition-opacity hover:opacity-100 md:text-4xl"
                  style={{ opacity: brand === b ? 1 : 0.7 }}
                >
                  {b}
                </button>
              ) : (
                <span
                  key={b}
                  className="font-display text-3xl md:text-4xl"
                  style={{ opacity: 0.45 }}
                >
                  {b}
                </span>
              );
            })}
          </div>
          <p className="mt-8 max-w-xl text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
            We build creator partnerships designed to drive measurable business
            outcomes across every stage of the marketing funnel. Select a brand
            to see its campaigns.
          </p>
        </div>
      </section>
    </>
  );
}
