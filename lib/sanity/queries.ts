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
