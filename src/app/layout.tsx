import type { Metadata } from "next";
import { Playfair_Display, Bodoni_Moda, Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/Header";


import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

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
  title: "Michael Cebral | Science Communication",
  description: "Personal portfolio of Michael Cebral, Science Communicator.",
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
          {/* Global Video Background */}
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
              <div 
                  className="absolute inset-0 w-full h-full"
                  dangerouslySetInnerHTML={{
                      __html: `
                      <video
                          autoplay
                          loop
                          muted
                          playsinline
                          preload="auto"
                          class="absolute inset-0 w-full h-full object-cover scale-105"
                      >
                          <source src="/galaxy.webm" type="video/webm" />
                          <source src="/galaxy.mp4" type="video/mp4" />
                      </video>
                      `
                  }}
              />
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/60" />
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
