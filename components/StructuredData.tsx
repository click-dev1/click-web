import { contact, recognition } from "@/content/manifest";
import { siteUrl } from "@/lib/site";

/**
 * Organization + WebSite JSON-LD.
 *
 * Every claim here is one the manifest already carries as verified-public
 * — name, parent org, award, contact address, social profiles. Nothing is
 * asserted that isn't rendered somewhere on the page, which is both the
 * blueprint's rule and Google's (structured data must reflect visible
 * content).
 */
const SOCIAL_PROFILES = [
  "https://www.instagram.com/weareclicktalent",
  "https://www.linkedin.com/company/clickmediagroup/",
  "https://www.tiktok.com/@clickmgmt",
];

export default function StructuredData() {
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
        email: contact.email,
        sameAs: SOCIAL_PROFILES,
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
