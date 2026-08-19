import type { Metadata } from "next";
import { Playfair_Display, Bodoni_Moda, Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/Header";


import { LanguageProvider } from "@/context/LanguageContext";
import { SkipLink } from "@/components/SkipLink";
import { NebulaBackground } from "@/components/NebulaBackground";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mcebral.com"),
  title: {
    default: "Michael Cebral | Science Communication",
    template: "%s | Michael Cebral",
  },
  description:
    "Portfolio of Michael Cebral — science communicator working at the intersection of biology, space science and storytelling.",
  keywords: [
    "Michael Cebral",
    "science communication",
    "space",
    "biotechnology",
    "portfolio",
  ],
  authors: [{ name: "Michael Cebral" }],
  openGraph: {
    type: "website",
    url: "https://mcebral.com",
    siteName: "Michael Cebral",
    title: "Michael Cebral | Science Communication",
    description:
      "Science communicator working at the intersection of biology, space science and storytelling.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Michael Cebral — Science Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Cebral | Science Communication",
    description:
      "Science communicator working at the intersection of biology, space science and storytelling.",
    images: ["/og.jpg"],
  },
};

/**
 * Structured data. Titles and descriptions tell a search engine what a page
 * says; this tells it who the site is about, which is what feeds a knowledge
 * panel and what makes a search for the name resolve to the right person.
 * Only profiles already public on the contact page are listed.
 */
const personaJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Michael Cebral",
  url: "https://mcebral.com",
  image: "https://mcebral.com/og.jpg",
  jobTitle: "Science Communicator",
  description:
    "Science communicator working between Earth observation, space and biotechnology.",
  email: "mailto:michaelcebralclase@gmail.com",
  sameAs: ["https://www.linkedin.com/in/michaelceb/"],
  knowsLanguage: ["es", "gl", "en", "pt", "fr"],
  knowsAbout: [
    "Science communication",
    "Earth observation",
    "Space science",
    "Biotechnology",
    "Public outreach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // The object is a literal in this file, so there is nothing here a
          // visitor could have written.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personaJsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${bodoni.variable} ${inter.variable} antialiased bg-background text-foreground flex flex-col min-h-[var(--pantalla)] font-sans overflow-x-hidden`}
      >
        {/* Proportional desktop zoom, third attempt, with the two prior
            failures understood: (a) viewport units do not scale under zoom,
            which --pantalla fixes, and (b) calibration is self service now:
            /medida saves the chosen D into this browser's localStorage and
            this script obeys it, so each of the owner's machines carries its
            own taste. Visitors without a stored value get the 2456 default,
            which renders like the classic fixed 0.8 on a common 1920 screen.
            Touch devices are excluded on purpose. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var st=0;try{st=+localStorage.getItem("mc_zoom_D")||0;}catch(e){}var D=(st>400&&st<6000)?st:2456;var fine=window.matchMedia&&matchMedia("(pointer: fine)").matches;function f(){var el=document.documentElement,w=window.innerWidth;if(!fine||w<768){el.style.zoom="";el.style.removeProperty("--pantalla");return;}var z=Math.min(3.5,Math.max(0.4,w/D));el.style.zoom=String(z);el.style.setProperty("--pantalla",(100/z)+"vh");}f();window.addEventListener("resize",f);})();',
          }}
        />
        <LanguageProvider>
          {/* Global Interactive Nebula Background (WebGL) */}
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#04050c]">
              <NebulaBackground />
              {/* Readability scrim over the shader — keeps headlines legible
                  while letting the dust breathe at the edges. */}
              <div
                  className="absolute inset-0"
                  style={{
                      background:
                          "radial-gradient(120% 90% at 50% 42%, rgba(4,5,12,0.10) 0%, rgba(4,5,12,0.50) 55%, rgba(4,5,12,0.78) 100%), linear-gradient(180deg, rgba(4,5,12,0.55) 0%, rgba(4,5,12,0) 22%, rgba(4,5,12,0) 78%, rgba(4,5,12,0.6) 100%)",
                  }}
              />
          </div>

          <SkipLink />
          <Header />
          <main
            id="contenido"
            className="flex-grow text-sm md:text-base leading-relaxed relative z-10"
          >
            {children}
          </main>

        </LanguageProvider>
      </body>
    </html>
  );
}
