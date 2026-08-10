"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ProjectVideo } from "@/components/ProjectVideo";
import { SitePreview } from "@/components/projects/SitePreview";
import { ProjectLogo } from "@/components/projects/ProjectLogo";
import { useLanguage } from "@/context/LanguageContext";
import { projects as todos, type Project } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/** Milliseconds of steady hover before a site is allowed to start loading. */
const ESPERA = 320;

export function ProjectsIndex({ projects = todos }: { projects?: Project[] }) {
    const { language, t } = useLanguage();

    // Only one project keeps a live site loaded at a time. Moving to another
    // row drops the previous one, so the page never runs nine apps at once.
    const [vivo, setVivo] = useState<string | null>(null);
    const reloj = useRef<number | null>(null);

    // The row used to open on hover alone, with a tabindex on the wrapper so a
    // tap would land focus on it and the panel would follow. That works in
    // Chrome and is a coin toss in Safari on iOS, which does not reliably focus
    // a plain div. The header is a real button now: it opens on tap, closes on
    // the second tap, announces its state, and hover stays as it was for a
    // pointer. One open at a time, as before.
    const [abierto, setAbierto] = useState<string | null>(null);

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

                const abre = abierto === p.id;

                return (
                    <div
                        key={p.id}
                        className={`proj-item${abre ? " is-open" : ""}`}
                        style={{ "--accent": p.accent } as CSSProperties}
                        onPointerEnter={() => programar(p.id)}
                    >
                        <button
                            type="button"
                            className="proj-row"
                            aria-expanded={abre}
                            aria-controls={`proj-panel-${p.id}`}
                            onClick={() => setAbierto(abre ? null : p.id)}
                            onFocus={() => programar(p.id)}
                        >
                            <span className="proj-num">{pad(i + 1)}</span>
                            <span className="proj-name">{p.name}</span>
                            <span className="proj-meta">
                                {p.type[language]} · {p.year}
                            </span>
                            <span className="proj-chevron" aria-hidden="true" />
                        </button>
                        <div className="proj-panel" id={`proj-panel-${p.id}`}>
                            <div className="proj-panel-wrap">
                                <div className="proj-panel-inner">
                                    <div className="proj-card">
                                        <div className="proj-logo">
                                            <ProjectLogo project={p} />
                                        </div>
                                        <div className="proj-desc">
                                            <div className="proj-desc-body">
                                                {p.proof && (
                                                    <p className="proj-proof">{p.proof[language]}</p>
                                                )}
                                                <p>{p.blurb[language]}</p>
                                                <div className="proj-tags">
                                                    {p.links?.map((l) => (
                                                        <a
                                                            key={l.kind}
                                                            href={l.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="proj-link"
                                                        >
                                                            {l.kind === "play"
                                                                ? t.projects.linkPlay
                                                                : t.projects.linkLive}
                                                        </a>
                                                    ))}
                                                    {p.status && (
                                                        <span className="proj-status">{p.status}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {p.video && (
                                                <ProjectVideo
                                                    id={p.video.id}
                                                    start={p.video.start}
                                                    label={
                                                        p.video.kind === "pitch"
                                                            ? t.projects.videoPitch
                                                            : t.projects.videoTalk
                                                    }
                                                    accent={p.accent}
                                                />
                                            )}
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
