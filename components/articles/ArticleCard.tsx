import Link from "next/link";
import BlockImage from "@/components/blocks/BlockImage";
import { formatDate } from "@/lib/date";
import { articlePath } from "@/lib/sanity/article";
import type { ArticleCard as Card } from "@/lib/sanity/types";

/* A picture card when there is a lead image, a text card when there is
   not — same rule as the featured-work row: no empty frames. */
export default function ArticleCard({ article }: { article: Card }) {
  return (
    <Link
      href={articlePath(article)}
      data-reveal
      className="card-surface group flex flex-col overflow-hidden rounded-xl"
    >
      {article.mainImage?.asset && (
        <BlockImage
          image={article.mainImage}
          ratio="16/9"
          width={1200}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="rounded-none"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="eyebrow">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        <h3 className="font-display text-2xl">{article.title}</h3>
        <p className="leading-body" style={{ color: "var(--ink-muted)" }}>
          {article.excerpt}
        </p>
        <span className="mt-auto pt-2 text-sm">
          Read <span className="btn-arrow">→</span>
        </span>
      </div>
    </Link>
  );
}
