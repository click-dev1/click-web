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
import { featuredWorkType } from "./objects/blocks/featuredWork";
import { featuredTalentType } from "./objects/blocks/featuredTalent";
import { mediaBlockType } from "./objects/blocks/mediaBlock";
import { teamGridType } from "./objects/blocks/teamGrid";
import { timelineType } from "./objects/blocks/timeline";
import { recognitionType } from "./objects/blocks/recognition";
import { activationScorecardType } from "./objects/blocks/activationScorecard";
import { splitCopyType } from "./objects/blocks/splitCopy";
import { journeySequenceType } from "./objects/blocks/journeySequence";
import { journeyPanelsType, journeyPanelType } from "./objects/blocks/journeyPanels";
import { contactFormType } from "./objects/blocks/contactForm";
import { linkChipsType } from "./objects/blocks/linkChips";
import { pageType } from "./page";
import { talentType } from "./talent";
import { caseStudyType } from "./caseStudy";
import { personType } from "./person";
import { siteSettingsType } from "./siteSettings";
import { navigationType } from "./navigation";
import { homePageType } from "./homePage";
import { workPageType } from "./workPage";
import { articleType } from "./article";
import { pressItemType } from "./pressItem";

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
  caseStudyType,
  personType,
  siteSettingsType,
  navigationType,
  homePageType,
  workPageType,
  articleType,
  pressItemType,
  // section blocks
  pageHeroType,
  copyMediaType,
  metricRowType,
  capabilityListType,
  cardGridType,
  featuredWorkType,
  featuredTalentType,
  mediaBlockType,
  teamGridType,
  timelineType,
  recognitionType,
  activationScorecardType,
  splitCopyType,
  journeySequenceType,
  journeyPanelsType,
  contactFormType,
  linkChipsType,
  ctaBannerType,
  // shared objects
  ctaType,
  metricType,
  journeyPanelType,
  seoType,
];
