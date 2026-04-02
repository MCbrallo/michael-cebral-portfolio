import Link from "next/link";
import { ArrowLeft, ExternalLink, Satellite, Brain } from "lucide-react";

export const metadata = {
    title: "Projects | Michael Cebral",
    description: "Projects at the intersection of biotechnology, space science, and engineering.",
};

const projects = [
    {
        title: "ALL-IN SPACE",
        description: "Interactive geopolitical dashboard mapping global space agency capabilities, satellite infrastructure, and communication networks.",
        href: "https://allinspace.xyz",
        tags: [],
        icon: Satellite,
        isPokerCard: true
    },
    {
        title: "AI for Astrophysics & Planetary Science",
        description: "Academic poster on AI and machine learning applied to exoplanet detection, spectral classification, and autonomous mission planning.",
        href: "https://mcbrallo.github.io/spaceai/posters/AI_for_Astrophysics_and_Planetary_Science/index.html",
        tags: ["Machine Learning", "Astrophysics", "Research"],
        icon: Brain,
        isMinimalCard: true
    },
];

export default function Projects() {
    return (
        <div className="min-h-screen text-white relative">
            <main className="max-w-[1000px] mx-auto px-6 md:px-14 pt-32 pb-20 relative z-[2]">
                <div className="mb-16 animate-fade-in text-center flex flex-col items-center">
                    <h1 className="title-shimmer font-serif text-5xl md:text-6xl font-normal mb-4 tracking-tight py-2 leading-tight">
                        Projects
                    </h1>
                    <p className="text-base text-white/50 max-w-lg font-light leading-relaxed">
                        Explorations at the intersection of biology, cosmology, and engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 justify-items-center">
                    {projects.map((project, index) => {
                        const Icon = project.icon;
                        
                        if (project.isPokerCard) {
                            return (
                                <a
                                    key={project.title}
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full max-w-[240px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                                >
                                    {/* Poker Card Design */}
                                    <div className="w-full h-full bg-[#f8f9fa] rounded-xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] text-black p-4 relative overflow-hidden flex flex-col justify-between">
                                        
                                        {/* Top Left Corner */}
                                        <div className="absolute top-4 left-4 flex flex-col items-center">
                                            <span className="font-serif font-bold text-[18px] leading-none">A</span>
                                            <span className="text-[18px]">♠</span>
                                        </div>
                                        
                                        {/* Bottom Right Corner */}
                                        <div className="absolute bottom-4 right-4 flex flex-col items-center rotate-180">
                                            <span className="font-serif font-bold text-[18px] leading-none">A</span>
                                            <span className="text-[18px]">♠</span>
                                        </div>

                                        {/* Card Content (Center) */}
                                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 z-[2]">
                                            <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center mb-5">
                                                <Icon className="w-7 h-7 text-[#c49a22]" />
                                            </div>
                                            <h2 className="font-serif text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 text-transparent bg-clip-text bg-gradient-to-br from-[#f2d06b] via-[#c49a22] to-[#805e00] drop-shadow-sm">
                                                {project.title}
                                            </h2>
                                            <p className="text-black/70 text-[11px] font-sans mb-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>
                                        
                                        {/* Border Inner Line */}
                                        <div className="absolute inset-2 border border-black/10 rounded-lg pointer-events-none" />
                                        <div className="absolute inset-3 border border-black/5 rounded-md pointer-events-none" />
                                        
                                        {/* Custom intricate overlay */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, black 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                    </div>
                                </a>
                            );
                        }

                        if (project.isMinimalCard) {
                            return (
                                <a
                                    key={project.title}
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full max-w-[240px] aspect-[2.5/3.5] group relative transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                                >
                                    <div className="w-full h-full bg-white/[0.02] rounded-xl border border-white/10 p-6 relative overflow-hidden flex flex-col items-center justify-center text-center hover:bg-white/[0.04] transition-colors duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        
                                        <Icon className="w-8 h-8 text-white/40 mb-6 group-hover:text-white/80 transition-colors duration-300" />
                                        
                                        <h2 className="font-serif text-lg font-medium tracking-wide mb-4 text-white/90">
                                            {project.title}
                                        </h2>
                                        
                                        <p className="text-white/40 text-xs font-light leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        }

                        // Fallback Standard Space Card (Same size)
                        return (
                            <a
                                key={project.title}
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full max-w-[280px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                                <div className={`w-full h-full p-8 rounded-xl bg-white/[0.02] border border-white/10 ${(project as any).borderHover || "hover:border-white/30"} transition-all duration-500 hover:bg-white/[0.04] relative overflow-hidden flex flex-col`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${(project as any).glowColor || "from-white/5 to-white/10"} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                    {/* Icon Top */}
                                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 mb-8 mt-2 relative z-10">
                                        <Icon className="w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col relative z-10">
                                        <h2 className="font-serif text-2xl md:text-3xl font-medium text-white leading-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-white/60 transition-all">
                                            {project.title}
                                        </h2>
                                        
                                        <p className="text-white/40 text-sm font-light leading-relaxed mb-8 flex-1 group-hover:text-white/60 transition-colors">
                                            {project.description}
                                        </p>

                                        <div className="flex gap-2 flex-wrap">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/30 border border-white/10 px-2 py-1 rounded bg-black/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <ExternalLink className="absolute top-6 right-6 w-5 h-5 text-white/10 group-hover:text-white/40 transition-colors duration-300" />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
