import type { CSSProperties } from "react";

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
    /** Primary brand colour, used for the title, halo and card accent. */
    accent: string;
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
        type: "Space Market Intelligence",
        year: "2025",
        blurb:
            "A global space market intelligence platform. It profiles more than 200 countries and maps 1,088 companies across five sectors, with 3D orbital tracking and a daily news and launch feed written in plain language.",
        accent: "#b48bff",
        logo: "/projects/all-in-space.svg",
        links: [{ label: "Live ↗", href: "https://allinspace.xyz/explore" }],
    },
    {
        id: "ariadne",
        name: "ARIADNE",
        type: "Access to Space",
        year: "2025",
        blurb:
            "An independent advisory on access to space. Ariadne helps a research project find the right launch provider, orbital host and funding, and guides it through every step from first idea to flight.",
        accent: "#f15a5a",
        logo: "/projects/ariadne.svg",
        links: [{ label: "Live ↗", href: "https://ariadne-gamma.vercel.app" }],
    },
    {
        id: "abil",
        name: "ABIL",
        type: "Environmental Scoring",
        year: "2025",
        blurb:
            "ABIL condenses satellite readings into a single environmental score for any site, made for risk, insurance, investment and ESG. Every score links back to the measurement behind it and the regulation it answers to, so people without a remote sensing background can still use it.",
        accent: "#8ed973",
        logo: "/projects/abil.svg",
        links: [{ label: "Live ↗", href: "https://clearesg.vercel.app" }],
    },
    {
        id: "nexum",
        name: "NEXUM",
        type: "Accounting Software",
        year: "2025",
        blurb:
            "Nexum Xestión is accounting software for small firms. It reached the Santander X Emprende finals and joined the startup incubator at the University of Santiago de Compostela. It is currently in beta.",
        accent: "#e0ae3e",
        logo: "/projects/nexum.png",
        links: [{ label: "Live ↗", href: "https://nexumxestion.com" }],
        status: "Santander X · USC Incubator",
    },
    {
        id: "roadmap",
        name: "ROADMAP",
        type: "Space Communication",
        year: "2026",
        blurb:
            "A communication plan for future Moon and Mars missions, with separate messaging for technical, institutional and public audiences. The web platform turns country level space capability data into long range communication plans. Accepted for presentation at IAC 2026.",
        accent: "#6ea8ff",
        logo: "/projects/roadmap.svg",
        links: [{ label: "Live ↗", href: "https://roadmap-project-five.vercel.app" }],
        status: "ISU · IAC 2026",
    },
    {
        id: "hoxe",
        name: "HOXE",
        type: "Editorial · Mobile App",
        year: "2025",
        blurb:
            "HOXE is a polished, editorial historical timeline. It lets you relive the exact events that shaped today, across history and across space.",
        accent: "#d8b878",
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
                        <div
                            key={p.id}
                            className="proj-item"
                            tabIndex={0}
                            style={{ "--accent": p.accent } as CSSProperties}
                        >
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
