/**
 * Póster de cada proyecto para el preview de /articles.
 *
 * La tarjeta de cada proyecto carga la web real en un iframe, pero una web
 * tarda entre uno y tres segundos en pintar. El póster se ve al instante y la
 * web viva aparece encima cuando termina de cargar, así que el hueco nunca
 * está en blanco. En los proyectos que prohíben incrustarse el póster se queda
 * como preview definitivo.
 *
 * Uso (una sola vez):
 *   npm i -D playwright && npx playwright install chromium
 * Y despues, cada vez que rediseñes una de las webs:
 *   node scripts/capturas.mjs            todas
 *   node scripts/capturas.mjs arquivonos una sola
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'public', 'projects', 'previews');

/** El id tiene que coincidir con el del proyecto en src/data/projects.ts. */
const WEBS = [
    { id: 'all-in-space', url: 'https://allinspace.xyz/explore', espera: 9000 },
    { id: 'ariadne', url: 'https://ariadne-gamma.vercel.app', espera: 5000 },
    { id: 'abil', url: 'https://clearesg.vercel.app', espera: 5000 },
    { id: 'nexum', url: 'https://nexumxestion.com', espera: 5000 },
    { id: 'roadmap', url: 'https://roadmap-project-five.vercel.app', espera: 9000 },
    { id: 'eoguessr', url: 'https://eoguessr.app', espera: 8000 },
    { id: 'rakugaki', url: 'https://rakugaki-deploy.vercel.app', espera: 7000 },
    { id: 'arquivonos', url: 'https://arquivonos.com', espera: 10000 },
    { id: 'hoxe', url: 'https://hoxe.org', espera: 6000 },
];

const soloEste = process.argv[2];
const cola = soloEste ? WEBS.filter((w) => w.id === soloEste) : WEBS;
if (!cola.length) {
    console.error(`No hay ningún proyecto con el id "${soloEste}".`);
    process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });

// El navegador pinta a 1280 de ancho y guarda a 896, que es el doble de lo que
// mide el preview en pantalla. Suficiente para pantallas retina sin engordar.
const browser = await chromium.launch({ args: ['--disable-gpu'] });

for (const web of cola) {
    const page = await browser.newPage({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 0.7,
        colorScheme: 'dark',
    });
    try {
        await page.goto(web.url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(web.espera);
        const salida = join(DESTINO, `${web.id}.jpg`);
        // Sin `animations` una web que nunca se queda quieta agota el plazo.
        await page.screenshot({
            path: salida,
            type: 'jpeg',
            quality: 80,
            animations: 'disabled',
            timeout: 60000,
        });
        console.log(`  ok  ${web.id}`);
    } catch (error) {
        console.error(`  falló  ${web.id}: ${error.message.split('\n')[0]}`);
    } finally {
        await page.close();
    }
}

await browser.close();
console.log(`\nPósters en public/projects/previews`);
