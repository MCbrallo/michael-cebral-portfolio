import type { ProjectVideoData } from "@/components/ProjectVideo";

export type ProjectLink = { label: string; href: string };

export type Project = {
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
    /** Optional talk/presentation embedded as a lazy YouTube facade. */
    video?: ProjectVideoData;
    /**
     * False while the site answers with X-Frame-Options DENY, which stops any
     * page from loading it in a frame. The card then keeps the poster still.
     * Turn it back to true once the site names mcebral.com as a frame ancestor.
     */
    embeddable?: boolean;
};

// ── EDIT PROJECTS HERE ────────────────────────────────────────────────────
// The card previews the first link, using public/projects/previews/<id>.jpg
// as the poster. Regenerate the posters with `node scripts/capturas.mjs`.
export const projects: Project[] = [
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
        video: { id: "3HKsfA4ykD8", start: 321, label: "Watch the pitch" },
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
        // The policy that would open this is written and committed, but the
        // app has real users and was deliberately left undeployed, so the
        // card holds the poster. Remove this line after it ships.
        embeddable: false,
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
        video: { id: "Q7CzyzCGLO0", start: 9547, label: "Watch the presentation" },
    },
    {
        id: "eoguessr",
        name: "EOGUESSR",
        type: "Educational Game · Earth Observation",
        year: "2026",
        blurb:
            "A free daily game that teaches you to read the planet from space. It drops you on a real, hidden place on Earth and lets you unlock Copernicus and NASA signal layers, vegetation, water, terrain, heat and night lights, to reason your way to the spot and drop a pin. Built solo with open data, and playable in English, Spanish and Galician.",
        accent: "#4ec1ce",
        logo: "/projects/eoguessr.svg",
        links: [{ label: "Live ↗", href: "https://eoguessr.app" }],
    },
    {
        id: "rakugaki",
        name: "RAKUGAKI",
        type: "Fighting Game · Ink Calligraphy",
        year: "2026",
        blurb:
            "A one on one fighting game where every attack is a brushstroke: you cast spells by drawing sumi-e calligraphy in real time and duel across hand painted ink arenas. Built solo in a single canvas file, with a live tutorial, online play and four elemental masters.",
        accent: "#cf5240",
        logo: "/projects/rakugaki.png",
        links: [{ label: "Play ↗", href: "https://rakugaki-deploy.vercel.app" }],
    },
    {
        id: "arquivonos",
        name: "ARQUIVO NÓS",
        type: "Territorial Memory · Open Data",
        year: "2026",
        blurb:
            "Everything Galicia knows about itself, on one map. Point at any place and it gathers the land, the history, the people and the heritage of that spot, across three hundred and thirteen councils and three thousand seven hundred parishes, with the open source behind every fact. The map also travels back to the 1956 aerial survey and Fontán's 1845 chart. Written in Galician.",
        accent: "#8fa76b",
        logo: "/projects/arquivonos.svg",
        links: [{ label: "Live ↗", href: "https://arquivonos.com" }],
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
