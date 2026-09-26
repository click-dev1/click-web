import Link from "next/link";
import BlockImage from "@/components/blocks/BlockImage";
import JsonLd from "@/components/JsonLd";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import { formatDate } from "@/lib/date";
import { articleJsonLd } from "@/lib/jsonld";
import { ARTICLE_SECTIONS } from "@/lib/sanity/article";
import type { Article, ArticleCard as Card } from "@/lib/sanity/types";

/**
 * One insight or news story. The heading is not split-animated like the
 * marketing pages': a long headline is the LCP element here, and the split
 * animation is what holds mobile LCP over budget elsewhere (PERFORMANCE.md).
 */
export default function ArticleView({ article, more }: { article: Article; more: Card[] }) {
  const { path, label } = ARTICLE_SECTIONS[article.kind];
  const byline = article.author
    ? [article.author.name, article.author.role].filter(Boolean).join(", ")
    : "CLICK";

  return (
    <>
      {!article.seo?.noIndex && <JsonLd nodes={articleJsonLd(article)} />}

      <article>
        <header
          data-signal="overlap"
          className="relative z-10 px-5 pt-36 pb-12 md:px-8"
        >
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow pill anim-fade-up mb-6">
              <Link href={path} className="transition-opacity hover:opacity-70">
                {label}
              </Link>{" "}
              <span className="tick">/</span>{" "}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </p>
            <h1 className="font-display text-h2 anim-fade-up">{article.title}</h1>
            <p
              className="anim-fade-up mt-6 text-xl leading-body"
              style={{ color: "var(--ink-muted)", animationDelay: "0.15s" }}
            >
              {article.excerpt}
            </p>
            <p className="eyebrow anim-fade-up mt-8" style={{ animationDelay: "0.25s" }}>
              By {byline}
            </p>
          </div>
        </header>

        {article.mainImage?.asset && (
          <div className="relative z-10 px-5 md:px-8">
            <figure className="mx-auto max-w-6xl">
              <BlockImage
                image={article.mainImage}
                width={2000}
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="rounded-xl"
                priority
              />
              {article.mainImage.credit && (
                <figcaption className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
                  {article.mainImage.credit}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        <div data-signal="settle" className="relative z-10 px-5 py-16 md:px-8">
          <div className="mx-auto max-w-3xl">
            <ArticleBody value={article.body} />
          </div>
        </div>
      </article>

      <section
        data-signal="flow"
        className="hairline-t relative z-10 px-5 py-20 md:px-8"
        aria-labelledby="more-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="more-heading" className="font-display text-h3">
              {more.length ? `More ${label.toLowerCase()}` : `All ${label.toLowerCase()}`}
            </h2>
            <Link href={path} className="text-sm underline underline-offset-4">
              Back to {label.toLowerCase()}
            </Link>
          </div>
          {more.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
