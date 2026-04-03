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
        <div className="min-h-screen text-white relative flex flex-col">
            <main className="w-full max-w-[1000px] mx-auto px-6 md:px-14 pt-28 pb-10 relative z-[2] flex-shrink-0">
                <div className="mb-10 animate-fade-in text-center flex flex-col items-center">
                    <h1 className="title-shimmer font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tight py-2 leading-tight">
                        Projects
                    </h1>
                    <p className="text-sm md:text-base text-white/50 max-w-lg font-light leading-relaxed px-4">
                        Explorations at the intersection of biology, space science, and science communication.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 justify-items-center">
                    {projects.map((project, index) => {
                        const Icon = project.icon;
                        
                        if (project.isPokerCard) {
                            return (
                                <a
                                    key={project.title}
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full max-w-[220px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-4 hover:scale-[1.05]"
                                >
                                    {/* Poker Card Design */}
                                    <div className="w-full h-full bg-[#f8f9fa] rounded-xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)] text-black p-4 relative overflow-hidden flex flex-col justify-between transition-all duration-500">
                                        
                                        {/* Top Left Corner */}
                                        <div className="absolute top-4 left-4 flex flex-col items-center">
                                            <span className="font-serif font-bold text-[16px] leading-none">A</span>
                                            <span className="text-[16px]">♠</span>
                                        </div>
                                        
                                        {/* Bottom Right Corner */}
                                        <div className="absolute bottom-4 right-4 flex flex-col items-center rotate-180">
                                            <span className="font-serif font-bold text-[16px] leading-none">A</span>
                                            <span className="text-[16px]">♠</span>
                                        </div>

                                        {/* Card Content (Center) */}
                                        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 relative z-10 z-[2]">
                                            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                                                <Icon className="w-6 h-6 text-[#c49a22]" />
                                            </div>
                                            <h2 className="font-serif text-lg md:text-xl font-bold uppercase tracking-widest mb-3 text-transparent bg-clip-text bg-gradient-to-br from-[#f2d06b] via-[#c49a22] to-[#805e00] drop-shadow-sm">
                                                {project.title}
                                            </h2>
                                            <p className="text-black/70 text-[9px] font-sans mb-1 leading-snug">
                                                {project.description}
                                            </p>
                                        </div>
                                        
                                        {/* Border Inner Line */}
                                        <div className="absolute inset-2 border border-black/10 rounded-lg pointer-events-none" />
                                        <div className="absolute inset-3 border border-black/5 rounded-md pointer-events-none" />
                                        
                                        {/* Custom intricate overlay */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none transition-opacity duration-500 group-hover:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, black 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
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
                                    className="block w-full max-w-[220px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-4 hover:scale-[1.05]"
                                >
                                    <div className="w-full h-full bg-white/[0.02] rounded-xl border border-white/10 group-hover:border-white/20 p-5 relative overflow-hidden flex flex-col items-center justify-center text-center hover:bg-white/[0.05] transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        
                                        <Icon className="w-10 h-10 text-white/40 mb-5 group-hover:text-white/90 transition-all duration-500 group-hover:scale-110" />
                                        
                                        <h2 className="font-serif text-base font-medium tracking-wide mb-3 text-white/90 group-hover:text-white transition-colors duration-500">
                                            {project.title}
                                        </h2>
                                        
                                        <p className="text-white/40 text-[10px] font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500">
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
                                className="block w-full max-w-[240px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-4 hover:scale-[1.05]"
                            >
                                <div className={`w-full h-full p-6 rounded-xl bg-white/[0.02] border border-white/10 ${(project as any).borderHover || "hover:border-white/30"} transition-all duration-500 hover:bg-white/[0.05] relative overflow-hidden flex flex-col shadow-lg`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${(project as any).glowColor || "from-white/10 to-white/20"} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                    {/* Icon Top */}
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 mb-6 mt-1 relative z-10 group-hover:scale-110">
                                        <Icon className="w-5 h-5 text-white/40 group-hover:text-white/90 transition-colors duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col relative z-10">
                                        <h2 className="font-serif text-xl md:text-2xl font-medium text-white leading-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-white/60 transition-all">
                                            {project.title}
                                        </h2>
                                        
                                        <p className="text-white/40 text-[11px] font-light leading-relaxed mb-6 flex-1 group-hover:text-white/80 transition-colors duration-500">
                                            {project.description}
                                        </p>

                                        <div className="flex gap-1.5 flex-wrap">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[8px] font-bold tracking-[0.1em] uppercase text-white/30 border border-white/10 px-1.5 py-0.5 rounded bg-black/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <ExternalLink className="absolute top-5 right-5 w-4 h-4 text-white/10 group-hover:text-white/80 transition-colors duration-300 group-hover:rotate-12" />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
