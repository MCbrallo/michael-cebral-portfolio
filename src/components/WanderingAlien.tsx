"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface WanderingAlienProps {
    onCatch: () => void;
}

// Classic Space-Invader sprite drawn with box-shadow pixels (two marching frames).
const FRAME_A =
    "18px 0px 0 0 currentColor, 72px 0px 0 0 currentColor, 27px 9px 0 0 currentColor, 63px 9px 0 0 currentColor, 18px 18px 0 0 currentColor, 27px 18px 0 0 currentColor, 36px 18px 0 0 currentColor, 45px 18px 0 0 currentColor, 54px 18px 0 0 currentColor, 63px 18px 0 0 currentColor, 72px 18px 0 0 currentColor, 9px 27px 0 0 currentColor, 18px 27px 0 0 currentColor, 36px 27px 0 0 currentColor, 45px 27px 0 0 currentColor, 54px 27px 0 0 currentColor, 72px 27px 0 0 currentColor, 81px 27px 0 0 currentColor, 0px 36px 0 0 currentColor, 9px 36px 0 0 currentColor, 18px 36px 0 0 currentColor, 27px 36px 0 0 currentColor, 36px 36px 0 0 currentColor, 45px 36px 0 0 currentColor, 54px 36px 0 0 currentColor, 63px 36px 0 0 currentColor, 72px 36px 0 0 currentColor, 81px 36px 0 0 currentColor, 90px 36px 0 0 currentColor, 0px 45px 0 0 currentColor, 18px 45px 0 0 currentColor, 27px 45px 0 0 currentColor, 36px 45px 0 0 currentColor, 45px 45px 0 0 currentColor, 54px 45px 0 0 currentColor, 63px 45px 0 0 currentColor, 72px 45px 0 0 currentColor, 90px 45px 0 0 currentColor, 0px 54px 0 0 currentColor, 18px 54px 0 0 currentColor, 72px 54px 0 0 currentColor, 90px 54px 0 0 currentColor, 27px 63px 0 0 currentColor, 36px 63px 0 0 currentColor, 54px 63px 0 0 currentColor, 63px 63px 0 0 currentColor";
const FRAME_B =
    "18px 0px 0 0 currentColor, 72px 0px 0 0 currentColor, 0px 9px 0 0 currentColor, 27px 9px 0 0 currentColor, 63px 9px 0 0 currentColor, 90px 9px 0 0 currentColor, 0px 18px 0 0 currentColor, 18px 18px 0 0 currentColor, 27px 18px 0 0 currentColor, 36px 18px 0 0 currentColor, 45px 18px 0 0 currentColor, 54px 18px 0 0 currentColor, 63px 18px 0 0 currentColor, 72px 18px 0 0 currentColor, 90px 18px 0 0 currentColor, 0px 27px 0 0 currentColor, 9px 27px 0 0 currentColor, 18px 27px 0 0 currentColor, 36px 27px 0 0 currentColor, 45px 27px 0 0 currentColor, 54px 27px 0 0 currentColor, 72px 27px 0 0 currentColor, 81px 27px 0 0 currentColor, 90px 27px 0 0 currentColor, 0px 36px 0 0 currentColor, 9px 36px 0 0 currentColor, 18px 36px 0 0 currentColor, 27px 36px 0 0 currentColor, 36px 36px 0 0 currentColor, 45px 36px 0 0 currentColor, 54px 36px 0 0 currentColor, 63px 36px 0 0 currentColor, 72px 36px 0 0 currentColor, 81px 36px 0 0 currentColor, 90px 36px 0 0 currentColor, 9px 45px 0 0 currentColor, 18px 45px 0 0 currentColor, 27px 45px 0 0 currentColor, 36px 45px 0 0 currentColor, 45px 45px 0 0 currentColor, 54px 45px 0 0 currentColor, 63px 45px 0 0 currentColor, 72px 45px 0 0 currentColor, 81px 45px 0 0 currentColor, 18px 54px 0 0 currentColor, 72px 54px 0 0 currentColor, 9px 63px 0 0 currentColor, 81px 63px 0 0 currentColor";

