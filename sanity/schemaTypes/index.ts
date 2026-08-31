import type { SchemaTypeDefinition } from "sanity";
import { seoType } from "./objects/seo";
import { talentType } from "./talent";

/* Every type the Studio knows about. Documents first, shared objects
   after — order is cosmetic, but keep it readable. */
export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  talentType,
  // objects
  seoType,
];
