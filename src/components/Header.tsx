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
    const { t } = useLanguage();

    const navItems = [
        { name: t.nav.articles, href: "/articles" },
        { name: t.nav.about, href: "/about" },
        { name: t.nav.cv, href: "/about/cv" },
        { name: t.nav.contact, href: "/contact" },
    ];
    const [isGameActive, setIsGameActive] = React.useState(false);

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
                "fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-6 md:px-12 backdrop-blur-md bg-deep-space/20 border-b border-white/5",
                isGameActive ? "pointer-events-none" : ""
            )}
        >
            <div className="flex items-center justify-between w-full max-w-[1400px]">
                {/* Logo - Pure Text, Bodoni */}
                <Link href="/" className="group relative">
                    <span className="font-serif text-2xl font-bold tracking-tighter text-stark-white">
                        MC
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* Navigation - Ultra Minimal */}
                <nav className="flex items-center gap-3 md:gap-12 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = item.href === '/about'
                            ? pathname === '/about'
                            : pathname.startsWith(item.href);
                        return (
                            <Magnetic key={item.href} strength={0.4}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-[9px] md:text-xs uppercase tracking-widest md:tracking-[0.2em] transition-all duration-300 relative block py-2 whitespace-nowrap",
                                        isActive ? "text-gold font-semibold" : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            </Magnetic>
                        );
                    })}
                </nav>
            </div>
        </motion.header>
    );
}
