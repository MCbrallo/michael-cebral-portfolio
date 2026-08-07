/**
 * Los logos institucionales vienen como vienen: unos con fondo blanco opaco,
 * otros ya recortados sobre transparente. Sobre la tarjeta oscura del CV eso
 * obligaba a ponerles una placa blanca detrás, que es justo lo que rompía la
 * coherencia con los proyectos, donde el logo va libre sobre su halo.
 *
 * Esto los normaliza a UNA sola forma: silueta blanca sobre transparente, en
 * public/logos/mono. Dos casos, decididos midiendo la imagen y no a ojo:
 *
 *   - Si ya trae transparencia real, se conserva su alfa y se pinta de blanco.
 *   - Si es un rectángulo opaco, el fondo es blanco y la tinta oscura, así que
 *     la opacidad de cada píxel sale de lo oscuro que sea. El fondo se va solo.
 *
 * Uso (una vez, o cuando cambie un logo):
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/logos-mono.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'public', 'logos');
const DESTINO = join(ORIGEN, 'mono');

/**
 * Se prefiere el SVG cuando existe: escala sin romperse.
 *
 * CiMUS no está, y es a propósito: su «M» es un bloque de color con la letra
 * calada en blanco, así que al pintar la marca de blanco el hueco se cierra y
 * queda un cuadrado. Las entradas del CiMUS usan el logo de la USC, que es la
 * universidad a la que pertenece el centro.
 */
const MARCAS = ['esa', 'isu', 'ki', 'kth', 'scilifelab', 'ucl', 'usc'];

mkdirSync(DESTINO, { recursive: true });

const browser = await chromium.launch({ args: ['--disable-gpu'] });
const page = await browser.newPage();

for (const marca of MARCAS) {
    const svg = join(ORIGEN, `${marca}.svg`);
    const png = join(ORIGEN, `${marca}.png`);
    const fuente = existsSync(svg) ? svg : png;
    if (!existsSync(fuente)) {
        console.error(`  falta  ${marca}`);
        continue;
    }
    const tipo = fuente.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    const b64 = readFileSync(fuente).toString('base64');

    const salida = await page.evaluate(async ({ b64, tipo }) => {
        const img = new Image();
        img.src = `data:${tipo};base64,${b64}`;
        await img.decode();

        // Lienzo generoso: un SVG pequeño escalado luego se vería sucio.
        const lado = 512;
        const escala = Math.min(lado / img.width, lado / img.height);
        const w = Math.round(img.width * escala);
        const h = Math.round(img.height * escala);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);

        const d = ctx.getImageData(0, 0, w, h);
        const p = d.data;

        // ¿Trae transparencia de verdad, o es un rectángulo opaco?
        let translucidos = 0;
        for (let i = 3; i < p.length; i += 4) if (p[i] < 250) translucidos++;
        const yaRecortado = translucidos > (p.length / 4) * 0.08;

        for (let i = 0; i < p.length; i += 4) {
            if (yaRecortado) {
                // Se respeta su alfa y la tinta pasa a blanca.
                p[i] = p[i + 1] = p[i + 2] = 255;
            } else {
                // Fondo blanco: cuanto más oscuro el píxel, más opaco queda.
                const lum = (p[i] * 0.2126 + p[i + 1] * 0.7152 + p[i + 2] * 0.0722) / 255;
                p[i] = p[i + 1] = p[i + 2] = 255;
                p[i + 3] = Math.round((1 - lum) * 255);
            }
        }
        ctx.putImageData(d, 0, 0);
        return {
            yaRecortado,
            medida: `${w}x${h}`,
            png: c.toDataURL('image/png').split(',')[1],
        };
    }, { b64, tipo });

    writeFileSync(join(DESTINO, `${marca}.png`), Buffer.from(salida.png, 'base64'));
    const via = salida.yaRecortado ? 'ya recortado' : 'fondo blanco retirado';
    console.log(`  ok  ${marca}  ${salida.medida}  (${via})`);
}

await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 4000))]);
console.log(`\nMarcas en public/logos/mono`);
process.exit(0);
