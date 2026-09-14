import { recognition } from "@/content/manifest";
import type { SiteSettings } from "@/lib/sanity/types";
import { siteUrl } from "@/lib/site";

/**
 * Organization + WebSite JSON-LD.
 *
 * Every claim here is one the site already carries as verified-public —
 * name, parent org, award, contact address, social profiles. Nothing is
 * asserted that isn't rendered somewhere on the page, which is both the
 * blueprint's rule and Google's (structured data must reflect visible
 * content). The email and the social profiles come from site settings for
 * exactly that reason: they are the ones the footer shows.
 */
export default function StructuredData({
  settings,
}: {
  settings: SiteSettings;
}) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "CLICK",
        url: siteUrl,
        logo: `${siteUrl}/click-logo.png`,
        description:
          "Global influencer marketing, experiential and talent management agency.",
        email: settings.email,
        sameAs: settings.socials.map((s) => s.url),
        parentOrganization: { "@type": "Organization", name: "GameSquare" },
        award: `${recognition.line} (${recognition.years.replace(" · ", ", ")})`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "CLICK",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
