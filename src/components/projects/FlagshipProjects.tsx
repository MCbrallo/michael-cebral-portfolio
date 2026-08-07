"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { SitePreview } from "@/components/projects/SitePreview";
import { ProjectLogo } from "@/components/projects/ProjectLogo";
import { projects } from "@/data/projects";

const flagships = projects.filter((p) => p.flagship);

type Props = {
    /** Small line above the heading. */
    eyebrow: string;
    heading: string;
    /** Shown under the last band, when there is somewhere else to go. */
    masHref?: string;
    masLabel?: string;
};

const youtube = (id: string, start?: number) =>
    `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`;

export function FlagshipProjects({ eyebrow, heading, masHref, masLabel }: Props) {
    // The band the reader has arrived at is the one that runs its site. One
    // at a time, so scrolling the page never leaves three apps loaded behind.
    const [vivo, setVivo] = useState<string | null>(null);
    const bandas = useRef(new Map<string, HTMLElement>());

    // Phones have no room for a site inside a card, and no hover to ask for it.
    const [conSitio, setConSitio] = useState(false);
    useEffect(() => {
        const consulta = window.matchMedia("(min-width: 861px)");
        const sincronizar = () => setConSitio(consulta.matches);
        sincronizar();
        consulta.addEventListener("change", sincronizar);
        return () => consulta.removeEventListener("change", sincronizar);
    }, []);

    useEffect(() => {
        if (!conSitio) {
            setVivo(null);
            return;
        }
        // Whichever band is showing most of itself wins. Ties do not matter:
        // the observer fires again on the next scroll and settles.
        const observador = new IntersectionObserver(
            (entradas) => {
                let mejor: string | null = null;
                let mejorRatio = 0.55;
                for (const [id, el] of bandas.current) {
                    const entrada = entradas.find((e) => e.target === el);
                    const ratio = entrada?.intersectionRatio ?? 0;
                    if (ratio > mejorRatio) {
                        mejorRatio = ratio;
                        mejor = id;
                    }
                }
                if (mejor) setVivo(mejor);
            },
            { threshold: [0, 0.25, 0.55, 0.75, 1] }
        );
        for (const el of bandas.current.values()) observador.observe(el);
        return () => observador.disconnect();
    }, [conSitio]);

    return (
        <section className="flag-wrap">
            <header className="flag-intro">
                <p className="flag-eyebrow">{eyebrow}</p>
                <h2 className="flag-heading font-serif">{heading}</h2>
            </header>

            {flagships.map((p, i) => {
                const sitio = p.previewUrl ?? p.links?.[0]?.href;
                return (
                    <article
                        key={p.id}
                        ref={(el) => {
                            if (el) bandas.current.set(p.id, el);
                            else bandas.current.delete(p.id);
                        }}
                        className={`flag${i % 2 ? " is-mirrored" : ""}${vivo === p.id ? " is-live" : ""}`}
                        style={{ "--accent": p.accent } as CSSProperties}
                        onPointerEnter={() => conSitio && setVivo(p.id)}
                    >
                        <div className="flag-media">
                            {sitio && (
                                <SitePreview
                                    url={sitio}
                                    poster={`/projects/previews/${p.id}.jpg`}
                                    name={p.name}
                                    open={conSitio && vivo === p.id}
                                    embeddable={p.embeddable !== false}
                                    grande
                                />
                            )}
                        </div>

                        <div className="flag-body">
                            <div className="flag-head">
                                <span className="flag-logo">
                                    <ProjectLogo project={p} />
                                </span>
                                <span className="flag-titles">
                                    <h3 className="flag-name">{p.name}</h3>
                                    <span className="flag-meta">
                                        {p.type} · {p.year}
                                    </span>
                                </span>
                            </div>

                            {p.proof && <p className="flag-proof">{p.proof}</p>}
                            <p className="flag-blurb">{p.blurb}</p>

                            <div className="flag-actions">
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
                                {p.video && (
                                    <a
                                        href={youtube(p.video.id, p.video.start)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flag-second"
                                    >
                                        {p.video.label} ↗
                                    </a>
                                )}
                                {p.status && <span className="proj-status">{p.status}</span>}
                            </div>
                        </div>
                    </article>
                );
            })}

            {masHref && (
                <Link href={masHref} className="flag-mas">
                    {masLabel}
                    <span aria-hidden="true">→</span>
                </Link>
            )}
        </section>
    );
}
