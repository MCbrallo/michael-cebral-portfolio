import type { Texto } from "@/data/projects";

/**
 * The record behind /about/cv, replacing experiences.json.
 *
 * Three languages, like the rest of the site. Institutions, grades and award
 * names stay in their own language: "Premio Extraordinario Fin de Carrera" is
 * the name of a thing, not a sentence.
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
    /** The evidence line, in the same slot and shape used across the site. */
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
            es: "Becario de Comunicación Científica y Evaluación de la Investigación",
            gl: "Bolseiro de Comunicación Científica e Avaliación da Investigación",
        },
        organizacion: "European Space Agency · Exploration Science Office, ESTEC",
        lugar: "Noordwijk, Netherlands",
        fechas: { en: "Jul to Oct 2026", es: "Jul a Oct 2026", gl: "Xul a Out 2026" },
        orden: 202607,
        logo: "/logos/mono/esa.png",
        acento: "#5b9bd5",
        prueba: {
            en: "Incoming · human spaceflight programme",
            es: "Entrante · programa de vuelo espacial tripulado",
            gl: "Entrante · programa de voo espacial tripulado",
        },
        cuerpo: {
            en: [
                "Joining ESA's human spaceflight programme to help communicate exploration science and support research evaluation, for readers who range from review panels to the wider public.",
            ],
            es: [
                "Me incorporo al programa de vuelo espacial tripulado de la ESA para comunicar la ciencia de la exploración y apoyar la evaluación de la investigación, para lectores que van desde paneles de revisión hasta el público general.",
            ],
            gl: [
                "Incorpórome ao programa de voo espacial tripulado da ESA para comunicar a ciencia da exploración e apoiar a avaliación da investigación, para lectores que van desde paneis de revisión ata o público xeral.",
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
            en: "Master's degree in Space Studies · Space Policy and Entrepreneurship",
            es: "Máster en Estudios Espaciales · Política Espacial y Emprendimiento",
            gl: "Máster en Estudos Espaciais · Política Espacial e Emprendemento",
        },
        organizacion: "International Space University",
        lugar: "Strasbourg, France",
        fechas: { en: "2025 to 2027", es: "2025 a 2027", gl: "2025 a 2027" },
        orden: 202508,
        logo: "/logos/mono/isu.png",
        acento: "#8b83dd",
        prueba: {
            en: "Full scholarship · Fundación Barrié",
            es: "Beca completa · Fundación Barrié",
            gl: "Bolsa completa · Fundación Barrié",
        },
        cuerpo: {
            en: ["Space policy and entrepreneurship, alongside executive certificates in space applications."],
            es: ["Política espacial y emprendimiento, junto a certificados ejecutivos en aplicaciones espaciales."],
            gl: ["Política espacial e emprendemento, xunto a certificados executivos en aplicacións espaciais."],
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
        organizacion: "Giacomello Lab · SciLifeLab, KTH Royal Institute of Technology",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Nov 2024 to Aug 2025", es: "Nov 2024 a Ago 2025", gl: "Nov 2024 a Ago 2025" },
        orden: 202411,
        logo: "/logos/mono/scilifelab.png",
        acento: "#4fb3a3",
        prueba: {
            en: "NASA Rodent Research 9 · pipelines kept on as the lab standard",
            es: "NASA Rodent Research 9 · pipelines adoptados como estándar del laboratorio",
            gl: "NASA Rodent Research 9 · pipelines adoptados como estándar do laboratorio",
        },
        cuerpo: {
            en: [
                "Made dense spaceflight biology data, the NASA Rodent Research 9 bone and muscle samples, readable for specialists and non specialists alike, through clear summaries and figures.",
                "Wrote reproducible data pipelines in R and Python that the lab kept on as its standard.",
                "Produced the figures and summaries the team relied on internally and in its outreach.",
            ],
            es: [
                "Hice legibles, para especialistas y para quien no lo es, datos densos de biología de vuelo espacial: las muestras de hueso y músculo de NASA Rodent Research 9, con resúmenes y figuras claras.",
                "Escribí pipelines de datos reproducibles en R y Python que el laboratorio adoptó como estándar.",
                "Produje las figuras y los resúmenes que el equipo usó por dentro y en divulgación.",
            ],
            gl: [
                "Fixen lexibles, para especialistas e para quen non o é, datos densos de bioloxía de voo espacial: as mostras de óso e músculo de NASA Rodent Research 9, con resumos e figuras claras.",
                "Escribín pipelines de datos reproducibles en R e Python que o laboratorio adoptou como estándar.",
                "Producín as figuras e os resumos que o equipo usou por dentro e en divulgación.",
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
            es: "Coordinador de Diseño y Comunicación",
            gl: "Coordinador de Deseño e Comunicación",
        },
        organizacion: "TEDxKI · Karolinska Institutet",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Nov 2023 to Jun 2024", es: "Nov 2023 a Jun 2024", gl: "Nov 2023 a Xuñ 2024" },
        orden: 202311,
        logo: "/logos/mono/ki.png",
        acento: "#d9635a",
        prueba: {
            en: "A TEDx event of 2,500 people · one visual identity across everything",
            es: "Un TEDx de 2.500 personas · una identidad visual para todo",
            gl: "Un TEDx de 2.500 persoas · unha identidade visual para todo",
        },
        cuerpo: {
            en: [
                "Ran the visual identity and every piece of communication for a TEDx event of 2,500 people: slides, signage, social posts and speaker decks, all held to one coherent style.",
                "Built the slide templates and visual guidelines that every speaker worked from.",
            ],
            es: [
                "Llevé la identidad visual y toda la comunicación de un TEDx de 2.500 personas: diapositivas, señalética, redes y presentaciones de ponentes, todo bajo un mismo estilo.",
                "Construí las plantillas y las guías visuales con las que trabajó cada ponente.",
            ],
            gl: [
                "Levei a identidade visual e toda a comunicación dun TEDx de 2.500 persoas: diapositivas, sinaléctica, redes e presentacións de relatores, todo baixo un mesmo estilo.",
                "Construín as plantillas e as guías visuais coas que traballou cada relator.",
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
            en: "Around 30 public talks · three countries · six years",
            es: "Unas 30 charlas públicas · tres países · seis años",
            gl: "Arredor de 30 charlas públicas · tres países · seis anos",
        },
        cuerpo: {
            en: [
                "Gave around 30 public talks in three countries over six years, from primary school classrooms to international conferences, designing the slides, graphics and posts for each one.",
                "Reshaped the same science, across space, biology and research careers, to fit whoever was in the room.",
            ],
            es: [
                "Di unas 30 charlas públicas en tres países a lo largo de seis años, desde aulas de primaria hasta congresos internacionales, diseñando las diapositivas, los gráficos y las publicaciones de cada una.",
                "Rehíce la misma ciencia, entre espacio, biología y carreras de investigación, para encajar con quien tuviera delante.",
            ],
            gl: [
                "Dei arredor de 30 charlas públicas en tres países ao longo de seis anos, desde aulas de primaria ata congresos internacionais, deseñando as diapositivas, os gráficos e as publicacións de cada unha.",
                "Refixen a mesma ciencia, entre espazo, bioloxía e carreiras de investigación, para encaixar con quen tivese diante.",
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
        organizacion: "European Space Agency · ELGRA",
        lugar: "Transinne, Belgium",
        fechas: { en: "2024", es: "2024", gl: "2024" },
        orden: 202406,
        logo: "/logos/mono/esa.png",
        acento: "#5b9bd5",
        prueba: { en: "Grade A", es: "Calificación A", gl: "Cualificación A" },
        cuerpo: {
            en: ["Microgravity research, and the ground platforms that stand in for it."],
            es: ["Investigación en microgravedad y las plataformas en tierra que la sustituyen."],
            gl: ["Investigación en microgravidade e as plataformas en terra que a substitúen."],
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
        organizacion: "Anna Rising Lab · Karolinska Institutet",
        lugar: "Stockholm, Sweden",
        fechas: { en: "Mar to Jun 2024", es: "Mar a Jun 2024", gl: "Mar a Xuñ 2024" },
        orden: 202403,
        logo: "/logos/mono/ki.png",
        acento: "#c07aa0",
        cuerpo: {
            en: [
                "Produced recombinant spider silk proteins and assembled 3D scaffolds.",
                "Generated protocols for structural characterisation.",
            ],
            es: [
                "Produje proteínas recombinantes de seda de araña y ensamblé andamios 3D.",
                "Generé protocolos para caracterización estructural.",
            ],
            gl: [
                "Producín proteínas recombinantes de seda de araña e ensamblei estadas 3D.",
                "Xerei protocolos para caracterización estrutural.",
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
        logo: "/logos/mono/ki.png",
        acento: "#c07aa0",
        prueba: {
            en: "Grade VG, highest distinction · full scholarship, Fundación la Caixa",
            es: "Calificación VG, máxima distinción · beca completa, Fundación la Caixa",
            gl: "Cualificación VG, máxima distinción · bolsa completa, Fundación la Caixa",
        },
        cuerpo: {
            en: ["Biomedicine, with the thesis carried out at SciLifeLab on spaceflight biology data."],
            es: ["Biomedicina, con el trabajo de fin de máster en SciLifeLab sobre datos de biología de vuelo espacial."],
            gl: ["Biomedicina, co traballo de fin de máster en SciLifeLab sobre datos de bioloxía de voo espacial."],
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
        organizacion: "CiMUS · Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Nov 2022 to Jul 2023", es: "Nov 2022 a Jul 2023", gl: "Nov 2022 a Xul 2023" },
        orden: 202211,
        logo: "/logos/mono/usc.png",
        acento: "#9db35c",
        cuerpo: {
            en: [
                "Investigated novel low molecular weight compounds for treating rheumatoid arthritis using gene expression assays (qPCR).",
                "Explored the efficacy of eprinomectin in reducing pro inflammatory cytokine secretion in vitro.",
            ],
            es: [
                "Investigué compuestos novedosos de bajo peso molecular para el tratamiento de la artritis reumatoide mediante ensayos de expresión génica (qPCR).",
                "Exploré la eficacia de la eprinomectina en la reducción de la secreción de citoquinas proinflamatorias in vitro.",
            ],
            gl: [
                "Investiguei compostos novos de baixo peso molecular para o tratamento da artrite reumatoide mediante ensaios de expresión xénica (qPCR).",
                "Explorei a eficacia da eprinomectina na redución da secreción de citocinas proinflamatorias in vitro.",
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
        logo: "/logos/mono/usc.png",
        acento: "#9db35c",
        prueba: {
            en: "9.2 out of 10 · Premio Extraordinario Fin de Carrera, top of the class · Academic Excellence Awards, Xunta de Galicia",
            es: "9,2 sobre 10 · Premio Extraordinario Fin de Carrera, primero de la promoción · Premios de Excelencia Académica, Xunta de Galicia",
            gl: "9,2 sobre 10 · Premio Extraordinario Fin de Carreira, primeiro da promoción · Premios de Excelencia Académica, Xunta de Galicia",
        },
        cuerpo: {
            en: ["Biotechnology, with three research placements at CiMUS alongside the degree."],
            es: ["Biotecnología, con tres estancias de investigación en el CiMUS durante la carrera."],
            gl: ["Biotecnoloxía, con tres estadías de investigación no CiMUS durante a carreira."],
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
        organizacion: "Pereira-Acedo Lab · ILDH, University College London",
        lugar: "London, United Kingdom",
        fechas: { en: "Jul to Sep 2022", es: "Jul a Sep 2022", gl: "Xul a Set 2022" },
        orden: 202207,
        logo: "/logos/mono/ucl.png",
        acento: "#a77fd4",
        cuerpo: {
            en: ["Generated 3D tumour spheroids to test novel photosensitive therapeutic compounds."],
            es: ["Generé esferoides tumorales 3D para probar nuevos compuestos terapéuticos fotosensibles."],
            gl: ["Xerei esferoides tumorais 3D para probar novos compostos terapéuticos fotosensibles."],
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
        organizacion: "Prionlab · CiMUS, Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Sep to Nov 2022", es: "Sep a Nov 2022", gl: "Set a Nov 2022" },
        orden: 202209,
        logo: "/logos/mono/usc.png",
        acento: "#9db35c",
        cuerpo: {
            en: [
                "Studied prion biology and protein misfolding diseases.",
                "Learned proteomics techniques for protein structural elucidation.",
            ],
            es: [
                "Estudié la biología de los priones y las enfermedades por plegamiento incorrecto de proteínas.",
                "Aprendí técnicas de proteómica para la elucidación estructural de proteínas.",
            ],
            gl: [
                "Estudei a bioloxía dos prións e as enfermidades por pregamento incorrecto de proteínas.",
                "Aprendín técnicas de proteómica para a elucidación estrutural de proteínas.",
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
        organizacion: "Immunity and Small Molecules Lab · CiMUS, Universidade de Santiago de Compostela",
        lugar: "Santiago de Compostela, Spain",
        fechas: { en: "Feb to Jun 2022", es: "Feb a Jun 2022", gl: "Feb a Xuñ 2022" },
        orden: 202202,
        logo: "/logos/mono/usc.png",
        acento: "#9db35c",
        cuerpo: {
            en: [
                "Developed cell culture skills with suspension and adherent cells.",
                "Performed colorimetric quantification (ELISA) and flow cytometry analysis.",
            ],
            es: [
                "Desarrollé habilidades de cultivo celular con células en suspensión y adherentes.",
                "Realicé cuantificación colorimétrica (ELISA) y análisis de citometría de flujo.",
            ],
            gl: [
                "Desenvolvín habilidades de cultivo celular con células en suspensión e adherentes.",
                "Realicei cuantificación colorimétrica (ELISA) e análise de citometría de fluxo.",
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
            { en: "Public speaking", es: "Oratoria y charlas", gl: "Oratoria e charlas" },
            { en: "Daily news monitoring and curation", es: "Seguimiento y curación diaria de noticias", gl: "Seguimento e curación diaria de novas" },
            { en: "Messaging for technical, institutional and public audiences", es: "Mensajes para públicos técnicos, institucionales y generales", gl: "Mensaxes para públicos técnicos, institucionais e xerais" },
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
            { en: "English, C2 listening and reading, C1 spoken and written", es: "Inglés, C2 comprensión, C1 expresión", gl: "Inglés, C2 comprensión, C1 expresión" },
            { en: "Portuguese, C1", es: "Portugués, C1", gl: "Portugués, C1" },
            { en: "French, A2", es: "Francés, A2", gl: "Francés, A2" },
        ],
    },
];
