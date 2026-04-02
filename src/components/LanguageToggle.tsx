"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const langs = [
        { code: "en" as const, label: "EN" },
        { code: "es" as const, label: "ES" },
        { code: "gl" as const, label: "GL" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-8 right-6 md:right-12 lg:right-16 z-50 mix-blend-difference"
        >
            <Magnetic strength={0.2}>
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
                    {langs.map((lang, i) => (
                        <span key={lang.code} className="flex items-center gap-2">
                            <button
                                onClick={() => setLanguage(lang.code)}
                                className={cn(
                                    "transition-colors duration-300 hover:text-white cursor-pointer",
                                    language === lang.code ? "text-white" : "text-white/40"
                                )}
                            >
                                {lang.label}
                            </button>
                            {i < langs.length - 1 && (
                                <span className="text-white/20">|</span>
                            )}
                        </span>
                    ))}
                </div>
            </Magnetic>
        </motion.div>
    );
}
