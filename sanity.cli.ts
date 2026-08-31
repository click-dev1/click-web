import { defineCliConfig } from "sanity/cli";

/* For `pnpm sanity <command>` (dataset export/import, manage, etc.).
   Reads the same env as the app so the CLI can never point at a
   different project than the site. */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
  autoUpdates: false,
});
