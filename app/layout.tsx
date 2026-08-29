import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import ConsentProvider from "@/components/consent/ConsentProvider";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PageViews from "@/components/analytics/PageViews";
import HubSpotLoader from "@/components/analytics/HubSpotLoader";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/* Free OFL stand-ins that carry the page until the licensed brand faces
   land — and that stay in the stack afterwards as the fallback layer.
   See the @font-face block in globals.css for the handover.

   Archivo for Helvetica Now Display Condensed: a Helvetica-family
   grotesque with a real width axis (wdth 62–125), so .font-display can
   condense it to sit near HNDC's proportions instead of approximating
   with a separately-drawn narrow face. Its wght 100–900 covers the three
   weights the guidelines actually call for — Regular, Bold and Extra
   Bold — which the previous Roboto Condensed 700-only cut could not.
   Black is deliberately absent: the guidelines reserve it for the logo,
   and the logo ships as an image, so it is never typeset in the browser. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display-fallback",
  axes: ["wdth"],
  display: "swap",
});

/* Hanken Grotesk for Matter: a warm grotesque rather than Inter's
   neutral one, closer to the "subtle, warm touch" the guidelines
   describe, with genuine Regular/Medium/Bold across wght 100–900. */
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body-fallback",
  display: "swap",
});


const title = "CLICK — Influencer Marketing & Talent Management Agency";
const description =
  "Global influencer marketing and talent management. We map where brand audiences and creator communities overlap — then build partnerships that move culture.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · CLICK" },
  description,
  applicationName: "CLICK",
  /* canonical is declared per route, not here — a root-level canonical is
     inherited by every page and would point them all at "/" */
  openGraph: {
    type: "website",
    siteName: "CLICK",
    url: "/",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  /* Live: indexable, with app/robots.ts and app/sitemap.ts alongside. */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${hankenGrotesk.variable} grain antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Root level, not per route group: consent, the tags it governs
            and the contact CTA all have to exist on every route — the 404
            lives outside (site). Consent wraps the contact modal because
            the HubSpot form is one of the things it governs.

            GA4's bootstrap declares Consent Mode defaults (read from the
            consent cookie) before anything else runs, so storage is denied
            from the first byte; the provider raises it via updateConsent().
            PageViews needs Suspense: useSearchParams opts its subtree out
            of static rendering otherwise. HubSpot's tracker renders only
            once analytics is granted. */}
        <ConsentProvider>
          <GoogleAnalytics />
          <Suspense fallback={null}>
            <PageViews />
          </Suspense>
          <HubSpotLoader />
          <ContactModalProvider>{children}</ContactModalProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
