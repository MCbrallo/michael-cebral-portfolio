"use client";

import { FlagshipProjects } from "@/components/projects/FlagshipProjects";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");
const resto = projects.filter((p) => !p.flagship);

/**
 * The page itself stays a server component so it can declare its metadata.
 * Everything written on it lives here, because the language is client state.
 */
export function ProjectsPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen text-white relative flex flex-col">
            <main className="w-full max-w-[1180px] mx-auto px-6 md:px-14 pt-28 pb-16 relative z-[2]">
                <div className="mb-9">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-3">
                        {t.projects.sector} {pad(projects.length)}
                    </p>
                    <h1 className="title-shimmer font-serif text-5xl md:text-6xl font-bold tracking-tight py-2 leading-tight">
                        {t.projects.title}
                    </h1>
                </div>

                {/* The three that carry the page, at full size and running.
                    No heading of their own: the title above already said it. */}
                <FlagshipProjects />

                {/* Everything else, in the quieter index */}
                <div className="mt-28 md:mt-36">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-7">
                        {t.projects.rest} · {pad(resto.length)}
                    </p>
                    <ProjectsIndex projects={resto} />
                </div>

                <p className="mt-10 text-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-white/30">
                    <span className="hint-hover">{t.projects.hintHover}</span>
                    <span className="hint-tap">{t.projects.hintTap}</span>
                </p>
            </main>
        </div>
    );
}
