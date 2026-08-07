"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es" | "gl";

interface Translations {
    nav: {
        articles: string;
        about: string;
        cv: string;
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
    /** Everything written on the projects index and on the home selection. */
    projects: {
        /** Followed by the project count, so the number stays out of the string. */
        sector: string;
        title: string;
        subtitle: string;
        rest: string;
        hintHover: string;
        hintTap: string;
        homeEyebrow: string;
        homeHeading: string;
        /** {n} is replaced with how many projects there are. */
        homeMore: string;
        linkLive: string;
        linkPlay: string;
        videoPitch: string;
        videoTalk: string;
        /** Badge on the preview: the site is running, or it is a still. */
        flagLive: string;
        flagPreview: string;
    };
    /** The CV page. Its own section: it used to borrow the About copy, which
     *  described an earlier version of the work. */
    cv: {
        eyebrow: string;
        title: string;
        summary: string;
        filterAll: string;
        filterCareer: string;
        filterEducation: string;
        labelCareer: string;
        labelEducation: string;
        download: string;
        skillsTitle: string;
    };
    /** Chrome that belongs to no page in particular. */
    common: {
        skip: string;
    };
}

const translations: Record<Language, Translations> = {
    en: {
        nav: {
            articles: "Projects",
            about: "About me",
            cv: "My CV",
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
            subtitle: "Bridging biotechnology and space science. I combine my background in research with a passion for clear, impactful science communication.",
            filterAll: "All",
            filterEducation: "Education",
            filterExperience: "Professional Experience",
            education: "Education",
            experience: "Experience",
            skillsTitle: "Core Competencies",
            biotech: "Biotechnology",
            space: "Space Science",
            technical: "Technical"
        },
        projects: {
            sector: "Selected Work · Sector",
            title: "Projects",
            subtitle: "Explorations at the intersection of biology, space science, communication and engineering.",
            rest: "The rest of the record",
            hintHover: "Hover a project to expand",
            hintTap: "Tap a project to expand",
            homeEyebrow: "Selected Work",
            homeHeading: "Three that are live right now",
            homeMore: "All {n} projects",
            linkLive: "Live ↗",
            linkPlay: "Play ↗",
            videoPitch: "Watch the pitch",
            videoTalk: "Watch the presentation",
            flagLive: "Live",
            flagPreview: "Preview",
        },
        cv: {
            eyebrow: "Curriculum · Record",
            title: "Strategic Communications and Outreach",
            summary:
                "Science communicator with a research background, focused on space science, Earth observation and public engagement. I explain technical and sensitive subjects, from environmental and emergency monitoring to security and defence, in clear language for expert, institutional and public audiences. I handle the full process, from tracking the news each morning to planning the message, writing the copy and building the visuals.",
            filterAll: "Everything",
            filterCareer: "Work",
            filterEducation: "Education",
            labelCareer: "Work",
            labelEducation: "Education",
            download: "Download the CV",
            skillsTitle: "What I work with",
        },
        common: {
            skip: "Skip to content",
        }
    },
    es: {
        nav: {
            articles: "Proyectos",
            about: "Sobre mí",
            cv: "Mi CV",
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
            subtitle: "Conectando la biotecnología y la ciencia espacial. Combino mi experiencia en investigación con la pasión por una comunicación científica clara y con impacto.",
            filterAll: "Todo",
            filterEducation: "Educación",
            filterExperience: "Experiencia Profesional",
            education: "Educación",
            experience: "Experiencia",
            skillsTitle: "Competencias Principales",
            biotech: "Biotecnología",
            space: "Ciencia Espacial",
            technical: "Técnico"
        },
        projects: {
            sector: "Trabajo seleccionado · Sector",
            title: "Proyectos",
            subtitle: "Exploraciones en el cruce entre la biología, la ciencia espacial, la comunicación y la ingeniería.",
            rest: "El resto del registro",
            hintHover: "Pasa el ratón por un proyecto para abrirlo",
            hintTap: "Toca un proyecto para abrirlo",
            homeEyebrow: "Trabajo seleccionado",
            homeHeading: "Tres que están en marcha ahora mismo",
            homeMore: "Los {n} proyectos",
            linkLive: "Ver ↗",
            linkPlay: "Jugar ↗",
            videoPitch: "Ver el pitch",
            videoTalk: "Ver la presentación",
            flagLive: "En vivo",
            flagPreview: "Vista previa",
        },
        cv: {
            eyebrow: "Currículum · Registro",
            title: "Comunicación estratégica y divulgación",
            summary:
                "Comunicador de ciencia con formación investigadora, centrado en ciencia espacial, observación de la Tierra y participación pública. Explico asuntos técnicos y delicados, desde la vigilancia ambiental y de emergencias hasta la seguridad y la defensa, en lenguaje claro para públicos expertos, institucionales y generales. Me ocupo del proceso entero, desde seguir las noticias cada mañana hasta planificar el mensaje, escribir el texto y construir los visuales.",
            filterAll: "Todo",
            filterCareer: "Trabajo",
            filterEducation: "Formación",
            labelCareer: "Trabajo",
            labelEducation: "Formación",
            download: "Descargar el CV",
            skillsTitle: "Con lo que trabajo",
        },
        common: {
            skip: "Ir al contenido",
        }
    },
    gl: {
        nav: {
            articles: "Proxectos",
            about: "Sobre min",
            cv: "O meu CV",
            contact: "Contacto",
        },
        hero: {
            subtitle: "Comunicación Científica",
        },
        contact: {
            title: "Conectemos",
            subtitle: "Aberto a discutir novos proxectos, ideas creativas ou oportunidades para colaborar en iniciativas de comunicación científica.",
            emailDesc: "Envíame un correo para consultas e colaboracións",
            linkedinDesc: "Conecta comigo profesionalmente",
            footer: "Normalmente respondo en 24-48 horas"
        },
        about: {
            title: "Traxectoria Científica",
            subtitle: "Conectando a biotecnoloxía e a ciencia espacial. Combino a miña experiencia en investigación coa paixón por unha comunicación científica clara e con impacto.",
            filterAll: "Todo",
            filterEducation: "Educación",
            filterExperience: "Experiencia Profesional",
            education: "Educación",
            experience: "Experiencia",
            skillsTitle: "Competencias Principais",
            biotech: "Biotecnoloxía",
            space: "Ciencia Espacial",
            technical: "Técnico"
        },
        projects: {
            sector: "Traballo escollido · Sector",
            title: "Proxectos",
            subtitle: "Exploracións no cruce entre a bioloxía, a ciencia espacial, a comunicación e a enxeñaría.",
            rest: "O resto do rexistro",
            hintHover: "Pasa o rato por un proxecto para abrilo",
            hintTap: "Toca un proxecto para abrilo",
            homeEyebrow: "Traballo escollido",
            homeHeading: "Tres que están en marcha agora mesmo",
            homeMore: "Os {n} proxectos",
            linkLive: "Ver ↗",
            linkPlay: "Xogar ↗",
            videoPitch: "Ver o pitch",
            videoTalk: "Ver a presentación",
            flagLive: "En vivo",
            flagPreview: "Vista previa",
        },
        cv: {
            eyebrow: "Currículo · Rexistro",
            title: "Comunicación estratéxica e divulgación",
            summary:
                "Comunicador de ciencia con formación investigadora, centrado en ciencia espacial, observación da Terra e participación pública. Explico asuntos técnicos e delicados, desde a vixilancia ambiental e de emerxencias ata a seguridade e a defensa, en linguaxe clara para públicos expertos, institucionais e xerais. Ocúpome do proceso enteiro, desde seguir as novas cada mañá ata planificar a mensaxe, escribir o texto e construír os visuais.",
            filterAll: "Todo",
            filterCareer: "Traballo",
            filterEducation: "Formación",
            labelCareer: "Traballo",
            labelEducation: "Formación",
            download: "Descargar o CV",
            skillsTitle: "Con que traballo",
        },
        common: {
            skip: "Ir ao contido",
        }
    }
};

const languageOrder: Language[] = ["en", "es", "gl"];

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CLAVE = "mc-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    /* The choice used to last only until the next full page load, which put
       a Galician reader back into English every time they arrived from a
       link. Read after mount, never during render, so the server and the
       first client pass still agree. */
    const [restaurado, setRestaurado] = React.useState(false);

    React.useEffect(() => {
        try {
            const guardado = window.localStorage.getItem(CLAVE) as Language | null;
            if (guardado && languageOrder.includes(guardado)) setLanguage(guardado);
        } catch { /* private mode, and the default is fine */ }
        setRestaurado(true);
    }, []);

    /* Nothing is written until the saved choice has been read. Writing on the
       first pass stored the default over whatever the reader had picked, and
       a tab closed in that instant forgot it. */
    React.useEffect(() => {
        if (!restaurado) return;
        try {
            window.localStorage.setItem(CLAVE, language);
        } catch { /* nothing to remember it with, and nothing breaks */ }
    }, [language, restaurado]);

    /* The attribute the page is served with says English, because the server
       cannot know the choice. Keeping it truthful matters: it is what a
       screen reader uses to pick a voice. Set in a layout effect so it lands
       in the same commit as the text it describes. */
    React.useLayoutEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const idx = languageOrder.indexOf(prev);
            return languageOrder[(idx + 1) % languageOrder.length];
        });
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
