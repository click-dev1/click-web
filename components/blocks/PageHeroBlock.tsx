import PageHero, { type HeroCta } from "@/components/PageHero";
import BlockImage from "./BlockImage";
import Placeholder from "@/components/Placeholder";
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

  const aside = note ? (
    <div className="insight-frame">
      {note.label && (
        <p className="eyebrow mb-2">
          <span className="tick">◉</span> {note.label}
        </p>
      )}
      <p className="text-sm leading-body">{note.text}</p>
      {note.footnote && <p className="eyebrow mt-3">{note.footnote}</p>}
    </div>
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
