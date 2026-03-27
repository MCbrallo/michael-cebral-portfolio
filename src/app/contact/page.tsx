"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
    const { t } = useLanguage();

    const contacts = [
        {
            icon: Mail,
            label: "Email",
            action: "Send message",
            href: "mailto:michaelcebralclase@gmail.com"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            action: "View profile",
            href: "https://www.linkedin.com/in/michaelceb/"
        }
    ];

    return (
        <section className="h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full text-center"
            >
                {/* Title */}
                <h1 className="font-serif text-5xl md:text-6xl font-medium text-white mb-4 tracking-tight">
                    {t.contact?.title || "Let's Connect"}
                </h1>

                <p className="text-white/40 text-sm md:text-base mb-10 font-sans">
                    {t.contact?.subtitle || "Open to discussing new projects and collaborations"}
                </p>

                {/* Contact Buttons */}
                <div className="space-y-4 mb-12">
                    {contacts.map((contact, index) => {
                        const Icon = contact.icon;
                        return (
                            <motion.a
                                key={contact.label}
                                href={contact.href}
                                target={contact.label === "LinkedIn" ? "_blank" : undefined}
                                rel={contact.label === "LinkedIn" ? "noopener noreferrer" : undefined}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                className="group block relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-6 border border-white/[0.08] hover:border-white/20 rounded-lg transition-all duration-300 hover:bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                                            <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs uppercase tracking-[0.2em] text-white/30 mb-1 font-sans">
                                                {contact.label}
                                            </div>
                                            <div className="text-white/70 text-sm group-hover:text-white transition-colors">
                                                {contact.action}
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-white/20 text-xs tracking-wide font-sans"
                >
                    {t.contact?.footer || "Typically responds within 24-48 hours"}
                </motion.p>
            </motion.div>
        </section>
    );
}
