import { HeroSection } from "@/components/HeroSection";
import { FlagshipProjects } from "@/components/projects/FlagshipProjects";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      {/* The work comes before the story. Somebody who only ever sees this
          one page should leave having seen three things that exist and run,
          not only a description of the person who made them. */}
      <section className="w-full max-w-[1180px] mx-auto px-6 md:px-14 py-24 md:py-32 relative z-[2]">
        <FlagshipProjects
          eyebrow="Selected Work"
          heading="Three that are live right now"
          masHref="/articles"
          masLabel={`All ${projects.length} projects`}
        />
      </section>
    </div>
  );
}
