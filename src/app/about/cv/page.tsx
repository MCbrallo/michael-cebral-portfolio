'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Magnetic } from '@/components/Magnetic';
import { StarField } from '@/components/StarField';
import experiencesData from '@/data/experiences.json';

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
}

type ExperiencesData = {
    [country: string]: Experience[];
};

const experiences = experiencesData as ExperiencesData;

export default function CVPage() {
    const { t, language } = useLanguage();
    // Galician falls back to Spanish for CV data (very similar languages)
    const cvLang = language === 'gl' ? 'es' : language;
    const [selectedFilter, setSelectedFilter] = useState<ExperienceType | 'all'>('all');

    // Flatten and sort all experiences by date (most recent first)
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
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* StarField Background — same as About Me */}
            <StarField />

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10">



                {/* Header Section */}
                <div className="mb-10 animate-fade-in">
                    <div className="border-b border-white/10 pb-8 mb-8 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        {/* Premium accent line */}
                        <div className="absolute bottom-0 left-0 h-px w-24 bg-gradient-to-r from-white/50 to-transparent" />

                        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start w-full">
                            <div className="max-w-2xl relative z-10">
                                <h1 className="title-shimmer font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-4 leading-tight py-2">
                                    {t.about?.title}
                                </h1>
                                <p className="text-white/40 text-base md:text-lg font-light leading-relaxed max-w-xl">
                                    {t.about?.subtitle}
                                </p>
                            </div>
                        </div>

                        <Magnetic>
                            <a
                                href="/Michael_Cebral_CV.pdf"
                                download="Michael_Cebral_CV.pdf"
                                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                                <span className="text-sm uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                                    {language === 'en' ? 'Download CV' : 'Descargar CV'}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white/60 group-hover:text-white group-hover:translate-y-0.5 transition-all duration-300"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                            </a>
                        </Magnetic>
                    </div>

                    {/* Filter Navigation */}
                    <div className="flex gap-6 text-sm flex-wrap">
                        {[
                            { value: 'all', label: t.about?.filterAll || 'All' },
                            { value: 'education', label: t.about?.filterEducation || 'Education' },
                            { value: 'career', label: t.about?.filterExperience || 'Professional Experience' }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value as ExperienceType | 'all')}
                                className={`
                  uppercase tracking-[0.2em] transition-all duration-500 relative pb-2 group
                  ${selectedFilter === filter.value
                                        ? 'text-white font-medium'
                                        : 'text-white/40 hover:text-white/70'
                                    }
                `}
                            >
                                {filter.label}
                                {selectedFilter === filter.value && (
                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
                                )}
                                {selectedFilter !== filter.value && (
                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-10">
                    {filteredExperiences.map((exp, index) => (
                        <article
                            key={`${exp.country}-${index}`}
                            className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 group animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Left Column: Date & Type */}
                            <div className="space-y-3">
                                <time className="block text-xs uppercase tracking-[0.2em] text-white/30 font-light transition-colors duration-300 group-hover:text-white/50">
                                    {exp.dates}
                                </time>
                                <div className="inline-block">
                                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 border border-white/10 text-white/50 transition-all duration-500 group-hover:border-white/30 group-hover:text-white/70 rounded-sm">
                                        {exp.type === 'education' ? t.about?.education : t.about?.experience}
                                    </span>
                                </div>
                            </div>

                            {/* Right Column: Content */}
                            <div className="relative">
                                {/* Premium border accent */}
                                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Logo with premium container */}
                                {exp.logo && (
                                    <div className="absolute -top-2 right-0 w-16 h-16 bg-white rounded-sm p-2 opacity-90 group-hover:opacity-100 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-white/10">
                                        <Image
                                            src={exp.logo}
                                            alt={exp.organization}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                {/* Title & Organization */}
                                <div className="mb-4 pr-10">
                                    <h2 className="font-serif text-xl md:text-2xl font-medium tracking-tight mb-2 text-white transition-colors duration-300 group-hover:text-white/90">
                                        {exp.title[cvLang] || exp.title.en}
                                    </h2>
                                    <p className="text-white/60 text-base font-light transition-colors duration-300 group-hover:text-white/80">
                                        {exp.organization}
                                    </p>
                                </div>

                                {/* Description with premium styling and HTML support */}
                                <ul className="space-y-3 mb-6">
                                    {(exp.description[cvLang] || exp.description.en).map((item, i) => (
                                        <li key={i} className="text-white/60 leading-relaxed flex gap-3 group/item">
                                            <span className="text-white/30 mt-1.5 transition-colors duration-300 group-hover/item:text-white/50">—</span>
                                            <span
                                                className="flex-1 transition-colors duration-300 group-hover/item:text-white/70"
                                                dangerouslySetInnerHTML={{ __html: item }}
                                            />
                                        </li>
                                    ))}
                                </ul>

                                {/* Tags with refined styling */}
                                <div className="flex flex-wrap gap-3">
                                    {(exp.tags[cvLang] || exp.tags.en).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs uppercase tracking-wider text-white/40 font-light px-2 py-1 border border-white/10 rounded-sm transition-all duration-300 hover:border-white/30 hover:text-white/60"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Skills Section with Premium Grid */}
                <div className="mt-32 pt-16 border-t border-white/10 relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    {/* Premium accent */}
                    <div className="absolute top-0 left-0 h-px w-24 bg-gradient-to-r from-white/50 to-transparent" />

                    <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">
                        {t.about?.skillsTitle}
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: t.about?.biotech || 'Biotechnology',
                                skills: cvLang === 'es'
                                    ? ['Transcriptómica Espacial', 'Ingeniería de Biomateriales', 'Ingeniería de Proteínas', 'Sistemas de Cultivo Celular']
                                    : ['Spatial Transcriptomics', 'Biomaterials Engineering', 'Protein Engineering', 'Cell Culture Systems']
                            },
                            {
                                title: t.about?.space || 'Space Science',
                                skills: cvLang === 'es'
                                    ? ['Biología en Microgravedad', 'Investigación en Astrobiología', 'Ingeniería de Sistemas Espaciales', 'Vuelo Espacial Comercial']
                                    : ['Microgravity Biology', 'Astrobiology Research', 'Space Systems Engineering', 'Commercial Spaceflight']
                            },
                            {
                                title: t.about?.technical || 'Technical',
                                skills: cvLang === 'es'
                                    ? ['Programación en R y Python', 'Pipelines de Bioinformática', 'Análisis Estadístico', 'Desarrollo Full-Stack']
                                    : ['R & Python Programming', 'Bioinformatics Pipelines', 'Statistical Analysis', 'Full-Stack Development']
                            }
                        ].map((category, index) => (
                            <div
                                key={index}
                                className="group/skill relative p-6 rounded-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.02]"
                            >
                                {/* Subtle corner accent */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-white/20 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-white/20 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-500" />

                                <h4 className="text-lg uppercase tracking-[0.2em] mb-6 text-white/80 group-hover/skill:text-white transition-colors duration-300">
                                    {category.title}
                                </h4>
                                <ul className="space-y-3">
                                    {category.skills.map((skill, i) => (
                                        <li key={i} className="text-white/50 font-light leading-relaxed transition-colors duration-300 group-hover/skill:text-white/60 flex items-start gap-2">
                                            <span className="text-white/30 mt-1.5">·</span>
                                            <span className="flex-1">{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, white, transparent);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
        </div>
    );
}
