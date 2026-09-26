import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ArticleCard from "./ArticleCard";
import { breadcrumbList } from "@/lib/jsonld";
import { ARTICLE_SECTIONS } from "@/lib/sanity/article";
import type { ArticleCard as Card, ArticleKind } from "@/lib/sanity/types";

/**
 * /insights and /news: every published piece of one kind, newest first.
 *
 * Empty is a real state before CLICK publishes. The page then says so
 * plainly and points at the work, and the route is noindexed and left out
 * of the sitemap (see the page files) — an empty index is thin content.
 */
export default function ArticleIndex({
  kind,
  title,
  lede,
  articles,
}: {
  kind: ArticleKind;
  title: string;
  lede: string;
  articles: Card[];
}) {
  const { path, label } = ARTICLE_SECTIONS[kind];

  return (
    <>
      <JsonLd nodes={[breadcrumbList([{ name: label, path }])]} />
      <PageHero eyebrow={label} title={title} lede={lede} />

      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-24 md:px-8"
        aria-labelledby="index-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="index-heading" className="visually-hidden">
            All {label.toLowerCase()}
          </h2>
          {articles.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl">
              <p className="font-display text-h3">Nothing published here yet.</p>
              <p className="mt-4 text-lg leading-body" style={{ color: "var(--ink-muted)" }}>
                In the meantime, the clearest record of how we think is the work
                itself.
              </p>
              <Link href="/work" className="btn-primary mt-8 inline-flex">
                See the work <span className="btn-arrow">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
