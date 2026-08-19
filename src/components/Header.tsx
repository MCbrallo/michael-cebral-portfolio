"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/Magnetic";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();

    const navItems = [
        { name: t.nav.articles, href: "/projects" },
        { name: t.nav.about, href: "/about" },
        { name: t.nav.cv, href: "/about/cv" },
        { name: t.nav.contact, href: "/contact" },
    ];
    const [isGameActive, setIsGameActive] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    // navigating closes the drawer
    React.useEffect(() => { setMenuOpen(false); }, [pathname]);

    React.useEffect(() => {
        const handleStart = () => setIsGameActive(true);
        const handleStop = () => setIsGameActive(false);
        window.addEventListener("game:start", handleStart);
        window.addEventListener("game:stop", handleStop);
        return () => {
            window.removeEventListener("game:start", handleStart);
            window.removeEventListener("game:stop", handleStop);
        };
    }, []);


    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: isGameActive ? -100 : 0, opacity: isGameActive ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
                "barra fixed top-0 left-0 right-0 z-50 flex justify-center py-3 md:py-6 px-5 md:px-12",
                isGameActive ? "pointer-events-none" : ""
            )}
        >
            <div className="flex items-center justify-between w-full max-w-[1400px] relative z-[1]">
                {/* Symbol only — links home, no bar */}
                <Link href="/" className="group relative shrink-0 flex items-center min-h-[44px] pr-2" aria-label="Home">
                    <span className="font-serif text-2xl font-bold tracking-tighter text-stark-white">
                        MC
                    </span>
                    <span className="absolute bottom-2 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* Navigation - Ultra Minimal (tabs only) */}
                <nav className="hidden md:flex items-center gap-2.5 md:gap-12 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = item.href === '/about'
                            ? pathname === '/about'
                            : pathname.startsWith(item.href);
                        return (
                            <Magnetic key={item.href} strength={0.4}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        // 9px with 30px of height was a target no thumb could
                                        // find. The label is legible now and the box around it
                                        // clears the 44px the hand needs.
                                        "nav-link text-[11px] md:text-xs uppercase tracking-[0.08em] md:tracking-[0.2em] transition-all duration-300 relative flex items-center min-h-[44px] px-1 whitespace-nowrap",
                                        isActive ? "text-gold font-semibold" : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            </Magnetic>
                        );
                    })}
                    {(
                        // The language switcher lives in the bar on every page:
                        // the old floating pill kept landing on content corners
                        // (Journey's readout among them) and is gone for good.
                        <div className="flex items-center gap-1 md:gap-1.5 pl-2.5 md:pl-6 border-l border-white/15">
                            {(['en', 'es', 'gl'] as const).map((code) => (
                                <button
                                    key={code}
                                    onClick={() => setLanguage(code)}
                                    aria-current={language === code ? 'true' : undefined}
                                    className={cn(
                                        "text-[10px] md:text-[11px] uppercase tracking-[0.14em] min-h-[44px] px-1 transition-colors duration-300 cursor-pointer",
                                        language === code ? "text-gold font-semibold" : "text-white/45 hover:text-white"
                                    )}
                                >
                                    {code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </nav>

                {/* Phone bar: the languages stay visible and the sections fold
                    behind a drawer, which is what a 390px width can afford. */}
                <div className="flex md:hidden items-center gap-1">
                    {(['en', 'es', 'gl'] as const).map((code) => (
                        <button
                            key={code}
                            onClick={() => setLanguage(code)}
                            aria-current={language === code ? 'true' : undefined}
                            className={cn(
                                "text-[10px] uppercase tracking-[0.12em] min-h-[44px] px-1.5 transition-colors duration-300",
                                language === code ? "text-gold font-semibold" : "text-white/45"
                            )}
                        >
                            {code.toUpperCase()}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-expanded={menuOpen}
                        aria-label="Menu"
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 text-xl"
                    >
                        {menuOpen ? '\u2715' : '\u2630'}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="absolute top-full left-0 right-0 md:hidden bg-[#060608]/95 backdrop-blur-md border-b border-white/10">
                    {navItems.map((item) => {
                        const isActive = item.href === '/about'
                            ? pathname === '/about'
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "block px-6 py-4 text-xs uppercase tracking-[0.2em] border-t border-white/5",
                                    isActive ? "text-gold font-semibold" : "text-white/70"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </motion.header>
    );
}
