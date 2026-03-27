"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface Translations {
    nav: {
        articles: string;
        about: string;
        contact: string;
    };
    hero: {
        subtitle: string;
    };
    contact?: {
        title: string;
        subtitle: string;
        emailDesc: string;
        linkedinDesc: string;
        footer: string;
    };
    about?: {
        title: string;
        subtitle: string;
        filterAll: string;
        filterEducation: string;
        filterExperience: string;
        education: string;
        experience: string;
        skillsTitle: string;
        biotech: string;
        space: string;
        technical: string;
    };
}

const translations: Record<Language, Translations> = {
    en: {
        nav: {
            articles: "Projects",
            about: "About me",
            contact: "Contact",
        },
        hero: {
            subtitle: "Science Communication",
        },
        contact: {
            title: "Let's Connect",
            subtitle: "Open to discussing new projects, creative ideas, or opportunities to collaborate on science communication initiatives.",
            emailDesc: "Send me an email for inquiries and collaborations",
            linkedinDesc: "Connect with me professionally",
            footer: "Typically responds within 24-48 hours"
        },
        about: {
            title: "Scientific Trajectory",
            subtitle: "Researcher with interdisciplinary experience across biotechnology, space science, and biomedicine. Focused on bridging molecular biology, bioinformatics, and translational research to address complex scientific challenges.",
            filterAll: "All",
            filterEducation: "Education",
            filterExperience: "Professional Experience",
            education: "Education",
            experience: "Experience",
            skillsTitle: "Core Competencies",
            biotech: "Biotechnology",
            space: "Space Science",
            technical: "Technical"
        }
    },
    es: {
        nav: {
            articles: "Proyectos",
            about: "Sobre mí",
            contact: "Contacto",
        },
        hero: {
            subtitle: "Comunicación Científica",
        },
        contact: {
            title: "Conectemos",
            subtitle: "Abierto a discutir nuevos proyectos, ideas creativas u oportunidades para colaborar en iniciativas de comunicación científica.",
            emailDesc: "Envíame un correo para consultas y colaboraciones",
            linkedinDesc: "Conéctate conmigo profesionalmente",
            footer: "Por lo general respondo en 24-48 horas"
        },
        about: {
            title: "Trayectoria Científica",
            subtitle: "Investigador con experiencia interdisciplinaria en biotecnología, ciencia espacial y biomedicina. Enfocado en conectar biología molecular, bioinformática e investigación traslacional para abordar desafíos científicos complejos.",
            filterAll: "Todo",
            filterEducation: "Educación",
            filterExperience: "Experiencia Profesional",
            education: "Educación",
            experience: "Experiencia",
            skillsTitle: "Competencias Principales",
            biotech: "Biotecnología",
            space: "Ciencia Espacial",
            technical: "Técnico"
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "es" : "en"));
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                toggleLanguage,
                t: translations[language],
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
