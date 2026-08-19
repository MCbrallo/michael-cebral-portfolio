'use client';

import { useEffect, useState } from 'react';

/**
 * The calibration bench, second edition. The first one lied: its sample used a
 * fixed type size while the real hero switches sizes at responsive
 * breakpoints, so what looked right here could render differently out there.
 * The sample now wears the hero's exact classes. And the loop is closed for
 * good: the choice is SAVED into this browser, and the global zoom script
 * obeys it, so every machine can carry its own taste without redeploys.
 */
export default function Medida() {
    const [m, setM] = useState(0.8);
    const [info, setInfo] = useState({ w: 0, h: 0, dpr: 1 });
    const [saved, setSaved] = useState<number | null>(null);

    useEffect(() => {
        try {
            const st = +(localStorage.getItem('mc_zoom_D') || 0);
            if (st) { setSaved(st); }
        } catch {}
        const el = document.documentElement;
        const apply = () => {
            if (el.style.zoom !== '1') el.style.zoom = '1';
            if (el.style.getPropertyValue('--pantalla') !== '100vh') el.style.setProperty('--pantalla', '100vh');
            setInfo((prev) => {
                const next = { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio };
                return (prev.w === next.w && prev.h === next.h && prev.dpr === next.dpr) ? prev : next;
            });
        };
        apply();
        const iv = setInterval(apply, 400);
        window.addEventListener('resize', apply);
        return () => { clearInterval(iv); window.removeEventListener('resize', apply); };
    }, []);

    const D = info.w ? Math.round(info.w / m) : 0;

    const guardar = () => {
        // read the live values at click time; render-time closures can lag a tick
        setM((cur) => {
            try {
                const d = Math.round(window.innerWidth / cur);
                if (d > 400 && d < 6000) { localStorage.setItem('mc_zoom_D', String(d)); setSaved(d); }
            } catch {}
            return cur;
        });
    };
    const restaurar = () => {
        try { localStorage.removeItem('mc_zoom_D'); setSaved(null); } catch {}
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-10 pt-28 pb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2">Banco de calibrado</p>
            <h2 className="text-2xl font-serif mb-6">Ajusta hasta que la muestra tenga el tamaño que quieres y guarda</h2>

            <div className="flex flex-wrap items-center gap-4 mb-10">
                <button onClick={() => setM((v) => Math.max(0.3, +(v - 0.025).toFixed(3)))}
                    className="w-16 h-16 text-3xl border border-white/30 rounded-md hover:bg-white/10">−</button>
                <button onClick={() => setM((v) => Math.min(2.5, +(v + 0.025).toFixed(3)))}
                    className="w-16 h-16 text-3xl border border-white/30 rounded-md hover:bg-white/10">+</button>
                <button onClick={guardar}
                    className="h-16 px-6 text-sm tracking-[0.2em] uppercase border border-[#D4AF37]/60 text-[#D4AF37] rounded-md hover:bg-[#D4AF37]/10">
                    Guardar en este navegador
                </button>
                <button onClick={restaurar}
                    className="h-16 px-5 text-sm tracking-[0.15em] uppercase border border-white/20 text-white/50 rounded-md hover:bg-white/10">
                    Restaurar por defecto
                </button>
                <div className="ml-2 font-mono text-sm text-white/70 leading-6">
                    ventana: {info.w} × {info.h} px · dpr: {info.dpr}
                    <br />
                    escala: {m.toFixed(3)} · D actual: {D}{saved ? ` · guardado: ${saved}` : ' · sin calibrado guardado'}
                </div>
            </div>

            {/* La muestra viste EXACTAMENTE las clases del hero real, saltos
                responsivos incluidos, para que lo que apruebes aqui sea lo que
                salga alli. */}
            <div className="border border-white/15 rounded-lg p-8 overflow-hidden mb-10" style={{ zoom: m }}>
                <div className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-normal leading-none">Michael</div>
                <div className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-normal leading-none">Cebral</div>
                <div className="mt-6 text-xs md:text-sm tracking-[0.38em] uppercase text-white/85">Science Communication</div>
                <p className="mt-6 max-w-md font-bodoni italic text-white/70">
                    &quot;Science is a way of thinking much more than it is a body of knowledge.&quot;
                </p>
            </div>

            <p className="text-white/50 text-sm max-w-xl">
                Al pulsar guardar, esta pantalla queda calibrada a tu gusto y el resto de la web lo
                obedece al instante en este navegador. Repite la operación en cada ordenador o
                monitor donde la quieras clavada. Los visitantes ven el ajuste por defecto.
            </p>
        </div>
    );
}
