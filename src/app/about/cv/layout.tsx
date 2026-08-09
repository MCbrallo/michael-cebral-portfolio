import type { Metadata } from "next";

/** The CV page is a client component, so its metadata lives here. */
export const metadata: Metadata = {
    title: "CV",
    description:
        "Curriculum of Michael Cebral. Science communication, strategic communications and outreach, Earth observation and space. Four working languages, around thirty public talks since 2019.",
    alternates: { canonical: "/about/cv" },
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
    return children;
}
