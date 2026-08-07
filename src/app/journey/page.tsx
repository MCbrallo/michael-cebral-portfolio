import type { Metadata } from "next";
import { JourneyFilm } from "@/components/journey/JourneyFilm";

export const metadata: Metadata = {
    // The name is added by the root template. Spelling it out here as well
    // produced "The Journey | Michael Cebral | Michael Cebral".
    title: "The Journey",
    description:
        "From the Roman wall of Lugo to ESTEC. A scrolled film of one continuous thread across biology and space.",
    alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
    return <JourneyFilm />;
}
