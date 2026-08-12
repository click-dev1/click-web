import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
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

/* Runs before paint: restores the visitor's chosen design direction.
   Kept inline so there is no theme flash. */
const themeInit = `(function(){try{var t=localStorage.getItem("click-theme");if(t==="paper"||t==="noir"||t==="signal"||t==="blue"){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme="signal"}}catch(e){document.documentElement.dataset.theme="signal"}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="signal" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${anton.variable} ${inter.variable} ${jetbrains.variable} grain antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
