/**
 * Every visible string here comes in the three languages the site speaks.
 * Brand names, years and institution names stay as they are: translating
 * "Space and Society" or "IAC 2026" would make them wrong, not clearer.
 */
export type Texto = { en: string; es: string; gl: string };

/** "live" for something running, "play" for something you play. */
export type ProjectLink = { kind: "live" | "play"; href: string };

export type Project = {
    id: string;
    /** Brand name. The same in every language. */
    name: string;
    type: Texto;
    year: string;
    blurb: Texto;
    /**
     * The description on the console's ink screen, written to fill exactly
     * five lines of it in every language. Left out, the console falls back
     * to the blurb, steps its type down and cuts it at the fifth line.
     */
    brief?: Texto;
    /** Primary brand colour, used for the title, halo and card accent. */
    accent: string;
    /** Logo image in /public/projects, or "hoxe" for the inline editorial mark. */
    logo: string;
    /**
     * How the logo prints on paper: on the cartridge sticker and on the ink
     * screen of the projects console. "ink" turns a light logo into black
     * ink, since a white mark on white paper disappears. Left out, the logo
     * keeps its own colours.
     */
    markOnPaper?: "ink" | "color";
    links?: ProjectLink[];
    /** Institutions and acronyms, left untranslated on purpose. */
    status?: string;
    /** Optional talk embedded as a lazy YouTube facade. */
    video?: { id: string; start?: number; kind: "pitch" | "talk" };
    /**
     * False while the site answers with X-Frame-Options DENY, which stops any
     * page from loading it in a frame. The card then keeps the poster still.
     * Turn it back to true once the site names mcebral.com as a frame ancestor.
     */
    embeddable?: boolean;
    /**
     * The origins the site lets frame it, copied from the frame-ancestors
     * rule of its own Content-Security-Policy. Left out, the site sets no
     * limit. Served from anywhere else, the browser blocks the frame and logs
     * an error, so the console keeps the screenshot and never asks.
     */
    frameAncestors?: string[];
    /**
     * What the preview loads, when that is not simply the first link. Sites
     * that greet a first time visitor with a tour or a language gate take
     * ?embed=1, which skips it: nobody can read or dismiss a tour inside a
     * card, so it would only hide the thing worth showing.
     */
    previewUrl?: string;
    /**
     * The three that carry the page. They lead the projects index and they
     * are the ones the home page shows, at full size and running live.
     */
    flagship?: boolean;
    /**
     * One line of evidence, not description. What somebody else has said
     * about this, or the size of what it holds. It sits in the same slot on
     * every project, so the page can be read as a record and not as a list
     * of intentions. Left out where there is nothing verifiable to claim:
     * an empty slot is honest, an invented figure is not.
     */
    proof?: Texto;
};

/** Whether a page served from `origin` may show the project's site in a frame. */
export function canFrameFrom(p: Project, origin: string): boolean {
    if (p.embeddable === false) return false;
    return !p.frameAncestors || p.frameAncestors.includes(origin);
}

