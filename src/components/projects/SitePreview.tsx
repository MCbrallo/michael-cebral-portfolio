"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    url: string;
    /** Screenshot in public/projects/previews, shown while the site loads. */
    poster: string;
    name: string;
    /** The card is open and steady, so the real site may start loading. */
    open: boolean;
    /** Sites answering X-Frame-Options DENY can only ever show the poster. */
    embeddable: boolean;
    /** Fills its column instead of sitting beside the text, for the flagships. */
    grande?: boolean;
};

/** The site loads at desktop width and is scaled down to fit the card. */
const ANCHO = 1280;
const ALTO = 800;

const dominio = (url: string) => {
    try {
        return new URL(url).host.replace(/^www\./, "");
    } catch {
        return url;
    }
};

export function SitePreview({ url, poster, name, open, embeddable, grande }: Props) {
    const marco = useRef<HTMLDivElement>(null);
    const [escala, setEscala] = useState(0);
    const [cargada, setCargada] = useState(false);

    // The card width is fluid, so the scale that fits a 1280px page inside it
    // has to be measured rather than written down.
    useEffect(() => {
        const el = marco.current;
        if (!el) return;
        // Only react to a real change. Writing the same scale back would make
        // the observer fire again on its own notification, and a
        // ResizeObserver loop pegs the main thread of the whole page.
        const medir = () => {
            const k = el.clientWidth / ANCHO;
            setEscala((previo) => (Math.abs(previo - k) < 0.0005 ? previo : k));
        };
        medir();
        const observador = new ResizeObserver(medir);
        observador.observe(el);
        return () => observador.disconnect();
    }, []);

    // A site that is dropped and hovered again should fade in cleanly.
    useEffect(() => {
        if (!open) setCargada(false);
    }, [open]);

    const vivo = open && embeddable && escala > 0;

    return (
        <div className={`proj-preview${grande ? " is-grande" : ""}`}>
            <div className="proj-preview-bar">
                <span className="proj-preview-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </span>
                <span className="proj-preview-host">{dominio(url)}</span>
            </div>
            <div className="proj-preview-stage" ref={marco}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="proj-preview-poster"
                    src={poster}
                    alt={`${name} website`}
                    loading="lazy"
                />
                {vivo && (
                    <iframe
                        className={`proj-preview-frame${cargada ? " is-live" : ""}`}
                        src={url}
                        title={`${name} live preview`}
                        style={{
                            width: ANCHO,
                            height: ALTO,
                            transform: `scale(${escala})`,
                        }}
                        onLoad={() => setCargada(true)}
                        sandbox="allow-scripts allow-same-origin"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                )}
                <span className="proj-preview-flag">
                    <i className="proj-preview-pulse" aria-hidden="true" />
                    {embeddable ? "Live" : "Preview"}
                </span>
            </div>
        </div>
    );
}
