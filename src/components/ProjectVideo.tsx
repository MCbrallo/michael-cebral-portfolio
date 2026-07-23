"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

export type ProjectVideoData = {
    /** YouTube video id. */
    id: string;
    /** Optional start time in seconds. */
    start?: number;
    /** Call-to-action shown over the poster. */
    label?: string;
};

/**
 * Lightweight YouTube "facade": renders only the poster + a play button until
 * the visitor clicks, then swaps in the real iframe. No third-party script or
 * heavy embed loads on page view, so the projects index stays fast.
 */
export function ProjectVideo({
    id,
    start = 0,
    label = "Watch the presentation",
    accent,
}: ProjectVideoData & { accent?: string }) {
    const [playing, setPlaying] = useState(false);

    const src =
        `https://www.youtube-nocookie.com/embed/${id}` +
        `?autoplay=1&rel=0&modestbranding=1&color=white` +
        (start ? `&start=${start}` : "");
    // maxres isn't guaranteed; hqdefault always exists and looks crisp at this size.
    const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return (
        <div className="proj-video" style={{ "--accent": accent } as CSSProperties}>
            {playing ? (
                <iframe
                    src={src}
                    title={label}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    loading="lazy"
                />
            ) : (
                <button
                    type="button"
                    className="proj-video-poster"
                    onClick={() => setPlaying(true)}
                    aria-label={label}
                    style={{ backgroundImage: `url(${poster})` }}
                >
                    <span className="proj-video-scrim" aria-hidden="true" />
                    <span className="proj-video-play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                            <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                    </span>
                    <span className="proj-video-label">
                        <span className="proj-video-dot" aria-hidden="true" />
                        {label}
                    </span>
                </button>
            )}
        </div>
    );
}
