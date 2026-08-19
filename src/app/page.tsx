import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";

/* No title of its own: the site default is already the right one for the
   front page, and setting one here would append the suffix twice. */
export const metadata: Metadata = {
  description:
    "Michael Cebral, science communicator working between Earth observation and space. Nine projects built and running, from a global space market platform to a territorial archive of Galicia.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    // One viewport, no scroll: the front page is the hero and nothing else.
    // 125vh is not a typo: under the site's fixed desktop zoom of 0.8, viewport
    // units are not compensated, so 100vh paints at 80 percent of the screen
    // and 125vh (1/0.8) paints at exactly one screen. Phones carry no zoom and
    // keep the plain screen height.
    <div className="h-screen md:h-[125vh] overflow-hidden">
      <HeroSection />
    </div>
  );
}
