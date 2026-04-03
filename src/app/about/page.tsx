'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { StarField } from '@/components/StarField';

/* ══════════════════════════════════════════════════════════════
   HOOKS
   ══════════════════════════════════════════════════════════════ */
function useProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const fn = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            setP(h > 0 ? window.scrollY / h : 0);
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    return p;
}




/* ══════════════════════════════════════════════════════════════
   CSS
   ══════════════════════════════════════════════════════════════ */
const designCSS = `
/* Signal pulse */
@keyframes pulse-dot {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.8); }
}

/* Title shimmer */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.title-shimmer:hover {
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, rgba(200,220,255,1) 50%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.9) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* Cursor blink */
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
.cursor-blink::after {
  content: '\u2588';
  font-size: 0.8em;
  margin-left: 4px;
  animation: cursor-blink 1s step-end infinite;
  color: rgba(255,255,255,0.25);
}

/* Tag hairline */
.tag-line { position: relative; }
.tag-line::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  width: min(20vw, 200px);
  height: 1px;
  margin-left: 12px;
  background: linear-gradient(to right, rgba(255,255,255,0.06), rgba(255,255,255,0));
}

/* Pull highlight */
.pull-highlight { position: relative; }
.pull-highlight::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
  border-radius: 1px;
}

/* Monitor scanline */
@keyframes monitor-scan {
  0%   { top: -2px; }
  100% { top: 100%; }
}
.monitor-scanline {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent 5%, rgba(255,255,255,0.04) 50%, transparent 95%);
  animation: monitor-scan 8s linear infinite;
  pointer-events: none;
  z-index: 5;
}

/* Photo crossfade */
.photo-slot {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.photo-slot.active {
  opacity: 1;
}

/* Music equalizer */
@keyframes eq-bar-1 { 0%, 100% { height: 30%; } 50% { height: 80%; } }
@keyframes eq-bar-2 { 0%, 100% { height: 60%; } 50% { height: 20%; } }
@keyframes eq-bar-3 { 0%, 100% { height: 45%; } 50% { height: 90%; } }
.eq-bar {
  display: inline-block; width: 2px; border-radius: 1px;
  background: rgba(74, 222, 128, 0.7); vertical-align: bottom;
}
.eq-bar:nth-child(1) { animation: eq-bar-1 0.8s ease-in-out infinite; }
.eq-bar:nth-child(2) { animation: eq-bar-2 0.6s ease-in-out infinite 0.1s; }
.eq-bar:nth-child(3) { animation: eq-bar-3 0.7s ease-in-out infinite 0.2s; }

@keyframes music-glow {
  0%, 100% { box-shadow: 0 0 8px 0 rgba(74, 222, 128, 0.1); }
  50%      { box-shadow: 0 0 18px 2px rgba(74, 222, 128, 0.2); }
}
.music-playing { animation: music-glow 2s ease-in-out infinite; }

/* Photo load animation */
@keyframes photo-acquire {
  0% { filter: brightness(2) contrast(0.3); transform: scale(1.02); }
  40% { filter: brightness(1.3) contrast(0.7); }
  100% { filter: brightness(1) contrast(1); transform: scale(1); }
}
.photo-slot.active img {
  animation: photo-acquire 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Text reveal — smooth transition instead of keyframe animation */
.text-block {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(2px);
  transition: opacity 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.8s ease-out;
  will-change: opacity, transform;
}
.text-block.visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* Photo link click feedback */
.photo-link {
  transition: all 0.25s ease;
}
.photo-link:active {
  color: rgba(255,255,255,1);
  text-shadow: 0 0 8px rgba(255,255,255,0.3);
}
`;

/* ══════════════════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════════════════ */

/* ── Bold keyword (replaces golden glow) ─────────────── */
function B({ children }: { children: React.ReactNode }) {
    return <strong className="text-white/90 font-medium">{children}</strong>;
}

/* ── Reveal-on-scroll wrapper ───────────────────────────── */
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className={`text-block ${visible ? 'visible' : ''} ${className}`}>
            {children}
        </div>
    );
}

/* ── Tag with hairline ──────────────────────────────────── */
function Tag({ text }: { text: string }) {
    return (
        <Reveal>
            <div className="flex items-center gap-3 my-10 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-white/25 shrink-0"
                    style={{ animation: 'pulse-dot 3s ease-in-out infinite' }} />
                <span className="tag-line font-mono text-[11px] md:text-[12px] tracking-[0.18em] text-white/25 uppercase whitespace-nowrap">
                    {text}
                </span>
            </div>
        </Reveal>
    );
}

