import { defineQuery } from "next-sanity";

/* GROQ for the talent roster. One projection shared by the list and the
   profile page so the two can never disagree about a field's shape. */

const talentFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  category,
  platforms[]{ platform, handle, url, audience },
  audience,
  region,
  location,
  managed,
  bio,
  "partners": coalesce(partners, []),
  "ventures": coalesce(ventures, []),
  featured,
  portrait{
    ...,
    "lqip": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
  "story": coalesce(story[]{ label, text }, []),
  seo
`;

const talentOrder = `order(featured desc, sortOrder asc, name asc)`;

export const rosterQuery = defineQuery(
  `*[_type == "talent" && defined(slug.current)] | ${talentOrder} { ${talentFields} }`,
);

export const talentBySlugQuery = defineQuery(
  `*[_type == "talent" && slug.current == $slug][0] { ${talentFields} }`,
);

export const talentSlugsQuery = defineQuery(
  `*[_type == "talent" && defined(slug.current)].slug.current`,
);

/* Sitemap needs only the address and when it last changed — projecting
   the whole document to throw it away would be wasteful, and the sitemap
   is regenerated on every talent publish. */
export const talentSitemapQuery = defineQuery(
  `*[_type == "talent" && defined(slug.current)] | order(name asc) {
    "slug": slug.current,
    _updatedAt
  }`,
);

/* ---------- Pages ---------- */

/* Images are projected with the metadata the renderer needs: lqip for the
   blur placeholder and the aspect ratio so a slot can reserve its space
   before the image arrives (CLS is a contractual threshold — SOW §6). */
const imageFields = /* groq */ `
  ...,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`;

/* Blocks come back whole (`...`), with per-type projections layered on
   for the fields that need resolving. A new block type needs a line here
   only if it references something. */
const pageFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  seo,
  blocks[]{
    ...,
    _type == "pageHero" => { aside{ ${imageFields} } },
    _type == "copyMedia" => { media{ ${imageFields} } }
  }
`;

export const pageBySlugQuery = defineQuery(
  `*[_type == "page" && slug.current == $slug][0] { ${pageFields} }`,
);

export const pageSlugsQuery = defineQuery(
  `*[_type == "page" && defined(slug.current)].slug.current`,
);

/* Sitemap: everything except pages an editor has deliberately hidden. */
export const pageSitemapQuery = defineQuery(
  `*[_type == "page" && defined(slug.current) && seo.noIndex != true] | order(slug.current asc) {
    "slug": slug.current,
    _updatedAt
  }`,
);
