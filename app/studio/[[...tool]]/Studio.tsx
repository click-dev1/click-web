"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/* Client boundary for the Studio. The config (and with it the whole
   `sanity` package) must only ever be imported on the client: pulled into
   a server component, Next resolves its dependencies under the
   `react-server` export condition and swr's server build has no default
   export — "Export default doesn't exist in target module". */
export default function Studio() {
  return <NextStudio config={config} />;
}
