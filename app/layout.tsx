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

export const metadata: Metadata = {
  title: "CLICK — Where Science Meets Culture · Independent Concept",
  description:
    "Independent homepage design concept for CLICK. Not the official CLICK Media Group website.",
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
