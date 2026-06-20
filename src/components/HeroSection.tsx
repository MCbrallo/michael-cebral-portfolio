"use client";

import { motion } from "framer-motion";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

// Elegant Chromatic Aberration - Clean 3-channel split
const ChromaticText = ({ text, className }: { text: string; className?: string }) => {
    return (
        <div className={cn("relative group cursor-default chromatic-host", className)}>
            {/* Cyan channel */}
            <span
                className="absolute top-0 left-0 -z-10 chromatic-layer"
                style={{ color: "#00D4FF", ["--cx" as any]: "-3px", ["--cy" as any]: "-1px" }}
                aria-hidden="true"
            >{text}</span>
            {/* Magenta channel */}
            <span
                className="absolute top-0 left-0 -z-10 chromatic-layer"
                style={{ color: "#FF0080", ["--cx" as any]: "3px", ["--cy" as any]: "1px" }}
                aria-hidden="true"
            >{text}</span>
            {/* Gold channel */}
            <span
                className="absolute top-0 left-0 -z-10 chromatic-layer"
                style={{ color: "#FFD700", ["--cx" as any]: "0px", ["--cy" as any]: "-2px" }}
                aria-hidden="true"
            >{text}</span>
            {/* Main Text */}
            <span className="relative z-10 block text-white transition-transform duration-500 group-hover:scale-[1.02]">
                {text}
            </span>
            {/* Rainbow shimmer overlay */}
            <span
                className="absolute top-0 left-0 z-20 block rainbow-shimmer pointer-events-none"
                aria-hidden="true"
            >{text}</span>
        </div>
    );
};

import { useState, useCallback, useEffect } from "react";
import { SpaceInvaders } from "@/components/SpaceInvaders";
import { WanderingAlien } from "@/components/WanderingAlien";
import { quotes } from "@/data/quotes";
import { QuotesDisplay } from "@/components/QuotesDisplay";

// ...

export function HeroSection() {
    const { language, t } = useLanguage(); // Get current language (en/es)
    const [quoteIndex, setQuoteIndex] = useState<number | null>(null);
    const [showGame, setShowGame] = useState(false);
    const [alienOn, setAlienOn] = useState(true);

    // Initialize with a random quote on client-side mount
    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
        try {
            if (localStorage.getItem("alienOn") === "false") setAlienOn(false);
        } catch { }
    }, []);

    const toggleAlien = useCallback(() => {
        setAlienOn((v) => {
            const nv = !v;
            try { localStorage.setItem("alienOn", String(nv)); } catch { }
            return nv;
        });
    }, []);

    const handleNextQuote = useCallback(() => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * quotes.length);
        } while (newIndex === quoteIndex && quotes.length > 1);
        setQuoteIndex(newIndex);
    }, [quoteIndex]);

    const activeQuote = quoteIndex !== null ? {
        text: language === 'en' ? quotes[quoteIndex].en : quotes[quoteIndex].es,
        author: quotes[quoteIndex].author
    } : null;

    return (
        <>
        {!showGame && alienOn && <WanderingAlien onCatch={() => setShowGame(true)} />}
        {showGame && <SpaceInvaders onClose={() => setShowGame(false)} />}
        <section className="relative w-full min-h-[125vh] flex flex-col justify-center items-center overflow-x-hidden">
            {/* Faint cut-out portrait on the right, fading toward the centre */}
            {!showGame && (
                <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/michael-portrait.webp"
                        alt=""
                        className="absolute select-none h-[58%] md:h-[104%] w-auto max-w-none right-[-8%] md:right-[16%] top-[72%] md:top-[64%] -translate-y-1/2 opacity-[0.16] md:opacity-[0.44]"
                        style={{
                            filter: "contrast(1.13) brightness(1.03)",
                            WebkitMaskImage:
                                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 34%, #000 82%), linear-gradient(to bottom, #000 84%, transparent 100%)",
                            maskImage:
                                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 34%, #000 82%), linear-gradient(to bottom, #000 84%, transparent 100%)",
                            WebkitMaskComposite: "source-in",
                            maskComposite: "intersect",
                        }}
                    />
                </div>
            )}


            {/* Content Layer - hidden during game */}
            {!showGame && (
            <div className="relative z-10 text-left w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Slow, elegant ease
                    className="flex flex-col items-start gap-6 max-w-xl"
                >
                    {/* Main Title - Playfair Display (Normal, Elegant) */}
                    <div className="pointer-events-auto" onClick={handleNextQuote}>
                        <div className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-normal text-white leading-none flex flex-col items-start">
                            <Magnetic strength={0.20} active={true}>
                                <ChromaticText text="Michael" />
                            </Magnetic>
                            <Magnetic strength={0.20} active={true}>
                                <ChromaticText text="Cebral" />
                            </Magnetic>
                        </div>
                    </div>

                    {/* Subtitle - with a gold accent rule */}
                    <div className="flex items-center gap-4 mt-2 pointer-events-auto">
                        <span className="h-px w-12 bg-gold/50 shrink-0" />
                        <div className="overflow-hidden">
                            <motion.p
                                key={t.hero.subtitle}
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 0.85 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-xs md:text-sm text-white/85 font-sans tracking-[0.38em] uppercase"
                            >
                                {t.hero.subtitle}
                            </motion.p>
                        </div>
                    </div>

                    {/* Quotes - Bodoni (The "First Font") */}
                    <div className="min-h-[110px] flex items-start justify-start mt-3 w-full max-w-md font-bodoni overflow-visible">
                        <QuotesDisplay quote={activeQuote} />
                    </div>

                </motion.div>
            </div>
            )}

            {/* Alien warning + toggle — bottom left, hidden during game */}
            {!showGame && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2 }}
                    className="fixed bottom-3 left-4 md:bottom-5 md:left-6 z-[100] flex flex-col gap-2.5"
                >
                    {alienOn && (
                        <div className="relative group pointer-events-none max-w-[230px]">
                            <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full animate-pulse-slow" />
                            <p className="relative text-red-500/60 text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase leading-relaxed drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                                <span className="animate-pulse inline-block mr-1">⚠</span>
                                {language === 'en' && 'Warning: If you see an alien, click on it.'}
                                {language === 'es' && 'Aviso: Si ves un alien, haz clic en él.'}
                                {language === 'gl' && 'Aviso: Se ves un alien, fai clic nel.'}
                            </p>
                        </div>
                    )}

                    {/* Alien on/off switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={alienOn ? "true" : "false"}
                        onClick={toggleAlien}
                        title={alienOn ? "Disable alien" : "Enable alien"}
                        aria-label="Toggle alien"
                        className="pointer-events-auto group/sw inline-flex items-center gap-2.5 w-fit"
                    >
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 transition-colors group-hover/sw:text-white/75">
                            Alien
                        </span>
                        <span
                            className={cn(
                                "relative w-9 h-[18px] rounded-full border transition-colors duration-300",
                                alienOn
                                    ? "bg-gold/80 border-gold/60 shadow-[0_0_10px_-2px_var(--color-gold)]"
                                    : "bg-white/10 border-white/20"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-md transition-transform duration-300",
                                    alienOn ? "translate-x-[18px]" : "translate-x-0"
                                )}
                            />
                        </span>
                    </button>
                </motion.div>
            )}
        </section>
        </>
    );
}
