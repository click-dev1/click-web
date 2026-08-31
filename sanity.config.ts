import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

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
    /* GROQ playground — for developers, harmless for editors. */
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
