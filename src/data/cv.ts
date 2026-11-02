import type { Texto } from "@/data/projects";

/**
 * The record behind /about/cv, replacing experiences.json.
 *
 * Three languages, like the rest of the site. Institutions, grades and award
 * names stay in their own language: "Premio Extraordinario Fin de Carrera" is
 * the name of a thing, not a sentence.
 *
 * The voice is plain: what was done, where, and what came of it, in short
 * sentences. No dashes and no middle dots inside the copy; commas do the work.
 *
 * Ordering comes from `orden`, a plain year and month number, and not from
 * parsing the date label. The label reads differently in each language, so
 * sorting on it broke the moment the dates were translated.
 *
 * `acento` is the colour of the institution, reused when a place appears more
 * than once so a repeat reads as the same place. It plays the part the project
 * colour plays elsewhere: colour arrives with the thing, never as decoration.
 */
export type Tipo = "career" | "education";

export type Entrada = {
    id: string;
    tipo: Tipo;
    /** The role or the degree. */
    titulo: Texto;
    /** Institution. A proper noun, so it is not translated. */
    organizacion: string;
    lugar: string;
    fechas: Texto;
    /** Year and month of the start, as YYYYMM. Newest first. */
    orden: number;
    logo?: string;
    acento: string;
    /** One plain line with the key fact: a grant, a grade, a scale. */
    prueba?: Texto;
    cuerpo: { en: string[]; es: string[]; gl: string[] };
    etiquetas: { en: string[]; es: string[]; gl: string[] };
};

