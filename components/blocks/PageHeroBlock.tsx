import PageHero, { type HeroCta } from "@/components/PageHero";
import BlockImage from "./BlockImage";
import type { PageHeroBlock as Block } from "@/lib/sanity/types";

/* Adapter, not a second hero. The bespoke pages already render
   components/PageHero; this maps the editor's fields onto it so a CMS
   page and a hand-built page are the same markup. */
export default function PageHeroBlock({ block }: { block: Block }) {
  const ctas: HeroCta[] = (block.ctas ?? []).map((c) => ({
    label: c.label,
    primary: c.style !== "ghost",
    ...(c.destination === "modal" ? { modal: true } : { href: c.href }),
  }));

  return (
    <PageHero
      eyebrow={block.eyebrow}
      title={block.title}
      kicker={block.kicker}
      lede={block.lede}
      ctas={ctas}
      outline={block.outline}
      aside={
        block.aside?.asset ? (
          <BlockImage
            image={block.aside}
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority
          />
        ) : undefined
      }
    />
  );
}
