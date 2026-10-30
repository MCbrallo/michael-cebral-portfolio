"use client";

import { ProjectConsole } from "@/components/projects/ProjectConsole";

/**
 * The page itself stays a server component so it can declare its metadata.
 *
 * The projects are cartridges. A visitor drags one into the console: the top
 * screen runs the live site, the ink screen below carries the description.
 * The page is exactly one screen tall and never scrolls.
 */
export function ProjectsPage() {
    return (
        <div className="pc-page text-white relative flex flex-col overflow-clip">
            <div className="flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-3 md:px-10 pt-[72px] md:pt-[92px] pb-2 md:pb-5 relative z-[2] flex flex-col">
                <ProjectConsole />
            </div>
        </div>
    );
}
