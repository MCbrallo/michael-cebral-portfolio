"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import localFont from "next/font/local";
import { CartridgeFace } from "@/components/projects/Cartridge";
import { ProjectLogo } from "@/components/projects/ProjectLogo";
import { useLanguage } from "@/context/LanguageContext";
import { canFrameFrom, projects } from "@/data/projects";

/* The cartridge names are written by hand, the ink screen is set for reading.
   Both fonts ship with the site (src/fonts, latin subset, licences beside
   them). Fetched from Google at build time, Literata sometimes came back as a
   font URL that Turbopack cannot parse, and the production build failed or
   passed depending on which Google server answered. */
const marker = localFont({ src: "../../fonts/permanent-marker-latin-400-normal.woff2", weight: "400", variable: "--font-marker", display: "swap" });
const literata = localFont({
    src: [
        { path: "../../fonts/literata-latin-400-normal.woff2", weight: "400", style: "normal" },
        { path: "../../fonts/literata-latin-500-normal.woff2", weight: "500", style: "normal" },
    ],
    variable: "--font-literata",
    display: "swap",
});

type Power = "off" | "boot" | "on";
type Ink = "idle" | "black" | "white" | "page";

/* ── Geometry, in scene units. The whole scene is drawn at a fixed size and
   scaled to the column, so every measurement below is a design pixel. ── */
const CW = 176;
const CH = 128;
const DEV_W = 540;
const SLIDER_H = 390;
const BASE_H = 400;
const OVERLAP = 26;
const SLIDE = SLIDER_H - OVERLAP;
const TILTS = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6, -0.3, 0.9, -0.7, 0.4];

type ModeName = "wide" | "narrow";
type Home = { x: number; y: number; a: number };
type Mode = {
    name: ModeName; W: number; H: number;
    /** Device scale. The cartridges share it, so a cartridge always fits its slot. */
    ds: number;
    /** Cartridge scale. Larger than the device scale; the slot widens to match. */
    cs: number;
    dev: { x: number; y: number };
    homes: Home[];
    head: { x: number; y: number };
    strip: { y: number; first: number; step: number } | null;
};

/* Wide: a loose pile of cartridges on the left, the console high on the right.
   Narrow: the console on top and the cartridges in a row along the bottom that
   slides sideways. Both fit one screen; nothing scrolls the page.
   The first cartridge goes into the console on arrival, so its place sits apart
   below the pile: while it is away the pile reads whole instead of missing one. */
const SCATTER: [number, number, number][] = [
    [270, 682, 0.06],
    [168, 236, -0.09], [400, 256, 0.07], [190, 386, 0.05], [424, 410, -0.1],
    [156, 536, -0.03], [392, 560, 0.11], [480, 690, -0.05],
    [570, 160, 0.04], [585, 320, -0.07],
];
/* A window much wider than it is tall leaves room at the sides, so the scene
   widens with it and the pile spreads into three columns of larger
   cartridges. Columns are in column widths, rows in scene units. */
const SCATTER3: [number, number, number][] = [
    [1.12, 680, 0.06],
    [0.02, 262, -0.08], [1.05, 286, 0.06], [1.98, 258, -0.05],
    [0.08, 486, 0.07], [0.98, 510, -0.1], [2.04, 482, 0.09],
    [2.1, 680, -0.06], [-0.1, 680, 0.05],
];
const WIDE_H = 740;
const WIDE_MAX_W = 1520;
function makeMode(name: ModeName, n: number, W = 1200): Mode {
    if (name === "wide") {
        const ds = 0.8;
        const dev = { x: W - 510, y: 92 };
        if (W >= 1400) {
            /* Three loose columns between the left edge and the console */
            const left = 80, right = dev.x - 70, cw = (right - left) / 3;
            const homes = Array.from({ length: n }, (_, i) => {
                const s = SCATTER3[i % SCATTER3.length];
                return { x: left + cw * (s[0] + 0.5), y: s[1], a: s[2] };
            });
            return { name, W, H: WIDE_H, ds, cs: 1.2 * ds, dev, homes, head: { x: left + cw * 0.5 - 76, y: 44 }, strip: null };
        }
        /* Two columns, centred in the room the console leaves */
        const shift = dev.x / 2 - 345;
        const homes = Array.from({ length: n }, (_, i) => {
            const s = SCATTER[i % SCATTER.length];
            return { x: s[0] + shift + Math.floor(i / SCATTER.length) * 18, y: s[1], a: s[2] };
        });
        return { name, W, H: WIDE_H, ds, cs: 1.0 * ds, dev, homes, head: { x: 92 + shift, y: 44 }, strip: null };
    }
    const ds = 0.7;
    return {
        name, W: 420, H: 834, ds, cs: 1.06 * ds,
        dev: { x: (420 - DEV_W * ds) / 2, y: 148 }, homes: [], head: { x: 22, y: 14 },
        strip: { y: 766, first: 78, step: 146 },
    };
}

/* ── Sound, synthesised so there is nothing to download ── */
function createSound(enabled: () => boolean) {
    let ctx: AudioContext | null = null;
    let noise: AudioBuffer | null = null;
    const ac = () => {
        if (!enabled()) return null;
        try {
            if (!ctx) {
                const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                ctx = new Ctor();
            }
            if (ctx.state === "suspended") void ctx.resume();
            return ctx;
        } catch {
            return null;
        }
    };
    const burst = (when: number, dur: number, freq: number, q: number, gain: number, type: BiquadFilterType = "bandpass") => {
        const a = ac(); if (!a) return;
        if (!noise) {
            noise = a.createBuffer(1, a.sampleRate * 0.5, a.sampleRate);
            const ch = noise.getChannelData(0);
            for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
        }
        const src = a.createBufferSource(); src.buffer = noise;
        const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
        const g = a.createGain(); const t = a.currentTime + when;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(f); f.connect(g); g.connect(a.destination); src.start(t); src.stop(t + dur + 0.02);
    };
    const tone = (when: number, dur: number, f0: number, f1: number, gain: number, type: OscillatorType = "sine") => {
        const a = ac(); if (!a) return;
        const o = a.createOscillator(); o.type = type;
        const t = a.currentTime + when;
        o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        const g = a.createGain();
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
    };
    return {
        wake: () => { ac(); },
        pick: () => burst(0, 0.04, 3000, 1.2, 0.04),
        land: () => burst(0, 0.08, 380, 0.8, 0.06, "lowpass"),
        slide: () => burst(0, 0.16, 1400, 0.6, 0.025, "lowpass"),
        latch: () => { burst(0, 0.012, 4200, 3, 0.3); burst(0.008, 0.03, 2200, 2.5, 0.18); tone(0.004, 0.06, 160, 70, 0.22); },
        release: () => { burst(0, 0.012, 3600, 3, 0.2); tone(0.02, 0.09, 380, 720, 0.04, "triangle"); },
        refresh: () => burst(0, 0.02, 6000, 1, 0.012),
        /* Two cartridges meeting, louder the harder they hit */
        knock: (j: number) => { burst(0, 0.035, 900 + Math.min(1400, j * 1.4), 1.4, Math.min(0.09, 0.012 + j * 0.00005), "bandpass"); burst(0, 0.06, 260, 0.8, Math.min(0.05, j * 0.00003), "lowpass"); },
    };
}

