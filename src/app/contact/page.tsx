"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DisplayTitle } from "@/components/DisplayTitle";

const channels = [
    {
        num: "01",
        name: "Email",
        addr: "michaelcebralclase@gmail.com",
        href: "mailto:michaelcebralclase@gmail.com",
        accent: "#d8b878",
        external: false,
        Icon: Mail,
    },
    {
        num: "02",
        name: "LinkedIn",
        addr: "/in/michaelceb",
        href: "https://www.linkedin.com/in/michaelceb/",
        accent: "#6ea8ff",
        external: true,
        Icon: Linkedin,
    },
];

export default function ContactPage() {
    const { language } = useLanguage();

    const copy = {
        en: {
            eyebrow: "Transmission · Open Channel",
            title: "Let's Connect",
            lede: "Open to new projects, collaborations and conversations. Pick a channel.",
            meta: "Noordwijk, NL · Available from October 2026 · Replies in 24–48h",
        },
        es: {
            eyebrow: "Transmisión · Canal Abierto",
            title: "Hablemos",
            lede: "Abierto a nuevos proyectos, colaboraciones y conversaciones. Elige un canal.",
            meta: "Noordwijk, NL · Disponible desde octubre 2026 · Responde en 24–48h",
        },
        gl: {
            eyebrow: "Transmisión · Canle Aberta",
            title: "Falemos",
            lede: "Aberto a novos proxectos, colaboracións e conversas. Escolle unha canle.",
            meta: "Noordwijk, NL · Dispoñible desde outubro 2026 · Responde en 24–48h",
        },
    }[language];

    return (
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-14 pt-28 pb-20">
            <div className="w-full max-w-[1080px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Eyebrow */}
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-5">
                        {copy.eyebrow}
                    </p>

                    {/* Display title — same size/format as the other pages */}
                    <DisplayTitle text={copy.title} />

                    <p className="mt-6 max-w-xl text-base md:text-lg text-white/55 font-light leading-relaxed">
                        {copy.lede}
                    </p>
                </motion.div>

                {/* Channels — same index language as Projects */}
                <div className="proj-index mt-12">
                    {channels.map((c, i) => (
                        <a
                            key={c.name}
                            href={c.href}
                            target={c.external ? "_blank" : undefined}
                            rel={c.external ? "noopener noreferrer" : undefined}
                            className="proj-item contact-ch block animate-fade-in-up"
                            style={{ "--accent": c.accent, animationDelay: `${0.15 + i * 0.1}s` } as CSSProperties}
                        >
                            <div className="proj-row">
                                <span className="proj-num">{c.num}</span>
                                <span className="ch-namewrap">
                                    <c.Icon className="ch-icon" strokeWidth={1.5} aria-hidden="true" />
                                    <span className="proj-name">{c.name}</span>
                                </span>
                                <span className="proj-meta">
                                    {c.addr}
                                    <span className="proj-arrow" aria-hidden="true">↗</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
