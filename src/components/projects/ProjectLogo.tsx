import type { Project } from "@/data/projects";

/** HOXE has no logo file: its mark is an editorial crossed page, drawn here. */
export function ProjectLogo({ project }: { project: Project }) {
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
