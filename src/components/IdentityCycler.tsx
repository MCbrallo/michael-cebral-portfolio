"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, CodeXml, Feather } from "lucide-react";

const concepts = [
    { icon: Atom, label: "Science" },
    { icon: CodeXml, label: "Engineering" },
    { icon: Feather, label: "Communication" },
];

interface IdentityCyclerProps {
    onClick?: () => void;
}

export function IdentityCycler({ onClick }: IdentityCyclerProps) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return; // Pause cycling on hover

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % concepts.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [isHovered]);

    const CurrentIcon = concepts[index].icon;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Icon Container */}
            <div
                className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Minimalist Diffused Gold Aura (Background) */}
                        <div className="absolute inset-[-10px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-lg">
                            <div className="w-full h-full bg-[conic-gradient(from_0deg,var(--color-gold),white,var(--color-gold))] animate-spin-slow" />
                        </div>

                        {/* Icon (Pure White) */}
                        <CurrentIcon
                            strokeWidth={1.5}
                            className="relative z-10 w-10 h-10 text-white transition-all duration-300 ease-out 
                            group-hover:scale-110 group-hover:-translate-y-1
                            drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
