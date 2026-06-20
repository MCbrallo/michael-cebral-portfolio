export const metadata = {
    title: "Projects",
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
            "A space intelligence workspace that brings launches, satellite operations and industry data into one place you can explore. It includes a live launch tracker and a documented source registry, made for anyone who needs quick, organised access to space data.",
        logo: "/projects/all-in-space.svg",
        links: [{ label: "Live ↗", href: "https://allinspace.xyz/explore" }],
    },
    {
        id: "ariadne",
        name: "ARIADNE",
        type: "Research to Orbit",
        year: "2025",
        blurb:
            "Ariadne is the thread that guides a research project to orbit. It finds the right commercial launch provider, orbital host and funding agency for your experiment, then helps you handle the regulatory steps from first idea to flight. It compares more than 22 providers and programmes, and you get a first reply within 48 hours.",
        logo: "/projects/ariadne.svg",
        links: [{ label: "Live ↗", href: "https://ariadne-gamma.vercel.app" }],
    },
    {
        id: "abil",
        name: "ABIL",
        type: "Environmental Intelligence",
        year: "2025",
        blurb:
            "ABIL turns satellite and geospatial data into clear environmental insight for any site. It maps your locations, scores them across several factors, sends alerts, writes executive reports and answers questions through a conversational AI analyst grounded in real data.",
        logo: "/projects/abil.svg",
        links: [{ label: "Live ↗", href: "https://clearesg.vercel.app" }],
    },
    {
        id: "nexum",
        name: "NEXUM",
        type: "Marketplace · Advisory",
        year: "2025",
        blurb:
            "Nexum Xestión connects companies with the advisory and consulting firms that fit them best. It was a finalist in Santander X Emprende and joined the startup incubator at the University of Santiago de Compostela. It is currently in beta.",
        logo: "/projects/nexum.png",
        links: [{ label: "Live ↗", href: "https://nexumxestion.com" }],
        status: "Santander X · USC Incubator",
    },
    {
        id: "roadmap",
        name: "ROADMAP",
        type: "Strategy · Creative Concept",
        year: "2026",
        blurb:
            "ROADMAP is a strategic creative concept and an interdisciplinary mission plan, developed within the International Space University as part of the Master of Space Studies 2026.",
        logo: "/projects/roadmap.svg",
        links: [{ label: "Live ↗", href: "https://roadmap-project-five.vercel.app" }],
        status: "ISU · MSS 2026",
    },
    {
        id: "hoxe",
        name: "HOXE",
        type: "Editorial · Mobile App",
        year: "2025",
        blurb:
            "HOXE is a polished, editorial historical timeline. It lets you relive the exact events that shaped today, across history and across space.",
        logo: "hoxe",
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
                stroke="#ede7db"
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
                                        <div className="proj-card">
                                            <div className="proj-logo">
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
