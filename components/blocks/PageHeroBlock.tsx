import PageHero, { type HeroCta } from "@/components/PageHero";
import BlockImage from "./BlockImage";
import Placeholder from "@/components/Placeholder";
import InsightFrame from "./InsightFrame";
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

  /* Either a picture or a framed note. The image is the fallback when no
     choice has been recorded, so heroes authored before `asideKind`
     existed keep rendering what they always did. */
  const note =
    block.asideKind === "note" && block.asideNote?.text
      ? block.asideNote
      : undefined;

  /* The hero note IS an insight frame — same two styles, same rule: a
     bare line is set large, a labelled one small with its provenance
     under it. Sharing the component keeps the two from drifting. */
  const aside = note ? (
    <InsightFrame
      text={note.text}
      label={note.label}
      footnote={note.footnote}
      href={note.href}
      className="insight-frame"
    />
  ) : block.asideKind === "none" ? undefined : block.aside?.asset ? (
    <BlockImage
      image={block.aside}
      sizes="(max-width: 1024px) 100vw, 33vw"
      priority
    />
  ) : block.asideLabel ? (
    <Placeholder label={block.asideLabel} ratio="3/4" />
  ) : undefined;

  return (
    <PageHero
      eyebrow={block.eyebrow}
      title={block.title}
      kicker={block.kicker}
      lede={block.lede}
      ctas={ctas}
      outline={block.outline}
      aside={aside}
    />
  );
}
