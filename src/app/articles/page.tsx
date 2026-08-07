import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { projects } from "@/data/projects";

export const metadata = {
    title: "Projects",
    description:
        "Projects at the intersection of biotechnology, space science, communication and engineering.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
    return (
        <div className="min-h-screen text-white relative flex flex-col">
            <main className="w-full max-w-[1080px] mx-auto px-6 md:px-14 pt-28 pb-16 relative z-[2]">
                {/* Header */}
                <div className="mb-10">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-3">
                        Selected Work · Sector {pad(projects.length)}
                    </p>
                    <h1 className="title-shimmer font-serif text-5xl md:text-6xl font-bold tracking-tight py-2 leading-tight">
                        Projects
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-white/50 max-w-xl font-light leading-relaxed">
                        Explorations at the intersection of biology, space science, communication and engineering.
                    </p>
                </div>

                <ProjectsIndex />

                <p className="mt-10 text-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-white/30">
                    <span className="hint-hover">Hover</span>
                    <span className="hint-tap">Tap</span> a project to expand
                </p>
            </main>
        </div>
    );
}
