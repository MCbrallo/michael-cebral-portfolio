import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/data/projects";

/* ── The face of a cartridge: shell, label and the name on tape.
   Every label is a full bleed print made from the project's own logo, in the
   spirit of a screen print or a riso run. The name is written in marker on a
   strip of masking tape stuck over the print, the way a collector labels a
   shelf. Label coordinates are label pixels (LW x LH). ── */
const LW = 152;
const LH = 86;

/* Integer hash: the same on the server and in every browser, so the
   generated patterns hydrate without a mismatch */
function hash(n: number) {
    let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35) >>> 0;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

/** A logo used as a stencil: its shape, filled with any paint. */
function Ink({ src, fill, style, className }: { src: string; fill: string; style: CSSProperties; className?: string }) {
    return (
        <span
            className={`cv-ink${className ? ` ${className}` : ""}`}
            aria-hidden="true"
            style={{ ...style, background: fill, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
        />
    );
}

function Svg({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    return (
        <svg className="cv-svg" viewBox={`0 0 ${LW} ${LH}`} preserveAspectRatio="none" aria-hidden="true" style={style}>
            {children}
        </svg>
    );
}

/* ── ALL-IN SPACE: deep orbit ── */
const STARS = Array.from({ length: 40 }, (_, i) => ({
    x: +(hash(i * 3 + 1) * LW).toFixed(1),
    y: +(hash(i * 3 + 2) * LH).toFixed(1),
    r: +(0.45 + hash(i * 3 + 3) * 0.8).toFixed(2),
    o: +(0.45 + hash(i * 7 + 5) * 0.55).toFixed(2),
}));
/* A few bright ones with a cross flare */
const FLARES = [[22, 66, 3.2], [64, 14, 2.4], [140, 10, 2.8]] as const;

function OrbitCover({ p }: { p: Project }) {
    const orbit = "translate(104 62) rotate(-15)";
    /* The mark fills x .12 to .88 and y .23 to .74 of its square: whole, cut only by the bottom edge */
    const mark: CSSProperties = { width: 112, height: 112, left: 56, top: 4, transform: "rotate(-8deg)" };
    return (
        <>
            <span className="cv-fill" style={{ background: "radial-gradient(90% 120% at 92% 112%, #ff63b8 0%, #8a3dff 26%, #261063 52%, #0a0820 82%, #06051a 100%)" }} />
            <Svg>
                {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />)}
                {FLARES.map(([x, y, r], i) => (
                    <g key={i} stroke="#fff" strokeLinecap="round" strokeWidth=".6">
                        <path d={`M${x - r * 1.8} ${y} h${r * 3.6} M${x} ${y - r * 1.8} v${r * 3.6}`} opacity=".8" />
                        <circle cx={x} cy={y} r={r * 0.32} fill="#fff" stroke="none" />
                    </g>
                ))}
                <g transform={orbit}><path d="M -76 0 A 76 17 0 0 1 76 0" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1" /></g>
            </Svg>
            <Ink src={p.logo} fill="#b47dff" className="cv-glow" style={mark} />
            <Ink src={p.logo} fill="linear-gradient(165deg, #fbf4ff 22%, #d6b8ff 42%, #b48bff 58%, #ff79d0 80%)" style={mark} />
            <Svg>
                <g transform={orbit}>
                    <path d="M 76 0 A 76 17 0 0 1 -76 0" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="1.1" />
                    <circle cx="-44" cy="13.9" r="2.1" fill="#fff" />
                    <circle cx="-44" cy="13.9" r="5" fill="#fff" opacity=".2" />
                </g>
            </Svg>
        </>
    );
}

/* ── ROADMAP: a cyanotype of the globe and its orbits, made at the International Space University ── */
function CyanotypeCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill" style={{ background: "linear-gradient(158deg, #2a63b8 0%, #17448f 46%, #0c2a63 100%)" }} />
            <span className="cv-fill cv-blueprint" />
            <Svg>
                <g fill="none" stroke="#fff" strokeWidth=".8">
                    <circle cx="118" cy="58" r="54" opacity=".32" />
                    <circle cx="118" cy="58" r="76" opacity=".22" />
                </g>
            </Svg>
            <Ink src={p.logo} fill="#f3efe4" style={{ width: 98, height: 115, right: -14, top: -12, transform: "rotate(12deg)", opacity: 0.96 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cv-img" src="/projects/isu-mark.webp" alt="" style={{ width: 30, height: 17, left: 8, bottom: 7, opacity: 0.92 }} />
        </>
    );
}

/* ── EOGUESSR: a contour map in two inks, crosshair on the pin ── */
function contours(cx: number, cy: number, n: number, step: number) {
    return Array.from({ length: n }, (_, k) => {
        const r = (k + 1) * step;
        let d = "";
        for (let i = 0; i <= 72; i++) {
            const t = (i / 72) * Math.PI * 2;
            const w = 1 + 0.17 * Math.sin(3 * t + 0.7 + k * 0.33) + 0.08 * Math.sin(5 * t - 1.2 + k * 0.57) + 0.04 * Math.sin(9 * t + k);
            d += `${i ? "L" : "M"}${(cx + Math.cos(t) * r * w * 1.5).toFixed(1)} ${(cy + Math.sin(t) * r * w).toFixed(1)}`;
        }
        return d + "Z";
    });
}
const TOPO = contours(106, 50, 15, 5.6);

function TopoCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill" style={{ background: "#f1e7d1" }} />
            <span className="cv-sun" />
            <Svg>
                {TOPO.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#178a98" strokeWidth={i % 4 === 3 ? 1.5 : 0.8} opacity={i % 4 === 3 ? 0.95 : 0.75} />
                ))}
                <g stroke="#e0412e" strokeWidth=".9">
                    <line x1="106" y1="0" x2="106" y2="86" opacity=".8" />
                    <line x1="0" y1="50" x2="152" y2="50" opacity=".8" />
                    <circle cx="106" cy="50" r="12" fill="none" />
                </g>
                <ellipse cx="106" cy="50.5" rx="7" ry="2.2" fill="#000" opacity=".28" />
            </Svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cv-img cv-pin" src={p.logo} alt="" style={{ width: 46, height: 46, left: 83, top: 11 }} />
        </>
    );
}

