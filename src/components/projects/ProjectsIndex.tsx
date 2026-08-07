"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ProjectVideo } from "@/components/ProjectVideo";
import { SitePreview } from "@/components/projects/SitePreview";
import { projects, type Project } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/** Milliseconds of steady hover before a site is allowed to start loading. */
const ESPERA = 320;

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

export function ProjectsIndex() {
    // Only one project keeps a live site loaded at a time. Moving to another
    // row drops the previous one, so the page never runs nine apps at once.
    const [vivo, setVivo] = useState<string | null>(null);
    const reloj = useRef<number | null>(null);

    // Phones have no hover and the preview is hidden there, so nothing loads.
    const [conRaton, setConRaton] = useState(false);
    useEffect(() => {
        const consulta = window.matchMedia("(hover: hover) and (min-width: 701px)");
        const sincronizar = () => setConRaton(consulta.matches);
        sincronizar();
        consulta.addEventListener("change", sincronizar);
        return () => consulta.removeEventListener("change", sincronizar);
    }, []);

    useEffect(() => {
        return () => {
            if (reloj.current) window.clearTimeout(reloj.current);
        };
    }, []);

    const programar = (id: string | null) => {
        if (reloj.current) window.clearTimeout(reloj.current);
        reloj.current = window.setTimeout(() => setVivo(id), ESPERA);
    };

    return (
        <div className="proj-index" onPointerLeave={() => programar(null)}>
            {projects.map((p, i) => {
                const sitio = p.previewUrl ?? p.links?.[0]?.href;
                // The two projects with a talk keep the talk: it is stronger
                // proof than a screenshot, and both would crowd the card.
                const preview = !p.video && sitio;

                return (
                    <div
                        key={p.id}
                        className="proj-item"
                        tabIndex={0}
                        style={{ "--accent": p.accent } as CSSProperties}
                        onPointerEnter={() => programar(p.id)}
                        onFocus={() => programar(p.id)}
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
                                            <div className="proj-desc-body">
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
                                                    {p.status && (
                                                        <span className="proj-status">{p.status}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {p.video && <ProjectVideo {...p.video} accent={p.accent} />}
                                            {preview && (
                                                <SitePreview
                                                    url={sitio}
                                                    poster={`/projects/previews/${p.id}.jpg`}
                                                    name={p.name}
                                                    open={conRaton && vivo === p.id}
                                                    embeddable={p.embeddable !== false}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
