import { ArticlePage, articleMetadata, articleStaticParams } from "@/components/articles/routes";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => articleStaticParams("insight");

export async function generateMetadata({ params }: Props) {
  return articleMetadata("insight", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ArticlePage kind="insight" slug={(await params).slug} />;
}
