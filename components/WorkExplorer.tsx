"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";
import BlockImage from "./blocks/BlockImage";
import AttributionBadge from "./work/AttributionBadge";
import WorkReels from "./work/WorkReels";
import type { CaseStudy, Reel } from "@/lib/sanity/types";
import { brands } from "@/content/manifest";

/**
 * The /work grid: industry reels, filters, and the case studies six at a
 * time.
 *
 * Filters are Industry / Service / Engagement type / Delivered by, each
 * generated from the data so an empty value never renders and a filter
 * with one value hides itself. The grid shows PAGE cards and "View more"
 * adds the next PAGE — every case study still has its own /work/<slug>
 * page in the sitemap, so the button only shapes the view, never what
 * search engines can reach.
 *
 * The filter state lives in the URL (?industry=…&type=…&show=12) so a
 * filtered view can be shared and survives the back button. It is read
 * once after hydration and written with history.replaceState, rather
 * than through useSearchParams: that hook would force the whole grid to
 * render client-side behind a Suspense boundary, and the first six cards
 * are exactly what should arrive in the initial HTML.
 *
 * CLICK Influence's own work leads; GameSquare activations follow it,
 * badged. The case studies are fetched by the page (server) and handed
 * in — this component only owns the view.
 */
const PAGE = 6;

type Filters = {
  industry: string | null;
  service: string | null;
  type: string | null;
  by: string | null;
  brand: string | null;
};

const EMPTY: Filters = {
  industry: null,
  service: null,
  type: null,
  by: null,
  brand: null,
};

const BY_LABEL: Record<string, string> = {
  click: "CLICK Influence",
  gamesquare: "GameSquare",
};

