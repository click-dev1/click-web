import { PortableText, type PortableTextComponents } from "next-sanity";
import type { RichText as RichTextValue } from "@/lib/sanity/types";

/* Body copy from the CMS, rendered in the site's own type scale rather
   than browser defaults. The schema only offers paragraphs, bullets,
   bold, italic and links, so this list is the whole surface. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
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
};

export default function RichText({ value }: { value: RichTextValue }) {
  return (
    <div className="flex flex-col gap-5 text-lg leading-body">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
