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
    /** Primary brand colour, used for the title, halo and card accent. */
    accent: string;
    /** Logo image in /public/projects, or "hoxe" for the inline editorial mark. */
    logo: string;
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
        accent: "#b48bff",
        logo: "/projects/all-in-space.svg",
        links: [{ kind: "live", href: "https://allinspace.xyz/explore" }],
        video: { id: "3HKsfA4ykD8", start: 321, kind: "pitch" },
        previewUrl: "https://allinspace.xyz/explore?embed=1",
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
        accent: "#6ea8ff",
        logo: "/projects/roadmap.svg",
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
        accent: "#4ec1ce",
        logo: "/projects/eoguessr.svg",
        links: [{ kind: "live", href: "https://eoguessr.app" }],
        previewUrl: "https://eoguessr.app/?embed=1",
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
        accent: "#cf5240",
        logo: "/projects/rakugaki.png",
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
        accent: "#8fa76b",
        logo: "/projects/arquivonos.svg",
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
            en: "A daily briefing on the day you are living. Open it and you get what happened on this exact date, across history and across space, written the way an editor would write it and not the way a database prints it. Every entry is checked by hand, dated properly, given an image that truly matches it and paired with the music that was playing that week. A list of terms that must never appear before their time stops anachronisms before anything goes in. It reads in English, Spanish and Galician, keeps an archive and the days you save, and runs on the web and as an Android app.",
            es: "Un resumen diario del día que estás viviendo. Al abrirlo encuentras lo que pasó en esta misma fecha, a lo largo de la historia y del espacio, escrito como lo escribiría un editor y no como lo imprime una base de datos. Cada entrada se revisa a mano, se data con cuidado, lleva una imagen que de verdad le corresponde y la música que sonaba esa semana. Una lista de términos que nunca pueden aparecer antes de su época frena los anacronismos antes de que entren. Se lee en inglés, castellano y gallego, guarda un archivo y los días que marcas, y funciona en la web y como app para Android.",
            gl: "Un resumo diario do día que estás a vivir. Ao abrilo atopas o que pasou nesta mesma data, ao longo da historia e do espazo, escrito como o escribiría un editor e non como o imprime unha base de datos. Cada entrada revísase a man, dátase con coidado, leva unha imaxe que de verdade lle corresponde e a música que soaba esa semana. Unha lista de termos que nunca poden aparecer antes da súa época frea os anacronismos antes de que entren. Lese en galego, castelán e inglés, garda un arquivo e os días que marcas, e funciona na web e como app para Android.",
        },
        accent: "#d8b878",
        logo: "hoxe",
        links: [{ kind: "live", href: "https://hoxe.org" }],
        previewUrl: "https://hoxe.org/?embed=1",
    },
];