const MESSAGES: Record<string, string> = {
    en: "We have watched this coast for a long time. Its rain, its grey light, its sea that never lets go of the land.\nWe have come to reclaim Galicia.\nDecide before the tide turns.",
    es: "Llevamos mucho tiempo observando esta costa. Su lluvia, su luz gris, su mar que nunca suelta la tierra.\nHemos venido a reclamar Galicia.\nDecide antes de que cambie la marea.",
    gl: "Levamos moito tempo observando esta costa. A súa choiva, a súa luz gris, o seu mar que nunca solta a terra.\nViñemos reclamar Galicia.\nDecide antes de que cambie a marea.",
};

const SCRAMBLE = "#%&*+=<>/:;~!?ΞΨΔΩ░▒▓";
const NAME_GLYPHS =
    "⟒⊑⌖⟟⍍⟁⎔⏃⍜⋔⟓◇⌿⊰⊱ΞΨΔΩ";

export function WanderingAlien({ onCatch }: WanderingAlienProps) {
    const { language } = useLanguage();

    const [pos, setPos] = useState({ ax: "-220px", ay: "140px", adur: "0ms" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deco, setDeco] = useState("");
    const [decoTarget, setDecoTarget] = useState("");
    const [alienName, setAlienName] = useState("");

    const dialogOpenRef = useRef(false);
    const stepsRef = useRef<{ x: number; y: number; dur: number; hold: number }[]>([]);
    const stepT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cycleT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const decoT = useRef<ReturnType<typeof setInterval> | null>(null);
    const nameT = useRef<ReturnType<typeof setInterval> | null>(null);
    const decoTargetRef = useRef("");
    const decoPosRef = useRef(0);
    const langRef = useRef(language);
    langRef.current = language;
    const startCycleRef = useRef<() => void>(() => {});

    useEffect(() => {
        const rnd = (a: number, b: number) => a + Math.random() * (b - a);
        const ri = (a: number, b: number) => Math.round(rnd(a, b));

        const play = (i: number) => {
            if (dialogOpenRef.current) return;
            const steps = stepsRef.current;
            if (i >= steps.length) {
                cycleT.current = setTimeout(startCycle, ri(16000, 34000));
                return;
            }
            const s = steps[i];
            setPos({ ax: Math.round(s.x) + "px", ay: Math.round(s.y) + "px", adur: s.dur + "ms" });
            stepT.current = setTimeout(() => play(i + 1), s.dur + s.hold);
        };

        const startCycle = () => {
            if (dialogOpenRef.current) return;
            const W = window.innerWidth, H = window.innerHeight, AW = 84, AH = 62;
            const minX = 24, maxX = Math.max(minX + 40, W - AW - 24);
            const minY = 84, maxY = Math.max(minY + 40, H - AH - 100);
            const edge = (["left", "right", "top"] as const)[ri(0, 2)];
            let sx, sy, px, py;
            if (edge === "left") { sx = -AW - 20; sy = rnd(minY, maxY); px = rnd(minX, minX + W * 0.14); py = sy; }
            else if (edge === "right") { sx = W + 20; sy = rnd(minY, maxY); px = rnd(maxX - W * 0.14, maxX); py = sy; }
            else { sx = rnd(minX, maxX); sy = -AH - 20; px = sx; py = rnd(minY, minY + H * 0.14); }

            const steps: { x: number; y: number; dur: number; hold: number }[] = [];
            steps.push({ x: sx, y: sy, dur: 0, hold: 80 });
            steps.push({ x: px, y: py, dur: ri(1300, 1700), hold: ri(500, 1100) });
            if (Math.random() < 0.55) {
                let bx = edge === "left" ? px - rnd(20, 70) : edge === "right" ? px + rnd(20, 70) : px + rnd(-50, 50);
                const by = edge === "top" ? py - rnd(20, 55) : py + rnd(-30, 30);
                bx = Math.max(Math.min(bx, maxX), Math.min(sx, minX));
                steps.push({ x: bx, y: by, dur: ri(600, 950), hold: ri(300, 700) });
            }
            const n = ri(2, 4);
            for (let i = 0; i < n; i++) steps.push({ x: rnd(minX, maxX), y: rnd(minY, maxY), dur: ri(1900, 3400), hold: ri(250, 950) });
            const xe = (["left", "right", "top", "bottom"] as const)[ri(0, 3)];
            let ex, ey;
            if (xe === "left") { ex = -AW - 30; ey = rnd(minY, maxY); }
            else if (xe === "right") { ex = W + 30; ey = rnd(minY, maxY); }
            else if (xe === "top") { ex = rnd(minX, maxX); ey = -AH - 30; }
            else { ex = rnd(minX, maxX); ey = H + 30; }
            steps.push({ x: ex, y: ey, dur: ri(1400, 1800), hold: 0 });
            stepsRef.current = steps;
            play(0);
        };
        startCycleRef.current = startCycle;

        // First appearance after a short, noticeable delay.
        const first = setTimeout(startCycle, ri(6000, 12000));

        return () => {
            clearTimeout(first);
            if (stepT.current) clearTimeout(stepT.current);
            if (cycleT.current) clearTimeout(cycleT.current);
            if (decoT.current) clearInterval(decoT.current);
            if (nameT.current) clearInterval(nameT.current);
        };
    }, []);

    // ---- transmission ----
    const nameStep = () => {
        let s = "";
        for (let i = 0; i < 6; i++) s += NAME_GLYPHS[Math.floor(Math.random() * NAME_GLYPHS.length)];
        setAlienName(s);
    };

    const decodeStep = () => {
        const target = decoTargetRef.current || "";
        decoPosRef.current += 2;
        const reveal = Math.floor(decoPosRef.current);
        if (reveal >= target.length) {
            if (decoT.current) clearInterval(decoT.current);
            setDeco(target);
            return;
        }
        let out = "";
        for (let i = 0; i < target.length; i++) {
            const ch = target[i];
            if (i < reveal) out += ch;
            else if (ch === "\n") out += "\n";
            else if (ch === " ") out += " ";
            else if (i < reveal + 9) out += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
            else out += " ";
        }
        setDeco(out);
    };

    const openDialog = () => {
        if (stepT.current) clearTimeout(stepT.current);
        if (cycleT.current) clearTimeout(cycleT.current);
        dialogOpenRef.current = true;
        setDialogOpen(true);

        // alien name — glyphs that never resolve
        if (nameT.current) clearInterval(nameT.current);
        nameStep();
        nameT.current = setInterval(nameStep, 95);

        // body — scramble that decodes
        const text = MESSAGES[langRef.current] || MESSAGES.en;
        if (decoT.current) clearInterval(decoT.current);
        decoTargetRef.current = text;
        decoPosRef.current = 0;
        setDeco("");
        setDecoTarget(text);
        decoT.current = setInterval(decodeStep, 38);
    };

    const closeDialog = () => {
        if (decoT.current) clearInterval(decoT.current);
        if (nameT.current) clearInterval(nameT.current);
        dialogOpenRef.current = false;
        setDialogOpen(false);
        setDeco(""); setDecoTarget(""); setAlienName("");
        // resume wandering shortly after
        cycleT.current = setTimeout(() => {
            if (!dialogOpenRef.current) startCycleRef.current();
        }, 150);
    };

    return (
        <>
            <style>{`
                @keyframes inv-f1 { 0%,49.9%{opacity:1} 50%,100%{opacity:0} }
                @keyframes inv-f2 { 0%,49.9%{opacity:0} 50%,100%{opacity:1} }
                @keyframes gz-floaty { 0%,100%{transform:translateY(0) rotate(-2.5deg)} 50%{transform:translateY(-9px) rotate(2.5deg)} }
                @keyframes gz-fade { 0%{opacity:0} 100%{opacity:1} }
                @keyframes gz-pop { 0%{transform:translateY(16px) scale(.97);opacity:0} 100%{transform:translateY(0) scale(1);opacity:1} }
                @keyframes gz-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
                @media (prefers-reduced-motion: reduce) {
                    .alien-floaty { animation: none !important; }
                }
            `}</style>

            {/* Alien — random wander */}
            <div
                className="fixed left-0 top-0 z-[60]"
                style={{
                    pointerEvents: "none",
                    transition: `transform ${pos.adur} cubic-bezier(.37,.16,.31,1)`,
                    transform: `translate3d(${pos.ax}, ${pos.ay}, 0)`,
                    willChange: "transform",
                    visibility: dialogOpen ? "hidden" : "visible",
                }}
            >
                <div
                    onClick={openDialog}
                    style={{ pointerEvents: "auto", cursor: "pointer", width: 99, height: 72, transform: "scale(0.8)", transformOrigin: "top left" }}
                    role="button"
                    aria-label="Alien"
                >
                    <div className="alien-floaty" style={{ animation: "gz-floaty 3.2s ease-in-out infinite" }}>
                        <div
                            style={{
                                position: "relative",
                                width: 99, height: 72,
                                color: "#6CF0B0",
                                filter: "drop-shadow(0 0 7px rgba(108,240,176,.9)) drop-shadow(0 0 20px rgba(108,240,176,.45))",
                            }}
                        >
                            <div style={{ position: "absolute", left: 0, top: 0, width: 9, height: 9, boxShadow: FRAME_A, animation: "inv-f1 .6s steps(1,end) infinite" }} />
                            <div style={{ position: "absolute", left: 0, top: 0, width: 9, height: 9, boxShadow: FRAME_B, animation: "inv-f2 .6s steps(1,end) infinite" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transmission dialog */}
            {dialogOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-hidden font-mono"
                    style={{ background: "rgba(4,9,16,.95)", animation: "gz-fade .35s ease-out" }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(circle at 50% 40%, rgba(34,92,160,.42), transparent 58%), radial-gradient(circle at 50% 50%, transparent 46%, rgba(0,0,0,.62))" }}
                    />

                    <button
                        type="button"
                        onClick={closeDialog}
                        className="absolute top-7 right-9 z-[2] cursor-pointer bg-transparent border-0 text-[15px] transition-colors"
                        style={{ color: "#7f93a6" }}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <div className="relative z-[1] text-center" style={{ width: "min(520px,92vw)", animation: "gz-pop .5s cubic-bezier(.2,1.04,.35,1)" }}>
                        {/* sender — glyphs that never decode */}
                        <div style={{ fontSize: "clamp(28px,5.5vw,46px)", letterSpacing: "13px", color: "#eaf2fb", textShadow: "0 0 20px rgba(90,160,230,.55)", paddingLeft: 13 }}>
                            {alienName}
                        </div>
                        <div style={{ fontSize: "8.5px", letterSpacing: "5px", color: "#6f9bc4", marginTop: 14 }}>ORIGIN UNTRANSLATABLE</div>

                        <div style={{ width: 60, height: 1, margin: "26px auto", background: "linear-gradient(90deg,transparent,rgba(90,160,230,.75),transparent)" }} />

                        {/* message: scramble -> decode */}
                        <div style={{ position: "relative", fontSize: "11.5px", lineHeight: 2.05, letterSpacing: "1.5px", maxWidth: 380, margin: "0 auto" }}>
                            <div style={{ visibility: "hidden", whiteSpace: "pre-wrap" }}>{decoTarget}</div>
                            <div style={{ position: "absolute", inset: 0, whiteSpace: "pre-wrap", color: "#eef3f8" }}>
                                {deco}
                                <span style={{ color: "#5aa0e6", animation: "gz-blink 1s steps(1) infinite" }}>▋</span>
                            </div>
                        </div>

                        {/* single action -> launch the minigame */}
                        <button
                            type="button"
                            onClick={onCatch}
                            className="mt-9 cursor-pointer border-0 font-bold transition-transform hover:-translate-y-px"
                            style={{ fontSize: "12px", letterSpacing: "3px", color: "#06101a", background: "#f3f8fd", borderRadius: 3, padding: "15px 38px", boxShadow: "0 6px 24px rgba(40,110,200,.45)" }}
                        >
                            NUNCA MÁIS!
                        </button>

                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#3f80b0", marginTop: 28 }}>◇ BEARING · LUGO</div>
                    </div>
                </div>
            )}
        </>
    );
}