export const entradas: Entrada[] = [
    {
        id: "esa-estec",
        tipo: "career",
        titulo: {
            en: "Science Communication and Research Evaluation Intern",
            es: "Becario de comunicación científica y evaluación de la investigación",
            gl: "Bolseiro de comunicación científica e avaliación da investigación",
        },
        organizacion: "European Space Agency, Exploration Science Office (ESTEC)",
        lugar: "Noordwijk, Netherlands",
        fechas: { en: "Jul to Sep 2026", es: "Jul a Sep 2026", gl: "Xul a Set 2026" },
        orden: 202607,
        logo: "/logos/oficial/esa.svg",
        acento: "#5b9bd5",
        prueba: {
            en: "Human Spaceflight Programme",
            es: "Programa de vuelo espacial tripulado",
            gl: "Programa de voo espacial tripulado",
        },
        cuerpo: {
            en: [
                "Worked on science communication and supported research evaluation in ESA's human spaceflight programme, writing for review panels as well as the general public.",
            ],
            es: [
                "Trabajé en comunicación científica y apoyé la evaluación de la investigación en el programa de vuelo espacial tripulado de la ESA, con textos para paneles de evaluación y para el público general.",
            ],
            gl: [
                "Traballei en comunicación científica e apoiei a avaliación da investigación no programa de voo espacial tripulado da ESA, con textos para paneis de avaliación e para o público xeral.",
            ],
        },
        etiquetas: {
            en: ["Science communication", "Research evaluation"],
            es: ["Comunicación científica", "Evaluación de la investigación"],
            gl: ["Comunicación científica", "Avaliación da investigación"],
        },
    },
    {
        id: "isu-master",
        tipo: "education",
        titulo: {
            en: "Master's degree in Space Studies",
            es: "Máster en Estudios Espaciales",
            gl: "Máster en Estudos Espaciais",
        },
        organizacion: "International Space University",
        lugar: "Strasbourg, France",
        fechas: { en: "2025 to 2026", es: "2025 a 2026", gl: "2025 a 2026" },
        orden: 202508,
        logo: "/logos/oficial/isu.png",
        acento: "#8b83dd",
        prueba: {
            en: "Full scholarship from Fundación Barrié",
            es: "Beca completa de la Fundación Barrié",
            gl: "Bolsa completa da Fundación Barrié",
        },
        cuerpo: {
            en: ["Specialisation in space policy and entrepreneurship, plus executive certificates in space applications."],
            es: ["Especialidad en política espacial y emprendimiento, además de certificados ejecutivos en aplicaciones espaciales."],
            gl: ["Especialidade en política espacial e emprendemento, ademais de certificados executivos en aplicacións espaciais."],
        },
        etiquetas: {
            en: ["Space policy", "Entrepreneurship"],
            es: ["Política espacial", "Emprendimiento"],
            gl: ["Política espacial", "Emprendemento"],
        },
    },
    {
        id: "kth-scilifelab",
        tipo: "career",
        titulo: {
            en: "Research Engineer and MSc Researcher",
            es: "Ingeniero de investigación e investigador de máster",
            gl: "Enxeñeiro de investigación e investigador de máster",
        },
        organizacion: "Giacomello Lab, SciLifeLab, KTH Royal Institute of Technology",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Nov 2024 to Aug 2025", es: "Nov 2024 a Ago 2025", gl: "Nov 2024 a Ago 2025" },
        orden: 202411,
        logo: "/logos/oficial/scilifelab.svg",
        acento: "#4fb3a3",
        prueba: {
            en: "Data from NASA's Rodent Research 9 mission",
            es: "Datos de la misión Rodent Research 9 de la NASA",
            gl: "Datos da misión Rodent Research 9 da NASA",
        },
        cuerpo: {
            en: [
                "Worked with bone and muscle data from NASA's Rodent Research 9 mission and presented it in clear summaries and figures for specialists and a general audience.",
                "Wrote reproducible data pipelines in R and Python, which the lab now uses as its standard.",
                "Prepared figures and summaries for internal use and for the lab's outreach.",
            ],
            es: [
                "Trabajé con datos de hueso y músculo de la misión Rodent Research 9 de la NASA y los presenté en resúmenes y figuras claros para especialistas y público general.",
                "Escribí pipelines de datos reproducibles en R y Python, que el laboratorio usa ahora como estándar.",
                "Preparé figuras y resúmenes para uso interno y para la divulgación del laboratorio.",
            ],
            gl: [
                "Traballei con datos de óso e músculo da misión Rodent Research 9 da NASA e presenteinos en resumos e figuras claros para especialistas e público xeral.",
                "Escribín pipelines de datos reproducibles en R e Python, que o laboratorio usa agora como estándar.",
                "Preparei figuras e resumos para uso interno e para a divulgación do laboratorio.",
            ],
        },
        etiquetas: {
            en: ["Spaceflight biology", "R and Python", "Data visualisation"],
            es: ["Biología espacial", "R y Python", "Visualización de datos"],
            gl: ["Bioloxía espacial", "R e Python", "Visualización de datos"],
        },
    },
    {
        id: "tedxki",
        tipo: "career",
        titulo: {
            en: "Design and Communications Coordinator",
            es: "Coordinador de diseño y comunicación",
            gl: "Coordinador de deseño e comunicación",
        },
        organizacion: "TEDxKI, Karolinska Institutet",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Nov 2023 to Jun 2024", es: "Nov 2023 a Jun 2024", gl: "Nov 2023 a Xuñ 2024" },
        orden: 202311,
        logo: "/logos/oficial/tedx.png",
        acento: "#e62b1e",
        prueba: {
            en: "TEDx event with 2,500 attendees",
            es: "Evento TEDx con 2.500 asistentes",
            gl: "Evento TEDx con 2.500 asistentes",
        },
        cuerpo: {
            en: [
                "Led the visual identity and communication for the event: slides, signage, social media and speaker presentations, all in one consistent style.",
                "Created the slide templates and visual guidelines used by every speaker.",
            ],
            es: [
                "Dirigí la identidad visual y la comunicación del evento: diapositivas, señalética, redes sociales y presentaciones de los ponentes, con un estilo común.",
                "Creé las plantillas y las guías visuales que usaron todos los ponentes.",
            ],
            gl: [
                "Dirixín a identidade visual e a comunicación do evento: diapositivas, sinaléctica, redes sociais e presentacións dos relatores, cun estilo común.",
                "Creei as plantillas e as guías visuais que usaron todos os relatores.",
            ],
        },
        etiquetas: {
            en: ["Visual identity", "Event communication"],
            es: ["Identidad visual", "Comunicación de eventos"],
            gl: ["Identidade visual", "Comunicación de eventos"],
        },
    },
    {
        id: "outreach",
        tipo: "career",
        titulo: {
            en: "Speaker and Outreach Content Creator",
            es: "Ponente y creador de contenido divulgativo",
            gl: "Relator e creador de contido divulgativo",
        },
        organizacion: "Independent Science Communication",
        lugar: "Spain, Sweden and Belgium",
        fechas: { en: "2019 to present", es: "2019 a hoy", gl: "2019 a hoxe" },
        orden: 201901,
        acento: "#c9d2d3",
        prueba: {
            en: "About 30 talks in three countries since 2019",
            es: "Unas 30 charlas en tres países desde 2019",
            gl: "Arredor de 30 charlas en tres países desde 2019",
        },
        cuerpo: {
            en: [
                "Talks for audiences ranging from primary school pupils to international conferences, with my own slides, graphics and posts for each one.",
                "Topics include space, biology and research careers, adapted to each audience.",
            ],
            es: [
                "Charlas para públicos que van desde alumnos de primaria hasta congresos internacionales, con diapositivas, gráficos y publicaciones propias para cada una.",
                "Los temas incluyen espacio, biología y carreras científicas, adaptados a cada público.",
            ],
            gl: [
                "Charlas para públicos que van desde alumnado de primaria ata congresos internacionais, con diapositivas, gráficos e publicacións propias para cada unha.",
                "Os temas inclúen espazo, bioloxía e carreiras científicas, adaptados a cada público.",
            ],
        },
        etiquetas: {
            en: ["Public speaking", "Outreach"],
            es: ["Oratoria", "Divulgación"],
            gl: ["Oratoria", "Divulgación"],
        },
    },
    {
        id: "elgra",
        tipo: "education",
        titulo: {
            en: "Gravity Related Research Summer School",
            es: "Escuela de verano de investigación en gravedad",
            gl: "Escola de verán de investigación en gravidade",
        },
        organizacion: "European Space Agency, ELGRA",
        lugar: "Transinne, Belgium",
        fechas: { en: "2024", es: "2024", gl: "2024" },
        orden: 202406,
        logo: "/logos/oficial/esa.svg",
        acento: "#5b9bd5",
        prueba: { en: "Grade A", es: "Calificación A", gl: "Cualificación A" },
        cuerpo: {
            en: ["Microgravity research and the ground facilities used to simulate it."],
            es: ["Investigación en microgravedad y las instalaciones en tierra que se usan para simularla."],
            gl: ["Investigación en microgravidade e as instalacións en terra que se usan para simulala."],
        },
        etiquetas: {
            en: ["Microgravity", "ESA Academy"],
            es: ["Microgravedad", "ESA Academy"],
            gl: ["Microgravidade", "ESA Academy"],
        },
    },
    {
        id: "ki-anna-rising",
        tipo: "career",
        titulo: {
            en: "Research Assistant",
            es: "Asistente de investigación",
            gl: "Asistente de investigación",
        },
        organizacion: "Anna Rising Lab, Karolinska Institutet",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Mar to Jun 2024", es: "Mar a Jun 2024", gl: "Mar a Xuñ 2024" },
        orden: 202403,
        logo: "/logos/oficial/ki.svg",
        acento: "#c07aa0",
        cuerpo: {
            en: [
                "Produced recombinant spider silk proteins and assembled them into 3D scaffolds.",
                "Wrote protocols for structural characterisation.",
            ],
            es: [
                "Produje proteínas recombinantes de seda de araña y las ensamblé en andamios 3D.",
                "Redacté protocolos de caracterización estructural.",
            ],
            gl: [
                "Producín proteínas recombinantes de seda de araña e ensambleinas en estadas 3D.",
                "Redactei protocolos de caracterización estrutural.",
            ],
        },
        etiquetas: {
            en: ["Biomaterials"],
            es: ["Biomateriales"],
            gl: ["Biomateriais"],
        },
    },
    {
        id: "ki-master",
        tipo: "education",
        titulo: {
            en: "Master's degree in Biomedicine",
            es: "Máster en Biomedicina",
            gl: "Máster en Biomedicina",
        },
        organizacion: "Karolinska Institutet",
        lugar: "Stockholm, Sweden",
        fechas: { en: "2023 to 2025", es: "2023 a 2025", gl: "2023 a 2025" },
        orden: 202308,
        logo: "/logos/oficial/ki.svg",
        acento: "#c07aa0",
        prueba: {
            en: "Highest grade (VG) and a full scholarship from Fundación la Caixa",
            es: "Máxima calificación (VG) y beca completa de la Fundación la Caixa",
            gl: "Máxima cualificación (VG) e bolsa completa da Fundación la Caixa",
        },
        cuerpo: {
            en: ["Master's thesis at SciLifeLab on spaceflight biology data."],
            es: ["Trabajo de fin de máster en SciLifeLab sobre datos de biología espacial."],
            gl: ["Traballo de fin de máster en SciLifeLab sobre datos de bioloxía espacial."],
        },
        etiquetas: {
            en: ["Biomedicine", "Research"],
            es: ["Biomedicina", "Investigación"],
            gl: ["Biomedicina", "Investigación"],
        },
    },
    {
        id: "cimus-tfg",
        tipo: "career",
        titulo: {
            en: "Bachelor Thesis Researcher",
            es: "Investigador de trabajo de fin de grado",
            gl: "Investigador de traballo de fin de grao",
        },
        organizacion: "CiMUS, Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Nov 2022 to Jul 2023", es: "Nov 2022 a Jul 2023", gl: "Nov 2022 a Xul 2023" },
        orden: 202211,
        logo: "/logos/oficial/cimus.png",
        acento: "#56a419",
        cuerpo: {
            en: [
                "Tested new low molecular weight compounds for rheumatoid arthritis using gene expression assays (qPCR).",
                "Studied whether eprinomectin reduces the secretion of proinflammatory cytokines in vitro.",
            ],
            es: [
                "Probé nuevos compuestos de bajo peso molecular para la artritis reumatoide con ensayos de expresión génica (qPCR).",
                "Estudié si la eprinomectina reduce la secreción de citoquinas proinflamatorias in vitro.",
            ],
            gl: [
                "Probei novos compostos de baixo peso molecular para a artrite reumatoide con ensaios de expresión xénica (qPCR).",
                "Estudei se a eprinomectina reduce a secreción de citocinas proinflamatorias in vitro.",
            ],
        },
        etiquetas: {
            en: ["Immunology", "Research"],
            es: ["Inmunología", "Investigación"],
            gl: ["Inmunoloxía", "Investigación"],
        },
    },
    {
        id: "usc-grado",
        tipo: "education",
        titulo: {
            en: "Bachelor's degree in Biotechnology",
            es: "Grado en Biotecnología",
            gl: "Grao en Biotecnoloxía",
        },
        organizacion: "Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "2019 to 2023", es: "2019 a 2023", gl: "2019 a 2023" },
        orden: 201909,
        logo: "/logos/oficial/usc.svg",
        acento: "#9db35c",
        prueba: {
            en: "Average grade 9.2 out of 10, Premio Extraordinario Fin de Carrera (top of the class) and Academic Excellence Awards from the Xunta de Galicia",
            es: "Nota media de 9,2 sobre 10, Premio Extraordinario Fin de Carrera (primero de la promoción) y Premios de Excelencia Académica de la Xunta de Galicia",
            gl: "Nota media de 9,2 sobre 10, Premio Extraordinario Fin de Carreira (primeiro da promoción) e Premios de Excelencia Académica da Xunta de Galicia",
        },
        cuerpo: {
            en: ["Included three research placements at CiMUS."],
            es: ["Incluyó tres estancias de investigación en el CiMUS."],
            gl: ["Incluíu tres estadías de investigación no CiMUS."],
        },
        etiquetas: {
            en: ["Biotechnology"],
            es: ["Biotecnología"],
            gl: ["Biotecnoloxía"],
        },
    },
    {
        id: "ucl",
        tipo: "career",
        titulo: {
            en: "Research Intern",
            es: "Estudiante de prácticas en investigación",
            gl: "Estudante de prácticas en investigación",
        },
        organizacion: "Pereira-Acedo Lab, ILDH, University College London",
        lugar: "London, United Kingdom",
        fechas: { en: "Jul to Sep 2022", es: "Jul a Sep 2022", gl: "Xul a Set 2022" },
        orden: 202207,
        logo: "/logos/oficial/ucl.svg",
        acento: "#a77fd4",
        cuerpo: {
            en: ["Grew 3D tumour spheroids to test new photosensitive therapeutic compounds."],
            es: ["Cultivé esferoides tumorales 3D para probar nuevos compuestos terapéuticos fotosensibles."],
            gl: ["Cultivei esferoides tumorais 3D para probar novos compostos terapéuticos fotosensibles."],
        },
        etiquetas: {
            en: ["Oncology", "Research"],
            es: ["Oncología", "Investigación"],
            gl: ["Oncoloxía", "Investigación"],
        },
    },
    {
        id: "cimus-prion",
        tipo: "career",
        titulo: {
            en: "Research Intern",
            es: "Estudiante de prácticas en investigación",
            gl: "Estudante de prácticas en investigación",
        },
        organizacion: "Prionlab, CiMUS, Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Sep to Nov 2022", es: "Sep a Nov 2022", gl: "Set a Nov 2022" },
        orden: 202209,
        logo: "/logos/oficial/cimus.png",
        acento: "#56a419",
        cuerpo: {
            en: [
                "Studied prion biology and diseases caused by protein misfolding.",
                "Learned proteomics techniques for determining protein structure.",
            ],
            es: [
                "Estudié la biología de los priones y las enfermedades causadas por el plegamiento incorrecto de proteínas.",
                "Aprendí técnicas de proteómica para determinar la estructura de proteínas.",
            ],
            gl: [
                "Estudei a bioloxía dos prións e as enfermidades causadas polo pregamento incorrecto de proteínas.",
                "Aprendín técnicas de proteómica para determinar a estrutura de proteínas.",
            ],
        },
        etiquetas: {
            en: ["Proteomics", "Research"],
            es: ["Proteómica", "Investigación"],
            gl: ["Proteómica", "Investigación"],
        },
    },
    {
        id: "cimus-inmuno",
        tipo: "career",
        titulo: {
            en: "Research Intern",
            es: "Estudiante de prácticas en investigación",
            gl: "Estudante de prácticas en investigación",
        },
        organizacion: "Immunity and Small Molecules Lab, CiMUS, Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Feb to Jun 2022", es: "Feb a Jun 2022", gl: "Feb a Xuñ 2022" },
        orden: 202202,
        logo: "/logos/oficial/cimus.png",
        acento: "#56a419",
        cuerpo: {
            en: [
                "Cell culture with suspension and adherent cells.",
                "ELISA quantification and flow cytometry analysis.",
            ],
            es: [
                "Cultivo celular con células en suspensión y adherentes.",
                "Cuantificación por ELISA y análisis por citometría de flujo.",
            ],
            gl: [
                "Cultivo celular con células en suspensión e adherentes.",
                "Cuantificación por ELISA e análise por citometría de fluxo.",
            ],
        },
        etiquetas: {
            en: ["Immunology", "Cell culture"],
            es: ["Inmunología", "Cultivo celular"],
            gl: ["Inmunoloxía", "Cultivo celular"],
        },
    },
];