export default function WorkExplorer({
  caseStudies: all,
  reels = [],
  reelsEyebrow,
  reelsHeading,
}: {
  caseStudies: CaseStudy[];
  reels?: Reel[];
  reelsEyebrow?: string;
  reelsHeading?: string;
}) {
  /* CLICK's own work first, the query's order kept within each group. */
  const caseStudies = useMemo(
    () => [
      ...all.filter((c) => c.attribution !== "gamesquare"),
      ...all.filter((c) => c.attribution === "gamesquare"),
    ],
    [all],
  );

  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [shown, setShown] = useState(PAGE);
  const hydrated = useRef(false);

  /* Read the URL once, after hydration — see the note above. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next: Filters = {
      industry: q.get("industry"),
      service: q.get("service"),
      type: q.get("type"),
      by: q.get("by"),
      brand: q.get("brand"),
    };
    const show = Number(q.get("show"));
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from
       the URL on mount; there is no external store to subscribe to. */
    if (Object.values(next).some(Boolean)) setFilters(next);
    if (show > PAGE) setShown(show);
    /* eslint-enable react-hooks/set-state-in-effect */
    hydrated.current = true;
  }, []);

  /* …and keep it in step afterwards. */
  useEffect(() => {
    if (!hydrated.current) return;
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) q.set(key, value);
    }
    if (shown > PAGE) q.set("show", String(shown));
    const search = q.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`,
    );
  }, [filters, shown]);

  const options = useMemo(
    () => ({
      industries: [...new Set(caseStudies.map((c) => c.industry))].sort(),
      services: [...new Set(caseStudies.map((c) => c.service))].sort(),
      types: [
        ...new Set(caseStudies.map((c) => c.engagementType).filter(Boolean)),
      ].sort() as string[],
      by: [...new Set(caseStudies.map((c) => c.attribution))],
    }),
    [caseStudies],
  );

  const results = caseStudies.filter(
    (c) =>
      (!filters.industry || c.industry === filters.industry) &&
      (!filters.service || c.service === filters.service) &&
      (!filters.type || c.engagementType === filters.type) &&
      (!filters.by || c.attribution === filters.by) &&
      (!filters.brand || c.brand === filters.brand),
  );
  const visible = results.slice(0, shown);

  /* The brand wall: the confirmed client list, plus any brand CLICK
     Influence has a case study for, so every one of its campaigns can be
     reached from here. GameSquare brands stay off it — the wall says
     "brands we've partnered with", and those were the group's clients. */
  const wall = useMemo(
    () => [
      ...new Set([
        ...brands.clients,
        ...caseStudies
          .filter((c) => c.attribution !== "gamesquare")
          .map((c) => c.brand),
      ]),
    ],
    [caseStudies],
  );
  const remaining = results.length - visible.length;

  /* Any filter change starts the list again from the top. */
  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setShown(PAGE);
  };

  const scrollToGrid = () =>
    document
      .getElementById("work-grid-heading")
      ?.scrollIntoView({ block: "start" });

  const chipRow = (
    label: string,
    key: keyof Filters,
    values: string[],
    display: (v: string) => string = (v) => v,
  ) =>
    /* a filter with one value can't filter anything — hide it */
    values.length > 1 ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-2 w-28 shrink-0">{label}</span>
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className="chip"
            aria-pressed={filters[key] === v}
            onClick={() => update({ [key]: filters[key] === v ? null : v })}
          >
            {display(v)}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <WorkReels
        eyebrow={reelsEyebrow}
        heading={reelsHeading}
        reels={reels}
        available={new Set(options.industries)}
        onSelect={(industry) => {
          setFilters({ ...EMPTY, industry });
          setShown(PAGE);
          scrollToGrid();
        }}
      />

      {/* ---- filters + grid ---- */}
      <section
        data-signal="quiet"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="work-grid-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="work-grid-heading" className="visually-hidden">
            Case studies
          </h2>
          <div className="flex flex-col gap-4">
            {chipRow("Industry", "industry", options.industries)}
            {chipRow("Service", "service", options.services)}
            {chipRow("Engagement", "type", options.types)}
            {chipRow("Delivered by", "by", options.by, (v) => BY_LABEL[v] ?? v)}
            {filters.brand && (
              <p className="eyebrow flex flex-wrap items-center gap-2">
                <span>
                  <span className="tick">◉</span> Filtered by brand · {filters.brand}
                </span>
                <button
                  type="button"
                  className="chip"
                  onClick={() => update({ brand: null })}
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

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="card-surface group flex flex-col overflow-hidden rounded-xl"
              >
                <div className="relative">
                  {c.media?.asset ? (
                    <BlockImage
                      image={c.media}
                      ratio="4/3"
                      width={1200}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="rounded-none"
                    />
                  ) : (
                    <Placeholder
                      label={c.mediaLabel ?? "Campaign film · client-supplied"}
                      ratio="4/3"
                      className="rounded-none border-0"
                    />
                  )}
                  <AttributionBadge attribution={c.attribution} overlay />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="eyebrow">
                      <span className="tick">▸</span> {c.brand}
                    </p>
                    <p className="eyebrow">{c.engagementType ?? c.service}</p>
                  </div>
                  <h3 className="font-display text-h3 mt-2">{c.title}</h3>
                  <p className="mt-3 text-sm leading-body" style={{ color: "var(--ink-muted)" }}>
                    {c.insight}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                    {c.metrics.slice(0, 3).map((m) => (
                      <div key={m._key ?? m.label}>
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
                  <div className="mt-auto pt-6">
                    <span className="btn-ghost inline-flex px-4 py-2 text-xs group-hover:border-[var(--signal)]">
                      View Campaign <span className="btn-arrow">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShown((n) => n + PAGE)}
              >
                View more
                <span className="eyebrow ml-2">({remaining})</span>
              </button>
            </div>
          )}

          {results.length === 0 && (
            <div className="insight-frame mt-6 max-w-md">
              <p className="leading-body">
                No campaigns match that combination — try clearing a filter.
              </p>
            </div>
          )}
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
            {wall.map((b) => {
              const hasWork = caseStudies.some((c) => c.brand === b);
              const active = filters.brand === b;
              return hasWork ? (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setFilters({ ...EMPTY, brand: active ? null : b });
                    setShown(PAGE);
                    scrollToGrid();
                  }}
                  aria-pressed={active}
                  className="font-display text-3xl transition-opacity hover:opacity-100 md:text-4xl"
                  style={{ opacity: active ? 1 : 0.7 }}
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
