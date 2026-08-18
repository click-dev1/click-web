import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import "./globals.css";

/* Display fallback until the licensed Helvetica Now Display Condensed
   files land. Roboto Condensed shares HNDC's skeleton — Helvetica-family
   grotesque, open apertures, condensed — and, unlike Anton, it has a real
   Bold. That matters: the guidelines set the logo in Black and say that
   weight "should be used extremely sparingly so that our logo remains
   distinctive", so headlines should not all be wearing it.
   To revert to the previous poster look: swap this for Anton (weight 400)
   and put --font-anton back in .font-display. */
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-display-fallback",
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Set NEXT_PUBLIC_SITE_URL in the deploy environment. It resolves
   canonical + Open Graph URLs; without it they fall back to localhost and
   any absolute URL Next emits will be wrong. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  /* ⚠ LAUNCH GATE — this build must stay out of the index. Remove this
     line (and add app/sitemap.ts + robots.ts) when the real site ships. */
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${robotoCondensed.variable} ${inter.variable} grain antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Root level, not per route group: the contact CTA appears in the
            nav, the sections and the 404 — which sit in different layouts.
            One provider covers every route and keeps a single <dialog> in
            the top layer. */}
        <ContactModalProvider>{children}</ContactModalProvider>
      </body>
    </html>
  );
}
