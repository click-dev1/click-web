import { client } from "./client";
import { rosterQuery, talentBySlugQuery, talentSlugsQuery } from "./queries";
import type { Talent } from "./types";

/* Server-side accessors. Each fetch is tagged so a Sanity webhook can
   revalidate exactly the pages a talent edit touches. */
const tags = { next: { tags: ["talent"] } };

export const fetchRoster = () => client.fetch<Talent[]>(rosterQuery, {}, tags);

export const fetchTalent = (slug: string) =>
  client.fetch<Talent | null>(talentBySlugQuery, { slug }, tags);

export const fetchTalentSlugs = () =>
  client.fetch<string[]>(talentSlugsQuery, {}, tags);
