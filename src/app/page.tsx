import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FlagshipProjects } from "@/components/projects/FlagshipProjects";

/* No title of its own: the site default is already the right one for the
   front page, and setting one here would append the suffix twice. */
export const metadata: Metadata = {
  description:
    "Michael Cebral, science communicator working between Earth observation and space. Nine projects built and running, from a global space market platform to a territorial archive of Galicia.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      {/* The work comes before the story. Somebody who only ever sees this
          one page should leave having seen three things that exist and run,
          not only a description of the person who made them. */}
      <section className="w-full max-w-[1180px] mx-auto px-6 md:px-14 py-24 md:py-32 relative z-[2]">
        <FlagshipProjects conCabecera conEnlace />
      </section>
    </div>
  );
}
