'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DisplayTitle } from '@/components/DisplayTitle';
import { entradas, competencias, type Entrada, type Tipo } from '@/data/cv';

type Filtro = Tipo | 'all';

/**
 * The record, set like the CV pages of an annual report: no cards, no pills.
 * Entries hang under their year, which stays in view while its entries pass.
 * Each institution brings its colour as a short stroke over its entry, as the
 * tint of its name and of its evidence line, and nothing else.
 */
export default function CVPage() {
    const { t, language } = useLanguage();
    const [filtro, setFiltro] = useState<Filtro>('all');

    // Newest first, grouped by the year each entry started.
    const grupos = useMemo(() => {
        const lista = [...entradas]
            .sort((a, b) => b.orden - a.orden)
            .filter((e) => filtro === 'all' || e.tipo === filtro);
        const g: { ano: number; items: Entrada[] }[] = [];
        for (const e of lista) {
            const ano = Math.floor(e.orden / 100);
            const ultimo = g[g.length - 1];
            if (ultimo && ultimo.ano === ano) ultimo.items.push(e);
            else g.push({ ano, items: [e] });
        }
        return g;
    }, [filtro]);

    const filtros: { valor: Filtro; texto: string }[] = [
        { valor: 'all', texto: t.cv.filterAll },
        { valor: 'career', texto: t.cv.filterCareer },
        { valor: 'education', texto: t.cv.filterEducation },
    ];

    return (
        <div className="min-h-[var(--pantalla)] text-white relative">
            <div className="w-full max-w-[1180px] mx-auto px-6 md:px-14 pt-28 pb-24 relative z-[2]">

                {/* Header, in the same register as Projects */}
                <header className="mb-12 md:mb-16">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-3">
                        {t.cv.eyebrow}
                    </p>
                    {/* Same component every other page title uses, so the CV
                        reads as one more tab and not as its own thing. */}
                    <DisplayTitle text={t.cv.title} />

                    <div className="cv-barra">
                        <div className="cv-filtros" role="group">
                            {filtros.map((f) => (
                                <button
                                    key={f.valor}
                                    type="button"
                                    onClick={() => setFiltro(f.valor)}
                                    className={`cv-filtro${filtro === f.valor ? ' is-on' : ''}`}
                                    aria-pressed={filtro === f.valor}
                                >
                                    {f.texto}
                                </button>
                            ))}
                        </div>

                        <a href="/Michael_Cebral_CV.pdf" download className="cv-descarga">
                            {t.cv.download}
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </header>

                {/* The record */}
                <div className="cv-registro">
                    {grupos.map((g) => (
                        <section key={g.ano} className="cv-grupo">
                            <p className="cv-ano" aria-hidden="true">{g.ano}</p>
                            <div className="cv-entradas">
                                {g.items.map((e) => (
                                    <article
                                        key={e.id}
                                        className="cv-entrada"
                                        style={{ '--accent': e.acento } as CSSProperties}
                                    >
                                        <div className="cv-cabeza">
                                            <div className="cv-titular">
                                                <p className="cv-meta">
                                                    <time>{e.fechas[language]}</time>
                                                    <span>{e.tipo === 'education' ? t.cv.labelEducation : t.cv.labelCareer}</span>
                                                </p>
                                                <h2 className="cv-papel">{e.titulo[language]}</h2>
                                                <p className="cv-org">
                                                    <span className="cv-org-nombre">{e.organizacion}</span>
                                                    <span className="cv-lugar">{e.lugar}</span>
                                                </p>
                                            </div>
                                            {e.logo && (
                                                <span className="cv-logo">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={e.logo} alt={e.organizacion} loading="lazy" />
                                                </span>
                                            )}
                                        </div>

                                        {e.prueba && <p className="cv-prueba">{e.prueba[language]}</p>}

                                        <ul className="cv-puntos">
                                            {e.cuerpo[language].map((linea, i) => (
                                                <li key={i}>{linea}</li>
                                            ))}
                                        </ul>

                                        {e.etiquetas[language].length > 0 && (
                                            <p className="cv-temas">{e.etiquetas[language].join(' · ')}</p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Competencies */}
                <section className="cv-saber">
                    <h2 className="cv-seccion">{t.cv.skillsTitle}</h2>
                    <div className="cv-competencias">
                        {competencias.map((c) => (
                            <div key={c.titulo.en} className="cv-competencia">
                                <h3 className="cv-competencia-titulo">{c.titulo[language]}</h3>
                                <ul>
                                    {c.puntos.map((p) => (
                                        <li key={p.en}>{p[language]}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
