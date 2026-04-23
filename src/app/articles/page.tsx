import Link from "next/link";
import { ArrowLeft, ExternalLink, Satellite, Brain, BrainCircuit } from "lucide-react";

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
        icon: BrainCircuit,
        isMinimalCard: true
    },
    {
        title: "HOXE",
        description: "A premium, editorial-grade historical timeline. Experience the exact events that defined today across time and space.",
        href: "https://hoxe.org",
        tags: ["Editorial", "History", "Mobile App"],
        icon: Brain, // Not used for this specific card
        isHoxeCard: true
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14 justify-items-center">
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
                                    <div className="w-full h-full bg-[#f8f9fa] rounded-xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)] text-black p-4 relative overflow-hidden flex flex-col transition-all duration-500">
                                        
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

                                        {/* Card Content Aligned Grid */}
                                        <div className="flex-1 flex flex-col relative z-10 z-[2] w-full pt-8">
                                            {/* Icon Area */}
                                            <div className="h-[90px] flex items-center justify-center w-full mb-6">
                                                <div className="w-32 h-32 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                    <img src="/all-in-space-icon.png" alt="All-In Space" className="w-[140%] h-[140%] max-w-none object-contain brightness-75 contrast-125 drop-shadow-md" />
                                                </div>
                                            </div>
                                            
                                            {/* Text Area */}
                                            <div className="flex flex-col items-center w-full">
                                                <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-br from-[#f2d06b] via-[#c49a22] to-[#805e00] drop-shadow-sm leading-tight mb-2 px-2">
                                                    {project.title}
                                                </h2>
                                                
                                                <p className="text-black/70 text-[9px] font-sans leading-relaxed text-center px-4">
                                                    {project.description}
                                                </p>
                                            </div>
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
                                    <div className="w-full h-full bg-[#030712] rounded-xl border border-cyan-500/20 p-4 relative overflow-hidden flex flex-col hover:border-cyan-400/50 transition-all duration-700 shadow-lg group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/10 blur-[40px] pointer-events-none" />

                                        <div className="flex-1 flex flex-col relative z-10 w-full pt-8">
                                            {/* Icon Area */}
                                            <div className="h-[90px] flex items-center justify-center w-full mb-6 transition-transform duration-500 group-hover:scale-110">
                                                <Icon className="w-16 h-16 text-cyan-400/80 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all duration-500" />
                                            </div>
                                            
                                            {/* Text Area */}
                                            <div className="flex flex-col items-center w-full">
                                                <h2 className="font-sans text-[13px] font-semibold tracking-wider text-cyan-50 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] text-center leading-tight mb-2 px-2">
                                                    {project.title}
                                                </h2>
                                                
                                                <p className="text-cyan-100/50 text-[9px] font-light leading-relaxed px-3 text-center group-hover:text-cyan-100/80 transition-colors duration-500">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out pointer-events-none" />
                                    </div>
                                </a>
                            );
                        }

                        if ((project as any).isHoxeCard) {
                            return (
                                <a
                                    key={project.title}
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full max-w-[220px] aspect-[2.5/3.5] group relative transition-transform duration-500 hover:-translate-y-4 hover:scale-[1.05]"
                                >
                                    <div className="w-full h-full bg-[#EEECE1] rounded-xl border-4 border-[#EEECE1] ring-1 ring-[#263944]/10 p-4 relative overflow-hidden flex flex-col transition-all duration-700 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_20px_40px_rgba(238,236,225,0.15)] group-hover:ring-[#263944]/30">
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #263944 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                                        {/* Editorial Frame Elements */}
                                        <div className="absolute inset-3 border border-[#263944]/20 rounded-[4px] pointer-events-none" />
                                        <div className="absolute inset-4 border border-[#263944]/5 pointer-events-none" />
                                        
                                        {/* Vintage Corners */}
                                        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#263944]/40 pointer-events-none" />
                                        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#263944]/40 pointer-events-none" />
                                        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#263944]/40 pointer-events-none" />
                                        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#263944]/40 pointer-events-none" />

                                        <div className="flex-1 flex flex-col relative z-10 w-full pt-8">
                                            {/* Icon Area */}
                                            <div className="h-[90px] flex items-center justify-center w-full mb-6 transition-transform duration-500 group-hover:scale-110">
                                                <div className="w-16 h-16">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#263944" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
                                                        <path d="M 40 15 L 20 15 C 14 15 10 19 10 25 L 10 85 C 10 91 14 95 20 95 L 80 95 C 86 95 90 91 90 85 L 90 25 C 90 19 86 15 80 15 L 60 15" />
                                                        <path d="M 32 35 L 68 75 M 68 35 L 32 75" strokeWidth="9" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            {/* Text Area */}
                                            <div className="flex flex-col items-center w-full">
                                                <h2 className="font-serif text-2xl font-black tracking-[0.2em] text-[#263944] uppercase drop-shadow-md text-center mb-1">
                                                    {project.title}
                                                </h2>
                                                
                                                <div className="w-6 h-[1px] bg-[#263944]/30 mb-2 group-hover:w-12 transition-all duration-500" />
                                                
                                                <p className="text-[#263944]/70 text-[9px] font-sans leading-relaxed px-3 font-medium text-center group-hover:text-[#263944] transition-colors duration-500">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
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
