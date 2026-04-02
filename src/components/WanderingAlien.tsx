"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface WanderingAlienProps {
    onCatch: () => void;
}

type Phase = "hidden" | "crossing" | "dying" | "calling" | "done";

export function WanderingAlien({ onCatch }: WanderingAlienProps) {
    const [phase, setPhase] = useState<Phase>("hidden");
    const [frame, setFrame] = useState(0);
    const [callingDots, setCallingDots] = useState(0);
    const alienRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const frameInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Crossing config stored in ref to avoid re-renders
    const crossingRef = useRef({
        direction: "right" as "left" | "right",
        startY: 300,
        amplitude: 30 + Math.random() * 40,   // Y wave amplitude
        frequency: 0.003 + Math.random() * 0.002, // Y wave speed
        duration: 18 + Math.random() * 8,      // seconds to cross screen
    });

    const scheduleNext = useCallback((isFirst = false) => {
        const delay = isFirst ? 15000 + Math.random() * 15000 : 50000 + Math.random() * 20000;
        timerRef.current = setTimeout(() => {
            // Randomize crossing params
            const goRight = Math.random() > 0.5;
            crossingRef.current = {
                direction: goRight ? "right" : "left",
                startY: 120 + Math.random() * (window.innerHeight - 300),
                amplitude: 25 + Math.random() * 50,
                frequency: 0.002 + Math.random() * 0.003,
                duration: 16 + Math.random() * 10,
            };
            setPhase("crossing");
        }, delay);
    }, []);

    // Schedule first crossing
    useEffect(() => {
        scheduleNext(true);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [scheduleNext]);

    // Animate crossing using direct DOM manipulation (no React re-renders = no flicker)
    useEffect(() => {
        if (phase !== "crossing") return;

        const el = alienRef.current;
        if (!el) return;

        const { direction, startY, amplitude, frequency, duration } = crossingRef.current;
        const startX = direction === "right" ? -60 : window.innerWidth + 60;
        const endX = direction === "right" ? window.innerWidth + 80 : -80;
        const startTime = performance.now();
        const durationMs = duration * 1000;
        let legFrame = 0;

        // Leg animation (slower interval, won't cause flicker)
        frameInterval.current = setInterval(() => {
            legFrame++;
            setFrame(legFrame);
        }, 300);

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / durationMs, 1);

            // Smooth ease-in-out for X
            const easeT = t < 0.05 ? t * 20 * t : t > 0.95 ? 1 - (1 - t) * 20 * (1 - t) : t;
            const x = startX + (endX - startX) * easeT;

            // Organic Y drift: layered sine waves
            const yOffset = Math.sin(elapsed * frequency) * amplitude
                + Math.sin(elapsed * frequency * 1.7 + 2) * (amplitude * 0.4)
                + Math.sin(elapsed * frequency * 0.5 + 5) * (amplitude * 0.3);
            const y = startY + yOffset;

            // Gentle rotation based on Y velocity
            const yVelocity = Math.cos(elapsed * frequency) * amplitude * frequency
                + Math.cos(elapsed * frequency * 1.7 + 2) * (amplitude * 0.4) * frequency * 1.7;
            const rot = yVelocity * 15;

            el.style.transform = `translate(${x}px, ${y}px) scaleX(${direction === "left" ? -1 : 1}) rotate(${rot}deg)`;

            if (t >= 1) {
                // Crossed the screen, schedule next
                if (frameInterval.current) clearInterval(frameInterval.current);
                setPhase("hidden");
                scheduleNext(false);
                return;
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);

        return () => {
            if (frameInterval.current) clearInterval(frameInterval.current);
        };
    }, [phase, scheduleNext]);

    const handleClick = useCallback(() => {
        if (phase !== "crossing") return;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (frameInterval.current) clearInterval(frameInterval.current);

        // Freeze position — the CSS will handle the dying animation
        setPhase("dying");

        // After 1.5s dying, switch to calling
        setTimeout(() => {
            setPhase("calling");
            setCallingDots(0);
            let count = 0;
            const dotInterval = setInterval(() => {
                count++;
                setCallingDots(count);
                if (count >= 6) clearInterval(dotInterval);
            }, 280);

            // After 2s calling, launch game
            setTimeout(() => {
                setPhase("done");
                onCatch();
            }, 2000);
        }, 1500);
    }, [phase, onCatch]);

    if (phase === "hidden" || phase === "done") return null;

    const isDying = phase === "dying";
    const isCalling = phase === "calling";
    const alienColor = isDying ? "#ff3366" : isCalling ? "#ff6633" : "#33ff99";

    return (
        <>
            {/* Inline keyframes for dying animation */}
            <style>{`
                @keyframes alien-die {
                    0% { transform: scale(1) rotate(0deg); opacity: 1; }
                    10% { transform: scale(1.2) rotate(-10deg); opacity: 1; }
                    20% { transform: scale(0.9) rotate(12deg); opacity: 0.4; }
                    30% { transform: scale(1.1) rotate(-8deg); opacity: 1; }
                    40% { transform: scale(0.85) rotate(15deg); opacity: 0.3; }
                    50% { transform: scale(1.05) rotate(-5deg); opacity: 1; }
                    60% { transform: scale(0.8) rotate(10deg); opacity: 0.4; }
                    70% { transform: scale(0.9) rotate(-12deg); opacity: 0.9; }
                    80% { transform: scale(0.75) rotate(8deg); opacity: 0.5; }
                    90% { transform: scale(0.7) rotate(-3deg); opacity: 0.8; }
                    100% { transform: scale(0.65) rotate(0deg); opacity: 1; }
                }
                @keyframes alien-call-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes sos-appear {
                    0% { opacity: 0; transform: translateY(8px) scale(0.7); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes sos-pulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(255,50,50,0.3); }
                    50% { box-shadow: 0 0 20px rgba(255,50,50,0.6); }
                }
                @keyframes sos-shake {
                    0%, 100% { transform: translateX(-50%) rotate(0deg); }
                    25% { transform: translateX(-50%) rotate(-2deg) translateY(-1px); }
                    75% { transform: translateX(-50%) rotate(2deg) translateY(1px); }
                }
            `}</style>

            {/* Alien container - positioned via direct DOM in crossing, CSS anim in other phases */}
            <div
                ref={alienRef}
                className="fixed top-0 left-0 z-[100] select-none"
                style={{
                    cursor: phase === "crossing" ? "pointer" : "default",
                    pointerEvents: phase === "crossing" ? "auto" : "none",
                    willChange: "transform",
                }}
                onClick={handleClick}
            >
                {/* Inner wrapper for dying/calling animations (separate from position transform) */}
                <div
                    style={{
                        animation: isDying
                            ? "alien-die 1.5s ease-in-out forwards"
                            : isCalling
                                ? "alien-call-pulse 0.6s ease-in-out infinite"
                                : "none",
                    }}
                >
                    {/* SVG Alien */}
                    <svg width="40" height="32" viewBox="0 0 40 32" style={{ imageRendering: "pixelated" }}>
                        {frame % 2 === 0 ? (
                            <>
                                <rect x="16" y="0" width="8" height="4" fill={alienColor} />
                                <rect x="8" y="4" width="24" height="4" fill={alienColor} />
                                <rect x="4" y="8" width="32" height="4" fill={alienColor} />
                                <rect x="4" y="12" width="8" height="4" fill={alienColor} />
                                <rect x="20" y="12" width="8" height="4" fill={alienColor} />
                                <rect x="0" y="12" width="4" height="12" fill={alienColor} />
                                <rect x="28" y="12" width="4" height="12" fill={alienColor} />
                                <rect x="12" y="8" width="4" height="4" fill="#000" />
                                <rect x="24" y="8" width="4" height="4" fill="#000" />
                            </>
                        ) : (
                            <>
                                <rect x="16" y="0" width="8" height="4" fill={alienColor} />
                                <rect x="8" y="4" width="24" height="4" fill={alienColor} />
                                <rect x="4" y="8" width="32" height="4" fill={alienColor} />
                                <rect x="4" y="12" width="8" height="4" fill={alienColor} />
                                <rect x="20" y="12" width="8" height="4" fill={alienColor} />
                                <rect x="8" y="16" width="4" height="8" fill={alienColor} />
                                <rect x="24" y="16" width="4" height="8" fill={alienColor} />
                                <rect x="12" y="8" width="4" height="4" fill="#000" />
                                <rect x="24" y="8" width="4" height="4" fill="#000" />
                            </>
                        )}
                        {/* X eyes when dying/calling */}
                        {(isDying || isCalling) && (
                            <>
                                <rect x="11" y="7" width="2" height="2" fill="#fff" />
                                <rect x="15" y="11" width="2" height="2" fill="#fff" />
                                <rect x="13" y="9" width="2" height="2" fill="#fff" />
                                <rect x="23" y="7" width="2" height="2" fill="#fff" />
                                <rect x="27" y="11" width="2" height="2" fill="#fff" />
                                <rect x="25" y="9" width="2" height="2" fill="#fff" />
                            </>
                        )}
                    </svg>

                    {/* Glow - only during dying/calling, no green glow */}
                    <div
                        className="absolute inset-0 rounded-full blur-xl pointer-events-none"
                        style={{
                            background: alienColor,
                            opacity: isDying ? 0.5 : isCalling ? 0.6 : 0,
                            transform: "scale(2)",
                            transition: "opacity 0.3s, background 0.3s",
                        }}
                    />
                </div>

                {/* SOS bubble when calling */}
                {isCalling && (
                    <div
                        style={{ transform: `scaleX(${crossingRef.current.direction === "left" ? -1 : 1})` }}
                    >
                        <div
                            className="absolute -top-24 left-1/2 whitespace-nowrap"
                            style={{ animation: "sos-appear 0.3s ease-out, sos-shake 0.15s ease-in-out infinite 0.3s", transform: "translateX(-50%)" }}
                        >
                            <div className="bg-gradient-to-r from-red-600/95 to-red-800/95 text-white px-5 py-2.5 rounded-lg text-base font-mono font-black shadow-xl shadow-red-500/40 relative border border-red-400/30" style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)" }}>
                                <span className="animate-pulse tracking-wider">SCREW YOU!</span>
                                <span className="text-red-200 tracking-wide">{" "}HELP{".".repeat(Math.min(callingDots, 3))}</span>
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-700/95 rotate-45" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
