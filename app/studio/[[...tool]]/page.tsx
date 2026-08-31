import Studio from "./Studio";

/* The editing dashboard, mounted inside the site at /studio. It sits
   outside the (site) route group on purpose: no nav, footer, signal
   canvas or structured data — the root layout's consent and analytics
   providers are the only things it inherits, and both skip this path.
   Keep this file a server component: metadata/viewport can't be exported
   from a client file, and the Studio itself lives in ./Studio.tsx. */

export const dynamic = "force-static";

import type { Metadata } from "next";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

export { viewport };
/* next-sanity's metadata keeps the Studio out of search engines; the
   title is ours. */
export const metadata: Metadata = { ...studioMetadata, title: "CLICK Studio" };

export default function StudioPage() {
  return (
    <>
      {/* The site's film-grain overlay is fixed above everything at 5%
          opacity; harmless on marketing pages, a smear over form fields
          here. */}
      <style>{`body.grain::after{display:none}`}</style>
      <Studio />
    </>
  );
}
