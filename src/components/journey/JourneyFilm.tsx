"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useMotionValue,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Download, ArrowDown, ArrowRight } from "lucide-react";

import { JOURNEY, type JourneyChapter, type JourneyRow } from "@/data/journey";
import { drawFrame, drawCover, frameState } from "@/components/journey/journeyFrames";
import { Magnetic } from "@/components/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const PROOF_LOGOS = [
    { src: "/logos/usc.svg", alt: "Universidade de Santiago de Compostela" },
    { src: "/logos/ucl.svg", alt: "University College London" },
    { src: "/logos/ki.svg", alt: "Karolinska Institutet" },
    { src: "/logos/scilifelab.svg", alt: "SciLifeLab" },
    { src: "/logos/isu.svg", alt: "International Space University" },
    { src: "/logos/esa.svg", alt: "European Space Agency" },
];

export function JourneyFilm() {
    const reduce = useReducedMotion();
    if (reduce) return <StaticJourney />;
    return <CinematicJourney />;
}

function CinematicJourney() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const progress = useMotionValue(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const pin = pinRef.current;
        if (!canvas || !container || !pin) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // The global html { zoom: 0.8 } hack corrupts canvas pixel sizing (it compounds to
        // ~0.64 and the frame renders small in the corner). Neutralize zoom for the immersive
        // film so the canvas fills the viewport exactly, and restore it on unmount.
        const html = document.documentElement;
        const prevZoom = html.style.zoom;
        html.style.zoom = "1";

        let cssW = 0;
        let cssH = 0;

        const size = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            cssW = pin.clientWidth;
            cssH = pin.clientHeight;
            canvas.width = Math.round(cssW * dpr);
            canvas.height = Math.round(cssH * dpr);
            canvas.style.width = `${cssW}px`;
            canvas.style.height = `${cssH}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // Real hyperrealistic frames per chapter, loaded progressively below.
        const realFrames: Record<number, ImageBitmap[]> = {};

        const render = (p: number) => {
            const { chapterIndex, local } = frameState(p, JOURNEY.length);
            const seq = realFrames[chapterIndex];
            if (seq && seq.length) {
                const i = Math.min(seq.length - 1, Math.round(local * (seq.length - 1)));
                const bmp = seq[i];
                drawCover(ctx, bmp, cssW, cssH, bmp.width, bmp.height);
                return;
            }
            drawFrame(ctx, cssW, cssH, p, JOURNEY);
        };

        size();
        render(0);

        // Progressively load real frames for any chapter that ships them. Chapters
        // without frames keep the procedural placeholder. A missing manifest is fine.
        let cancelled = false;
        (async () => {
            for (let ci = 0; ci < JOURNEY.length; ci++) {
                const dir = JOURNEY[ci].framesDir;
                if (!dir) continue;
                try {
                    const res = await fetch(`${dir}/manifest.json`);
                    if (!res.ok) continue;
                    const m: { count: number; ext: string; pad?: number } = await res.json();
                    const pad = m.pad ?? 4;
                    const seq: ImageBitmap[] = [];
                    for (let i = 1; i <= m.count; i++) {
                        if (cancelled) return;
                        const name = String(i).padStart(pad, "0");
                        const fr = await fetch(`${dir}/frame_${name}.${m.ext}`);
                        if (!fr.ok) break;
                        const blob = await fr.blob();
                        seq.push(await createImageBitmap(blob));
                        realFrames[ci] = seq; // usable as frames arrive
                        if (i % 12 === 0) render(progress.get());
                    }
                    realFrames[ci] = seq;
                    render(progress.get());
                } catch {
                    // keep the procedural placeholder for this chapter
                }
            }
        })();

        // Smooth scroll, bridged to the GSAP ticker so there is one animation loop.
        const lenis = new Lenis({ lerp: 0.1 });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const ticker = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        const st = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            pin: pin,
            pinSpacing: false,
            scrub: true,
            onUpdate: (self) => {
                progress.set(self.progress);
                render(self.progress);
            },
        });

        const onResize = () => {
            size();
            render(progress.get());
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);
        ScrollTrigger.refresh();

        return () => {
            cancelled = true;
            html.style.zoom = prevZoom;
            window.removeEventListener("resize", onResize);
            st.kill();
            gsap.ticker.remove(ticker);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [progress]);

    const scrollToChapter = (index: number) => {
        const container = containerRef.current;
        const lenis = lenisRef.current;
        if (!container) return;
        const top = container.offsetTop;
        const range = container.offsetHeight - window.innerHeight;
        const target = top + ((index + 0.5) / JOURNEY.length) * range;
        if (lenis) lenis.scrollTo(target);
        else window.scrollTo({ top: target, behavior: "smooth" });
    };

    const introOpacity = useTransform(progress, [0, 0.04], [1, 0]);

    return (
        <>
            <FilmHeader />

            <section
                ref={containerRef}
                style={{ height: `${(JOURNEY.length + 1) * 100}vh` }}
                className="relative"
            >
                <div ref={pinRef} className="relative h-screen w-screen overflow-hidden bg-[#050505]">
                    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

                    {/* Intro cue */}
                    <motion.div
                        style={{ opacity: introOpacity }}
                        className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center text-center"
                    >
                        <p className="font-bodoni text-2xl md:text-4xl text-white/90 italic">Tira do fío.</p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                            Scroll to follow the thread
                        </p>
                        <ArrowDown className="mt-6 h-4 w-4 animate-bounce text-gold/70" />
                    </motion.div>

                    {/* Chapter museum label cards */}
                    {JOURNEY.map((chapter, i) => (
                        <ChapterOverlay
                            key={chapter.id}
                            chapter={chapter}
                            index={i}
                            total={JOURNEY.length}
                            progress={progress}
                        />
                    ))}

                    {/* Chapter rail */}
                    <nav
                        aria-label="Chapters"
                        className="fixed right-5 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-4 md:right-8"
                    >
                        {JOURNEY.map((chapter, i) => (
                            <RailDot
                                key={chapter.id}
                                chapter={chapter}
                                index={i}
                                total={JOURNEY.length}
                                progress={progress}
                                onClick={() => scrollToChapter(i)}
                            />
                        ))}
                    </nav>
                </div>
            </section>

            <ProofWall />
        </>
    );
}

function chapterRange(index: number, total: number): [number, number, number, number] {
    const span = 1 / total;
    const start = index * span;
    const pad = span * 0.22;
    return [start, start + pad, start + span - pad, start + span];
}

function ChapterOverlay({
    chapter,
    index,
    total,
    progress,
}: {
    chapter: JourneyChapter;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const [a, b, c, d] = chapterRange(index, total);
    const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
    const y = useTransform(progress, [a, b, c, d], [24, 0, 0, -16]);

    return (
        <motion.div
            id={chapter.id}
            style={{ opacity, y }}
            className="absolute bottom-[12%] left-5 z-30 max-w-[360px] md:left-12 md:max-w-[440px]"
        >
            <div className="border-t border-gold/60 bg-black/55 p-5 backdrop-blur-md">
                <div className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
                    <span>CH.{String(chapter.index).padStart(2, "0")}</span>
                    <span className="text-white/40">{chapter.phase}</span>
                </div>
                <h2 className="mt-1 font-serif text-3xl md:text-5xl text-white leading-tight">
                    {chapter.place}
                </h2>
                <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/40">{chapter.coord}</p>

                {chapter.main && <RowBlock row={chapter.main} lead />}
                {chapter.extraRows?.map((row, i) => (
                    <RowBlock key={i} row={row} />
                ))}

                <p className="mt-4 max-w-[40ch] font-sans text-sm leading-relaxed text-white/70">
                    {chapter.caption}
                </p>
            </div>
        </motion.div>
    );
}

function RowBlock({ row, lead = false }: { row: JourneyRow; lead?: boolean }) {
    return (
        <div className={lead ? "mt-4" : "mt-3 border-t border-white/5 pt-3"}>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40">{row.years}</p>
            <p className="font-serif text-lg text-white">{row.role}</p>
            <p className="font-sans text-sm text-white/55">{row.institution}</p>
            {row.proof && (
                <p className="mt-1.5 font-mono text-xs tracking-wide text-gold">{row.proof}</p>
            )}
        </div>
    );
}

function RailDot({
    chapter,
    index,
    total,
    progress,
    onClick,
}: {
    chapter: JourneyChapter;
    index: number;
    total: number;
    progress: MotionValue<number>;
    onClick: () => void;
}) {
    const center = (index + 0.5) / total;
    const span = 1 / total;
    const active = useTransform(
        progress,
        [center - span / 2, center, center + span / 2],
        [0.3, 1, 0.3]
    );
    const scale = useTransform(
        progress,
        [center - span / 2, center, center + span / 2],
        [1, 1.8, 1]
    );

    return (
        <button
            onClick={onClick}
            className="group flex items-center justify-end gap-2"
            aria-label={`Go to ${chapter.place}`}
        >
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/0 transition-colors duration-300 group-hover:text-white/60">
                {chapter.place}
            </span>
            <motion.span
                style={{ opacity: active, scale }}
                className="block h-1.5 w-1.5 rounded-full bg-gold"
            />
        </button>
    );
}

function FilmHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-12">
            <Link href="/" className="font-serif text-xl font-bold tracking-tighter text-white">
                MC
            </Link>
            <div className="flex items-center gap-5">
                <Link
                    href="/about/cv"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
                >
                    Skip to CV
                </Link>
                <Magnetic>
                    <a
                        href="/Michael_Cebral_CV.pdf"
                        download
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                            Download CV
                        </span>
                        <Download className="h-3.5 w-3.5 text-white/60" />
                    </a>
                </Magnetic>
            </div>
        </header>
    );
}

function ProofWall() {
    return (
        <section className="relative z-10 bg-[#050505] px-6 py-28 md:px-12">
            <div className="mx-auto max-w-[1000px] text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">The proof</p>
                <h2 className="mt-4 font-serif text-4xl md:text-6xl text-white">
                    One thread, from a dish to a planet.
                </h2>
                <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-white/50">
                    Every place on the journey is a real line of work, named and verifiable. The story is
                    the hook. The record is below.
                </p>

                <div className="mt-14 grid grid-cols-3 items-center justify-items-center gap-8 md:grid-cols-6">
                    {PROOF_LOGOS.map((logo) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={logo.src}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-9 w-full max-w-[88px] object-contain opacity-50 transition-opacity duration-500 hover:opacity-90"
                        />
                    ))}
                </div>

                <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Magnetic>
                        <Link
                            href="/about/cv"
                            className="flex items-center gap-2 rounded-full bg-white px-7 py-3 text-black transition-transform hover:scale-[1.03]"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                                Read the full CV
                            </span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Magnetic>
                    <a
                        href="/Michael_Cebral_CV.pdf"
                        download
                        className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 transition-colors hover:bg-white/5"
                    >
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
                            Download CV
                        </span>
                        <Download className="h-4 w-4 text-white/60" />
                    </a>
                </div>
            </div>
        </section>
    );
}

// Accessible, no animation version. Same story and facts in normal document flow.
function StaticJourney() {
    return (
        <>
            <FilmHeader />
            <main className="relative z-10 mx-auto max-w-[760px] px-6 pb-24 pt-32">
                <p className="font-bodoni text-3xl italic text-white/90">Tira do fío.</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    From Lugo to ESTEC, one unbroken thread
                </p>
                <div className="mt-14 space-y-16">
                    {JOURNEY.map((chapter) => (
                        <article key={chapter.id} id={chapter.id} className="border-l border-gold/40 pl-6">
                            <div className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
                                <span>CH.{String(chapter.index).padStart(2, "0")}</span>
                                <span className="text-white/40">{chapter.phase}</span>
                            </div>
                            <h2 className="mt-1 font-serif text-4xl text-white">{chapter.place}</h2>
                            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/40">
                                {chapter.coord}
                            </p>
                            {chapter.main && <RowBlock row={chapter.main} lead />}
                            {chapter.extraRows?.map((row, i) => (
                                <RowBlock key={i} row={row} />
                            ))}
                            <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
                                {chapter.caption}
                            </p>
                        </article>
                    ))}
                </div>
            </main>
            <ProofWall />
        </>
    );
}
