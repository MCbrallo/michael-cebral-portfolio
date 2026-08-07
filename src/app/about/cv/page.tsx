'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DisplayTitle } from '@/components/DisplayTitle';
import { entradas, competencias, type Tipo } from '@/data/cv';

type Filtro = Tipo | 'all';

export default function CVPage() {
    const { t, language } = useLanguage();
    const [filtro, setFiltro] = useState<Filtro>('all');

    const lista = useMemo(
        () =>
            [...entradas]
                .sort((a, b) => b.orden - a.orden)
                .filter((e) => filtro === 'all' || e.tipo === filtro),
        [filtro]
    );

    const filtros: { valor: Filtro; texto: string }[] = [
        { valor: 'all', texto: t.cv.filterAll },
        { valor: 'career', texto: t.cv.filterCareer },
        { valor: 'education', texto: t.cv.filterEducation },
    ];

    return (
        <div className="min-h-screen text-white relative">
            <div className="w-full max-w-[1180px] mx-auto px-6 md:px-14 pt-28 pb-20 relative z-[2]">

                {/* Header, in the same register as Projects */}
                <header className="mb-14">
                    <p className="font-sans text-[11px] tracking-[0.34em] uppercase text-white/40 mb-3">
                        {t.cv.eyebrow}
                    </p>
                    {/* Same component every other page title uses, so the CV
                        reads as one more tab and not as its own thing. */}
                    <DisplayTitle text={t.cv.title} />
                    <p className="cv-resumen mt-5 text-white/60 text-[15px] md:text-base font-light leading-relaxed">
                        {t.cv.summary}
                    </p>

                    <div className="cv-barra">
                        <div className="cv-filtros">
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

                        <a
                            href="/Michael_Cebral_CV.pdf"
                            download
                            className="proj-link"
                        >
                            {t.cv.download} ↓
                        </a>
                    </div>
                </header>

                {/* The record */}
                <div className="cv-lista">
                    {lista.map((e) => (
                        <article
                            key={e.id}
                            className="cv-fila"
                            style={{ '--accent': e.acento } as CSSProperties}
                        >
                            <div className="cv-cuando">
                                <time className="cv-fechas">{e.fechas[language]}</time>
                                <span className="cv-tipo">
                                    {e.tipo === 'education' ? t.cv.labelEducation : t.cv.labelCareer}
                                </span>
                            </div>

                            <div className="cv-tarjeta">
                                {e.logo && (
                                    <span className="cv-logo">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={e.logo} alt={e.organizacion} loading="lazy" />
                                    </span>
                                )}

                                <div className="cv-cuerpo">
                                    <h2 className="cv-papel font-serif">{e.titulo[language]}</h2>
                                    <p className="cv-org">
                                        {e.organizacion} · {e.lugar}
                                    </p>

                                    {e.prueba && <p className="cv-prueba">{e.prueba[language]}</p>}

                                    <ul className="cv-puntos">
                                        {e.cuerpo[language].map((linea, i) => (
                                            <li key={i}>{linea}</li>
                                        ))}
                                    </ul>

                                    <div className="cv-etiquetas">
                                        {e.etiquetas[language].map((tag) => (
                                            <span key={tag} className="proj-status">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Competencies */}
                <section className="mt-28 md:mt-36">
                    <h2 className="cv-seccion font-serif">{t.cv.skillsTitle}</h2>
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
