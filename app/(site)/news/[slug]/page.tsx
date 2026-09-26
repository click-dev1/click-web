import { ArticlePage, articleMetadata, articleStaticParams } from "@/components/articles/routes";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => articleStaticParams("news");

export async function generateMetadata({ params }: Props) {
  return articleMetadata("news", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ArticlePage kind="news" slug={(await params).slug} />;
}