/* ── RAKUGAKI: the brush, the splash and the seal ── */
const SPLASH = [
    [126, 13, 5.2], [116, 7, 1.6], [138, 25, 1.4], [111, 20, 1], [143, 9, 2.2], [131, 30, 0.8], [121, 26, 0.7], [148, 18, 0.9],
] as const;

function BrushCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill cv-washi" />
            <Ink src={p.logo} fill="#d3341f" style={{ width: 236, height: 136, left: -34, top: 2, transform: "rotate(-7deg)" }} />
            <Svg>
                {SPLASH.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#141210" />)}
                <path d="M126 17 q 1 9 -1 16 q -1 3 1 5" fill="none" stroke="#141210" strokeWidth="1.3" strokeLinecap="round" />
            </Svg>
            <span className="cv-seal">
                <Ink src={p.logo} fill="#f6efe2" style={{ inset: "5px 2px" }} />
            </span>
        </>
    );
}

/* ── COPERNICUS MOSAIC: the label itself is the mosaic ── */
const SEA = ["#1d5d8f", "#236ca3", "#2b7bb3", "#3a8cc2", "#1b5486"];
const SHALLOW = ["#56acd0", "#79c3d8", "#4fb3c4"];
const LAND = ["#5f9a46", "#4f8a3c", "#73a653", "#447d36", "#86ae5c"];
const DRY = ["#d6b477", "#c79c5e", "#e3c894", "#bb8f57"];
const CLOUD = ["#f4f7f9", "#e4eaee"];
const TILE = 9;
const TILES = (() => {
    const out: { x: number; y: number; c: string }[] = [];
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 17; col++) {
            const n = hash(row * 31 + col * 7 + 3);
            const score = col * 0.62 - row * 0.95 + n * 2.6;
            const pick = (a: string[], k: number) => a[Math.floor(hash(row * 131 + col * 17 + k) * a.length)];
            let c: string;
            if (hash(row * 59 + col * 13 + 11) > 0.94) c = pick(CLOUD, 1);
            else if (score > 5.2) c = pick(SEA, 2);
            else if (score > 4.1) c = pick(SHALLOW, 3);
            else if (score < 0.6 && n > 0.45) c = pick(DRY, 4);
            else c = pick(LAND, 5);
            out.push({ x: col * TILE - 2, y: row * TILE - 3, c });
        }
    }
    return out;
})();

function MosaicCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill" style={{ background: "#102330" }} />
            <Svg>
                {TILES.map((t, i) => <rect key={i} x={t.x} y={t.y} width={TILE - 1} height={TILE - 1} rx="1.1" fill={t.c} />)}
                <g fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="square">
                    <path d="M 60 39 h -3 v 3 M 70 39 h 3 v 3 M 60 51 h -3 v -3 M 70 51 h 3 v -3" />
                </g>
            </Svg>
            <span className="cv-tilecard">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cv-img" src={p.logo} alt="" style={{ left: 3, top: 3, width: 40, height: 40 }} />
            </span>
        </>
    );
}

/* ── ARQUIVO NÓS: a catalogue card, the portrait in halftone ── */
function ArchiveCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill cv-card" />
            <Svg>
                <g transform="rotate(-14 30 62)" fill="none" stroke="#56449a" opacity=".55">
                    <circle cx="30" cy="62" r="15" strokeWidth="1.5" />
                    <circle cx="30" cy="62" r="11.6" strokeWidth=".6" strokeDasharray="1.2 1.4" />
                    <text x="30" y="65" textAnchor="middle" fill="#56449a" stroke="none" fontFamily="Georgia, serif" fontWeight="700" fontSize="8.5" letterSpacing=".3">1845</text>
                </g>
            </Svg>
            <Ink src={p.logo} fill="#8a6a43" style={{ width: 118, height: 126, right: -30, bottom: -38, opacity: 0.35, transform: "translate(2px, 2px)" }} />
            <Ink src={p.logo} fill="radial-gradient(circle, #1f1812 0 1.05px, transparent 1.3px) 0 0 / 2.6px 2.6px" style={{ width: 118, height: 126, right: -30, bottom: -38 }} />
            <span className="cv-hole" />
        </>
    );
}

/* ── HOXE: newsprint, riso yellow, the mark slightly off register ── */
const COLS = Array.from({ length: 3 }, (_, c) =>
    Array.from({ length: 9 }, (_, r) => ({ x: 7 + c * 21, y: 44 + r * 4.3, w: r === 8 ? 8 + hash(c * 9 + r) * 6 : 15 + hash(c * 9 + r) * 3 })),
).flat();

function HoxeGlyph({ color, style }: { color: string; style: CSSProperties }) {
    return (
        <svg className="cv-glyph" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
            <path d="M 40 15 L 20 15 C 14 15 10 19 10 25 L 10 85 C 10 91 14 95 20 95 L 80 95 C 86 95 90 91 90 85 L 90 25 C 90 19 86 15 80 15 L 60 15" />
            <path d="M 32 35 L 68 75 M 68 35 L 32 75" strokeWidth={13} />
        </svg>
    );
}

