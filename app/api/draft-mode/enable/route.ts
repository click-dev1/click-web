import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

/**
 * Turns on draft mode for an editor previewing from the Studio.
 *
 * The Studio's Presentation tool opens this with a short-lived secret it
 * has just written to the dataset; `defineEnableDraftMode` checks that
 * secret against Sanity (with the read token) before setting Next's
 * draft-mode cookie, and only ever redirects to a path on this site. There
 * is no shared secret in an environment variable to leak or rotate.
 */
export const { GET } = defineEnableDraftMode({ client });