/* ── Photo data ─────────────────────────────────────────── */
const photos: { src: string; alt: string; label: string }[] = [
    { src: '/about/childhood.jpeg', alt: 'Childhood in Lugo', label: 'fig 01 // childhood · lugo' },
    { src: '/about/childhood-glasses.jpg', alt: 'Childhood with glasses', label: 'fig 02 // childhood · glasses' },
    { src: '/about/lugo-sign.jpeg', alt: 'Lugo', label: 'fig 03 // lugo' },
    { src: '/about/galicia-flag.jpg', alt: 'Galician flag', label: 'fig 04 // galicia · flag' },
    { src: '/about/parents-karolinska.jpeg', alt: 'With my parents', label: 'fig 05 // family' },
    { src: '/about/home-dog.jpeg', alt: 'Home', label: 'fig 06 // home' },
    { src: '/about/mountains-hiking.jpg', alt: 'Hiking in the mountains', label: 'fig 07 // mountains · hiking' },
    { src: '/about/skeleton-selfie.jpeg', alt: 'Science encounters', label: 'fig 08 // science' },
    { src: '/about/lab-work.jpeg', alt: 'Research', label: 'fig 09 // lab · research' },
    { src: '/about/la-caixa.jpeg', alt: 'Fundación La Caixa', label: 'fig 10 // la caixa · scholarship' },
    { src: '/about/snowmobile.jpeg', alt: 'Swedish Lapland', label: 'fig 11 // lapland · sweden' },
    { src: '/about/norway-ice.jpeg', alt: 'Scandinavian winter', label: 'fig 12 // scandinavia' },
    { src: '/about/sweden-highland-cow.jpeg', alt: 'Swedish countryside', label: 'fig 13 // countryside' },
    { src: '/about/city-sunset.jpg', alt: 'Sunset over the city', label: 'fig 14 // travel · sunset' },
    { src: '/about/iss-module.jpeg', alt: 'ISS module', label: 'fig 15 // iss · columbus module' },
    { src: '/about/esa-simulation.jpeg', alt: 'ESA simulation', label: 'fig 16 // esa · simulation' },
    { src: '/about/strasbourg-selfie.jpg', alt: 'Belgium', label: 'fig 17 // belgium · travel' },
    { src: '/about/desert.jpeg', alt: 'Sahara', label: 'fig 18 // sahara · travel' },
    { src: '/about/bjj-competition.jpeg', alt: 'BJJ', label: 'fig 19 // bjj · competition' },
    { src: '/about/discus-throw.jpeg', alt: 'Athletics', label: 'fig 20 // discus · athletics' },
];

