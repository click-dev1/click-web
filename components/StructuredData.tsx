import { recognition } from "@/content/manifest";
import type { SiteSettings } from "@/lib/sanity/types";
import { siteUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { ORG_ID, WEBSITE_ID } from "@/lib/jsonld";

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
  const nodes = [
      {
        "@type": "Organization",
        "@id": ORG_ID,
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
        "@id": WEBSITE_ID,
        url: siteUrl,
        name: "CLICK",
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
  ];

  return <JsonLd nodes={nodes} />;
}
