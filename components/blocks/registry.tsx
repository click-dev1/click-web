import PageHeroBlock from "./PageHeroBlock";
import CopyMedia from "./CopyMedia";
import CtaBanner from "./CtaBanner";
import type { PageBlock } from "@/lib/sanity/types";

/**
 * Renders a page's sections, top to bottom.
 *
 * ADDING A BLOCK: give it a schema, add it to the `blocks` array in
 * sanity/schemaTypes/page.ts, and add a case here. A block missing from
 * any of the three is either invisible to editors or renders as nothing.
 *
 * The `data-signal` each section sends to the background canvas is
 * DERIVED, not chosen. Editors control copy, images and calls to action
 * (SOW §4); the page's vertical rhythm is not theirs to get wrong. A hero
 * always opens with "overlap", a closing CTA always settles, and the
 * sections between cycle so the canvas keeps moving however many an
 * editor adds.
 */
const MIDDLE_SIGNALS = ["flow", "divide", "quiet"] as const;

function signalFor(block: PageBlock, index: number): string {
  if (block._type === "pageHero") return "overlap";
  if (block._type === "ctaBanner") return "settle";
  return MIDDLE_SIGNALS[index % MIDDLE_SIGNALS.length];
}

export default function Blocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const signal = signalFor(block, i);
        switch (block._type) {
          case "pageHero":
            return <PageHeroBlock key={block._key} block={block} />;
          case "copyMedia":
            return <CopyMedia key={block._key} block={block} signal={signal} />;
          case "ctaBanner":
            return <CtaBanner key={block._key} block={block} signal={signal} />;
          default:
            /* An unknown block means the CMS has a type this deployment
               doesn't render yet. Skip it rather than crash the page. */
            return null;
        }
      })}
    </>
  );
}