/* ── Command Monitor + Integrated Player (FIXED right panel) ── */
function MonitorWithPlayer({
    activeIndex, onPrev, onNext,
    songs, current, playing, progress: musicProgress,
    onTogglePlay, onPrevSong, onNextSong,
}: {
    activeIndex: number; onPrev: () => void; onNext: () => void;
    songs: { title: string; artist: string; file: string }[];
    current: number; playing: boolean; progress: number;
    onTogglePlay: () => void; onPrevSong: () => void; onNextSong: () => void;
}) {
    return (
        <div className="fixed z-50 flex flex-col gap-0 shadow-2xl md:shadow-none
            bottom-4 left-4 right-4 w-[calc(100%-2rem)] max-w-none
            md:bottom-auto md:top-[55%] md:right-[10vw] md:left-auto md:-translate-y-1/2 md:w-[45vw]">
            {/* Photo monitor */}
            <div className="relative w-full rounded-t-sm overflow-hidden border border-white/[0.06] border-b-0 bg-[#080808] h-[26vh] min-h-[180px] md:h-[65vh] md:max-h-[85vh]">
                {/* Monitor header */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#080808] to-transparent">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/15 uppercase">
                        {activeIndex >= 0 && activeIndex < photos.length
                            ? photos[activeIndex].label
                            : 'awaiting signal…'
                        }
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-white/10">
                        {activeIndex >= 0 ? `${activeIndex + 1}/${photos.length}` : '—'}
                    </span>
                </div>

                <div className="monitor-scanline" />

                {photos.map((photo, i) => (
                    <div key={i} className={`photo-slot ${i === activeIndex ? 'active' : ''}`}>
                        <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="45vw" quality={85} priority={i < 3} />
                    </div>
                ))}

                {activeIndex < 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-mono text-[11px] text-white/10 tracking-wider">use arrows to browse ↔</p>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080808] to-transparent z-10" />

                {/* Photo arrows */}
                <button onClick={onPrev} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/[0.08] text-white/30 hover:text-white/80 hover:bg-black/60 hover:border-white/20 transition-all backdrop-blur-sm" aria-label="Previous photo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 md:w-5 md:h-5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button onClick={onNext} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/[0.08] text-white/30 hover:text-white/80 hover:bg-black/60 hover:border-white/20 transition-all backdrop-blur-sm" aria-label="Next photo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 md:w-5 md:h-5"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>

            {/* Integrated music player — same width, below monitor */}
            <div className="relative w-full rounded-b-sm border border-white/[0.06] border-t-white/[0.03] bg-[#080808] px-4 py-3 md:px-6 md:py-4">
                {/* Progress bar top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04] overflow-hidden">
                    <div className="h-full bg-white/20 transition-[width] duration-200" style={{ width: `${musicProgress * 100}%` }} />
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    <button onClick={onPrevSong} className="text-white/25 hover:text-white/70 transition-colors p-0.5 shrink-0 hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                    </button>
                    <button onClick={onTogglePlay} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/15 flex items-center justify-center transition-all shrink-0 border border-white/[0.06]">
                        {playing ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
                                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/80 ml-0.5">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </button>
                    <button onClick={onNextSong} className="text-white/25 hover:text-white/70 transition-colors p-0.5 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>
                    <div className="min-w-0 ml-1 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-white/60 text-[12px] md:text-[14px] font-light truncate">{songs[current].title}</p>
                            <span className="text-white/15 text-[10px] md:text-[12px] shrink-0">·</span>
                            <p className="text-white/20 text-[10px] md:text-[12px] shrink-0 truncate">{songs[current].artist}</p>
                            {playing && (
                                <span className="inline-flex items-end gap-[2px] h-3 shrink-0 ml-1">
                                    <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                                </span>
                            )}
                        </div>
                        <p className="text-white/10 text-[9px] font-mono tracking-wider mt-0.5">Songs that have stayed with me.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
    const progress = useProgress();
    const [activePhoto, setActivePhoto] = useState(0);
    const { songs, currentSong, isPlaying, musicProgress, togglePlay, prevSong, nextSong } = useMusicPlayer();
    const { language } = useLanguage();

    const goTo = useCallback((i: number) => setActivePhoto(i), []);
    const goPrev = useCallback(() => setActivePhoto(p => (p <= 0 ? photos.length - 1 : p - 1)), []);
    const goNext = useCallback(() => setActivePhoto(p => (p >= photos.length - 1 ? 0 : p + 1)), []);

    /* PhotoLink: clickable word that jumps to a specific photo */
    const PL = useCallback(({ to, children }: { to: number; children: React.ReactNode }) => (
        <button
            onClick={() => goTo(to)}
            className="photo-link text-white/80 hover:text-white underline decoration-white/20 hover:decoration-white/60 underline-offset-4 transition-all cursor-pointer font-medium"
        >
            {children}
        </button>
    ), [goTo]);

    /* paragraph style — bigger text */
    const pClass = "text-white/50 leading-[2] font-light text-[18px] md:text-[20px] lg:text-[21px] mb-10 max-w-[540px] [text-wrap:pretty]";

    /* ── Translated content ── */
    const content = {
        en: {
            signalOrigin: 'Signal · Origin',
            title: 'Who am I?',
            cvLabel: 'The formal version',
            cvLink: 'View My CV',
        },
        es: {
            signalOrigin: 'Señal · Origen',
            title: '¿Quién soy?',
            cvLabel: 'La versión formal',
            cvLink: 'Ver mi CV',
        },
        gl: {
            signalOrigin: 'Sinal · Orixe',
            title: 'Quen son eu?',
            cvLabel: 'A versión formal',
            cvLink: 'Ver o meu CV',
        },
    }[language];

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: designCSS }} />
            <div className="bg-[#050505] text-white relative min-h-screen">

                <StarField />

                {/* Progress bar */}
                <div className="fixed top-0 left-0 right-0 h-[1px] z-[60] pointer-events-none">
                    <div className="h-full bg-white/25" style={{ width: `${progress * 100}%`, transition: 'width 0.08s linear' }} />
                </div>

                {/* Bottom text blur mask */}
                <div className="fixed bottom-0 left-0 right-0 h-32 z-[45] pointer-events-none" style={{ background: 'linear-gradient(to top, #050505 0%, #05050580 40%, transparent 100%)' }} />

                {/* ═══════ FIXED MONITOR + PLAYER ═══════ */}
                <MonitorWithPlayer
                    activeIndex={activePhoto} onPrev={goPrev} onNext={goNext}
                    songs={songs} current={currentSong} playing={isPlaying} progress={musicProgress}
                    onTogglePlay={togglePlay} onPrevSong={prevSong} onNextSong={nextSong}
                />

                {/* ═══════ TEXT CONTENT ═══════ */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">

                    {/* Back */}
                    <div className="pt-8 md:pt-10">
                        <Link href="/" className="inline-flex items-center text-white/30 hover:text-white/80 transition-all group uppercase tracking-[0.15em] text-[12px] md:text-[13px] py-2 hover:tracking-[0.2em]">
                            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1.5 transition-transform" />
                            Home
                        </Link>
                    </div>

                    {/* Hero */}
                    <header className="pt-16 md:pt-24 pb-10 max-w-[560px]">
                        <p className="font-mono text-[12px] md:text-[13px] tracking-[0.3em] text-white/20 mb-5 uppercase cursor-blink">
                            {content.signalOrigin}
                        </p>
                        <h1 className="title-shimmer font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white/90 cursor-default">
                            {content.title}
                        </h1>
                    </header>

                    {/* ── Narrative (single column, text on left, monitor floats right) ── */}
                    <div className="md:mr-auto md:w-[45%] lg:w-[42%] pb-[45vh] md:pb-32">

                        {language === 'en' && (<>
                        <Reveal><p className={pClass}>
                            Hi. My name is <B>Michael</B> and the first thing I want you to know about myself is
                            that I am from <PL to={2}>Lugo</PL>, in <PL to={3}>Galicia</PL>, in the northwest of Spain. That is where my
                            story starts, and in many ways, it still explains a lot about me.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            I grew up playing football and hide and seek in the street, spending long hours
                            outside, making up games, coming home tired, and living in that last generation
                            that still had an <PL to={0}>outside childhood</PL> before the phone took over everything. I
                            honestly think I got lucky with that. Life felt more physical, more direct, and
                            probably a bit less stupid.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={2}>Lugo</PL> gave me that. <PL to={3}>Galicia</PL> too. A place full of rain,
                            character, humour, stubbornness, and people who do not usually need to say much
                            to mean a lot.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            And talking about people, my <PL to={4}>parents</PL> are a huge part of this story. They gave me the kind of support that
                            does not usually make headlines, but quietly changes everything. Trust, effort,
                            sacrifice, stability, humour, and the feeling that even if I kept pushing further
                            away geographically, I was never really leaving <PL to={5}>home</PL> behind.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            My academic path started in <PL to={7}>science</PL>, through <B>biotech and biomedicine</B>, but what
                            really shaped me was the variety of places and people that came with it. In <B>London</B>,
                            I worked in pancreatic cancer research. In <B>Santiago de Compostela</B>, I spent time
                            around prion biology and rheumatoid arthritis. Each <PL to={8}>lab</PL> felt like a small country
                            with its own rules and rituals.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Later in Sweden, my world opened even more. I moved there to complete my
                            Master&apos;s in Biomedicine at <B>Karolinska Institutet</B>, supported by a scholarship from
                            la <PL to={9}>Fundación La Caixa</PL>. Coming from Lugo and landing in <B>Stockholm</B> was a real shift.
                            Different rhythm, different weather, different culture, different everything.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            I worked around recombinant <B>spider silk</B> production and later on projects involving
                            bone and muscle from <B>spaceflight mice</B>, which brought together biology, health, and
                            space in a way that felt almost suspiciously tailored to my interests. Science gave
                            me discipline. My background gave me the stubbornness to keep going when the
                            experiments did not.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={11}>Sweden</PL> sharpened me. It challenged me, gave me independence, and made me grow up quickly.
                            I found beauty in the <PL to={10}>frozen landscapes</PL>, the silence, and the long winters that
                            taught you to sit still with your own thoughts.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Over time, my interests kept pulling me toward <B>space</B>. Not just because space is
                            impressive, which it obviously is, but because it sits at the intersection of so many
                            things I care about like science, health, exploration, human limits, international
                            collaboration, and the possibility of meeting amazing people.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Later, a scholarship from <B>Fundación Barrié</B> made it possible for me to join
                            the <PL to={15}>International Space University</PL> in <PL to={16}>Strasbourg</PL>. Support like that means a lot. Not just because it
                            opens doors, but because it makes you feel that someone looked at your story and
                            said, <em className="text-white/70 not-italic">yes, this is worth backing</em>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Both foundations believed in a kid from <PL to={2}>Lugo</PL>, and I carry that responsibility with pride.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            That is why I am now in <PL to={16}>Strasbourg</PL>, studying the Master of
                            Space Studies. This programme has brought together many parts of my life that
                            used to feel separate. Not a straight line, but definitely a pattern.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Finally, it would not be me if I didn&apos;t mention that <PL to={18}>sports</PL> have always been one of the most important parts of my life. It started
                            with football in the street, but later, other disciplines became part of me too, especially <PL to={18}>martial
                            arts</PL>, and <PL to={19}>athletics</PL>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            So if I had to sum it up, I would say that I am someone who grew up <PL to={6}>outdoors</PL>,
                            studied science across different disciplines
                            and countries, found a home in both research and communication, kept drifting toward
                            space until space became real, and along the way never stopped cooking, competing,
                            or telling people about where I come from.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            I care about science, but also about what science means. I care about excellence,
                            but not the cold kind. I care about stories, places, people, effort, humour, food
                            that makes you close your eyes, and the strange privilege of getting to build a
                            path that did not exist for you in advance.
                        </p></Reveal>

                        <Reveal><p className="text-white/40 italic leading-[2] font-light text-[18px] md:text-[20px] lg:text-[21px] max-w-[540px] pull-highlight pl-5">
                            Enjoy living, learning and laughing.
                        </p></Reveal>
                        </>)}

                        {language === 'es' && (<>
                        <Reveal><p className={pClass}>
                            Hola. Mi nombre es <B>Michael</B> y lo primero que quiero que sepas de mí es
                            que soy de <PL to={2}>Lugo</PL>, en <PL to={3}>Galicia</PL>, en el noroeste de España. Ahí es donde empieza mi
                            historia, y en muchos sentidos, todavía explica mucho sobre mí.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Crecí jugando al fútbol y al escondite en la calle, pasando largas horas
                            fuera, inventando juegos, llegando a casa cansado, y viviendo en esa última generación
                            que todavía tuvo una <PL to={0}>infancia al aire libre</PL> antes de que el teléfono se apoderase de todo. Sinceramente
                            creo que tuve suerte con eso. La vida se sentía más física, más directa, y
                            probablemente un poco menos estúpida.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={2}>Lugo</PL> me dio eso. <PL to={3}>Galicia</PL> también. Un lugar lleno de lluvia,
                            carácter, humor, cabezonería, y gente que normalmente no necesita decir mucho
                            para significar mucho.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Y hablando de gente, mis <PL to={4}>padres</PL> son una parte enorme de esta historia. Me dieron el tipo de apoyo que
                            normalmente no sale en los titulares, pero que silenciosamente lo cambia todo. Confianza, esfuerzo,
                            sacrificio, estabilidad, humor, y la sensación de que aunque me fuese alejando cada vez más
                            geográficamente, nunca dejaba realmente el <PL to={5}>hogar</PL> atrás.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Mi trayectoria académica empezó en la <PL to={7}>ciencia</PL>, a través de la <B>biotecnología y la biomedicina</B>, pero lo que
                            realmente me formó fue la variedad de lugares y personas que vinieron con ello. En <B>Londres</B>,
                            trabajé en investigación sobre cáncer de páncreas. En <B>Santiago de Compostela</B>, estuve
                            en biología de priones y artritis reumatoide. Cada <PL to={8}>laboratorio</PL> era como un pequeño país
                            con sus propias reglas y rituales.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Más tarde en Suecia, mi mundo se abrió aún más. Me mudé allí para completar mi
                            Máster en Biomedicina en el <B>Karolinska Institutet</B>, apoyado por una beca de la
                            la <PL to={9}>Fundación La Caixa</PL>. Venir de Lugo y aterrizar en <B>Estocolmo</B> fue un cambio real.
                            Ritmo diferente, clima diferente, cultura diferente, todo diferente.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Trabajé en producción de <B>seda de araña</B> recombinante y más tarde en proyectos con
                            hueso y músculo de <B>ratones de vuelos espaciales</B>, que unían biología, salud y
                            espacio de una forma que parecía casi sospechosamente hecha a medida para mis intereses. La ciencia me dio
                            disciplina. Mi origen me dio la cabezonería para seguir adelante cuando los
                            experimentos no lo hacían.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={11}>Suecia</PL> me afiló. Me desafió, me dio independencia, y me hizo madurar rápido.
                            Encontré belleza en los <PL to={10}>paisajes helados</PL>, el silencio, y los largos inviernos que
                            te enseñan a quedarte quieto con tus propios pensamientos.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Con el tiempo, mis intereses me fueron atrayendo hacia el <B>espacio</B>. No solo porque el espacio sea
                            impresionante, que obviamente lo es, sino porque se sitúa en la intersección de tantas
                            cosas que me importan, como la ciencia, la salud, la exploración, los límites humanos, la colaboración
                            internacional, y la posibilidad de conocer a gente increíble.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Más tarde, una beca de la <B>Fundación Barrié</B> me permitió unirme a
                            la <PL to={15}>International Space University</PL> en <PL to={16}>Estrasburgo</PL>. Un apoyo así significa mucho. No solo porque abre
                            puertas, sino porque te hace sentir que alguien miró tu historia y
                            dijo: <em className="text-white/70 not-italic">sí, esto merece la pena apoyarlo</em>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Ambas fundaciones creyeron en un chico de <PL to={2}>Lugo</PL>, y llevo esa responsabilidad con orgullo.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Por eso estoy ahora en <PL to={16}>Estrasburgo</PL>, estudiando el Máster de
                            Estudios Espaciales. Este programa ha unido muchas partes de mi vida que
                            antes parecían separadas. No una línea recta, pero definitivamente un patrón.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Finalmente, no sería yo si no mencionase que el <PL to={18}>deporte</PL> ha sido siempre una de las partes más importantes de mi vida. Empezó
                            con el fútbol en la calle, pero después, otras disciplinas también pasaron a formar parte de mí, especialmente las <PL to={18}>artes
                            marciales</PL>, y el <PL to={19}>atletismo</PL>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Así que si tuviese que resumirlo, diría que soy alguien que creció al <PL to={6}>aire libre</PL>,
                            estudió ciencia en diferentes disciplinas
                            y países, encontró un hogar tanto en la investigación como en la comunicación, fue derivando hacia
                            el espacio hasta que el espacio se hizo real, y por el camino nunca dejó de cocinar, competir,
                            ni de contarle a la gente de dónde viene.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Me importa la ciencia, pero también lo que la ciencia significa. Me importa la excelencia,
                            pero no la fría. Me importan las historias, los lugares, la gente, el esfuerzo, el humor, la comida
                            que te hace cerrar los ojos, y el extraño privilegio de poder construir un
                            camino que no existía para ti de antemano.
                        </p></Reveal>

                        <Reveal><p className="text-white/40 italic leading-[2] font-light text-[18px] md:text-[20px] lg:text-[21px] max-w-[540px] pull-highlight pl-5">
                            Disfruta viviendo, aprendiendo y riendo.
                        </p></Reveal>
                        </>)}

                        {language === 'gl' && (<>
                        <Reveal><p className={pClass}>
                            Ola. O meu nome é <B>Michael</B> e o primeiro que quero que saibas de min é
                            que son de <PL to={2}>Lugo</PL>, en <PL to={3}>Galicia</PL>, no noroeste de España. Aí é onde comeza a miña
                            historia, e en moitos sentidos, aínda explica moito sobre min.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Medrei xogando ao fútbol e ao escondite na rúa, pasando longas horas
                            fóra, inventando xogos, chegando á casa canso, e vivindo nesa última xeración
                            que aínda tivo unha <PL to={0}>infancia ao aire libre</PL> antes de que o teléfono se apoderase de todo. Sinceramente
                            creo que tiven sorte con iso. A vida sentíase máis física, máis directa, e
                            probablemente un pouco menos estúpida.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={2}>Lugo</PL> deume iso. <PL to={3}>Galicia</PL> tamén. Un lugar cheo de choiva,
                            carácter, humor, teimosía, e xente que normalmente non precisa dicir moito
                            para significar moito.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            E falando de xente, os meus <PL to={4}>pais</PL> son unha parte enorme desta historia. Déronme o tipo de apoio que
                            normalmente non sae nos titulares, pero que silenciosamente o cambia todo. Confianza, esforzo,
                            sacrificio, estabilidade, humor, e a sensación de que aínda que me fose afastando cada vez máis
                            xeograficamente, nunca deixaba realmente o <PL to={5}>fogar</PL> atrás.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            A miña traxectoria académica comezou na <PL to={7}>ciencia</PL>, a través da <B>biotecnoloxía e a biomedicina</B>, pero o que
                            realmente me formou foi a variedade de lugares e persoas que viñeron con iso. En <B>Londres</B>,
                            traballei en investigación sobre cancro de páncreas. En <B>Santiago de Compostela</B>, estiven
                            en bioloxía de prións e artrite reumatoide. Cada <PL to={8}>laboratorio</PL> era coma un pequeno país
                            coas súas propias regras e rituais.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Máis tarde en Suecia, o meu mundo abriuse aínda máis. Mudeime alí para completar o meu
                            Máster en Biomedicina no <B>Karolinska Institutet</B>, apoiado por unha bolsa da
                            a <PL to={9}>Fundación La Caixa</PL>. Vir de Lugo e aterrar en <B>Estocolmo</B> foi un cambio real.
                            Ritmo diferente, clima diferente, cultura diferente, todo diferente.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Traballei en produción de <B>seda de araña</B> recombinante e máis tarde en proxectos con
                            óso e músculo de <B>ratos de voos espaciais</B>, que unían bioloxía, saúde e
                            espazo dun xeito que parecía case sospeitosamente feito a medida para os meus intereses. A ciencia deume
                            disciplina. A miña orixe deume a teimosía para seguir adiante cando os
                            experimentos non o facían.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            <PL to={11}>Suecia</PL> afiloume. Desafiou, deume independencia, e fíxome madurar rápido.
                            Atopei beleza nas <PL to={10}>paisaxes xeadas</PL>, no silencio, e nos longos invernos que
                            che ensinan a quedarte quieto cos teus propios pensamentos.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Co tempo, os meus intereses foron atraéndome cara ao <B>espazo</B>. Non só porque o espazo sexa
                            impresionante, que obviamente o é, senón porque se sitúa na intersección de tantas
                            cousas que me importan, coma a ciencia, a saúde, a exploración, os límites humanos, a colaboración
                            internacional, e a posibilidade de coñecer a xente incrible.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Máis tarde, unha bolsa da <B>Fundación Barrié</B> permitiume unirme
                            á <PL to={15}>International Space University</PL> en <PL to={16}>Estrasburgo</PL>. Un apoio así significa moito. Non só porque abre
                            portas, senón porque che fai sentir que alguén mirou a túa historia e
                            dixo: <em className="text-white/70 not-italic">si, isto paga a pena apoialo</em>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Ambas as dúas fundacións creron nun rapaz de <PL to={2}>Lugo</PL>, e levo esa responsabilidade con orgullo.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Por iso estou agora en <PL to={16}>Estrasburgo</PL>, estudando o Máster de
                            Estudos Espaciais. Este programa uniu moitas partes da miña vida que
                            antes parecían separadas. Non unha liña recta, pero definitivamente un patrón.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Finalmente, non sería eu se non mencionase que o <PL to={18}>deporte</PL> foi sempre unha das partes máis importantes da miña vida. Comezou
                            co fútbol na rúa, pero despois, outras disciplinas tamén pasaron a formar parte de min, especialmente as <PL to={18}>artes
                            marciais</PL>, e o <PL to={19}>atletismo</PL>.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Así que se tivese que resumilo, diría que son alguén que medrou ao <PL to={6}>aire libre</PL>,
                            estudou ciencia en diferentes disciplinas
                            e países, atopou un fogar tanto na investigación coma na comunicación, foi derivando cara ao
                            espazo ata que o espazo se fixo real, e polo camiño nunca deixou de cociñar, competir,
                            nin de contarlle á xente de onde vén.
                        </p></Reveal>

                        <Reveal><p className={pClass}>
                            Impórtame a ciencia, pero tamén o que a ciencia significa. Impórtame a excelencia,
                            pero non a fría. Impórtanme as historias, os lugares, a xente, o esforzo, o humor, a comida
                            que che fai pechar os ollos, e o estraño privilexio de poder construír un
                            camiño que non existía para ti de antemán.
                        </p></Reveal>

                        <Reveal><p className="text-white/40 italic leading-[2] font-light text-[18px] md:text-[20px] lg:text-[21px] max-w-[540px] pull-highlight pl-5">
                            Goza vivindo, aprendendo e rindo.
                        </p></Reveal>
                        </>)}

                        {/* CV link */}
                        <Reveal>
                            <div className="pb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-t border-white/[0.04] pt-10 mt-12">
                                <p className="text-white/20 text-xs font-light font-mono tracking-wide">{content.cvLabel}</p>
                                <Link href="/about/cv"
                                    className="group inline-flex items-center gap-3 text-white/35 hover:text-white/90 transition-colors border border-white/[0.06] hover:border-white/20 px-5 py-2.5 rounded-full">
                                    <span className="text-xs uppercase tracking-[0.2em]">{content.cvLink}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </>
    );
}

/* Songs data — moved to page-level so Monitor can use it */
const songs = [
    { title: 'Vienna', artist: 'Billy Joel', file: '/music/song-1.mp3' },
    { title: 'Death of a Bachelor', artist: 'Panic! At The Disco', file: '/music/song-2.mp3' },
    { title: 'Mr. Blue Sky', artist: 'Electric Light Orchestra', file: '/music/song-3.mp3' },
    { title: 'The Pretender', artist: 'Foo Fighters', file: '/music/song-4.mp3' },
    { title: 'Gold', artist: 'Spandau Ballet', file: '/music/song-5.mp3' },
    { title: 'Guerrero', artist: 'Robe', file: '/music/song-6.mp3' },
    { title: 'still feel.', artist: 'half\u00b7alive', file: '/music/song-7.mp3' },
    { title: 'Llueve sobre mojado', artist: 'Joaqu\u00edn Sabina y Fito P\u00e1ez', file: '/music/song-8.mp3' },
    { title: 'Live & Learn', artist: 'Crush 40', file: '/music/song-9.mp3' },
    { title: "Don't Look Back In Anger", artist: 'Oasis', file: '/music/song-10.mp3' },
    { title: 'Segundo movimiento: lo de fuera', artist: 'Extremoduro', file: '/music/song-11.mp3' },
    { title: 'Sinti\u00e9ndolo Mucho', artist: 'C. Tangana', file: '/music/song-12.mp3' },
    { title: 'ARRANCARMELO', artist: 'WOS', file: '/music/song-13.mp3' },
    { title: 'Your Song', artist: 'Elton John', file: '/music/song-14.mp3' },
];

/* Music player hook — used in the main page */
function useMusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(0);
    const [musicProgress, setMusicProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const initAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.addEventListener('timeupdate', () => {
                const a = audioRef.current!;
                setMusicProgress(a.duration ? a.currentTime / a.duration : 0);
            });
            audioRef.current.addEventListener('ended', () => {
                setCurrentSong(prev => (prev + 1) % songs.length);
            });
        }
    }, []);

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.src = songs[currentSong].file;
            audioRef.current.play().catch(() => {});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong]);

    const playSong = useCallback((index: number) => {
        initAudio();
        audioRef.current!.src = songs[index].file;
        audioRef.current!.play().catch(() => {});
        setIsPlaying(true);
        setCurrentSong(index);
    }, [initAudio]);

    const togglePlay = useCallback(() => {
        initAudio();
        if (!audioRef.current!.src || audioRef.current!.src === window.location.href) {
            playSong(currentSong);
            return;
        }
        if (isPlaying) {
            audioRef.current!.pause();
            setIsPlaying(false);
        } else {
            audioRef.current!.play().catch(() => {});
            setIsPlaying(true);
        }
    }, [isPlaying, currentSong, playSong, initAudio]);

    const prevSong = useCallback(() => playSong((currentSong - 1 + songs.length) % songs.length), [currentSong, playSong]);
    const nextSong = useCallback(() => playSong((currentSong + 1) % songs.length), [currentSong, playSong]);

    useEffect(() => {
        return () => { audioRef.current?.pause(); };
    }, []);

    return { songs, currentSong, isPlaying, musicProgress, togglePlay, prevSong, nextSong };
}
