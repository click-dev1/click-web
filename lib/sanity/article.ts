import { sanityFetch } from "./client";
import {
  articleBySlugQuery,
  articleSitemapQuery,
  articleSlugsQuery,
  articlesByKindQuery,
  pressQuery,
} from "./queries";
import type { Article, ArticleCard, ArticleKind, PressItem } from "./types";

/* Server-side accessors for insights, news and press. Same contract as
   ./talent: published reads are cached and tagged with the document type
   so the webhook can invalidate them.

   Articles are also tagged "person": the byline is a reference to a team
   member, so renaming someone must rebuild the pieces they wrote.

   Unlike talent, an empty result is a legitimate state — CLICK may not
   have published anything yet — so nothing here asserts population. */
const articleTags = ["article", "person"];
const pressTags = ["pressItem"];

export const fetchArticles = (kind: ArticleKind) =>
  sanityFetch<ArticleCard[]>(articlesByKindQuery, { kind }, articleTags);

export const fetchArticle = (kind: ArticleKind, slug: string) =>
  sanityFetch<Article | null>(articleBySlugQuery, { kind, slug }, articleTags);

export const fetchArticleSlugs = (kind: ArticleKind) =>
  sanityFetch<string[]>(articleSlugsQuery, { kind }, articleTags);

export const fetchArticleSitemap = () =>
  sanityFetch<{ kind: ArticleKind; slug: string; _updatedAt: string }[]>(
    articleSitemapQuery,
    {},
    articleTags,
  );

export const fetchPress = () => sanityFetch<PressItem[]>(pressQuery, {}, pressTags);

/** Where each kind lives, and what its index is called. */
export const ARTICLE_SECTIONS: Record<ArticleKind, { path: string; label: string }> = {
  insight: { path: "/insights", label: "Insights" },
  news: { path: "/news", label: "News" },
};

export const articlePath = (a: { kind: ArticleKind; slug: string }) =>
  `${ARTICLE_SECTIONS[a.kind].path}/${a.slug}`;
