import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import ContactModalProvider from "@/components/contact/ContactModalProvider";
import "./globals.css";

/* Display face: Anton — the closest free match to the CLICK logotype's
   DNA (black-weight Swiss grotesque, closed apertures, vertical terminal
   cuts, condensed). Headlines speak in the logo's voice. */
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
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
  /* ⚠ LAUNCH GATE — this concept must stay out of the index. Remove this
     line (and add app/sitemap.ts + robots.ts) when the real site ships. */
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${inter.variable} ${jetbrains.variable} grain antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Root level, not per route group: the contact CTA appears in the
            nav, the sections, the /concept finale and the 404 — which all
            sit in different layouts. One provider covers every route and
            keeps a single <dialog> in the top layer. */}
        <ContactModalProvider>{children}</ContactModalProvider>
      </body>
    </html>
  );
}
