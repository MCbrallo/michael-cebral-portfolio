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
    // --pantalla is one real screen under whatever zoom is active (viewport
    // units do not scale with CSS zoom); phones carry no zoom and use plain
    // screen height.
    <div className="h-screen md:h-[var(--pantalla)] overflow-hidden">
      <HeroSection />
    </div>
  );
}