/* ── The engine. React draws the markup once; this moves it every frame. ── */type Anim = {
    from: { x: number; y: number; a: number; lift: number };
    to: { x: number; y: number; a: number; lift: number; arc: number };
    t: number; dur: number; ease: (t: number) => number; resolve: () => void;
};
type Body = {
    i: number; id: string; el: HTMLButtonElement;
    x: number; y: number; a: number; vx: number; vy: number; va: number;
    lift: number; lv: number; tx: number; ty: number;
    state: "rest" | "drag" | "busy" | "inserted";
    hover: boolean; anim: Anim | null; awake: boolean;
    grab: { x: number; y: number } | null; ptr: { x: number; y: number } | null;
    down: { x: number; y: number; t: number; moved: number; inserted: boolean; trail: { x: number; y: number; t: number }[] } | null;
    pending: { x: number; y: number; t: number; pid: number; pt: { x: number; y: number } } | null;
    rail: boolean; under: boolean; pid: number | null; wasHigh: boolean;
    /** Thrown by hand and still in the air: landing on the console puts it in */
    thrown: boolean;
};
type EngineOpts = {
    viewport: HTMLDivElement; scene: HTMLDivElement; device: HTMLDivElement; slot: HTMLDivElement;
    tip: HTMLDivElement; strip: HTMLDivElement; head: HTMLDivElement; carts: HTMLButtonElement[]; ids: string[];
    reduced: boolean; sound: ReturnType<typeof createSound>;
    onLoad: (id: string | null) => void; onPower: (p: Power) => void; onInk: (i: Ink) => void;
    onTip: (id: string | null) => void; onMode: (m: ModeName) => void; onTouched: () => void;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const upright = (a: number) => Math.round(a / (Math.PI * 2)) * Math.PI * 2;

function createEngine(o: EngineOpts) {
    const { viewport, scene, device, slot, tip, strip, head, sound, reduced } = o;
    const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, reduced ? 0 : ms));
    let M: Mode = makeMode("wide", o.ids.length);
    let S = M.cs, open = false, current: Body | null = null, busy = false, zTop = 100, tipFor: Body | null = null;
    let raf = 0, last = 0, dead = false, laidOut = false, lastKnock = 0;
    /* The sliding row of cartridges on narrow screens. stripGoal is where the row
       glides to on its own, to bring a cartridge reached by keyboard into view. */
    let stripOff = 0, stripV = 0, stripGoal: number | null = null;
    let stripDrag: { startX: number; startOff: number; lastX: number; lastT: number; pid: number; el: HTMLElement } | null = null;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, reduced ? 0 : ms)); };

    const bodies: Body[] = o.carts.map((el, i) => ({
        i, id: o.ids[i], el, x: 0, y: 0, a: 0, vx: 0, vy: 0, va: 0, lift: 0, lv: 0, tx: 0, ty: 0,
        state: "rest", hover: false, anim: null, awake: true, grab: null, ptr: null, down: null, pending: null,
        rail: false, under: false, pid: null, wasHigh: false, thrown: false,
    }));

    const hgt = () => CH * S, wid = () => CW * S;
    const devW = () => DEV_W * M.ds;
    const slotX = () => M.dev.x + devW() / 2;
    const slotY = () => M.dev.y + (open ? 0 : SLIDE * M.ds);
    const entryY = () => slotY() - hgt() / 2;
    /* Seated, a cartridge shows its top half, enough for the whole name on its tape */
    const seat = () => hgt() * 0.52;
    const latchAt = () => hgt() * 0.42;
    /* The row closes up around a cartridge that is in the console or on its way there */
    const inRow = (b: Body) => b.state !== "inserted" && b.state !== "busy";
    const stripMax = () => (M.strip ? Math.max(0, M.strip.first * 2 + (bodies.filter(inRow).length - 1) * M.strip.step - M.W) : 0);
    let stripMoving = false;
    const rowIndex = (b: Body) => { let k = 0; for (const c of bodies) { if (c === b) break; if (inRow(c)) k++; } return k; };
    function home(b: Body): Home {
        if (M.strip) return { x: M.strip.first + rowIndex(b) * M.strip.step - stripOff, y: M.strip.y, a: 0 };
        return M.homes[b.i];
    }
    /* Keyboard focus on a cartridge outside the visible row slides the row to it */
    function reveal(b: Body) {
        if (!M.strip || !inRow(b)) return;
        const x = M.strip.first + rowIndex(b) * M.strip.step, half = wid() / 2 + 14;
        const hi = x - half, lo = x + half - M.W;
        if (stripOff > hi) stripGoal = Math.max(0, hi);
        else if (stripOff < lo) stripGoal = Math.min(stripMax(), lo);
        stripV = 0;
    }

    /* The loop sleeps while nothing moves and wakes on the next touch, resize or animation */
    function kick() {
        if (dead || raf) return;
        raf = requestAnimationFrame((t) => { last = t - 16; frame(t); });
    }
    function front(b: Body) { b.el.style.zIndex = String(++zTop); }
    function wakeAll() { bodies.forEach((c) => { c.awake = true; }); kick(); }
    function setUnder(b: Body, under: boolean) {
        if (b.under === under) return;
        b.under = under;
        if (under) b.el.style.zIndex = "40"; else front(b);
    }

    /* E-ink refresh: black, white, then the new page, the way a real panel redraws. */
    let inkSeq = 0;
    async function inkTo(state: Ink) {
        const my = ++inkSeq;
        if (reduced) { o.onInk(state); return; }
        sound.refresh();
        o.onInk("black"); await wait(110); if (my !== inkSeq || dead) return;
        o.onInk("white"); await wait(110); if (my !== inkSeq || dead) return;
        o.onInk(state);
    }
    function powerOn(b: Body, instant: boolean) {
        o.onLoad(b.id);
        if (instant) { o.onPower("on"); o.onInk("page"); return; }
        o.onPower("boot");
        later(() => { if (current === b) o.onPower("on"); }, 520);
        later(() => { if (current === b) void inkTo("page"); }, 160);
    }
    function powerOff() { o.onPower("off"); o.onLoad(null); void inkTo("idle"); }

    /* Fit the whole scene inside the space the page leaves it, by width and by height */
    function layout() {
        const vw = viewport.clientWidth, vh = viewport.clientHeight;
        const name: ModeName = vw < 760 || vw / Math.max(1, vh) < 0.95 ? "narrow" : "wide";
        const W = name === "wide" ? Math.round(Math.min(WIDE_MAX_W, Math.max(1200, (WIDE_H * vw) / Math.max(1, vh)))) : 0;
        const changed = !laidOut || name !== M.name || (W >= 1400) !== (M.W >= 1400);
        const prevDevX = M.dev.x;
        M = makeMode(name, bodies.length, W || undefined); S = M.cs;
        laidOut = true;
        const k = Math.min(name === "wide" ? 1.3 : 1.5, vw / M.W, vh / M.H);
        const offX = Math.max(0, (vw - M.W * k) / 2);
        const offY = Math.max(0, (vh - M.H * k) / 2) * (name === "wide" ? 0.45 : 0.5);
        scene.style.width = M.W + "px"; scene.style.height = M.H + "px";
        scene.style.transform = `translate(${offX.toFixed(1)}px,${offY.toFixed(1)}px) scale(${k.toFixed(4)})`;
        device.style.transform = `translate(${M.dev.x}px,${M.dev.y}px) scale(${M.ds})`;
        device.style.setProperty("--pc-slot-w", `${(wid() + 10) / M.ds}px`);
        head.style.transform = `translate(${M.head.x}px,${M.head.y}px)`;
        strip.style.display = M.strip ? "block" : "none";
        if (M.strip) { strip.style.top = `${M.strip.y - hgt() / 2 - 24}px`; strip.style.height = `${hgt() + 48}px`; }
        stripOff = Math.min(stripOff, stripMax());
        o.onMode(name);
        bodies.forEach((b) => {
            if (b.state === "inserted") { place(b); return; }
            if (changed || (b.state === "rest" && M.strip)) {
                b.anim = null; b.state = "rest"; b.rail = false; b.pending = null; b.thrown = false;
                const h = home(b); b.x = h.x; b.y = h.y; b.a = h.a; b.vx = b.vy = b.va = 0;
                setUnder(b, false);
            } else if (b.state === "rest") {
                /* On the table a cartridge stays where it lies; the room moves with the console */
                if (prevDevX !== M.dev.x) b.x = b.x < prevDevX ? b.x * (M.dev.x / prevDevX) : b.x + (M.dev.x - prevDevX);
                b.x = Math.max(0, Math.min(M.W, b.x)); b.y = Math.max(0, Math.min(M.H, b.y));
            }
            b.awake = true;
        });
        kick();
    }
    function place(b: Body) {
        b.x = slotX(); b.y = entryY() + seat(); b.a = 0; b.lift = 0; b.tx = b.ty = 0; b.state = "inserted";
        setUnder(b, true); b.awake = true; kick();
    }
    function tween(b: Body, to: Partial<Anim["to"]>, dur: number, ease: (t: number) => number) {
        return new Promise<void>((resolve) => {
            b.anim = {
                from: { x: b.x, y: b.y, a: b.a, lift: b.lift },
                to: { x: b.x, y: b.y, a: b.a, lift: b.lift, arc: 0, ...to },
                t: 0, dur: reduced ? Math.min(dur, 90) : dur, ease, resolve,
            };
            b.awake = true; kick();
        });
    }

    /* The slot spring pulls the cartridge past its seat, then lets it settle back with the click. */
    async function latch(b: Body) {
        b.rail = false; b.state = "busy"; wakeAll();
        if (b.pid !== null) { try { b.el.releasePointerCapture(b.pid); } catch { /* already gone */ } b.pid = null; }
        b.el.classList.remove("is-dragging"); slot.removeAttribute("data-ready");
        setUnder(b, true);
        const up = upright(b.a);
        await tween(b, { x: slotX(), y: entryY() + seat() + 4 * S, a: up, lift: 0 }, 85, easeIn);
        sound.latch();
        if (!reduced) device.animate([{ translate: "0 0" }, { translate: "0 1.6px" }, { translate: "0 0" }], { duration: 200, easing: "cubic-bezier(.3,.7,.3,1)" });
        current = b;
        await tween(b, { y: entryY() + seat() }, 150, easeOutBack);
        b.a = 0; b.state = "inserted";
        powerOn(b, false);
        busy = false;
    }
    async function insert(b: Body) {
        if (busy || !open || b.state === "inserted") return;
        busy = true;
        b.state = "busy"; b.hover = false; b.rail = false; hideTip(); wakeAll();
        if (current && current !== b) await eject(current, true);
        front(b);
        const up = upright(b.a);
        await tween(b, { x: slotX(), y: entryY() - 8 * S, a: up, lift: 0.85, arc: 60 * S }, 480, easeInOut);
        await tween(b, { lift: 0.15, y: entryY() - 2 * S }, 120, easeOut);
        setUnder(b, true); sound.slide();
        await tween(b, { y: entryY() + latchAt(), lift: 0 }, 220, easeIn);
        await latch(b);
    }
    async function eject(b: Body, chained: boolean) {
        if (b.state !== "inserted") return;
        b.state = "busy";
        current = null;
        sound.release();
        powerOff();
        const out = entryY() + hgt() * 0.12;
        await tween(b, { y: out - 6 * S }, 110, easeOut);
        await tween(b, { y: out }, 110, easeOut);
        await wait(chained ? 60 : 160);
        await tween(b, { y: entryY() - 4 * S, lift: 0.4 }, 170, easeIn);
        setUnder(b, false);
        b.state = "rest"; b.lift = 0.4; b.lv = 0; b.vx = 0; b.vy = 0; b.wasHigh = true; b.thrown = false;
        if (!M.strip) {
            /* The spring throws it clear of the console, onto the table on its left */
            b.lift = 0.55; b.lv = 2.1;
            b.vx = -(860 + Math.random() * 160); b.vy = 300 + Math.random() * 220; b.va = (Math.random() - 0.5) * 7;
        }
        wakeAll();
    }
    function doEject() {
        if (!current || busy) return;
        busy = true;
        void eject(current, false).then(() => { busy = false; });
    }

    /* Tooltip: name and subtitle beside the cartridge under the pointer (wide only) */
    function showTip(b: Body) { if (M.strip) return; tipFor = b; o.onTip(b.id); tip.setAttribute("data-show", ""); placeTip(); }
    function hideTip() { tipFor = null; tip.removeAttribute("data-show"); o.onTip(null); }
    function placeTip() {
        if (!tipFor) return;
        const b = tipFor, th = tip.offsetHeight;
        tip.style.transform = `translate(${(b.x + wid() / 2 + 16).toFixed(1)}px,${(b.y - th / 2).toFixed(1)}px)`;
    }

    /* Pointer to scene units. Measured from the drawn box, so the site's zoom and the scene scale both drop out. */
    function toScene(e: PointerEvent) {
        const r = scene.getBoundingClientRect(), s = r.width / M.W;
        return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    }
    const nearSlot = (b: Body) => Math.abs(b.x - slotX()) < wid() * 1.1 && b.y > entryY() - hgt() * 1.6 && b.y < entryY() + hgt() * 0.3;
    const inCapture = (b: Body) => open && !current && !busy && Math.abs(b.x - slotX()) < wid() * 0.42 && b.y > entryY() - hgt() * 0.55 && b.y < entryY() + hgt() * 0.15 && Math.abs(b.a - upright(b.a)) < 0.5;
    const overDevice = (b: Body) => b.x > M.dev.x && b.x < M.dev.x + devW() && b.y > slotY() && b.y < M.dev.y + (SLIDE + BASE_H) * M.ds;

    const listeners: Array<[EventTarget, string, EventListener]> = [];
    /* Every handler ends by waking the loop, since any of them may set something moving */
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
        const run = ((e: HTMLElementEventMap[K]) => { fn(e); kick(); }) as EventListener;
        el.addEventListener(type, run);
        listeners.push([el, type, run]);
    };

    function startDrag(b: Body, e: PointerEvent, pid: number) {
        const pt = toScene(e);
        const dx = pt.x - b.x, dy = pt.y - b.y, cs = Math.cos(-b.a), sn = Math.sin(-b.a);
        b.grab = { x: dx * cs - dy * sn, y: dx * sn + dy * cs };
        b.ptr = pt; b.down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, inserted: false, trail: [{ x: pt.x, y: pt.y, t: performance.now() }] };
        b.state = "drag"; b.awake = true; b.pid = pid; b.thrown = false; b.el.classList.add("is-dragging");
        front(b); hideTip(); sound.pick();
    }
    function startStrip(x: number, pid: number, el: HTMLElement) {
        stripDrag = { startX: x, startOff: stripOff, lastX: x, lastT: performance.now(), pid, el };
        stripV = 0; stripGoal = null;
    }
    function moveStrip(e: PointerEvent) {
        if (!stripDrag) return;
        const r = scene.getBoundingClientRect(), s = r.width / M.W;
        let off = stripDrag.startOff - (e.clientX - stripDrag.startX) / s;
        const max = stripMax();
        if (off < 0) off *= 0.35; else if (off > max) off = max + (off - max) * 0.35;
        const now = performance.now(), dt = Math.max(1, now - stripDrag.lastT);
        stripV = (-(e.clientX - stripDrag.lastX) / s / dt) * 1000;
        stripDrag.lastX = e.clientX; stripDrag.lastT = now;
        stripOff = off;
        bodies.forEach((b) => { if (b.state === "rest") b.awake = true; });
    }
    function endStrip() {
        if (!stripDrag) return;
        try { stripDrag.el.releasePointerCapture(stripDrag.pid); } catch { /* gone */ }
        stripDrag = null;
        stripV = Math.max(-2400, Math.min(2400, stripV));
    }

    on(strip, "pointerdown", (e) => { if (!M.strip) return; e.preventDefault(); strip.setPointerCapture(e.pointerId); startStrip(e.clientX, e.pointerId, strip); o.onTouched(); });
    on(strip, "pointermove", (e) => moveStrip(e));
    on(strip, "pointerup", () => endStrip());
    on(strip, "pointercancel", () => endStrip());

    bodies.forEach((b) => {
        const el = b.el;
        on(el, "pointerdown", (e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            sound.wake(); o.onTouched();
            if (b.state === "inserted") { b.down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, inserted: true, trail: [] }; return; }
            if (b.state !== "rest" || busy) return;
            e.preventDefault();
            el.setPointerCapture(e.pointerId);
            if (M.strip) {
                /* In the row, a sideways swipe slides the row; an upward pull lifts the cartridge */
                b.pending = { x: e.clientX, y: e.clientY, t: performance.now(), pid: e.pointerId, pt: toScene(e) };
                return;
            }
            startDrag(b, e, e.pointerId);
        });
        on(el, "pointermove", (e) => {
            if (stripDrag && stripDrag.el === el) { moveStrip(e); return; }
            if (b.pending) {
                const dx = e.clientX - b.pending.x, dy = e.clientY - b.pending.y;
                if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { const p0 = b.pending; b.pending = null; startStrip(p0.x, p0.pid, el); moveStrip(e); return; }
                if (Math.abs(dy) > 8) { const pid = b.pending.pid; b.pending = null; startDrag(b, e, pid); }
                return;
            }
            if (b.state !== "drag" || !b.down) return;
            b.ptr = toScene(e);
            b.down.moved = Math.max(b.down.moved, Math.hypot(e.clientX - b.down.x, e.clientY - b.down.y));
            b.down.trail.push({ x: b.ptr.x, y: b.ptr.y, t: performance.now() });
            if (b.down.trail.length > 8) b.down.trail.shift();
        });
        const release = (e: PointerEvent, cancelled: boolean) => {
            if (stripDrag && stripDrag.el === el) { endStrip(); return; }
            if (b.pending) {
                b.pending = null;
                try { el.releasePointerCapture(e.pointerId); } catch { /* gone */ }
                if (!cancelled) void insert(b);
                return;
            }
            if (b.down && b.down.inserted) {
                const quick = Math.hypot(e.clientX - b.down.x, e.clientY - b.down.y) < 8;
                b.down = null;
                if (quick && !cancelled) doEject();
                return;
            }
            if (b.state !== "drag" || !b.down) return;
            b.pid = null;
            el.classList.remove("is-dragging"); slot.removeAttribute("data-ready");
            const tap = b.down.moved < 6 && performance.now() - b.down.t < 350;
            const wasRail = b.rail;
            const hand = handSpeed(b.down.trail);
            b.grab = null; b.ptr = null; b.down = null;
            if (cancelled) { b.state = "rest"; b.rail = false; setUnder(b, false); return; }
            if (wasRail) {
                if (b.y - entryY() > hgt() * 0.08) {
                    busy = true; b.state = "busy"; b.rail = false;
                    void tween(b, { x: slotX(), y: entryY() + latchAt(), a: upright(b.a) }, 140, easeIn).then(() => latch(b));
                } else {
                    b.state = "rest"; b.rail = false; setUnder(b, false); b.vy = -220; b.awake = true;
                }
                return;
            }
            b.state = "rest";
            /* Let go over the console it goes in, unless the hand was throwing it somewhere */
            if (tap || (overDevice(b) && Math.hypot(hand.x, hand.y) < 500)) { void insert(b); return; }
            b.wasHigh = true;
            if (!M.strip) {
                /* It leaves the hand at the hand's speed, and keeps the swing it had.
                   The harder the flick, the higher and the longer it flies. */
                b.vx = hand.x * 0.8 + b.vx * 0.2; b.vy = hand.y * 0.8 + b.vy * 0.2;
                const sp = Math.hypot(b.vx, b.vy);
                if (sp > MAX_V) { b.vx *= MAX_V / sp; b.vy *= MAX_V / sp; }
                b.va = Math.max(-16, Math.min(16, b.va));
                b.lv = Math.min(2.4, Math.hypot(b.vx, b.vy) / 1000);
                b.thrown = Math.hypot(b.vx, b.vy) > 260;
                if (b.thrown) b.hover = false;
            }
        };
        on(el, "pointerup", (e) => release(e, false));
        on(el, "pointercancel", (e) => release(e, true));
        on(el, "pointerenter", (e) => { if (e.pointerType !== "mouse" || b.state !== "rest") return; b.hover = true; b.awake = true; showTip(b); });
        on(el, "pointerleave", () => { b.hover = false; b.awake = true; if (tipFor === b) hideTip(); });
        on(el, "focus", () => { if (b.state !== "rest") return; if (M.strip) reveal(b); else showTip(b); });
        on(el, "blur", () => { if (tipFor === b) hideTip(); });
        on(el, "click", (e) => {
            if (e.detail !== 0) return;
            o.onTouched();
            if (b.state === "rest") void insert(b);
            else if (b.state === "inserted") doEject();
        });
    });

    /* ── Physics ── */
    const K = 950, DAMP = 2 * Math.sqrt(950) * 0.85;
    const LIGHT = { x: 0.55, y: 0.83 };
    /* On the table: lift falls under gravity, a landed cartridge slides against
       friction, they knock into each other, the edges and the console as rigid
       boxes, with spin and a little bounce. Units are scene pixels and seconds. */
    const G = 20, MU = 1900, SPIN_MU = 10, BOUNCE = 0.32, GRIP = 0.35, MAX_V = 3400;

    /** How fast the hand was moving when it let go, from its last tenth of a second */
    function handSpeed(trail: { x: number; y: number; t: number }[]) {
        const now = performance.now(), end = trail[trail.length - 1];
        if (!end || now - end.t > 70) return { x: 0, y: 0 };
        let start = end;
        for (let i = trail.length - 1; i >= 0; i--) { if (end.t - trail[i].t > 100) break; start = trail[i]; }
        const dt = (end.t - start.t) / 1000;
        return dt < 0.012 ? { x: 0, y: 0 } : { x: (end.x - start.x) / dt, y: (end.y - start.y) / dt };
    }
    type Box = { x: number; y: number; a: number; hw: number; hh: number };
    const boxOf = (b: Body): Box => ({ x: b.x, y: b.y, a: b.a, hw: wid() / 2, hh: hgt() / 2 });
    const deviceBox = (): Box => {
        const top = slotY(), bottom = M.dev.y + (SLIDE + BASE_H) * M.ds;
        return { x: M.dev.x + devW() / 2, y: (top + bottom) / 2, a: 0, hw: devW() / 2, hh: (bottom - top) / 2 };
    };
    function corners(B: Box) {
        const c = Math.cos(B.a), s = Math.sin(B.a);
        return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([i, j]) => ({ x: B.x + c * B.hw * i - s * B.hh * j, y: B.y + s * B.hw * i + c * B.hh * j }));
    }
    const inside = (p: { x: number; y: number }, B: Box) => {
        const c = Math.cos(-B.a), s = Math.sin(-B.a), dx = p.x - B.x, dy = p.y - B.y;
        return Math.abs(dx * c - dy * s) <= B.hw + 0.5 && Math.abs(dx * s + dy * c) <= B.hh + 0.5;
    };
    /** Separating axis test for two boxes: the push out of A into B, and where they touch */
    function overlap(A: Box, B: Box) {
        const axes = [A.a, A.a + Math.PI / 2, B.a, B.a + Math.PI / 2].map((t) => ({ x: Math.cos(t), y: Math.sin(t) }));
        const rad = (X: Box, n: { x: number; y: number }) => X.hw * Math.abs(n.x * Math.cos(X.a) + n.y * Math.sin(X.a)) + X.hh * Math.abs(-n.x * Math.sin(X.a) + n.y * Math.cos(X.a));
        const dx = B.x - A.x, dy = B.y - A.y;
        let depth = Infinity, nx = 0, ny = 0;
        for (const n of axes) {
            const d = dx * n.x + dy * n.y, o = rad(A, n) + rad(B, n) - Math.abs(d);
            if (o <= 0) return null;
            if (o < depth) { depth = o; nx = d < 0 ? -n.x : n.x; ny = d < 0 ? -n.y : n.y; }
        }
        const pts = [...corners(B).filter((p) => inside(p, A)), ...corners(A).filter((p) => inside(p, B))];
        const px = pts.length ? pts.reduce((t, p) => t + p.x, 0) / pts.length : (A.x + B.x) / 2;
        const py = pts.length ? pts.reduce((t, p) => t + p.y, 0) / pts.length : (A.y + B.y) / 2;
        return { nx, ny, depth, px, py };
    }
    /** An impulse at the contact, with friction along it. A null body is the immovable world. */
    function contact(a: Body | null, b: Body | null, nx: number, ny: number, px: number, py: number, depth: number) {
        const iI = 12 / (wid() * wid() + hgt() * hgt());
        const ma = a ? 1 : 0, mb = b ? 1 : 0, ia = a ? iI : 0, ib = b ? iI : 0;
        const rax = a ? px - a.x : 0, ray = a ? py - a.y : 0, rbx = b ? px - b.x : 0, rby = b ? py - b.y : 0;
        /* Overlap is undone a few pixels a frame, so a cartridge dropped on another slides off it */
        const corr = Math.min(4, Math.max(0, depth - 0.2) * 0.9) / (ma + mb);
        if (a) { a.x -= nx * corr * ma; a.y -= ny * corr * ma; }
        if (b) { b.x += nx * corr * mb; b.y += ny * corr * mb; }
        const rvx = (b ? b.vx - b.va * rby : 0) - (a ? a.vx - a.va * ray : 0);
        const rvy = (b ? b.vy + b.va * rbx : 0) - (a ? a.vy + a.va * rax : 0);
        const vn = rvx * nx + rvy * ny;
        if (vn >= 0) return 0;
        const push = (jx: number, jy: number) => {
            if (a) { a.vx -= jx * ma; a.vy -= jy * ma; a.va -= (rax * jy - ray * jx) * ia; }
            if (b) { b.vx += jx * mb; b.vy += jy * mb; b.va += (rbx * jy - rby * jx) * ib; }
        };
        const ran = rax * ny - ray * nx, rbn = rbx * ny - rby * nx;
        const j = (-(1 + BOUNCE) * vn) / (ma + mb + ran * ran * ia + rbn * rbn * ib);
        push(j * nx, j * ny);
        let tx = rvx - vn * nx, ty = rvy - vn * ny;
        const tl = Math.hypot(tx, ty);
        if (tl > 1e-6) {
            tx /= tl; ty /= tl;
            const rat = rax * ty - ray * tx, rbt = rbx * ty - rby * tx;
            const jt = Math.max(-GRIP * j, Math.min(GRIP * j, -(rvx * tx + rvy * ty) / (ma + mb + rat * rat * ia + rbt * rbt * ib)));
            push(jt * tx, jt * ty);
        }
        return j;
    }
    function knock(j: number) {
        const now = performance.now();
        if (j > 70 && now - lastKnock > 60) { lastKnock = now; sound.knock(j); }
    }
    const onTable = (b: Body) => b.state === "rest" && !b.anim && b.lift < 0.3;
    /** The edges of the scene and the body of the console */
    function confine(b: Body) {
        const B = boxOf(b);
        let worst: { nx: number; ny: number; d: number; p: { x: number; y: number } } | null = null;
        for (const p of corners(B)) {
            const cands = [{ nx: 1, ny: 0, d: -p.x }, { nx: -1, ny: 0, d: p.x - M.W }, { nx: 0, ny: 1, d: -p.y }, { nx: 0, ny: -1, d: p.y - M.H }];
            for (const c of cands) if (c.d > 0 && (!worst || c.d > worst.d)) worst = { ...c, p };
        }
        if (worst) knock(contact(null, b, worst.nx, worst.ny, worst.p.x, worst.p.y, worst.d));
        if (b.lift < 0.3) {
            const hit = overlap(deviceBox(), B);
            if (hit) knock(contact(null, b, hit.nx, hit.ny, hit.px, hit.py, hit.depth));
        }
    }
    /** Cartridges lying on the table knock into each other */
    function collide() {
        if (M.strip) return;
        for (let i = 0; i < bodies.length; i++) {
            const A = bodies[i];
            if (!onTable(A)) continue;
            for (let k = i + 1; k < bodies.length; k++) {
                const B = bodies[k];
                if (!onTable(B) || (!A.awake && !B.awake)) continue;
                const hit = overlap(boxOf(A), boxOf(B));
                if (!hit) continue;
                knock(contact(A, B, hit.nx, hit.ny, hit.px, hit.py, hit.depth));
                A.awake = B.awake = true;
            }
        }
    }
    function step(b: Body, dt: number): boolean {
        if (b.anim) {
            const A = b.anim; A.t += dt * 1000;
            const t = Math.min(1, A.t / A.dur), e = A.ease(t);
            b.x = A.from.x + (A.to.x - A.from.x) * e;
            b.y = A.from.y + (A.to.y - A.from.y) * e - (A.to.arc ? Math.sin(t * Math.PI) * A.to.arc : 0);
            b.a = A.from.a + (A.to.a - A.from.a) * e;
            b.lift = A.from.lift + (A.to.lift - A.from.lift) * e; b.lv = 0;
            b.vx = b.vy = b.va = 0;
            b.tx += -b.tx * Math.min(1, dt * 14); b.ty += -b.ty * Math.min(1, dt * 14);
            if (t >= 1) { const r = A.resolve; b.anim = null; r(); }
            return true;
        }
        if (b.state === "inserted") {
            if (Math.abs(b.x - slotX()) > 0.1 || Math.abs(b.y - (entryY() + seat())) > 0.1) place(b);
            return false;
        }
        if (b.state === "busy") return true;
        const dragging = b.state === "drag" && b.ptr !== null && b.grab !== null;
        const I = (wid() * wid() + hgt() * hgt()) / 12;
        const sub = 3, h = dt / sub;
        const hm = home(b);
        if (dragging && !b.rail && inCapture(b)) { b.rail = true; sound.slide(); }
        for (let s = 0; s < sub; s++) {
            if (dragging && b.rail && b.ptr && b.grab) {
                /* Inside the guides: sideways and twist are locked, pushing in meets friction */
                const up = upright(b.a);
                const ry = b.grab.x * Math.sin(b.a) + b.grab.y * Math.cos(b.a);
                const en = entryY();
                let ty = b.ptr.y - ry;
                if (ty > en) ty = en + (ty - en) * 0.55;
                ty = Math.min(ty, en + latchAt() + 1);
                const kk = 1100, cc = 2 * Math.sqrt(1100);
                b.vx += ((slotX() - b.x) * kk - b.vx * cc) * h;
                b.vy += ((ty - b.y) * kk - b.vy * cc) * h;
                b.va += ((up - b.a) * 900 - b.va * 2 * Math.sqrt(900)) * h;
            } else if (dragging && b.ptr && b.grab) {
                /* A spring pulls on the exact point you grabbed, so the cartridge swings and trails */
                const cs = Math.cos(b.a), sn = Math.sin(b.a);
                const rx = b.grab.x * cs - b.grab.y * sn, ry = b.grab.x * sn + b.grab.y * cs;
                const vgx = b.vx - b.va * ry, vgy = b.vy + b.va * rx;
                const fx = K * (b.ptr.x - (b.x + rx)) - DAMP * vgx, fy = K * (b.ptr.y - (b.y + ry)) - DAMP * vgy;
                b.vx += fx * h; b.vy += fy * h;
                b.va += ((rx * fy - ry * fx) / I) * h;
                if (open && !current && nearSlot(b)) {
                    b.va += (upright(b.a) - b.a) * 160 * h;
                    b.vx += (slotX() - b.x) * 40 * h;
                }
                b.vx *= Math.exp(-1.2 * h); b.vy *= Math.exp(-1.2 * h); b.va *= Math.exp(-5 * h);
            } else if (M.strip) {
                /* Back to its place in the row, floating, then down */
                const k2 = 90, c2 = 2 * Math.sqrt(90) * 0.78;
                b.vx += ((hm.x - b.x) * k2 - b.vx * c2) * h;
                b.vy += ((hm.y - b.y) * k2 - b.vy * c2) * h;
                b.va += ((hm.a - b.a) * 70 - b.va * 2 * Math.sqrt(70)) * h;
            } else if (b.lift < 0.06 || (b.hover && b.lift < 0.3)) {
                /* Lying on the table: sliding friction slows it and its spin to a stop */
                const sp = Math.hypot(b.vx, b.vy);
                if (sp > 0) { const dec = Math.min(sp, MU * h); b.vx -= (b.vx / sp) * dec; b.vy -= (b.vy / sp) * dec; }
                b.va -= Math.sign(b.va) * Math.min(Math.abs(b.va), SPIN_MU * h);
                b.vx *= Math.exp(-0.9 * h); b.vy *= Math.exp(-0.9 * h); b.va *= Math.exp(-1.6 * h);
            } else {
                /* In the air: only the air slows it */
                b.vx *= Math.exp(-0.25 * h); b.vy *= Math.exp(-0.25 * h); b.va *= Math.exp(-0.3 * h);
            }
            b.x += b.vx * h; b.y += b.vy * h; b.a += b.va * h;
        }
        const free = !dragging && !M.strip;
        if (free) {
            const sp = Math.hypot(b.vx, b.vy);
            if (b.hover && b.lift < 0.3 && sp < 60) {
                b.lv += ((0.22 - b.lift) * 240 - b.lv * 22) * dt; b.lift += b.lv * dt;
            } else {
                /* Height under gravity: it falls, lands, and a hard landing bounces once */
                b.lv -= G * dt; b.lift += b.lv * dt;
                if (b.lift <= 0) {
                    const fall = -b.lv;
                    b.lift = 0;
                    if (fall > 0.5) {
                        sound.land();
                        /* A cartridge thrown onto the console goes in */
                        if (b.thrown && overDevice(b) && open && !busy) { b.thrown = false; b.lv = 0; void insert(b); return true; }
                    }
                    b.lv = fall > 1.4 ? fall * 0.24 : 0;
                    if (b.lv === 0) b.thrown = false;
                }
            }
            confine(b);
            if (b.lift === 0 && sp < 3 && Math.abs(b.va) < 0.03) { b.vx = b.vy = b.va = 0; }
        }
        /* In the row, a cartridge sitting in its place rides the row exactly */
        if (!dragging && M.strip && stripMoving && Math.abs(b.y - hm.y) < 3 && Math.abs(b.x - hm.x) < 40) { b.x = hm.x; b.vx = 0; }
        if (dragging && b.rail && b.ptr) {
            const en = entryY();
            if (b.y > en - 1) { b.x = slotX(); b.a = upright(b.a); b.va = 0; b.vx = 0; setUnder(b, true); }
            else setUnder(b, false);
            if (b.y < en - hgt() * 0.8 || Math.abs(b.ptr.x - slotX()) > wid() * 0.9) { b.rail = false; setUnder(b, false); }
            else if (b.y - en >= latchAt() - 0.5) { busy = true; void latch(b); return true; }
        }
        if (dragging) {
            const near = nearSlot(b);
            if (near && current && !busy && open) doEject();
            if (open && !current && near) slot.setAttribute("data-ready", ""); else slot.removeAttribute("data-ready");
            b.x = Math.max(0, Math.min(M.W, b.x)); b.y = Math.max(0, Math.min(M.H, b.y));
        }
        const away = free ? 0 : Math.hypot(b.x - hm.x, b.y - hm.y);
        const sliding = !!M.strip && Math.abs(b.y - hm.y) < 6;
        const target = dragging ? (b.rail ? 0.12 : 1) : away > 14 && !sliding ? 0.55 : b.hover ? 0.22 : 0;
        if (!free) {
            b.lv += ((target - b.lift) * 240 - b.lv * 22) * dt;
            b.lift += b.lv * dt;
            if (b.lift > 0.45) b.wasHigh = true;
            if (!dragging && b.wasHigh && b.lift < 0.04) { b.wasHigh = false; sound.land(); }
        }
        const cs = Math.cos(-b.a), sn = Math.sin(-b.a);
        const lvx = b.vx * cs - b.vy * sn, lvy = b.vx * sn + b.vy * cs;
        const lf = reduced || b.rail ? 0 : Math.min(1, b.lift * 1.4);
        b.tx += (Math.max(-16, Math.min(16, -lvy * 0.014)) * lf - b.tx) * Math.min(1, dt * 10);
        b.ty += (Math.max(-16, Math.min(16, lvx * 0.014)) * lf - b.ty) * Math.min(1, dt * 10);
        const settledLift = free ? b.lift < 0.001 && !b.hover || (b.hover && Math.abs(0.22 - b.lift) < 0.003) : Math.abs(target - b.lift) < 0.003;
        return dragging || Math.hypot(b.vx, b.vy) > 1.5 || Math.abs(b.va) > 0.01 || Math.abs(b.lv) > 0.004 || !settledLift || Math.abs(b.tx) > 0.05 || Math.abs(b.ty) > 0.05 || away > 0.5;
    }
    function render(b: Body) {
        const scale = S * (1 + 0.075 * Math.max(0, b.lift));
        const st = b.el.style;
        st.transform = `translate3d(${(b.x - CW / 2).toFixed(2)}px,${(b.y - CH / 2).toFixed(2)}px,0) rotate(${b.a.toFixed(4)}rad) rotateX(${b.tx.toFixed(2)}deg) rotateY(${b.ty.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        const L = Math.max(0, b.lift), d = 3 + 30 * L, cd = 1 + 5 * L;
        const cs = Math.cos(-b.a), sn = Math.sin(-b.a);
        const lx = ((LIGHT.x * cs - LIGHT.y * sn) / scale) * S, ly = ((LIGHT.x * sn + LIGHT.y * cs) / scale) * S;
        st.setProperty("--sx", `${(lx * d).toFixed(1)}px`);
        st.setProperty("--sy", `${(ly * d).toFixed(1)}px`);
        st.setProperty("--sb", `${(7 + 38 * L).toFixed(1)}px`);
        st.setProperty("--so", (0.6 - 0.28 * L).toFixed(3));
        st.setProperty("--cx", `${(lx * cd).toFixed(1)}px`);
        st.setProperty("--cy", `${(ly * cd).toFixed(1)}px`);
        st.setProperty("--cb", `${(2 + 9 * L).toFixed(1)}px`);
        st.setProperty("--co", (0.55 - 0.4 * L).toFixed(3));
        st.setProperty("--sheen", `${(62 - b.ty * 2.6 + b.tx * 1.2 - L * 10).toFixed(1)}%`);
    }
    function frame(now: number) {
        raf = 0;
        if (dead) return;
        const dt = Math.min(1 / 30, Math.max(0.001, (now - last) / 1000)); last = now;
        stripMoving = !!stripDrag || Math.abs(stripV) > 1 || stripGoal !== null;
        if (M.strip && !stripDrag) {
            /* Momentum, then a soft spring back if the row was pulled past either end */
            const max = stripMax();
            if (stripGoal !== null) {
                stripOff += (stripGoal - stripOff) * Math.min(1, dt * 9);
                if (Math.abs(stripGoal - stripOff) < 0.5) { stripOff = stripGoal; stripGoal = null; }
                bodies.forEach((b) => { if (b.state === "rest") b.awake = true; });
            }
            if (Math.abs(stripV) > 1) { stripOff += stripV * dt; stripV *= Math.exp(-3.5 * dt); }
            if (stripOff < 0) { stripOff += -stripOff * Math.min(1, dt * 10); stripV *= 0.6; }
            else if (stripOff > max) { stripOff += (max - stripOff) * Math.min(1, dt * 10); stripV *= 0.6; }
            if (Math.abs(stripV) > 1 || stripOff < -0.5 || stripOff > max + 0.5) bodies.forEach((b) => { if (b.state === "rest") b.awake = true; });
        }
        collide();
        let moving = false;
        for (const b of bodies) {
            if (!b.awake && !b.anim && b.state !== "drag") continue;
            b.awake = step(b, dt);
            render(b);
            if (b.awake || b.anim || b.state === "drag" || b.state === "busy") moving = true;
        }
        const lipped = bodies.some((b) => b.under && b.y - entryY() > -4);
        if (lipped) device.setAttribute("data-lipped", ""); else device.removeAttribute("data-lipped");
        placeTip();
        const max = stripMax();
        if (moving || stripDrag || stripGoal !== null || Math.abs(stripV) > 1 || (M.strip && (stripOff < -0.5 || stripOff > max + 0.5))) raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => { layout(); });
    ro.observe(viewport);
    layout();
    bodies.forEach(render);
    kick();

    return {
        /* The device slides open; the slot is only live once it has. */
        open(instant: boolean) {
            device.setAttribute("data-open", "");
            if (instant) { open = true; return; }
            later(() => { open = true; }, 900);
        },
        insertFirst(instant: boolean) {
            const b = bodies[0];
            if (!b || current) return;
            if (instant) { current = b; place(b); powerOn(b, true); return; }
            void insert(b);
        },
        eject: doEject,
        destroy() {
            dead = true; cancelAnimationFrame(raf); ro.disconnect();
            timers.forEach((t) => window.clearTimeout(t));
            listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
        },
    };
}

/* Facts about the browser that never change while the page is open. The server
   renders the fallback; the client reads the real value on hydration. */
const never = () => () => {};
const useClientFact = <T,>(read: () => T, fallback: T) => useSyncExternalStore(never, read, () => fallback);

/* ── The component ── */
export function ProjectConsole() {
    const { language, t } = useLanguage();
    const viewportRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const deviceRef = useRef<HTMLDivElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);
    const tipRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const cartRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
    const touched = useRef(false);

    const [loaded, setLoaded] = useState<string | null>(null);
    const [power, setPower] = useState<Power>("off");
    const [ink, setInk] = useState<Ink>("idle");
    const [tipId, setTipId] = useState<string | null>(null);
    const [mode, setMode] = useState<ModeName>("wide");
    const [liveFor, setLiveFor] = useState<string | null>(null);
    /* Live sites only where a pointer can hover them; on touch the screenshot stays */
    const canFrame = useClientFact(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches, false);
    const origin = useClientFact(() => window.location.origin, "");
    const inkTextRef = useRef<HTMLParagraphElement>(null);

    /* This page is one screen. The document must not scroll underneath it. */
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("pc-noscroll");
        return () => root.classList.remove("pc-noscroll");
    }, []);

    useEffect(() => {
        const viewport = viewportRef.current, scene = sceneRef.current, device = deviceRef.current, slot = slotRef.current;
        const tip = tipRef.current, strip = stripRef.current, head = headRef.current;
        const carts = cartRefs.current.filter((c): c is HTMLButtonElement => c !== null);
        if (!viewport || !scene || !device || !slot || !tip || !strip || !head || carts.length !== projects.length) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const engine = createEngine({
            viewport, scene, device, slot, tip, strip, head, carts, ids: projects.map((p) => p.id), reduced,
            sound: createSound(() => true),
            onLoad: setLoaded, onPower: setPower, onInk: setInk, onTip: setTipId, onMode: setMode,
            onTouched: () => { touched.current = true; },
        });
        engineRef.current = engine;
        /* Entering the page: the screen slides up to reveal the ink panel, then the first cartridge goes in. */
        const timers: number[] = [];
        if (reduced) {
            engine.open(true);
            engine.insertFirst(true);
        } else {
            timers.push(window.setTimeout(() => engine.open(false), 350));
            timers.push(window.setTimeout(() => { if (!touched.current) engine.insertFirst(false); }, 1450));
        }
        return () => { timers.forEach((x) => window.clearTimeout(x)); engine.destroy(); engineRef.current = null; };
    }, []);

    /* The live site loads only once the screen is on, and only one at a time. */
    useEffect(() => {
        if (power !== "on" || !loaded) return;
        const id = window.setTimeout(() => setLiveFor(loaded), 300);
        return () => window.clearTimeout(id);
    }, [power, loaded]);
    const live = power === "on" && !!loaded && liveFor === loaded;

    /* The description is five lines at most. The briefs are written to fit;
       anything longer steps the type down a little, and only past that is it
       cut at the fifth line. */
    useEffect(() => {
        const el = inkTextRef.current;
        const copy = el?.firstElementChild as HTMLElement | null | undefined;
        if (!el || !copy) return;
        const fit = () => {
            el.style.fontSize = "";
            el.removeAttribute("data-clamp");
            const base = parseFloat(getComputedStyle(el).fontSize);
            const over = () => {
                const cs = getComputedStyle(el);
                const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
                return copy.offsetHeight > lh * 5 + 2 || copy.offsetHeight > el.clientHeight + 1;
            };
            let size = base;
            while (over() && size > base * 0.8) { size -= 0.5; el.style.fontSize = `${size}px`; }
            el.toggleAttribute("data-clamp", over());
        };
        fit();
        let alive = true;
        void document.fonts?.ready.then(() => { if (alive) fit(); });
        return () => { alive = false; };
    }, [loaded, language, mode]);

    const current = projects.find((p) => p.id === loaded) ?? null;
    const tipProject = projects.find((p) => p.id === tipId) ?? null;
    const site = current ? current.previewUrl ?? current.links?.[0]?.href : undefined;
    const href = current?.links?.[0]?.href;
    /* Two of the sites only let named origins frame them. Anywhere else the
       browser would block the frame, so the screen keeps the screenshot. */
    const showFrame = live && canFrame && !!site && !!current && !!origin && canFrameFrom(current, origin);

    return (
        <div className={`pc ${marker.variable} ${literata.variable}`} data-mode={mode}>
            <div className="pc-viewport" ref={viewportRef}>
                <div className="pc-scene" ref={sceneRef}>
                    <div className="pc-head" ref={headRef}>
                        <h1>{t.projects.consoleTitle}</h1>
                        <p>{t.projects.consoleHint}</p>
                    </div>

                    <div className="pc-strip" ref={stripRef} aria-hidden="true" />

                    <div
                        className="pc-device"
                        ref={deviceRef}
                        data-power={power}
                        style={{ "--accent": current?.accent ?? "#8a8c94" } as CSSProperties}
                    >
                        <div className="pc-base">
                            <span className="pc-rail l" aria-hidden="true" />
                            <span className="pc-rail r" aria-hidden="true" />
                            <div className="pc-eink" data-ink={ink}>
                                {current && (
                                    <div className="pc-ink-page">
                                        <div className="pc-ink-top">
                                            <span className="pc-ink-logo">
                                                <ProjectLogo project={current} />
                                            </span>
                                            <h2 className="pc-ink-name" data-long={current.name.length > 12 ? "" : undefined}>{current.name}</h2>
                                        </div>
                                        <p className="pc-ink-text" ref={inkTextRef}>
                                            <span>{(current.brief ?? current.blurb)[language]}</span>
                                        </p>
                                        {href && (
                                            <a className="pc-ink-btn" href={href} target="_blank" rel="noopener noreferrer">
                                                {t.projects.consoleOpen} <span aria-hidden="true">↗</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div className="pc-ink-idle">{t.projects.consoleEmpty}</div>
                                <div className="pc-ink-flash" />
                            </div>
                        </div>

                        <div className="pc-slider">
                            <div className="pc-lip" />
                            <div className="pc-slot" ref={slotRef} />
                            <button type="button" className="pc-ejectbtn" aria-label={t.projects.consoleEject} onClick={() => engineRef.current?.eject()} />
                            <div className="pc-lcd">
                                <div className="pc-boot">
                                    {current && <ProjectLogo project={current} />}
                                </div>
                                <div className="pc-view">
                                    <div className="pc-host">{site ? site.replace(/^https?:\/\//, "").replace(/\/?\?.*$/, "").replace(/\/$/, "") : ""}</div>
                                    <div className="pc-shot">
                                        {current && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={`/projects/previews/${current.id}.jpg`} alt={current.name} />
                                        )}
                                        {showFrame && site && (
                                            <iframe
                                                key={site}
                                                className="pc-frame"
                                                src={site}
                                                title={`${current?.name} live`}
                                                sandbox="allow-scripts allow-same-origin"
                                                referrerPolicy="no-referrer"
                                                loading="lazy"
                                                tabIndex={-1}
                                                aria-hidden="true"
                                                onLoad={(e) => e.currentTarget.setAttribute("data-ready", "")}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="pc-glass" />
                            </div>
                            <span className="pc-led" />
                        </div>
                    </div>

                    {projects.map((p, i) => (
                        <button
                            key={p.id}
                            ref={(el) => { cartRefs.current[i] = el; }}
                            type="button"
                            className="pc-cart"
                            aria-label={t.projects.consoleInsert.replace("{name}", p.name)}
                            style={{ "--accent": p.accent, "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
                        >
                            <CartridgeFace p={p} i={i} />
                        </button>
                    ))}

                    <div className="pc-tip" ref={tipRef} aria-hidden="true">
                        <b>{tipProject?.name}</b>
                        <span>{tipProject?.type[language]}</span>
                    </div>
                </div>
            </div>

            <p className="sr-only">{t.projects.consoleKeys}</p>
            <p className="sr-only" aria-live="polite">
                {current ? t.projects.consoleLoaded.replace("{name}", current.name) : ""}
            </p>
        </div>
    );
}
