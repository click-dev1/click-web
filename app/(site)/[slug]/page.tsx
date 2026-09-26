import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/blocks/registry";
import { fetchPage, fetchPageSlugs } from "@/lib/sanity/page";
import { fetchSiteSettings } from "@/lib/sanity/settings";
import { urlFor } from "@/lib/sanity/image";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";

/**
 * Any page CLICK assembles in the CMS.
 *
 * This route is the last one Next tries: every hand-built page
 * (/about, /work, /talent …) is a static route and wins over this dynamic
 * one, so a CMS page can never shadow them. That also means an editor who
 * gives a page the slug "about" gets a page that builds but is
 * unreachable — worth a validation rule once the bespoke pages migrate
 * onto this type.
 */
export async function generateStaticParams() {
  const slugs = await fetchPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPage(slug);
  if (!page) return {};

  const { seo } = page;
  const ogImage = seo?.image?.asset
    ? urlFor(seo.image).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: seo?.title ?? page.title,
    description: seo?.description,
    alternates: { canonical: `/${page.slug}` },
    ...(seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
    ...(ogImage ? { openGraph: { images: [ogImage] } } : {}),
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    fetchPage(slug),
    fetchSiteSettings(),
  ]);
  if (!page) notFound();

  return (
    <>
      {!page.seo?.noIndex && (
        <JsonLd nodes={[breadcrumbList([{ name: page.title, path: `/${page.slug}` }])]} />
      )}
      <Blocks blocks={page.blocks} settings={settings} />
    </>
  );
}