// ── EDIT PROJECTS HERE ────────────────────────────────────────────────────
// The card previews the first link, using public/projects/previews/<id>.jpg
// as the poster. Regenerate the posters with `node scripts/capturas.mjs`.
export const projects: Project[] = [
    {
        id: "all-in-space",
        name: "ALL-IN SPACE",
        type: {
            en: "Space Market Intelligence",
            es: "Inteligencia de mercado espacial",
            gl: "Intelixencia de mercado espacial",
        },
        year: "2025",
        blurb: {
            en: "A global space market intelligence platform. It profiles more than 200 countries and maps 1,088 companies across five sectors, with 3D orbital tracking and a daily news and launch feed written in plain language.",
            es: "Una plataforma global de inteligencia de mercado espacial. Perfila más de 200 países y cartografía 1.088 empresas en cinco sectores, con seguimiento orbital en 3D y un boletín diario de noticias y lanzamientos escrito en lenguaje llano.",
            gl: "Unha plataforma global de intelixencia de mercado espacial. Perfila máis de 200 países e cartografía 1.088 empresas en cinco sectores, con seguimento orbital en 3D e un boletín diario de novas e lanzamentos escrito en linguaxe chá.",
        },
        brief: {
            en: "The space economy on one screen. More than 200 countries profiled, 1,088 companies mapped, orbits tracked in 3D and a daily briefing in plain language. Every figure carries its source.",
            es: "La economía espacial en una sola pantalla. Más de 200 países perfilados, 1.088 empresas cartografiadas, órbitas en 3D y un boletín diario escrito en lenguaje llano. Cada cifra lleva su fuente.",
            gl: "A economía espacial nunha soa pantalla. Máis de 200 países perfilados, 1.088 empresas cartografadas, órbitas en 3D e un boletín diario escrito en linguaxe chá. Cada cifra leva a súa fonte.",
        },
        accent: "#b48bff",
        logo: "/projects/all-in-space.svg",
        links: [{ kind: "live", href: "https://allinspace.xyz/explore" }],
        video: { id: "3HKsfA4ykD8", start: 321, kind: "pitch" },
        previewUrl: "https://allinspace.xyz/explore?embed=1",
        frameAncestors: ["https://mcebral.com", "https://www.mcebral.com", "https://michael-cebral-site.vercel.app", "http://localhost:3000"],
        flagship: true,
        proof: {
            en: "200 countries profiled · 1,088 companies mapped · every figure carries its source",
            es: "200 países perfilados · 1.088 empresas cartografiadas · cada cifra con su fuente",
            gl: "200 países perfilados · 1.088 empresas cartografadas · cada cifra coa súa fonte",
        },
    },
    {
        id: "roadmap",
        name: "ROADMAP",
        type: {
            en: "Space Communication",
            es: "Comunicación espacial",
            gl: "Comunicación espacial",
        },
        year: "2026",
        blurb: {
            en: "A communication plan for future Moon and Mars missions, with separate messaging for technical, institutional and public audiences. The web platform turns country level space capability data into long range communication plans. It won the Space and Society category at IAC 2026.",
            es: "Un plan de comunicación para las futuras misiones a la Luna y a Marte, con mensajes distintos para públicos técnicos, institucionales y generales. La plataforma web convierte datos de capacidad espacial por país en planes de comunicación a largo plazo. Ganó la categoría Space and Society en el IAC 2026.",
            gl: "Un plan de comunicación para as futuras misións á Lúa e a Marte, con mensaxes distintas para públicos técnicos, institucionais e xerais. A plataforma web converte datos de capacidade espacial por país en plans de comunicación a longo prazo. Gañou a categoría Space and Society no IAC 2026.",
        },
        brief: {
            en: "How to talk about going to the Moon and Mars, country by country. A web platform turns space capability data into long range communication plans. Winner of Space and Society at IAC 2026.",
            es: "Cómo contar las misiones a la Luna y a Marte, país por país. Una plataforma web convierte datos de capacidad espacial en planes de comunicación a largo plazo. Ganó Space and Society en el IAC 2026.",
            gl: "Como contar as misións á Lúa e a Marte, país por país. Unha plataforma web converte datos de capacidade espacial en plans de comunicación a longo prazo. Gañou Space and Society no IAC 2026.",
        },
        accent: "#6ea8ff",
        logo: "/projects/roadmap.svg",
        markOnPaper: "ink",
        links: [{ kind: "live", href: "https://roadmap-project-five.vercel.app" }],
        status: "ISU · IAC 2026",
        video: { id: "Q7CzyzCGLO0", start: 9547, kind: "talk" },
        proof: {
            en: "Winner of the Space and Society category at IAC 2026 · International Space University",
            es: "Ganador de la categoría Space and Society en el IAC 2026 · International Space University",
            gl: "Gañador da categoría Space and Society no IAC 2026 · International Space University",
        },
    },
    {
        id: "eoguessr",
        name: "EOGUESSR",
        type: {
            en: "Educational Game · Earth Observation",
            es: "Juego educativo · Observación de la Tierra",
            gl: "Xogo educativo · Observación da Terra",
        },
        year: "2026",
        blurb: {
            en: "A free daily game that teaches you to read the planet from space. It drops you on a real, hidden place on Earth and lets you unlock Copernicus and NASA signal layers, vegetation, water, terrain, heat and night lights, to reason your way to the spot and drop a pin. Built solo with open data, and playable in English, Spanish and Galician.",
            es: "Un juego diario y gratuito que enseña a leer el planeta desde el espacio. Te suelta en un lugar real y oculto de la Tierra y te deja desbloquear capas de señal de Copernicus y la NASA, vegetación, agua, relieve, calor y luces nocturnas, para razonar dónde estás y clavar el alfiler. Hecho en solitario con datos abiertos y jugable en español, inglés y gallego.",
            gl: "Un xogo diario e gratuíto que ensina a ler o planeta desde o espazo. Sóltate nun lugar real e agochado da Terra e déixache desbloquear capas de sinal de Copernicus e a NASA, vexetación, auga, relevo, calor e luces nocturnas, para razoar onde estás e cravar o alfinete. Feito en solitario con datos abertos e xogable en galego, castelán e inglés.",
        },
        brief: {
            en: "A daily game that teaches you to read the planet from space. You land somewhere hidden on Earth and unlock Copernicus and NASA layers, water, heat and night lights, until you can drop the pin.",
            es: "Un juego diario que enseña a leer el planeta desde el espacio. Apareces en un lugar oculto de la Tierra y desbloqueas capas de Copernicus y la NASA, agua, calor y luces nocturnas, hasta clavar el alfiler.",
            gl: "Un xogo diario que ensina a ler o planeta desde o espazo. Apareces nun lugar agochado da Terra e desbloqueas capas de Copernicus e a NASA, auga, calor e luces nocturnas, ata cravar o alfinete.",
        },
        accent: "#4ec1ce",
        logo: "/projects/eoguessr.svg",
        links: [{ kind: "live", href: "https://eoguessr.app" }],
        previewUrl: "https://eoguessr.app/?embed=1",
        frameAncestors: ["https://mcebral.com", "https://www.mcebral.com", "https://michael-cebral-site.vercel.app", "https://mcebralloportfolio.vercel.app"],
        flagship: true,
        proof: {
            en: "Copernicus and NASA open data · built solo · playable in English, Spanish and Galician",
            es: "Datos abiertos de Copernicus y la NASA · hecho en solitario · jugable en tres idiomas",
            gl: "Datos abertos de Copernicus e a NASA · feito en solitario · xogable en tres idiomas",
        },
    },
    {
        id: "rakugaki",
        name: "RAKUGAKI",
        type: {
            en: "Fighting Game · Ink Calligraphy",
            es: "Juego de lucha · Caligrafía a tinta",
            gl: "Xogo de loita · Caligrafía a tinta",
        },
        year: "2026",
        blurb: {
            en: "A one on one fighting game where every attack is a brushstroke: you cast spells by drawing sumi-e calligraphy in real time and duel across hand painted ink arenas. Built solo in a single canvas file, with a live tutorial, online play and four elemental masters.",
            es: "Un juego de lucha uno contra uno donde cada ataque es una pincelada: lanzas hechizos dibujando caligrafía sumi-e en tiempo real y peleas en arenas de tinta pintadas a mano. Hecho en solitario en un único fichero de canvas, con tutorial en vivo, juego en línea y cuatro maestros elementales.",
            gl: "Un xogo de loita un contra un onde cada ataque é unha pincelada: lanzas feitizos debuxando caligrafía sumi-e en tempo real e pelexas en areas de tinta pintadas a man. Feito en solitario nun único ficheiro de canvas, con titorial en vivo, xogo en liña e catro mestres elementais.",
        },
        brief: {
            en: "A fighting game where every attack is a brushstroke. You cast spells by drawing sumi-e calligraphy in real time, in hand painted ink arenas. Four elemental masters and online play, built solo.",
            es: "Un juego de lucha donde cada ataque es una pincelada. Lanzas hechizos dibujando caligrafía sumi-e en tiempo real, en arenas de tinta pintadas a mano. Cuatro maestros elementales y juego en línea.",
            gl: "Un xogo de loita onde cada ataque é unha pincelada. Lanzas feitizos debuxando caligrafía sumi-e en tempo real, en areas de tinta pintadas a man. Catro mestres elementais e xogo en liña.",
        },
        accent: "#cf5240",
        logo: "/projects/rakugaki.png",
        markOnPaper: "ink",
        links: [{ kind: "play", href: "https://rakugaki-deploy.vercel.app" }],
    },
    {
        id: "copernicus-mosaic",
        name: "COPERNICUS MOSAIC",
        type: {
            en: "Photomosaic · Earth Observation",
            es: "Fotomosaico · Observación de la Tierra",
            gl: "Fotomosaico · Observación da Terra",
        },
        year: "2026",
        blurb: {
            en: "Rebuilds any photo, word or logo out of real Sentinel-2 views of Earth. Every tile is a place you can find. Tap one and it tells you where it is, when the satellite passed over and what lies nearby. The library holds 53,767 views of 7,039 places, picked for beauty and variety. Words and logos can be drawn in coastlines, and every mosaic saves as a full resolution poster.",
            es: "Reconstruye cualquier foto, palabra o logo con vistas reales de la Tierra tomadas por Sentinel-2. Cada tesela es un lugar que se puede encontrar. Pulsas una y te dice dónde está, cuándo pasó el satélite y qué hay cerca. La biblioteca reúne 53.767 vistas de 7.039 lugares, elegidas por su belleza y su variedad. Las palabras y los logos se pueden dibujar con líneas de costa, y cada mosaico se guarda como póster a resolución completa.",
            gl: "Reconstrúe calquera foto, palabra ou logo con vistas reais da Terra tomadas por Sentinel-2. Cada tesela é un lugar que se pode atopar. Premes unha e dicche onde está, cando pasou o satélite e que hai preto. A biblioteca reúne 53.767 vistas de 7.039 lugares, escollidas pola súa beleza e variedade. As palabras e os logos pódense debuxar con liñas de costa, e cada mosaico gárdase como póster a resolución completa.",
        },
        brief: {
            en: "Any photo, word or logo rebuilt from real Sentinel-2 views of Earth. Every tile is a place you can find. Tap one and it tells you where it is and when the satellite passed right over it.",
            es: "Cualquier foto, palabra o logo reconstruido con vistas reales de Sentinel-2. Cada tesela es un lugar que puedes encontrar. Pulsas una y te dice dónde está y cuándo pasó el satélite sobre ella.",
            gl: "Calquera foto, palabra ou logo reconstruído con vistas reais de Sentinel-2. Cada tesela é un lugar que podes atopar. Premes unha e dicche onde está e cando pasou o satélite por enriba dela.",
        },
        accent: "#dd9461",
        logo: "/projects/copernicus-mosaic.svg",
        links: [{ kind: "live", href: "https://copernicus-mosaic.netlify.app" }],
        previewUrl: "https://copernicus-mosaic.netlify.app/?embed=1",
    },
    {
        id: "arquivonos",
        name: "ARQUIVO NÓS",
        type: {
            en: "Territorial Memory · Open Data",
            es: "Memoria territorial · Datos abiertos",
            gl: "Memoria territorial · Datos abertos",
        },
        year: "2026",
        blurb: {
            en: "Everything Galicia knows about itself, on one map. Point at any place and it gathers the land, the history, the people and the heritage of that spot, across three hundred and thirteen councils and three thousand seven hundred parishes, with the open source behind every fact. The map also travels back to the 1956 aerial survey and Fontán's 1845 chart. Written in Galician.",
            es: "Todo lo que Galicia sabe de sí misma, en un mapa. Señala cualquier lugar y reúne la tierra, la historia, la gente y el patrimonio de ese punto, en trescientos trece concellos y tres mil setecientas parroquias, con la fuente abierta detrás de cada dato. El mapa viaja además al vuelo aéreo de 1956 y a la carta de Fontán de 1845. Escrito en gallego.",
            gl: "Todo o que Galicia sabe de si mesma, nun mapa. Sinala calquera lugar e reúne a terra, a historia, a xente e o patrimonio dese punto, en trescentos trece concellos e tres mil setecentas parroquias, coa fonte aberta detrás de cada dato. O mapa viaxa ademais ao voo aéreo de 1956 e á carta de Fontán de 1845. Escrito en galego.",
        },
        brief: {
            en: "Everything Galicia knows about itself, on one map. Point at any spot and it gathers its land, history, people and heritage, across 313 councils and 3,785 parishes, each fact with its open source.",
            es: "Todo lo que Galicia sabe de sí misma, en un mapa. Señalas un punto y reúne su tierra, su historia, su gente y su patrimonio, en 313 concellos y 3.785 parroquias, cada dato con su fuente abierta.",
            gl: "Todo o que Galicia sabe de si mesma, nun mapa. Sinalas un punto e reúne a súa terra, historia, xente e patrimonio, en 313 concellos e 3.785 parroquias, cada dato coa súa fonte aberta.",
        },
        accent: "#8fa76b",
        logo: "/projects/arquivonos.svg",
        markOnPaper: "ink",
        links: [{ kind: "live", href: "https://arquivonos.com" }],
        previewUrl: "https://arquivonos.com/?embed=1",
        flagship: true,
        proof: {
            en: "313 councils · 3,785 parishes · every fact traceable to an open source",
            es: "313 concellos · 3.785 parroquias · cada dato trazable hasta una fuente abierta",
            gl: "313 concellos · 3.785 parroquias · cada dato rastrexable ata unha fonte aberta",
        },
    },
    {
        id: "hoxe",
        name: "HOXE",
        type: {
            en: "Editorial · Mobile App",
            es: "Editorial · App móvil",
            gl: "Editorial · App móbil",
        },
        year: "2025",
        blurb: {
            en: "A daily briefing on the day you are living. It gathers what happened on this exact date across history and space, written the way an editor would write it. Every entry is checked by hand and paired with an image that fits it and the music of that week. In English, Spanish and Galician, on the web and on Android.",
            es: "Un resumen diario del día que estás viviendo. Reúne lo que pasó en esta misma fecha a lo largo de la historia y del espacio, escrito como lo haría un editor. Cada entrada se revisa a mano y lleva una imagen que le corresponde y la música de esa semana. En inglés, castellano y gallego, en la web y en Android.",
            gl: "Un resumo diario do día que estás a vivir. Reúne o que pasou nesta mesma data ao longo da historia e do espazo, escrito como o faría un editor. Cada entrada revísase a man e leva unha imaxe que lle corresponde e a música desa semana. En galego, castelán e inglés, na web e en Android.",
        },
        brief: {
            en: "A daily briefing on the day you are living. What happened on this date across history and space, written like an editor would and checked by hand, with an image and the music of that week.",
            es: "Un resumen diario del día que estás viviendo. Lo que pasó en esta fecha en la historia y en el espacio, escrito como lo haría un editor y revisado a mano, con su imagen y la música de esa semana.",
            gl: "Un resumo diario do día que estás a vivir. O que pasou nesta mesma data na historia e no espazo, escrito como o faría un editor e revisado a man, coa súa imaxe e a música desa semana.",
        },
        accent: "#d8b878",
        logo: "hoxe",
        markOnPaper: "ink",
        links: [{ kind: "live", href: "https://hoxe.org" }],
        previewUrl: "https://hoxe.org/?embed=1",
    },
    {
        id: "laikas-company",
        name: "LAIKA’S COMPANY",
        type: {
            en: "Science Communication · Space",
            es: "Comunicación científica · Espacio",
            gl: "Comunicación científica · Espazo",
        },
        year: "2026",
        blurb: {
            en: "A science communication studio for the space sector, run by two partners. Documentaries about space companies and questions, public speaking and presentation workshops, and communication consulting. Named after Laika, the stray who became the first animal to orbit the Earth in 1957, as a promise to always tell the true story.",
            es: "Un estudio de comunicación científica para el sector espacial, llevado por dos socios. Documentales sobre empresas y cuestiones del espacio, talleres de oratoria y presentaciones, y consultoría de comunicación. Lleva el nombre de Laika, la perra callejera que en 1957 fue el primer animal en orbitar la Tierra, como promesa de contar siempre la historia real.",
            gl: "Un estudo de comunicación científica para o sector espacial, levado por dous socios. Documentais sobre empresas e cuestións do espazo, obradoiros de oratoria e presentacións, e consultoría de comunicación. Leva o nome de Laika, a cadela da rúa que en 1957 foi o primeiro animal en orbitar a Terra, como promesa de contar sempre a historia real.",
        },
        brief: {
            en: "A science communication studio for the space sector. Documentaries, public speaking workshops and consulting. Named after the first animal in orbit, as a promise to always tell the true story.",
            es: "Un estudio de comunicación científica para el sector espacial. Documentales, talleres de oratoria y consultoría. Lleva el nombre de la primera perra en órbita, la promesa de contar la historia real.",
            gl: "Un estudo de comunicación científica para o sector espacial. Documentais, obradoiros de oratoria e consultoría. Leva o nome da primeira cadela en órbita, a promesa de contar a historia real.",
        },
        accent: "#b49171",
        logo: "/projects/laikas-company.svg",
        /* The link arrives later: until then the ink screen shows no button */
    },
];
