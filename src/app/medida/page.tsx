'use client';

import { useEffect, useState } from 'react';

/**
 * The calibration bench. Guessing the owner's display has failed four times;
 * this page turns his eye into the instrument: it neutralises the global zoom,
 * shows a live sample of the hero at an adjustable scale, and prints the one
 * number (D) that the site's zoom script needs. He nudges until it looks
 * right, reads D aloud, done.
 */
export default function Medida() {
    const [m, setM] = useState(0.8);
    const [info, setInfo] = useState({ w: 0, h: 0, dpr: 1 });

    useEffect(() => {
        const el = document.documentElement;
        const apply = () => {
            el.style.zoom = '1';
            el.style.setProperty('--pantalla', '100vh');
            setInfo({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio });
        };
        apply();
        // the global pre-paint script re-fires on resize; keep neutralising
        const iv = setInterval(apply, 400);
        window.addEventListener('resize', apply);
        return () => { clearInterval(iv); window.removeEventListener('resize', apply); };
    }, []);

    const D = info.w ? Math.round(info.w / m) : 0;

    return (
        <div className="min-h-screen bg-[#050505] text-white px-10 pt-28 pb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2">Banco de calibrado</p>
            <h2 className="text-2xl font-serif mb-6">Ajusta hasta que la muestra tenga el tamaño que te gusta</h2>

            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => setM((v) => Math.max(0.3, +(v - 0.025).toFixed(3)))}
                    className="w-16 h-16 text-3xl border border-white/30 rounded-md hover:bg-white/10">−</button>
                <button onClick={() => setM((v) => Math.min(2, +(v + 0.025).toFixed(3)))}
                    className="w-16 h-16 text-3xl border border-white/30 rounded-md hover:bg-white/10">+</button>
                <div className="ml-6 font-mono text-sm text-white/70 leading-6">
                    ventana: {info.w} × {info.h} px · dpr: {info.dpr}
                    <br />
                    escala de muestra: {m.toFixed(3)}
                </div>
            </div>

            <div className="border border-white/15 rounded-lg p-8 overflow-hidden mb-10" style={{ zoom: m }}>
                <div className="text-9xl font-serif font-medium leading-none">Michael</div>
                <div className="text-9xl font-serif font-medium leading-none">Cebral</div>
                <div className="mt-6 text-sm tracking-[0.38em] uppercase text-white/85">Science Communication</div>
                <p className="mt-6 max-w-md font-serif italic text-white/70">
                    &quot;Science is a way of thinking much more than it is a body of knowledge.&quot;
                </p>
            </div>

            <div className="font-mono text-lg">
                Dile a Claude: <span className="text-3xl text-[#D4AF37] font-bold">D = {D}</span>
            </div>
            <p className="mt-3 text-white/50 text-sm max-w-xl">
                Cuando la muestra de arriba se vea exactamente del tamaño que quieres para la portada,
                pásale ese número tal cual. Con eso el sitio se verá así en esta pantalla y con la misma
                composición en todas las demás.
            </p>
        </div>
    );
}
