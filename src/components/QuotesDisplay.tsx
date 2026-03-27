"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Quote {
    text: string;
    author: string;
}

interface QuotesDisplayProps {
    quote: Quote | null;
}

export function QuotesDisplay({ quote }: QuotesDisplayProps) {
    if (!quote) return null;

    return (
        <div className="h-24 w-full flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={quote.text} // Triggers animation on change
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center gap-2 max-w-lg text-center px-4"
                >
                    <p className="font-bodoni text-base md:text-lg text-white/90 italic leading-relaxed tracking-wide">
                        "{quote.text}"
                    </p>
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/50">
                        — {quote.author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
