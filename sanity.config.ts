import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { locations } from "./sanity/presentation";

/* Sanity Studio — the editing dashboard. It is a React app that lives in
   this repo and is served by Next at /studio (app/studio/[[...tool]]), so
   there is exactly one deployment and one domain for CLICK to know about.
   The schema in ./sanity/schemaTypes is what turns this into CLICK's CMS:
   it defines both the forms editors see and the shape of the data the
   site reads. */
export default defineConfig({
  name: "click-web",
  title: "CLICK",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    /* Draft preview: the site, beside the form, showing unpublished
       changes. It opens /api/draft-mode/enable with a short-lived secret
       it writes to the dataset; the site checks that secret before
       showing drafts. Same origin as the Studio, so no extra CORS. */
    presentationTool({
      title: "Preview",
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: { locations },
    }),
    /* GROQ playground — for developers, harmless for editors. */
    visionTool({ defaultApiVersion: apiVersion }),
    /* Video, for the /work industry reels. Editors upload in the Studio;
       Mux transcodes and streams it (adaptive quality, so a phone gets a
       phone-sized file). The API token is entered once in the Studio and
       stored in the dataset as `secrets.mux` — never in this repo.
       Basic quality keeps encoding free and suits short reels; 1080p is
       the ceiling because nothing on the site shows video larger. */
    muxInput({ video_quality: "basic", max_resolution_tier: "1080p" }),
  ],
});
