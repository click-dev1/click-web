import type { SchemaTypeDefinition } from "sanity";
import { seoType } from "./objects/seo";
import { ctaType } from "./objects/cta";
import { metricType } from "./objects/metric";
import { pageHeroType } from "./objects/blocks/pageHero";
import { copyMediaType } from "./objects/blocks/copyMedia";
import { ctaBannerType } from "./objects/blocks/ctaBanner";
import { metricRowType } from "./objects/blocks/metricRow";
import { capabilityListType } from "./objects/blocks/capabilityList";
import { cardGridType } from "./objects/blocks/cardGrid";
import { pageType } from "./page";
import { talentType } from "./talent";

/* Every type the Studio knows about. Documents first, then the section
   blocks a page is assembled from, then shared objects.

   Adding a block: define it here AND in the `blocks` array of page.ts AND
   give it a renderer in components/blocks/registry.tsx. A block missing
   from any of the three is either invisible to editors or renders as
   nothing. */
export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  pageType,
  talentType,
  // section blocks
  pageHeroType,
  copyMediaType,
  metricRowType,
  capabilityListType,
  cardGridType,
  ctaBannerType,
  // shared objects
  ctaType,
  metricType,
  seoType,
];
