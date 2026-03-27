"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="bg-deep-space relative overflow-hidden pt-32 pb-12 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mb-24">
                    {/* Call to Action */}
                    <div>
                        <h2 className="text-6xl md:text-8xl font-serif text-stark-white leading-[0.9] tracking-tight mb-8">
                            Let's <br />
                            <span className="text-gold italic">Connect</span>
                        </h2>
                        <p className="text-white/60 max-w-md font-sans leading-relaxed">
                            Open to collaborations at the intersection of biotechnology, space science, and design.
                        </p>
                    </div>

                    {/* Navigation & Contact */}
                    <div className="grid grid-cols-2 gap-12 self-end">
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-white/40 mb-6">Menu</h4>
                            <ul className="space-y-4">
                                <li><Link href="/" className="text-white hover:text-gold transition-colors">Home</Link></li>
                                <li><Link href="/about" className="text-white hover:text-gold transition-colors">About</Link></li>
                                <li><Link href="/articles" className="text-white hover:text-gold transition-colors">Articles</Link></li>
                                <li><Link href="/contact" className="text-white hover:text-gold transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-white/40 mb-6">Socials</h4>
                            <ul className="space-y-4">
                                <li><a href="https://linkedin.com/in/michaelceb" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors">LinkedIn</a></li>
                                <li><a href="mailto:michaelcebralclase@gmail.com" className="text-white hover:text-gold transition-colors">Email</a></li>
                                {/* Add more if needed, e.g. GitHub/Twitter */}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/20 uppercase tracking-widest font-sans">
                    <p>© {new Date().getFullYear()} Michael Cebral. All Rights Reserved.</p>
                    <p>Designed with Intent.</p>
                </div>
            </div>
        </footer>
    );
}
