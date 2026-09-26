import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";
import { formatDate } from "@/lib/date";
import { cookieCategoryData, cookieTableData, processorsSentence } from "@/lib/cookie-policy";
import type { LegalPageDoc, RichText } from "@/lib/sanity/types";

/**
 * Renders one legal document from Sanity (sanity/schemaTypes/legalPage.ts).
 *
 * Every section heading becomes an anchor and the "On this page" list is
 * generated from them. The cookie table, categories and processors are
 * generated from lib/cookie-policy.ts wherever the text places a "Cookie
 * inventory" insert.
 *
 * `approved` (signed off by counsel) is internal: it decides noindex and
 * sitemap membership, and is never shown to a visitor.
 */
export default function LegalPage({ page }: { page: LegalPageDoc }) {
  const updated = `Last updated: ${formatDate(page.lastUpdated)}`;

  return (
    <>
      {page.approved && (
        <JsonLd nodes={[breadcrumbList([{ name: page.title, path: `/${page.slug}` }])]} />
      )}
      <PageHero eyebrow="Legal" title={page.title} lede={page.description} signal="quiet" />

      <section
        data-signal="settle"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-label={page.title}
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="On this page" className="legal-toc lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-3">
              <span className="tick">◉</span> On this page
            </p>
            <ol className="flex flex-col gap-1.5 text-sm">
              {page.sections.map((s) => (
                <li key={s._key}>
                  <a
                    href={`#${slugify(s.heading)}`}
                    className="opacity-75 transition-opacity hover:opacity-100"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
            <p className="font-data mt-6 text-[0.62rem] opacity-70">{updated}</p>
          </nav>

          <article className="legal-body max-w-3xl">
            {page.intro && page.intro.length > 0 && (
              <div className="legal-intro">
                <LegalText value={page.intro} />
              </div>
            )}

            {page.sections.map((s, i) => (
              <section
                key={s._key}
                id={slugify(s.heading)}
                className="legal-section"
                aria-labelledby={`${slugify(s.heading)}-h`}
              >
                <p className="eyebrow mb-2">
                  <span className="tick">{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h2 id={`${slugify(s.heading)}-h`} className="font-display text-h3">
                  {s.heading}
                </h2>
                <div className="legal-blocks">
                  <LegalText value={s.body ?? []} />
                </div>
              </section>
            ))}

            <p className="hairline-t font-data mt-16 pt-6 text-[0.62rem] opacity-70">
              {updated}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function LegalText({ value }: { value: RichText }) {
  return <PortableText value={value as never} components={components} />;
}

const LINK_CLASS = "underline underline-offset-4 transition-opacity hover:opacity-70";

/* Only web, email and on-site links become anchors — the schema refuses
   anything else, and this is the second lock. */
const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;

function anchor(href: string, label: ReactNode, key?: number): ReactNode {
  if (!SAFE_HREF.test(href)) return label;
  if (href.startsWith("/")) {
    return (
      <Link key={key} href={href} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }
  const external = /^https?:/i.test(href);
  return (
    <a
      key={key}
      href={href}
      className={LINK_CLASS}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

function Table({ columns, rows }: { columns?: string[]; rows: string[][] }) {
  return (
    <div className="legal-table-wrap">
      <table className="legal-table">
        {columns && columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>{linkify(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-body">{children}</p>,
    h3: ({ children }) => <h3 className="font-display mt-6 text-lg">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="legal-list">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-body">
        <span aria-hidden="true">▸</span>
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => anchor(value?.href ?? "", children),
  },
  types: {
    legalTable: ({ value }: { value: { columns?: string[]; rows?: { cells?: string[] }[] } }) => (
      <Table columns={value.columns} rows={(value.rows ?? []).map((r) => r.cells ?? [])} />
    ),
    cookieInventory: ({ value }: { value: { show?: string } }) => {
      if (value.show === "table") return <Table {...cookieTableData()} />;
      if (value.show === "processors")
        return <p className="leading-body">{processorsSentence()}</p>;
      if (value.show === "categories")
        return (
          <>
            {cookieCategoryData().map((c) => (
              <Fragment key={c.heading}>
                <h3 className="font-display mt-6 text-lg">{c.heading}</h3>
                <p className="leading-body">{c.text}</p>
              </Fragment>
            ))}
          </>
        );
      return null;
    },
  },
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Table cells are plain strings: bare emails and URLs become links.
   Trailing sentence punctuation is left outside the link. */
const TOKEN =
  /([\w.+-]+@[\w-]+\.[\w.-]+\w)|(https?:\/\/[^\s<>"']+?)(?=[.,;:)]*(?:\s|$))/g;

function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const [whole, email, url] = m;
    out.push(email !== undefined ? anchor(`mailto:${email}`, email, key++) : anchor(url, url, key++));
    last = start + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
