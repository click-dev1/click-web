import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";
import { formatDate } from "@/lib/date";
import { fetchPress } from "@/lib/sanity/article";

/* Coverage of CLICK elsewhere. Each item links out to the original — the
   site lists the coverage, it never republishes it. Same empty-state rule
   as /insights: noindexed until there is something to list. */

export async function generateMetadata(): Promise<Metadata> {
  const empty = (await fetchPress()).length === 0;
  return {
    title: "Press",
    description: "CLICK in the press: coverage of our work, our creators and our people.",
    alternates: { canonical: "/press" },
    ...(empty ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function PressPage() {
  const items = await fetchPress();

  return (
    <>
      <JsonLd nodes={[breadcrumbList([{ name: "Press", path: "/press" }])]} />
      <PageHero
        eyebrow="Press"
        title="CLICK in the press."
        lede="Coverage of our work, our creators and our people. Each link opens the original article."
      />

      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="press-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2 id="press-heading" className="visually-hidden">
            Press coverage
          </h2>
          {items.length ? (
            <ul className="flex flex-col">
              {items.map((p) => (
                <li key={p._id} className="hairline-t first:border-t-0">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-reveal
                    className="group grid gap-3 py-8 md:grid-cols-[12rem_1fr] md:gap-10"
                  >
                    <p className="eyebrow">
                      {p.outlet}
                      <br />
                      <time dateTime={p.publishedAt} style={{ color: "var(--ink-muted)" }}>
                        {formatDate(p.publishedAt)}
                      </time>
                    </p>
                    <div>
                      <p className="font-display text-2xl transition-opacity group-hover:opacity-70">
                        {p.title} <span className="btn-arrow" aria-hidden="true">↗</span>
                        <span className="visually-hidden"> (opens {p.outlet} in a new tab)</span>
                      </p>
                      {p.excerpt && (
                        <p className="mt-3 leading-body" style={{ color: "var(--ink-muted)" }}>
                          “{p.excerpt}”
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-2xl">
              <p className="font-display text-h3">No coverage listed yet.</p>
              <p className="mt-4 text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
                For press enquiries, get in touch.
              </p>
              <Link href="/contact" className="btn-primary mt-8 inline-flex">
                Contact us <span className="btn-arrow">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
