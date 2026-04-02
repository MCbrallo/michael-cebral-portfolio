"use client";

import { motion } from "framer-motion";
import { Stardust } from "@/components/Stardust";
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

import { Vignette } from "@/components/Vignette";

// ...
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

    // Initialize with a random quote on client-side mount
    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
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
        {!showGame && <WanderingAlien onCatch={() => setShowGame(true)} />}
        {showGame && <SpaceInvaders onClose={() => setShowGame(false)} />}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-x-hidden">
            {/* Background Layer (moved to global layout, just keeping placeholder space) */}
            <div className="absolute inset-0 z-0 pointer-events-none" />

            {/* <Vignette /> - Optional, overlay does the job now but kept Vignette logic if needed, removed from DOM for now */}


            {/* Content Layer - hidden during game */}
            {!showGame && (
            <div className="relative z-10 text-center px-6 md:px-8 w-full max-w-6xl mx-auto flex flex-col items-center justify-start h-full pt-[calc(5rem+50px)] md:pt-[calc(6rem+50px)] pb-16">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Slow, elegant ease
                    className="flex flex-col items-center gap-6"
                >
                    {/* Main Title - Playfair Display (Normal, Elegant) */}
                    <div className="pointer-events-auto" onClick={handleNextQuote}>
                        <div className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-normal text-white leading-none flex flex-col items-center">
                            <Magnetic strength={0.20} active={true}>
                                <ChromaticText text="Michael" />
                            </Magnetic>
                            <Magnetic strength={0.20} active={true}>
                                <ChromaticText text="Cebral" />
                            </Magnetic>
                        </div>
                    </div>

                    {/* Subtitle - Plain, no effects */}
                    <div className="overflow-hidden pointer-events-auto mt-4 px-8">
                        <motion.p
                            key={t.hero.subtitle}
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 0.8 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-xs md:text-sm text-white/90 font-sans tracking-[0.4em] uppercase"
                            style={{
                                textDecoration: "none"
                            }}
                        >
                            {t.hero.subtitle}
                        </motion.p>
                    </div>

                    {/* Quotes - Bodoni (The "First Font") */}
                    <div className="min-h-[120px] flex items-start justify-center mt-6 w-full max-w-2xl px-6 font-bodoni overflow-visible">
                        <QuotesDisplay quote={activeQuote} />
                    </div>

                </motion.div>
            </div>
            )}

            {/* Alien Warning - absolute bottom left, hidden during game */}
            {!showGame && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2 }}
                    className="fixed bottom-2 left-4 md:bottom-4 md:left-6 z-[100] pointer-events-none"
                >
                    <div className="relative group">
                        {/* Subtle red glow */}
                        <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full animate-pulse-slow" />
                        
                        <p className="relative text-red-500/60 text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase max-w-[220px] leading-relaxed drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                            <span className="animate-pulse inline-block mr-1">⚠</span>
                            {language === 'en' && 'Warning: Alien activity has been detected in this sector. They could be hostile.'}
                            {language === 'es' && 'Cuidado: Se han avistado aliens en este sector. Podrían ser agresivos.'}
                            {language === 'gl' && 'Coidado: Avistáronse aliens neste sector. Poderían ser agresivos.'}
                        </p>
                    </div>
                </motion.div>
            )}
        </section>
        </>
    );
}
