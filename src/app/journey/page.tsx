import type { Metadata } from "next";
import { JourneyFilm } from "@/components/journey/JourneyFilm";

export const metadata: Metadata = {
    title: "The Journey | Michael Cebral",
    description:
        "From the Roman wall of Lugo to ESTEC. A scrolled film of one continuous thread across biology and space.",
};

export default function JourneyPage() {
    return <JourneyFilm />;
}
