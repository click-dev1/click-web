import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleIndex from "./ArticleIndex";
import ArticleView from "./ArticleView";
import { urlFor } from "@/lib/sanity/image";
import {
  ARTICLE_SECTIONS,
  articlePath,
  fetchArticle,
  fetchArticleSlugs,
  fetchArticles,
} from "@/lib/sanity/article";
import type { ArticleKind } from "@/lib/sanity/types";

/* Everything /insights and /news have in common, so the route files are
   one line each and the two sections cannot drift apart. */

const COPY: Record<ArticleKind, { title: string; lede: string; description: string }> = {
  insight: {
    title: "What the audience is telling us.",
    lede: "Findings from our audience intelligence, and what they mean for brands working with creators.",
    description: "Insights from CLICK on creators, audiences and influencer marketing.",
  },
  news: {
    title: "News from CLICK.",
    lede: "Announcements, partnerships and what's new across CLICK and its creators.",
    description: "The latest news from CLICK.",
  },
};

export async function indexMetadata(kind: ArticleKind): Promise<Metadata> {
  const { path, label } = ARTICLE_SECTIONS[kind];
  const empty = (await fetchArticles(kind)).length === 0;
  return {
    title: label,
    description: COPY[kind].description,
    alternates: { canonical: path },
    /* An empty index is thin content: keep it out of search until the
       first piece is published. Links on it are still followed. */
    ...(empty ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function IndexPage({ kind }: { kind: ArticleKind }) {
  const articles = await fetchArticles(kind);
  return <ArticleIndex kind={kind} articles={articles} {...COPY[kind]} />;
}

export async function articleStaticParams(kind: ArticleKind) {
  const slugs = await fetchArticleSlugs(kind);
  return slugs.map((slug) => ({ slug }));
}

export async function articleMetadata(kind: ArticleKind, slug: string): Promise<Metadata> {
  const a = await fetchArticle(kind, slug);
  if (!a) return { title: ARTICLE_SECTIONS[kind].label };
  const shareImage = a.seo?.image?.asset ? a.seo.image : a.mainImage;
  return {
    title: a.seo?.title ?? a.title,
    description: a.seo?.description ?? a.excerpt,
    alternates: { canonical: articlePath(a) },
    openGraph: {
      type: "article",
      title: a.seo?.title ?? a.title,
      description: a.seo?.description ?? a.excerpt,
      publishedTime: a.publishedAt,
      modifiedTime: a._updatedAt,
      ...(shareImage?.asset
        ? { images: [urlFor(shareImage).width(1200).height(630).fit("crop").url()] }
        : {}),
    },
    ...(a.seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function ArticlePage({ kind, slug }: { kind: ArticleKind; slug: string }) {
  const [article, all] = await Promise.all([fetchArticle(kind, slug), fetchArticles(kind)]);
  if (!article) notFound();
  const more = all.filter((a) => a.slug !== slug).slice(0, 3);
  return <ArticleView article={article} more={more} />;
}