/** Competencies, straight from the CV, grouped as it groups them. */
export const competencias: { titulo: Texto; puntos: Texto[] }[] = [
    {
        titulo: {
            en: "Communication and outreach",
            es: "Comunicación y divulgación",
            gl: "Comunicación e divulgación",
        },
        puntos: [
            { en: "Science communication", es: "Comunicación científica", gl: "Comunicación científica" },
            { en: "Copywriting and editing", es: "Redacción y edición", gl: "Redacción e edición" },
            { en: "Public speaking", es: "Oratoria", gl: "Oratoria" },
            { en: "Daily news monitoring and curation", es: "Seguimiento y selección diaria de noticias", gl: "Seguimento e selección diaria de novas" },
            { en: "Writing for technical, institutional and general audiences", es: "Textos para públicos técnicos, institucionales y generales", gl: "Textos para públicos técnicos, institucionais e xerais" },
        ],
    },
    {
        titulo: {
            en: "Design and visuals",
            es: "Diseño y visuales",
            gl: "Deseño e visuais",
        },
        puntos: [
            { en: "Visual identity", es: "Identidad visual", gl: "Identidade visual" },
            { en: "Infographics and data visualisation", es: "Infografía y visualización de datos", gl: "Infografía e visualización de datos" },
            { en: "Presentation and slide design", es: "Diseño de presentaciones", gl: "Deseño de presentacións" },
            { en: "Video editing", es: "Edición de vídeo", gl: "Edición de vídeo" },
            { en: "Canva, Photoshop, Illustrator, Premiere Pro, After Effects, Figma", es: "Canva, Photoshop, Illustrator, Premiere Pro, After Effects, Figma", gl: "Canva, Photoshop, Illustrator, Premiere Pro, After Effects, Figma" },
        ],
    },
    {
        titulo: {
            en: "Earth observation and data",
            es: "Observación de la Tierra y datos",
            gl: "Observación da Terra e datos",
        },
        puntos: [
            { en: "Copernicus and Sentinel data", es: "Datos Copernicus y Sentinel", gl: "Datos Copernicus e Sentinel" },
            { en: "NDVI and vegetation indices", es: "NDVI e índices de vegetación", gl: "NDVI e índices de vexetación" },
            { en: "Geospatial visualisation", es: "Visualización geoespacial", gl: "Visualización xeoespacial" },
            { en: "Drone and aerial imagery", es: "Imagen aérea y de dron", gl: "Imaxe aérea e de dron" },
            { en: "Analysis in Python, R and MATLAB", es: "Análisis en Python, R y MATLAB", gl: "Análise en Python, R e MATLAB" },
        ],
    },
    {
        titulo: {
            en: "Languages",
            es: "Idiomas",
            gl: "Idiomas",
        },
        puntos: [
            { en: "Spanish and Galician, mother tongues", es: "Español y gallego, lenguas maternas", gl: "Castelán e galego, linguas maternas" },
            { en: "English, C2 listening and reading, C1 speaking and writing", es: "Inglés, C2 comprensión, C1 expresión", gl: "Inglés, C2 comprensión, C1 expresión" },
            { en: "Portuguese, C1", es: "Portugués, C1", gl: "Portugués, C1" },
            { en: "French, A2", es: "Francés, A2", gl: "Francés, A2" },
        ],
    },
];
