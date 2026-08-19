"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();

    // On /about the room owns every corner of the viewport: the floating pill
    // landed exactly on Journey's country readout. There the switcher lives in
    // the header bar instead (see Header.tsx).
    if (pathname === "/about") return null;


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
            // mix-blend-difference put three bare letters straight on top of
            // whatever was underneath, which on a phone is always something.
            // The control carries its own ground now, sits clear of the home
            // indicator, and each letter is a target a thumb can actually hit.
            className="idioma fixed z-[60] bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-4 md:bottom-8 md:right-12 lg:right-16"
        >
            <Magnetic strength={0.2}>
                <div
                    role="group"
                    aria-label="Language"
                    className="idioma-caja flex items-center gap-0.5 text-xs font-medium tracking-widest uppercase"
                >
                    {langs.map((lang, i) => (
                        <span key={lang.code} className="flex items-center">
                            <button
                                onClick={() => setLanguage(lang.code)}
                                aria-current={language === lang.code ? "true" : undefined}
                                className={cn(
                                    "idioma-btn transition-colors duration-300 hover:text-white cursor-pointer",
                                    language === lang.code ? "text-white" : "text-white/45"
                                )}
                            >
                                {lang.label}
                            </button>
                            {i < langs.length - 1 && (
                                <span aria-hidden="true" className="idioma-sep" />
                            )}
                        </span>
                    ))}
                </div>
            </Magnetic>
        </motion.div>
    );
}
