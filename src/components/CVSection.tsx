'use client';

import { useState } from 'react';
// import Image from 'next/image'; // Logos temporarily disabled for cleaner look, or re-enable if desired
import experiencesData from '@/data/experiences.json';
import { motion, AnimatePresence } from 'framer-motion';

type ExperienceType = 'education' | 'career' | 'travel';

interface Experience {
    type: ExperienceType;
    title: {
        en: string;
        es: string;
    };
    organization: string;
    dates: string;
    logo?: string;
    description: {
        en: string[];
        es: string[];
    };
    tags: {
        en: string[];
        es: string[];
    };
    country?: string;
}

type ExperiencesData = {
    [country: string]: Experience[];
};

const experiences = experiencesData as ExperiencesData;

export function CVSection() {
    const [selectedFilter, setSelectedFilter] = useState<ExperienceType | 'all'>('all');

    // Flatten and sort
    const allExperiences = Object.entries(experiences)
        .flatMap(([country, exps]) =>
            exps.map(exp => ({ ...exp, country }))
        )
        .filter(exp => exp.type === 'education' || exp.type === 'career')
        .sort((a, b) => {
            const getYear = (dateStr: string) => {
                const match = dateStr.match(/(\d{2})/g);
                return match ? parseInt(match[match.length - 1]) : 0;
            };
            return getYear(b.dates) - getYear(a.dates);
        });

    const filteredExperiences = selectedFilter === 'all'
        ? allExperiences
        : allExperiences.filter(exp => exp.type === selectedFilter);

    return (
        <section id="about" className="min-h-screen py-32 px-6 md:px-12 relative bg-deep-space">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Section Header - Editorial Style */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24 items-end">
                    <div className="col-span-1 md:col-span-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-6xl md:text-8xl font-serif text-stark-white tracking-tight leading-[0.9]"
                        >
                            Scientific <br />
                            <span className="text-gold italic">Trajectory</span>
                        </motion.h2>
                    </div>

                    {/* Minimalist Filter */}
                    <div className="col-span-1 md:col-span-4 flex justify-start md:justify-end pb-2">
                        <div className="flex gap-6 text-sm font-sans tracking-widest uppercase text-white/40">
                            {['all', 'career', 'education'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter as any)}
                                    className={`
                                        transition-colors duration-300 hover:text-white
                                        ${selectedFilter === filter ? 'text-gold border-b border-gold' : ''}
                                    `}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Swiss Grid Content */}
                <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5">
                    {filteredExperiences.map((exp, index) => (
                        <motion.div
                            key={`${exp.country}-${index}`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-12 group bg-deep-space hover:bg-white/[0.02] transition-colors duration-500"
                        >
                            {/* Year / Date Column */}
                            <div className="md:col-span-3 p-8 md:p-12 border-b border-white/5 group-hover:border-white/10 transition-colors">
                                <span className="font-bodoni text-4xl text-white/20 group-hover:text-gold transition-colors block mb-2">
                                    {exp.dates.split(' ').pop()} {/* Show just the year broadly, or full date */}
                                </span>
                                <span className="text-xs font-sans tracking-widest uppercase text-white/40">
                                    {exp.dates}
                                </span>
                            </div>

                            {/* Role / Org Column */}
                            <div className="md:col-span-4 p-8 md:p-12 border-b border-white/5 md:border-l group-hover:border-white/10 transition-colors flex flex-col justify-center">
                                <h3 className="text-2xl font-serif text-stark-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                    {exp.title.en}
                                </h3>
                                <p className="text-gold font-sans text-sm tracking-wide uppercase">
                                    {exp.organization}
                                </p>
                            </div>

                            {/* Details Column */}
                            <div className="md:col-span-5 p-8 md:p-12 border-b border-white/5 md:border-l group-hover:border-white/10 transition-colors">
                                <p className="text-gray-400 font-sans leading-relaxed mb-6">
                                    {exp.description.en[0]}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tags.en.map((tag, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
