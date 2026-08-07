import { FlagshipProjects } from "@/components/projects/FlagshipProjects";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { projects } from "@/data/projects";

export const metadata = {
    title: "Projects",
    description:
        "Nine projects at the intersection of Earth observation, space science, communication and engineering. Space market intelligence, an Earth observation game, a territorial archive of Galicia and more, all live and built solo.",
    alternates: { canonical: "/projects" },
};

const pad = (n: number) => String(n).padStart(2, "0");
const resto = projects.filter((p) => !p.flagship);

export default function Projects() {
    return (
        <div className="min-h-screen text-white relative flex flex-col">
            <main className="w-full max-w-[1180px] mx-auto px-6 md:px-14 pt-28 pb-16 relative z-[2]">
                {/* Header */}
                <div className="mb-14">
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

                {/* The three that carry the page, at full size and running.
                    No heading of their own: the title above already said it. */}
                <FlagshipProjects />

                {/* Everything else, in the quieter index */}
                <div className="mt-28 md:mt-36">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-7">
                        The rest of the record · {pad(resto.length)}
                    </p>
                    <ProjectsIndex projects={resto} />
                </div>

                <p className="mt-10 text-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-white/30">
                    <span className="hint-hover">Hover</span>
                    <span className="hint-tap">Tap</span> a project to expand
                </p>
            </main>
        </div>
    );
}
