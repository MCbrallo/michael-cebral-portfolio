import Link from "next/link";
import { ArrowLeft, ExternalLink, Satellite, Brain } from "lucide-react";

export const metadata = {
    title: "Projects | Michael Cebral",
    description: "Projects at the intersection of biotechnology, space science, and engineering.",
};

const projects = [
    {
        title: "Space Communication Intelligence",
        description: "Interactive geopolitical dashboard mapping global space agency capabilities, satellite infrastructure, and communication networks.",
        href: "https://space-comm-simulator.vercel.app/",
        tags: ["Space Policy", "Geopolitics", "Data Visualization"],
        icon: Satellite,
        borderHover: "hover:border-cyan-400/30",
        glowColor: "from-cyan-500/15 to-blue-600/15",
    },
    {
        title: "AI for Astrophysics & Planetary Science",
        description: "Academic poster on AI and machine learning applied to exoplanet detection, spectral classification, and autonomous mission planning.",
        href: "https://mcbrallo.github.io/spaceai/posters/AI_for_Astrophysics_and_Planetary_Science/index.html",
        tags: ["Machine Learning", "Astrophysics", "Research"],
        icon: Brain,
        borderHover: "hover:border-purple-400/30",
        glowColor: "from-purple-500/15 to-pink-600/15",
    },
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 fixed pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <main className="max-w-[900px] mx-auto px-6 md:px-14 pt-32 pb-20 relative z-10">
                <div className="mb-12 animate-fade-in -ml-4 md:-ml-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-6 group uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="font-serif text-4xl md:text-5xl font-normal mb-3 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 tracking-tight">
                        Projects
                    </h1>
                    <p className="text-base text-white/50 max-w-lg font-light leading-relaxed">
                        Explorations at the intersection of biology, cosmology, and engineering.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {projects.map((project, index) => {
                        const Icon = project.icon;
                        return (
                            <a
                                key={project.title}
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.12}s` }}
                            >
                                <div className={`p-6 rounded-sm bg-white/[0.02] border border-white/10 ${project.borderHover} transition-all duration-500 hover:bg-white/[0.04] relative overflow-hidden group-hover:-translate-y-0.5`}>
                                    <div className={`absolute inset-0 bg-gradient-to-r ${project.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 mt-0.5">
                                            <Icon className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors duration-500" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h2 className="font-serif text-lg font-medium text-white leading-tight">
                                                    {project.title}
                                                </h2>
                                                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 shrink-0 ml-3 transition-colors duration-300" />
                                            </div>

                                            <p className="text-white/45 text-sm font-light leading-relaxed mb-3 group-hover:text-white/65 transition-colors">
                                                {project.description}
                                            </p>

                                            <div className="flex gap-2 flex-wrap">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/30 border border-white/8 px-2 py-0.5 rounded-sm group-hover:border-white/15 transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
