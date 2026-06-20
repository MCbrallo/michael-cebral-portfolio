export const metadata = {
    title: "Projects | Michael Cebral",
    description:
        "Projects at the intersection of biotechnology, space science, communication and engineering.",
};

type ProjectLink = { label: string; href: string };

type Project = {
    id: string;
    name: string;
    type: string;
    year: string;
    blurb: string;
    /** Logo image in /public/projects, or "hoxe" for the inline editorial mark. */
    logo: string;
    /** Background of the logo tile (logos ship in different colourways). */
    logoBg: string;
    links?: ProjectLink[];
    status?: string;
};

// ── EDIT PROJECTS HERE ────────────────────────────────────────────────────
const projects: Project[] = [
    {
        id: "all-in-space",
        name: "ALL-IN SPACE",
        type: "Space Intelligence",
        year: "2025",
        blurb:
            "A space-intelligence workspace that aggregates launches, satellite operations and industry data into one explorable view — a live launch tracker and a documented source registry for professionals, researchers and enthusiasts who need organised access to space data.",
        logo: "/projects/all-in-space.svg",
        logoBg: "rgba(10,12,28,0.55)",
        links: [{ label: "Live ↗", href: "https://allinspace.xyz/explore" }],
    },
    {
        id: "ariadne",
        name: "ARIADNE",
        type: "Research-to-Orbit Router",
        year: "2025",
        blurb:
            "The red thread through space research. Ariadne routes a scientific project to the right commercial launch provider, orbital host and funding agency, and manages the regulatory path from idea to flight readiness — indexing 22+ providers and programmes against your experiment, with a first response in 48 hours.",
        logo: "/projects/ariadne.svg",
        logoBg: "#0c0e1a",
        links: [{ label: "Live ↗", href: "https://ariadne-gamma.vercel.app" }],
    },
    {
        id: "abil",
        name: "ABIL",
        type: "Environmental Intelligence",
        year: "2025",
        blurb:
            "Environmental Site Intelligence. ABIL turns Earth observation and geospatial data into actionable, explainable diagnostics per physical asset — a global site map, multi-axis scoring, alerts, executive reports and a conversational AI analyst grounded in the data.",
        logo: "/projects/abil.svg",
        logoBg: "rgba(8,16,14,0.6)",
        links: [{ label: "Live ↗", href: "https://clearesg.vercel.app" }],
    },
    {
        id: "nexum",
        name: "NEXUM",
        type: "Marketplace · Advisory",
        year: "2025",
        blurb:
            "Nexum Xestión — el nexo entre empresas y asesorías: a marketplace that links companies with the right advisory and consulting firms. Santander X Emprende finalist and accepted into the University of Santiago de Compostela (USC) startup incubator; currently in beta.",
        logo: "/projects/nexum.png",
        logoBg: "rgba(10,12,20,0.6)",
        links: [{ label: "Live ↗", href: "https://nexumxestion.com" }],
        status: "Santander X · USC Incubator",
    },
    {
        id: "roadmap",
        name: "ROADMAP",
        type: "Strategy · Creative Concept",
        year: "2026",
        blurb:
            "A strategic creative concept and interdisciplinary mission roadmap developed within the International Space University (Master of Space Studies, MSS 2026).",
        logo: "/projects/roadmap.svg",
        logoBg: "rgba(10,12,24,0.55)",
        links: [{ label: "Live ↗", href: "https://roadmap-project-five.vercel.app" }],
        status: "ISU · MSS 2026",
    },
    {
        id: "hoxe",
        name: "HOXE",
        type: "Editorial · Mobile App",
        year: "2025",
        blurb:
            "A premium, editorial-grade historical timeline. Experience the exact events that defined today across time and space.",
        logo: "hoxe",
        logoBg: "#EEECE1",
        links: [{ label: "Live ↗", href: "https://hoxe.org" }],
    },
];

const pad = (n: number) => String(n).padStart(2, "0");

function ProjectLogo({ project }: { project: Project }) {
    if (project.logo === "hoxe") {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                fill="none"
                stroke="#263944"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M 40 15 L 20 15 C 14 15 10 19 10 25 L 10 85 C 10 91 14 95 20 95 L 80 95 C 86 95 90 91 90 85 L 90 25 C 90 19 86 15 80 15 L 60 15" />
                <path d="M 32 35 L 68 75 M 68 35 L 32 75" strokeWidth={9} />
            </svg>
        );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.logo} alt={`${project.name} logo`} loading="lazy" />;
}

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

                {/* Index */}
                <div className="proj-index">
                    {projects.map((p, i) => (
                        <div key={p.id} className="proj-item" tabIndex={0}>
                            <div className="proj-row">
                                <span className="proj-num">{pad(i + 1)}</span>
                                <span className="proj-name">{p.name}</span>
                                <span className="proj-meta">
                                    {p.type} · {p.year}
                                </span>
                            </div>
                            <div className="proj-panel">
                                <div className="proj-panel-wrap">
                                    <div className="proj-panel-inner">
                                        <div className="proj-logo" style={{ background: p.logoBg }}>
                                            <ProjectLogo project={p} />
                                        </div>
                                        <div className="proj-desc">
                                            <p>{p.blurb}</p>
                                            <div className="proj-tags">
                                                {p.links?.map((l) => (
                                                    <a
                                                        key={l.label}
                                                        href={l.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="proj-link"
                                                    >
                                                        {l.label}
                                                    </a>
                                                ))}
                                                {p.status && <span className="proj-status">{p.status}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-white/30">
                    Hover a project to expand
                </p>
            </main>
        </div>
    );
}