function NewsprintCover() {
    return (
        <>
            <span className="cv-fill" style={{ background: "#f3c22e" }} />
            <span className="cv-fill cv-dots" />
            <Svg>
                <rect x="7" y="38" width="62" height="2" fill="#151310" />
                {COLS.map((l, i) => <rect key={i} x={l.x} y={l.y} width={l.w} height="1.5" fill="#151310" opacity=".72" />)}
            </Svg>
            <HoxeGlyph color="#e5432f" style={{ width: 92, height: 92, right: -14, top: -1, transform: "rotate(-9deg) translate(2.5px, 2px)" }} />
            <HoxeGlyph color="#151310" style={{ width: 92, height: 92, right: -14, top: -1, transform: "rotate(-9deg)", mixBlendMode: "multiply" }} />
        </>
    );
}

/* ── LAIKA’S COMPANY: asleep on the moon, in the studio's own colours ── */
const WARM_STARS = Array.from({ length: 30 }, (_, i) => ({
    x: +(hash(i * 5 + 11) * LW).toFixed(1),
    y: +(hash(i * 5 + 12) * LH * 0.9).toFixed(1),
    r: +(0.4 + hash(i * 5 + 13) * 0.7).toFixed(2),
    o: +(0.35 + hash(i * 5 + 14) * 0.6).toFixed(2),
}));

function MoonCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill" style={{ background: "radial-gradient(75% 120% at 80% 78%, #4a2e1c 0%, #22150e 42%, #0b0705 74%, #070504 100%)" }} />
            <Svg>
                {WARM_STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f8f1df" opacity={s.o} />)}
            </Svg>
            <span className="cv-moonglow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cv-img cv-moon" src={p.logo} alt="" style={{ width: 100, height: 98, right: -10, bottom: -16 }} />
        </>
    );
}

/* A project without its own print gets its logo as a large stencil */
function PlainCover({ p }: { p: Project }) {
    return (
        <>
            <span className="cv-fill" style={{ background: `color-mix(in oklab, ${p.accent} 30%, #f1ece2)` }} />
            {p.logo !== "hoxe" && <Ink src={p.logo} fill="#141210" style={{ width: 110, height: 110, right: -24, bottom: -30, opacity: 0.85 }} />}
        </>
    );
}

function Print({ p }: { p: Project }) {
    switch (p.id) {
        case "all-in-space": return <OrbitCover p={p} />;
        case "roadmap": return <CyanotypeCover p={p} />;
        case "eoguessr": return <TopoCover p={p} />;
        case "rakugaki": return <BrushCover p={p} />;
        case "copernicus-mosaic": return <MosaicCover p={p} />;
        case "arquivonos": return <ArchiveCover p={p} />;
        case "hoxe": return <NewsprintCover />;
        case "laikas-company": return <MoonCover p={p} />;
        default: return <PlainCover p={p} />;
    }
}

/* The tape is sized by the longest word, so a name never breaks inside a word */
const tapeSize = (name: string) => {
    const longest = Math.max(...name.split(" ").map((w) => w.length));
    return longest <= 4 ? 17 : longest <= 6 ? 14.5 : longest <= 8 ? 13 : 11.5;
};
/* Each strip of tape lands a little differently */
const TAPE_TILT = [-3.5, 2, -2, 3, -4, 1.5, -2.5, 2.5];

export function CartridgeFace({ p, i }: { p: Project; i: number }) {
    return (
        <>
        <span className="pc-cart-shadow" />
        <span className="pc-cart-body">
            <span className="pc-ridges" />
            <span className="pc-grip l" />
            <span className="pc-grip r" />
            <span className="pc-bed" />
            <span className="pc-label">
                <Print p={p} />
                <span className="pc-finish" />
                <span className="pc-tape-wrap" style={{ transform: `rotate(${TAPE_TILT[i % TAPE_TILT.length]}deg)` }}>
                    <span className="pc-tape" style={{ fontSize: tapeSize(p.name) }}>
                        {p.name.split(/([’'])/).map((part, k) => (k % 2 ? <span key={k} className="pc-tape-mark">{part}</span> : part))}
                    </span>
                </span>
                <span className="pc-gloss" />
            </span>
            <span className="pc-contacts" />
            <span className="pc-grain" />
        </span>
        </>
    );
}
