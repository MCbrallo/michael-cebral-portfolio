import { ProjectsPage } from "@/components/projects/ProjectsPage";

export const metadata = {
    title: "Projects",
    description:
        "Nine projects at the intersection of Earth observation, space science, communication and engineering. Space market intelligence, an Earth observation game, a territorial archive of Galicia and more, all live and built solo.",
    alternates: { canonical: "/projects" },
};

export default function Page() {
    return <ProjectsPage />;
}
