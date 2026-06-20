// The Filament — journey chapter data.
// One source of storyboard truth for the /journey scroll film.
// CV facts here mirror src/data/experiences.json. The film is a projection of the CV,
// so every proof token below traces to a real entry. Keep copy simple and natural,
// with no hyphens or dashes as connectors (house style).

export interface JourneyRow {
    years: string;
    role: string;
    institution: string;
    proof?: string; // the single gold proof token for this row
}

export interface JourneyChapter {
    index: number;
    id: string; // anchor on this page
    place: string;
    coord: string; // decimal degrees label, telemetry styling
    phase: string; // CH.0x label word
    main?: JourneyRow; // primary credential surfaced over the footage
    extraRows?: JourneyRow[]; // additional rows (Stockholm fuses three)
    caption: string;
    cvAnchor: string; // deep link into /about/cv
    tint: string; // placeholder scene tint until the real frames land
    framesDir?: string; // when set, the engine loads <framesDir>/manifest.json and uses the real hyperrealistic frames for this chapter
    note?: string; // internal note, not rendered
}

export const JOURNEY: JourneyChapter[] = [
    {
        index: 1,
        id: "lugo",
        place: "Lugo",
        coord: "43.0097 N 7.5567 W",
        phase: "ORIGIN",
        caption: "Where the thread is born. Atlantic stone, rain, and roots.",
        cvAnchor: "/about/cv",
        tint: "#3a4a55", // wet slate blue hour
        framesDir: "/journey/lugo", // real hyperrealistic footage (Higgsfield)
    },
    {
        index: 2,
        id: "santiago",
        place: "Santiago de Compostela",
        coord: "42.8806 N 8.5446 W",
        phase: "THE WAY",
        main: {
            years: "2019 to 2023",
            role: "Bachelor in Biotechnology",
            institution: "Universidade de Santiago de Compostela",
            proof: "9.2 / 10 · Premio Extraordinario, top of class",
        },
        caption: "The end of the Camino. Three research placements at CiMUS.",
        cvAnchor: "/about/cv#santiago",
        tint: "#6b5630", // weathered granite gold
        framesDir: "/journey/santiago", // real hyperrealistic footage (Higgsfield)
    },
    {
        index: 3,
        id: "london",
        place: "London",
        coord: "51.5246 N 0.1340 W",
        phase: "THE PROBE",
        main: {
            years: "Jul to Sep 2022",
            role: "Research Intern",
            institution: "Pereira-Acedo Lab, ILDH, UCL",
            proof: "3D tumour spheroids",
        },
        caption: "Building tumours in miniature to test light driven medicine.",
        cvAnchor: "/about/cv#london",
        tint: "#46505a", // cool London overcast
    },
    {
        index: 4,
        id: "stockholm",
        place: "Stockholm",
        coord: "59.3499 N 18.0265 E",
        phase: "THE FUSION",
        main: {
            years: "2023 to 2025",
            role: "MSc Biomedicine",
            institution: "Karolinska Institutet",
            proof: "la Caixa full scholarship · VG",
        },
        extraRows: [
            {
                years: "2024",
                role: "Research Assistant",
                institution: "Anna Rising Lab, Karolinska",
                proof: "recombinant spider silk",
            },
            {
                years: "2024 to 2025",
                role: "Research Engineer",
                institution: "SciLifeLab and KTH",
                proof: "NASA Rodent Research 9 · spatial transcriptomics",
            },
        ],
        caption: "The thread becomes spider silk, then a map of genes that reads as a star field.",
        cvAnchor: "/about/cv#sweden",
        tint: "#2f4d63", // cold Nordic blue white
    },
    {
        index: 5,
        id: "strasbourg",
        place: "Strasbourg",
        coord: "48.5839 N 7.7455 E",
        phase: "LIFTOFF",
        main: {
            years: "2025 to 2027",
            role: "MSc Space Science",
            institution: "International Space University",
            proof: "Barrié Foundation full scholarship",
        },
        caption: "The bench lifts off. Biology trades the lab for orbit.",
        cvAnchor: "/about/cv#strasbourg",
        tint: "#5a3a52", // Alsace dusk
    },
    {
        index: 6,
        id: "estec",
        place: "ESTEC",
        coord: "52.2197 N 4.4221 E",
        phase: "DESTINATION",
        main: {
            years: "Jul to Sep 2026 · incoming",
            role: "Science Communication and Research Evaluation Intern",
            institution: "ESA, Exploration Science Office, ESTEC",
            proof: "ESA · human spaceflight programme",
        },
        caption: "The thread completes its orbit at ESA, then curves home to Galicia.",
        cvAnchor: "/about/cv",
        tint: "#1f5560", // North Sea maritime teal
        note: "Real incoming internship per CV (Jul to Sep 2026, Exploration Science Office). Mirror into experiences.json.",
    },
];

// Frames per chapter for the scrubbed sequence. With the procedural placeholder this only
// sets the scrub granularity. When the real Higgsfield frames land, FRAME_COUNT becomes the
// number of exported stills and drawFrame swaps to drawImage(bitmap).
export const FRAMES_PER_CHAPTER = 160;
export const FRAME_COUNT = JOURNEY.length * FRAMES_PER_CHAPTER;
