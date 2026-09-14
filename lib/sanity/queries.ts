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


/* ---------- Cards used inside featured blocks ---------- */

/* Deliberately smaller than the full projections: a featured row shows a
   brand, a headline, an insight line and up to three figures. Pulling
   whole documents to render a card would bloat every page that has one. */
const caseStudyCardFields = /* groq */ `
  _id,
  brand,
  title,
  "slug": slug.current,
  service,
  industry,
  insight,
  "metrics": coalesce(metrics[0...3]{ _key, value, label }, []),
  proofLine,
  media{ ${imageFields} },
  mediaLabel
`;

const talentCardFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  category,
  audience,
  portrait{ ${imageFields} }
`;

/* Both featured blocks resolve their picks AND the automatic fallback,
   and the renderer chooses. Doing the choosing in GROQ would mean a
   `select()` around a subquery that reaches back out to the block for its
   limit — correct, but fragile enough that the next person to touch it
   would break it silently. The fallback lists are small and this is a
   build-time query. */
const personCardFields = /* groq */ `
  _id,
  name,
  role,
  photo{ ${imageFields} },
  perspective,
  recognition
`;

const featuredWorkProjection = /* groq */ `{
  ...,
  "picked": picks[]->{ ${caseStudyCardFields} },
  "auto": *[_type == "caseStudy" && featured == true && defined(slug.current)]
    | order(sortOrder asc, brand asc)[0...6]{ ${caseStudyCardFields} }
}`;

const featuredTalentProjection = /* groq */ `{
  ...,
  "picked": picks[]->{ ${talentCardFields} },
  "auto": *[_type == "talent" && featured == true && defined(slug.current)]
    | order(sortOrder asc, name asc)[0...8]{ ${talentCardFields} }
}`;

/* The team grid's fallback is the WHOLE team, not a featured subset:
   adding someone to the team should add them to the About page. */
const teamGridProjection = /* groq */ `{
  ...,
  "picked": picks[]->{ ${personCardFields} },
  "auto": *[_type == "person"] | order(sortOrder asc, name asc){ ${personCardFields} }
}`;

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
    _type == "copyMedia" => { media[]{ ${imageFields} } },
    _type == "cardGrid" => { cards[]{ ..., image{ ${imageFields} } } },
    _type == "featuredWork" => ${featuredWorkProjection},
    _type == "featuredTalent" => ${featuredTalentProjection},
    _type == "mediaBlock" => { images[]{ ${imageFields} } },
    _type == "teamGrid" => ${teamGridProjection},
    _type == "activationScorecard" => { media{ ${imageFields} } }
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

/* ---------- Case studies ---------- */

const caseStudyFields = /* groq */ `
  _id,
  brand,
  title,
  "slug": slug.current,
  service,
  industry,
  "platforms": coalesce(platforms, []),
  insight,
  built,
  resultsIntro,
  "metrics": coalesce(metrics[]{ _key, value, label }, []),
  proofLine,
  figuresSource,
  media{ ${imageFields} },
  mediaLabel,
  featured,
  seo
`;

const caseStudyOrder = `order(featured desc, sortOrder asc, brand asc)`;

export const caseStudiesQuery = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current)] | ${caseStudyOrder} { ${caseStudyFields} }`,
);

export const caseStudyBySlugQuery = defineQuery(
  `*[_type == "caseStudy" && slug.current == $slug][0] { ${caseStudyFields} }`,
);

export const caseStudySlugsQuery = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current)].slug.current`,
);

/* Sitemap: published, not hidden, and not still awaiting the client's
   confirmation of its figures. That last clause is what
   isCampaignPublishable() did in content/site.ts — an unconfirmed
   campaign still renders for review, it just stays out of search. */
export const caseStudySitemapQuery = defineQuery(
  `*[_type == "caseStudy" && defined(slug.current) && seo.noIndex != true && figuresSource != "pending"] | ${caseStudyOrder} {
    "slug": slug.current,
    _updatedAt
  }`,
);

/* ---------- Site settings and navigation ---------- */

/* Both are singletons with a fixed id, so they are fetched by id rather
   than by a filter that could quietly match a second document. */
export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0] {
    email,
    "socials": coalesce(socials[]{ platform, url }, []),
    legalName,
    footerTagline
  }`,
);

export const navigationQuery = defineQuery(
  `*[_type == "navigation" && _id == "navigation"][0] {
    "main": coalesce(main[]{
      _type, _key, label, href,
      _type == "navGroup" => { "children": children[]{ label, href } }
    }, []),
    "footerColumns": coalesce(footerColumns[]{
      _key, label, "links": links[]{ label, href, external }
    }, [])
  }`,
);
