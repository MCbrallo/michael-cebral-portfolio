import type { Metadata } from "next";
import { Playfair_Display, Bodoni_Moda, Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/Header";


import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
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
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${bodoni.variable} ${inter.variable} antialiased bg-background text-foreground flex flex-col min-h-screen font-sans overflow-x-hidden`}
      >
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

          <LanguageToggle />
          <Header />
          <main className="flex-grow text-sm md:text-base leading-relaxed relative z-10">
            {children}
          </main>

        </LanguageProvider>
      </body>
    </html>
  );
}
