import { client, previewDrafts } from "./client";
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
   so the webhook can invalidate them; draft reads pass no cache directive.

   Articles are also tagged "person": the byline is a reference to a team
   member, so renaming someone must rebuild the pieces they wrote.

   Unlike talent, an empty result is a legitimate state — CLICK may not
   have published anything yet — so nothing here asserts population. */
const articleRead = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["article", "person"] } };
const pressRead = previewDrafts
  ? {}
  : { next: { revalidate: 3600, tags: ["pressItem"] } };

export const fetchArticles = (kind: ArticleKind) =>
  client.fetch<ArticleCard[]>(articlesByKindQuery, { kind }, articleRead);

export const fetchArticle = (kind: ArticleKind, slug: string) =>
  client.fetch<Article | null>(articleBySlugQuery, { kind, slug }, articleRead);

export const fetchArticleSlugs = (kind: ArticleKind) =>
  client.fetch<string[]>(articleSlugsQuery, { kind }, articleRead);

export const fetchArticleSitemap = () =>
  client.fetch<{ kind: ArticleKind; slug: string; _updatedAt: string }[]>(
    articleSitemapQuery,
    {},
    articleRead,
  );

export const fetchPress = () => client.fetch<PressItem[]>(pressQuery, {}, pressRead);

/** Where each kind lives, and what its index is called. */
export const ARTICLE_SECTIONS: Record<ArticleKind, { path: string; label: string }> = {
  insight: { path: "/insights", label: "Insights" },
  news: { path: "/news", label: "News" },
};

export const articlePath = (a: { kind: ArticleKind; slug: string }) =>
  `${ARTICLE_SECTIONS[a.kind].path}/${a.slug}`;
