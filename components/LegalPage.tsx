import type { ReactNode } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import type { LegalBlock, LegalPageContent } from "@/content/legal";

/**
 * Renders one legal document from its typed blocks (content/legal.ts).
 *
 * Stored text stays plain prose: emails, URLs and `[label](/route)` links
 * are turned into anchors here, so nobody edits JSX to change a policy.
 * Every section heading becomes an anchor and the "On this page" list is
 * generated from them.
 *
 * A document's `status` (content/legal.ts) is internal: it decides
 * noindex and sitemap membership, and is never shown to a visitor.
 */
export default function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <>
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
                <li key={s.heading}>
                  <a
                    href={`#${slugify(s.heading)}`}
                    className="opacity-75 transition-opacity hover:opacity-100"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
            <p className="font-data mt-6 text-[0.62rem] opacity-70">{page.updated}</p>
          </nav>

          <article className="legal-body max-w-3xl">
            {page.intro && <div className="legal-intro">{page.intro.map(renderBlock)}</div>}

            {page.sections.map((s, i) => (
              <section
                key={s.heading}
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
                <div className="legal-blocks">{s.blocks.map(renderBlock)}</div>
              </section>
            ))}

            <p className="hairline-t font-data mt-16 pt-6 text-[0.62rem] opacity-70">
              {page.updated}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function renderBlock(block: LegalBlock, i: number): ReactNode {
  switch (block.type) {
    case "text":
      return (
        <p key={i} className="leading-body">
          {linkify(block.text)}
        </p>
      );
    case "subheading":
      return (
        <h3 key={i} className="font-display mt-6 text-lg">
          {linkify(block.text)}
        </h3>
      );
    case "list":
      return (
        <ul key={i} className="legal-list">
          {block.items.map((item, j) => (
            <li key={j} className="leading-body">
              <span aria-hidden="true">▸</span>
              <span>{linkify(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="legal-table-wrap">
          <table className="legal-table">
            {block.columns && (
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, r) => (
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
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* [label](href) · bare email · bare URL. Trailing sentence punctuation is
   left outside the link. */
const TOKEN =
  /\[([^\]]+)\]\(([^)\s]+)\)|([\w.+-]+@[\w-]+\.[\w.-]+\w)|(https?:\/\/[^\s<>"']+?)(?=[.,;:)]*(?:\s|$))/g;

function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const [whole, label, href, email, url] = m;
    if (label !== undefined) out.push(anchor(href, label, key++));
    else if (email !== undefined) out.push(anchor(`mailto:${email}`, email, key++));
    else if (url !== undefined) out.push(anchor(url, url, key++));
    last = start + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function anchor(href: string, label: string, key: number): ReactNode {
  const cls = "underline underline-offset-4 transition-opacity hover:opacity-70";
  if (href.startsWith("/")) {
    return (
      <Link key={key} href={href} className={cls}>
        {label}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      key={key}
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}
