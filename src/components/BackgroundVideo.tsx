"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = () => {
            if (!video.paused) return;
            video.play().catch(e => {
                console.error("Video autoplay blocked:", e);
            });
        };

        // Attempt immediately
        attemptPlay();

        // If it got blocked (low power mode, etc.), retry on the first user interaction
        const onInteract = () => {
            attemptPlay();
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("click", onInteract);
            window.removeEventListener("scroll", onInteract);
        };

        window.addEventListener("touchstart", onInteract, { passive: true });
        window.addEventListener("click", onInteract, { passive: true });
        window.addEventListener("scroll", onInteract, { passive: true });

        return () => {
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("click", onInteract);
            window.removeEventListener("scroll", onInteract);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
        >
            <source src="/galaxy.webm" type="video/webm" />
            <source src="/galaxy.mp4" type="video/mp4" />
        </video>
    );
}
