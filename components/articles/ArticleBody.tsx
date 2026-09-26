import { PortableText, type PortableTextComponents } from "next-sanity";
import BlockImage from "@/components/blocks/BlockImage";
import type { RichText, SanityImage } from "@/lib/sanity/types";

/* Only web, email and on-site links become anchors. The schema already
   refuses anything else; this is the second lock, because a link that
   reaches the page as `javascript:` would run on click. */
const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="font-display text-h3 mt-6">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-2xl mt-4">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="font-display text-2xl border-l-2 pl-6" style={{ borderColor: "var(--signal)" }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "";
      if (!SAFE_HREF.test(href)) return <>{children}</>;
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="underline underline-offset-4"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    bodyImage: ({ value }: { value: SanityImage & { caption?: string } }) =>
      value?.asset ? (
        <figure className="my-4">
          <BlockImage image={value} width={1600} sizes="(min-width: 768px) 768px, 100vw" />
          {value.caption && (
            <figcaption className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

/** The body of an insight or news story, in the site's type scale. */
export default function ArticleBody({ value }: { value: RichText }) {
  return (
    <div className="flex flex-col gap-6 text-lg leading-body">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
