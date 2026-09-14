import PageHeroBlock from "./PageHeroBlock";
import CopyMedia from "./CopyMedia";
import MetricRow from "./MetricRow";
import CapabilityList from "./CapabilityList";
import CardGrid from "./CardGrid";
import FeaturedWork from "./FeaturedWork";
import FeaturedTalent from "./FeaturedTalent";
import MediaBand from "./MediaBand";
import TeamGrid from "./TeamGrid";
import Timeline from "./Timeline";
import Recognition from "./Recognition";
import ActivationScorecard from "./ActivationScorecard";
import SplitCopy from "./SplitCopy";
import JourneySequence from "./JourneySequence";
import JourneyPanels from "./JourneyPanels";
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
  /* Count the middles from the first middle, not from the top of the
     page: the cycle has to open on "flow" the way the hand-built pages
     do. Using the block's absolute index started it on "divide" whenever
     a page opened with a hero, which is every page. */
  const middleIndex = index - 1;
  return MIDDLE_SIGNALS[middleIndex % MIDDLE_SIGNALS.length];
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
          case "metricRow":
            return <MetricRow key={block._key} block={block} signal={signal} />;
          case "capabilityList":
            return (
              <CapabilityList key={block._key} block={block} signal={signal} />
            );
          case "cardGrid":
            return <CardGrid key={block._key} block={block} signal={signal} />;
          case "featuredWork":
            return (
              <FeaturedWork key={block._key} block={block} signal={signal} />
            );
          case "featuredTalent":
            return (
              <FeaturedTalent key={block._key} block={block} signal={signal} />
            );
          case "mediaBlock":
            return <MediaBand key={block._key} block={block} signal={signal} />;
          case "teamGrid":
            return <TeamGrid key={block._key} block={block} signal={signal} />;
          case "timeline":
            return <Timeline key={block._key} block={block} signal={signal} />;
          case "recognition":
            return (
              <Recognition key={block._key} block={block} signal={signal} />
            );
          case "activationScorecard":
            return (
              <ActivationScorecard
                key={block._key}
                block={block}
                signal={signal}
              />
            );
          case "splitCopy":
            return <SplitCopy key={block._key} block={block} signal={signal} />;
          case "journeySequence":
            return (
              <JourneySequence key={block._key} block={block} signal={signal} />
            );
          case "journeyPanels":
            return (
              <JourneyPanels key={block._key} block={block} signal={signal} />
            );
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
