import type { CSSProperties } from "react";
import { DisplayTitle } from "@/components/DisplayTitle";

export const metadata = {
    title: "Field Notes",
    description: "Places where Michael Cebral has studied, researched and worked.",
    alternates: { canonical: "/about/experiences" },
};

type Place = {
    num: string;
    name: string;
    meta: string;
    accent: string;
};

const places: Place[] = [
    { num: "01", name: "Spain", meta: "Galicia · Biotechnology, USC · 2019–2023", accent: "#f1b24a" },
    { num: "02", name: "United Kingdom", meta: "London · Pancreatic cancer research", accent: "#6ea8ff" },
    { num: "03", name: "Sweden", meta: "Stockholm · Karolinska & KTH · 2023–2025", accent: "#8ed973" },
    { num: "04", name: "Belgium", meta: "Transinne · ESA / ELGRA summer school · 2024", accent: "#f15a5a" },
    { num: "05", name: "France", meta: "Strasbourg · Space Studies, ISU · 2025–2027", accent: "#b48bff" },
    { num: "06", name: "Netherlands", meta: "Noordwijk · ESA ESTEC · 2026", accent: "#d8b878" },
];

export default function ExperiencesPage() {
    return (
        <div className="min-h-screen text-white relative flex flex-col">
            <main className="w-full max-w-[1080px] mx-auto px-6 md:px-14 pt-28 pb-16 relative z-[2]">
                <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-gold/70 mb-4">
                    Field · Trajectory · Sector {String(places.length).padStart(2, "0")}
                </p>
                <DisplayTitle text="Field Notes" />
                <p className="mt-6 max-w-xl text-base md:text-lg text-white/50 font-light leading-relaxed">
                    Where the work has taken me, from a Galician childhood to research labs and space programmes across Europe.
                </p>

                <div className="proj-index mt-12">
                    {places.map((pl) => (
                        <div
                            key={pl.name}
                            className="proj-item"
                            style={{ "--accent": pl.accent } as CSSProperties}
                        >
                            <div className="proj-row">
                                <span className="proj-num">{pl.num}</span>
                                <span className="proj-name">{pl.name}</span>
                                <span className="proj-meta">{pl.meta}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
