'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * About is the room.
 *
 * There used to be a long trilingual essay here with a photo console beside it.
 * The room says the same things and lets you walk through them instead: the
 * monitor holds the projects, the hatch opens onto Galicia from orbit, the wall
 * panel answers, the dog directed a short film. So the page hands the whole
 * viewport to it and keeps only the top bar.
 *
 * The room is framed rather than ported. It is its own application — a WebGL
 * scene, a Windows XP desktop, a scroll driven film — deployed separately, and
 * an iframe keeps one source of truth while isolating its scroll, its keyboard
 * handling and its own fullscreen gate from Next.
 */

// embed=1 tells the room it is inside someone else's frame: it drops the
// ultra-wide letterboxing it uses when it owns the screen, fills the width and
// crops the height instead, so there are no bars down the sides here.
// Straight at the document, not at the site root: the root is a meta refresh
// redirect that drops the query string, so ?embed=1 never arrived. This also
// saves the extra hop.
const ROOM_URL =
    'https://mcebralloportfolio.vercel.app/Habitaci%C3%B3n%20Interactiva.dc.html?embed=1';

// The room speaks the site's language. Switching the toggle changes the iframe
// src, which reloads the room in the new language: inside one room life the
// language is a constant, so a reload is the honest way to change it.
const roomSrc = (language: string) =>
    `${ROOM_URL}&lang=${language === 'es' || language === 'gl' ? language : 'en'}`;

const LOADING: Record<string, string> = {
    en: 'Setting up the room',
    es: 'Preparando la habitación',
    gl: 'Preparando o cuarto',
};

const TITLE: Record<string, string> = {
    en: 'Michael Cebral, the interactive room',
    es: 'Michael Cebral, la habitación interactiva',
    gl: 'Michael Cebral, o cuarto interactivo',
};

export default function AboutPage() {
    const { language } = useLanguage();
    const [ready, setReady] = useState(false);
    const [top, setTop] = useState<number | null>(null);
    // The room greets each browser once and remembers it. ?intro=1 on THIS
    // page brings the greeter back out (for demos), by riding along into the
    // iframe. Read after mount so the server render stays deterministic.
    const [forceIntro, setForceIntro] = useState(false);
    const frameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        try {
            setForceIntro(new URLSearchParams(window.location.search).has('intro'));
        } catch {}
    }, []);

    // The bar is measured, never guessed. It changes height at the md breakpoint
    // and the site runs at html { zoom: 0.8 } on a desktop, so any number written
    // here by hand leaves a black seam under it at some size. offsetHeight is read
    // in layout pixels, the same space the `top` below is expressed in, which is
    // what makes this correct under that zoom.
    useEffect(() => {
        const header = document.querySelector('header');
        if (!header) return;
        const measure = () => setTop((header as HTMLElement).offsetHeight);
        measure();
        // border-box: the bar animates its padding on mount, and padding does
        // not touch the content box, so the default observation never fires and
        // the measurement freezes mid-animation. The timers catch the settled
        // value even where border-box observation is not supported.
        const ro = new ResizeObserver(measure);
        try {
            ro.observe(header, { box: 'border-box' });
        } catch {
            ro.observe(header);
        }
        window.addEventListener('resize', measure);
        // and a slow heartbeat: every observed race so far (padding animation,
        // border-box quirks, ultra wide zoom factors) converges within one tick
        const iv = setInterval(measure, 500);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
            clearInterval(iv);
        };
    }, []);

    // The room owns the viewport, so the page behind it must not scroll: on a
    // phone a stray page scroll would fight the film inside the frame.
    useEffect(() => {
        const html = document.documentElement;
        const prevHtml = html.style.overflow;
        const prevBody = document.body.style.overflow;
        html.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            html.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, []);

    return (
        // Pinned to the measured bottom of the bar. Until the measurement lands it
        // sits at the top: the room slides up under the bar for one frame, which is
        // invisible, where a wrong guess would leave a black strip on show.
        <div
            className="fixed inset-x-0 bottom-0 bg-[#04050c]"
            style={{ top: top ?? 0 }}
        >
            {!ready && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <p className="text-white/40 text-[11px] uppercase tracking-[0.3em] animate-pulse">
                        {LOADING[language] ?? LOADING.en}
                    </p>
                </div>
            )}
            <iframe
                ref={frameRef}
                src={roomSrc(language) + (forceIntro ? '&intro=1' : '')}
                title={TITLE[language] ?? TITLE.en}
                onLoad={() => setReady(true)}
                className="absolute inset-0 w-full h-full border-0"
                allow="fullscreen; autoplay; clipboard-write; accelerometer; gyroscope"
            />
        </div>
    );
}
