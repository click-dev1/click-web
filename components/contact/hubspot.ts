/**
 * HUBSPOT FORM EMBED
 *
 * The questionnaire is a HubSpot form now: fields, copy, validation,
 * styling and the thank-you state all live in HubSpot's form editor, and
 * submissions land there directly. This file is the only place the site
 * knows which form — change the ids here and nowhere else.
 *
 * Both values are public: HubSpot puts them in the markup of every embed.
 */
export const HUBSPOT_FORM = {
  portalId: "5918623",
  formId: "ae20e534-55ba-4de9-9974-555da8eedd56",
  region: "na1",
} as const;

/** HubSpot's loader. It renders any `.hs-form-frame` it finds on the page
 *  and keeps watching the DOM for new ones, so a frame added when the
 *  modal opens is picked up without any imperative call. */
export const HUBSPOT_EMBED_SRC = `https://js.hsforms.net/forms/embed/${HUBSPOT_FORM.portalId}.js`;
