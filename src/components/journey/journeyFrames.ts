// Procedural placeholder renderer for the /journey scroll film.
//
// This draws the near black scene tint and the one continuous champagne gold thread
// directly on the canvas, driven by global scroll progress (0..1). It exists so the
// scroll engine is real and reviewable before the hyperrealistic Higgsfield frames are
// produced. When the real AVIF frame sequence lands, replace the body of drawFrame with
// ctx.drawImage(bitmap, ...) keyed to Math.round(progress * (FRAME_COUNT - 1)); the engine,
// preloader and overlays do not change.

import type { JourneyChapter } from "@/data/journey";

const GOLD = "#D4AF37";
const BASE = "#050505";

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
    ];
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function smoothstep(t: number): number {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
}

function mixHex(a: string, b: string, t: number): string {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return `rgb(${Math.round(lerp(ar, br, t))}, ${Math.round(lerp(ag, bg, t))}, ${Math.round(
        lerp(ab, bb, t)
    )})`;
}

interface FrameState {
    chapterIndex: number; // 0 based
    local: number; // 0..1 within the chapter
}

export function frameState(progress: number, count: number): FrameState {
    const f = Math.max(0, Math.min(0.999999, progress)) * count;
    const idx = Math.min(count - 1, Math.floor(f));
    return { chapterIndex: idx, local: f - idx };
}

// Draw a real frame (image bitmap) covering the canvas, object-fit cover.
export function drawCover(
    ctx: CanvasRenderingContext2D,
    bmp: CanvasImageSource,
    w: number,
    h: number,
    iw: number,
    ih: number
): void {
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.fillStyle = BASE;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, dx, dy, dw, dh);
}

/**
 * Paint one frame of the placeholder film.
 * @param ctx 2d context already scaled to devicePixelRatio (draw in CSS pixels)
 * @param w   css width
 * @param h   css height
 * @param progress global scroll progress 0..1
 * @param chapters the chapter list (for per scene tint)
 */
export function drawFrame(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    progress: number,
    chapters: JourneyChapter[]
): void {
    const n = chapters.length;
    const { chapterIndex, local } = frameState(progress, n);
    const next = Math.min(n - 1, chapterIndex + 1);
    const blend = smoothstep((local - 0.7) / 0.3); // cross fade tint near the chapter boundary
    const tint = mixHex(chapters[chapterIndex].tint, chapters[next].tint, blend);

    // Base near black
    ctx.fillStyle = BASE;
    ctx.fillRect(0, 0, w, h);

    // Atmospheric scene tint, drifting slightly to suggest a slow camera move
    const driftX = w * (0.5 + 0.08 * Math.sin(progress * Math.PI * 2));
    const driftY = h * (0.42 + 0.05 * Math.cos(progress * Math.PI * 2));
    const glow = ctx.createRadialGradient(driftX, driftY, 0, driftX, driftY, Math.max(w, h) * 0.85);
    glow.addColorStop(0, withAlpha(tint, 0.5));
    glow.addColorStop(0.45, withAlpha(tint, 0.22));
    glow.addColorStop(1, withAlpha(tint, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Chapter four: a faint gold scatter that is both tissue and star field
    if (chapterIndex === 3) {
        drawScatter(ctx, w, h, local);
    }

    // The one continuous gold thread
    drawThread(ctx, w, h, progress);

    // Vignette to keep the editorial near black frame
    const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
}

function withAlpha(rgb: string, a: number): string {
    // rgb() string to rgba()
    return rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
}

// A vertical meandering filament that scrolls with progress so it reads as one travelling thread.
function drawThread(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number): void {
    const cx = w * 0.5;
    const amp = Math.min(w * 0.18, 180);
    const phase = progress * Math.PI * 6; // the thread travels as you scroll
    const freq = 2.1;

    const pathX = (y: number) => cx + amp * Math.sin((y / h) * Math.PI * freq + phase);

    // Soft wide glow pass
    ctx.save();
    ctx.beginPath();
    for (let y = -20; y <= h + 20; y += 6) {
        const x = pathX(y);
        if (y === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = withAlpha("rgb(212,175,55)", 0.18);
    ctx.lineWidth = 9;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 28;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // Thin bright core
    ctx.save();
    ctx.beginPath();
    for (let y = -20; y <= h + 20; y += 4) {
        const x = pathX(y);
        if (y === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 10;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // A brighter travelling node near the optical centre
    const ny = h * 0.5;
    const nx = pathX(ny);
    ctx.save();
    const node = ctx.createRadialGradient(nx, ny, 0, nx, ny, 26);
    node.addColorStop(0, "rgba(255,240,200,0.95)");
    node.addColorStop(0.4, withAlpha("rgb(212,175,55)", 0.6));
    node.addColorStop(1, withAlpha("rgb(212,175,55)", 0));
    ctx.fillStyle = node;
    ctx.beginPath();
    ctx.arc(nx, ny, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Deterministic pseudo random so the scatter does not flicker between frames.
function rand(seed: number): number {
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
}

function drawScatter(ctx: CanvasRenderingContext2D, w: number, h: number, local: number): void {
    const count = 140;
    const appear = smoothstep(local); // fade the field in across the chapter
    ctx.save();
    for (let i = 0; i < count; i++) {
        const rx = rand(i + 1);
        const ry = rand(i + 99);
        // cluster density toward the centre, reading as tissue and as a galaxy core
        const x = w * (0.5 + (rx - 0.5) * (0.5 + ry * 0.5));
        const y = h * ry;
        const r = 0.6 + rand(i + 7) * 1.8;
        const a = (0.15 + rand(i + 13) * 0.5) * appear;
        ctx.beginPath();
        ctx.fillStyle = withAlpha("rgb(212,175,55)", a);
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
