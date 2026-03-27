"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-8 right-6 md:right-12 lg:right-16 z-50 mix-blend-difference"
        >
            <Magnetic strength={0.2}>
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/80 hover:text-white transition-colors uppercase"
                >
                    <span className={cn(language === "en" ? "text-white" : "text-white/40")}>EN</span>
                    <span className="text-white/20">|</span>
                    <span className={cn(language === "es" ? "text-white" : "text-white/40")}>ES</span>
                </button>
            </Magnetic>
        </motion.div>
    );
}
