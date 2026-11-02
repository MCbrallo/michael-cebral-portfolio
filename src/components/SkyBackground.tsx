"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The real sky, drifting — WebGL, no library.
 * The same sky as Laika's Company: the Milky Way from NASA SVS Deep Star Maps
 * (ESA Gaia), 5,044 real stars with their real colours, and the slow nebula
 * laid over them. Here it is regraded to one of the palettes below and set in
 * motion: the camera travels along the galactic plane, so the band of the
 * Milky Way never leaves the frame, while it slowly leans and rises.
 *
 * Nothing follows the pointer. The render loop pauses when the tab is hidden,
 * scales quality by FPS, survives a lost WebGL context, and holds still under
 * prefers-reduced-motion.
 */

type Tint = { band: number[]; neb0: number[]; neb1: number[]; hi: number[] };

// The Milky Way's light is taken to grey and recoloured with `band`; the nebula
// runs from neb0 to neb1 and flares towards hi. Change TINT to try another.
const TINTS = {
    azul: { band: [0.60, 0.86, 1.32], neb0: [0.12, 0.20, 0.62], neb1: [0.30, 0.55, 0.95], hi: [0.80, 0.90, 1.00] },
    violeta: { band: [0.95, 0.80, 1.15], neb0: [0.40, 0.10, 0.58], neb1: [0.72, 0.40, 0.92], hi: [0.95, 0.85, 1.00] },
    aurora: { band: [0.75, 1.05, 0.95], neb0: [0.05, 0.36, 0.32], neb1: [0.25, 0.72, 0.56], hi: [0.80, 1.00, 0.92] },
} satisfies Record<string, Tint>;
const TINT: Tint = TINTS.azul;

// Radians per second along the galactic plane: a full turn in about 17 minutes.
const DRIFT = 0.006;
const FOV = 50;

const D2R = Math.PI / 180;
type V3 = [number, number, number];
const radec = (ra: number, dec: number): V3 => [
    Math.cos(dec * D2R) * Math.cos(ra * D2R),
    Math.sin(dec * D2R),
    -Math.cos(dec * D2R) * Math.sin(ra * D2R),
];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const comb = (a: V3, x: number, b: V3, y: number): V3 => [a[0] * x + b[0] * y, a[1] * x + b[1] * y, a[2] * x + b[2] * y];

// The galactic frame: its north pole, the centre in Sagittarius, and the
// direction of travel. Everything the camera looks at lies near this plane.
const GNP = radec(192.85948, 27.12825);
const GC = norm(comb(radec(266.40499, -28.93617), 1, GNP, -dot(radec(266.40499, -28.93617), GNP)));
const GE = cross(GNP, GC);

// Star colour from B-V: temperature, then black-body colour, softened towards white.
function starColour(bv: number): V3 {
    const t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)) / 100;
    let r: number, g: number, b: number;
    if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04; }
    else { r = 329.7 * Math.pow(t - 60, -0.1332); g = 288.12 * Math.pow(t - 60, -0.0755); b = 255; }
    const c = (v: number) => Math.min(255, Math.max(0, v)) / 255;
    const mix = 0.45;
    return [c(r) * (1 - mix) + mix, c(g) * (1 - mix) + mix, c(b) * (1 - mix) + mix];
}

// Kept across mounts: leaving /about and coming back picks the journey up where
// it was instead of rewinding to Sagittarius, and the catalogue is parsed once.
let epoch = -1;
let catalogue: Promise<number[][]> | null = null;

export function SkyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // /about hands the whole viewport to the room, which is opaque and brings its
    // own WebGL scene. The sky has nothing to draw there.
    const paused = usePathname() === "/about";

    useEffect(() => {
        if (paused) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        // A context can be taken away (driver reset, a backgrounded phone, too many
        // WebGL pages). The scene is built in start() so it can be built again.
        let disposed = false;
        let teardown: (() => void) | null = null;
        const onLost = (e: Event) => {
            e.preventDefault();          // required, or the context is never restored
            if (teardown) { teardown(); teardown = null; }
        };
        const onRestored = () => { if (!disposed) teardown = start(); };
        canvas.addEventListener("webglcontextlost", onLost as EventListener);
        canvas.addEventListener("webglcontextrestored", onRestored);

        function start(): (() => void) | null {
        const gl = canvas!.getContext("webgl", { antialias: false, preserveDrawingBuffer: false, powerPreference: "high-performance" });
        if (!gl) return null;
        let disposedHere = false;

        const NOISE = `
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
        float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }`;

        // The sky sphere, traced per pixel from the camera basis, with the nebula on top.
        const SKY_V = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
        const SKY_F = `
        precision highp float;
        uniform vec2 u_res, u_tan; uniform vec3 u_f, u_r, u_u;
        uniform float u_time, u_gain, u_map;
        uniform sampler2D u_mw;
        uniform vec3 u_band, u_neb0, u_neb1, u_hi;
        ${NOISE}
        void main(){
          vec2 s = gl_FragCoord.xy / u_res * 2.0 - 1.0;
          vec3 d = normalize(u_f + s.x * u_tan.x * u_r + s.y * u_tan.y * u_u);
          vec2 uv = vec2(fract(0.5 - atan(-d.z, d.x) / 6.2831853), 0.5 + asin(clamp(d.y, -1.0, 1.0)) / 3.14159265);
          // sRGB to linear (2.2), then Laika's contrast (1.55); taken to grey and recoloured.
          vec3 c = pow(texture2D(u_mw, uv).rgb, vec3(3.4));
          float L = dot(c, vec3(0.2126, 0.7152, 0.0722));
          vec3 mw = mix(L * u_band, c, 0.08) * u_map;

          vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
          float t = u_time * 0.012;
          float a = fbm(p * 1.4 + vec2(t, -t * 0.6));
          float b = fbm(p * 2.8 - a * 1.6 + vec2(-t * 0.8, t));
          float m = smoothstep(0.42, 0.98, a * 0.55 + b * 0.6);
          float edge = smoothstep(0.15, 1.1, length(p * vec2(0.8, 1.15)));
          vec3 nc = mix(mix(u_neb0, u_neb1, b), u_hi, pow(m, 3.0) * 0.35);
          vec3 neb = nc * m * (0.08 + edge * 0.16);

          vec3 col = vec3(0.016, 0.020, 0.047) + (mw + neb) * u_gain;
          // 8 bits cannot hold these soft dark gradients; one LSB of noise hides the steps.
          col += (h(gl_FragCoord.xy + fract(u_time) * 61.7) - 0.5) * (1.5 / 255.0);
          gl_FragColor = vec4(col, 1.0);
        }`;

        // The stars: points projected with the same basis, added on top.
        const STAR_V = `
        attribute vec3 a_pos, a_col; attribute float a_size, a_phase;
        uniform vec3 u_f, u_r, u_u; uniform vec2 u_tan;
        uniform float u_time, u_px, u_fade, u_twinkle;
        varying vec3 v_col; varying float v_a;
        void main(){
          gl_Position = vec4(dot(a_pos, u_r) / u_tan.x, dot(a_pos, u_u) / u_tan.y, 0.0, dot(a_pos, u_f));
          float tw = 1.0 - u_twinkle * 0.22 * (0.5 + 0.5 * sin(u_time * (0.7 + a_phase * 2.3) + a_phase * 60.0));
          gl_PointSize = a_size * u_px * tw;
          v_col = a_col; v_a = clamp(a_size / 2.6, 0.35, 1.0) * tw * u_fade;
        }`;
        const STAR_F = `
        precision mediump float;
        varying vec3 v_col; varying float v_a;
        void main(){
          vec2 p = gl_PointCoord - 0.5; float d2 = dot(p, p);
          float a = exp(-d2 * 30.0) + exp(-d2 * 7.0) * 0.18;
          if (a < 0.01) discard;
          gl_FragColor = vec4(v_col * a * v_a, 1.0);
        }`;

        let ok = true;
        function sh(type: number, src: string) {
            const o = gl!.createShader(type)!;
            gl!.shaderSource(o, src);
            gl!.compileShader(o);
            if (!gl!.getShaderParameter(o, gl!.COMPILE_STATUS)) { console.error(gl!.getShaderInfoLog(o)); ok = false; }
            return o;
        }
        function program(v: string, f: string) {
            const p = gl!.createProgram()!;
            gl!.attachShader(p, sh(gl!.VERTEX_SHADER, v));
            // Some older mobile GPUs have no highp in the fragment stage.
            let fs = sh(gl!.FRAGMENT_SHADER, f);
            if (!ok) { ok = true; fs = sh(gl!.FRAGMENT_SHADER, f.replace("precision highp float;", "precision mediump float;")); }
            gl!.attachShader(p, fs);
            gl!.linkProgram(p);
            if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) ok = false;
            return p;
        }
        const skyP = program(SKY_V, SKY_F);
        const starP = program(STAR_V, STAR_F);
        // The page underneath is the same deep blue, so it still reads without a sky.
        if (!ok) return null;

        const loc = (p: WebGLProgram, names: string[]) =>
            Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)])) as Record<string, WebGLUniformLocation | null>;
        const su = loc(skyP, ["u_res", "u_tan", "u_f", "u_r", "u_u", "u_time", "u_gain", "u_map", "u_mw", "u_band", "u_neb0", "u_neb1", "u_hi"]);
        const tu = loc(starP, ["u_f", "u_r", "u_u", "u_tan", "u_time", "u_px", "u_fade", "u_twinkle"]);

        const tri = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tri);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const triLoc = gl.getAttribLocation(skyP, "p");

        gl.useProgram(skyP);
        gl.uniform3fv(su.u_band, TINT.band); gl.uniform3fv(su.u_neb0, TINT.neb0);
        gl.uniform3fv(su.u_neb1, TINT.neb1); gl.uniform3fv(su.u_hi, TINT.hi);
        gl.uniform1i(su.u_mw, 0);

        /* The Milky Way: 4K on a desk, 2K on a phone or a GPU that cannot hold 4K */
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let mapReady = false, starsReady = false, starN = 0;
        const mwTex = gl.createTexture();
        const img = new Image();
        const small = matchMedia("(max-width: 820px)").matches || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096;
        img.onload = () => {
            if (disposedHere) return;
            gl.bindTexture(gl.TEXTURE_2D, mwTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            // No mipmaps: the wrap seam would show as a line.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            mapReady = true;
            if (reduce) draw();
        };
        img.src = small ? "/sky/milkyway-2k.jpg" : "/sky/milkyway.jpg";

        /* The stars */
        const starBuf = gl.createBuffer();
        catalogue ??= fetch("/sky/stars.json").then((r) => r.json());
        catalogue.then((stars) => {
            if (disposedHere) return;
            // Interleaved: position (3), colour (3), size, phase.
            const a = new Float32Array(stars.length * 8);
            stars.forEach(([ra, dec, mag, bv], i) => {
                a.set(radec(ra, dec), i * 8);
                a.set(starColour(bv), i * 8 + 3);
                a[i * 8 + 6] = Math.min(9, 1.2 + 5.2 * Math.sqrt(Math.pow(10, -0.4 * mag)));
                a[i * 8 + 7] = Math.random();
            });
            gl.bindBuffer(gl.ARRAY_BUFFER, starBuf);
            gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW);
            starN = stars.length;
            starsReady = true;
            if (reduce) draw();
        }).catch(() => { catalogue = null; });
        const sa = ["a_pos", "a_col", "a_size", "a_phase"].map((n) => gl.getAttribLocation(starP, n));

        let qScale = 1.0, dpr = 1;
        function resize() {
            const cap = matchMedia("(pointer: coarse)").matches ? 1.5 : 2;
            dpr = Math.min(window.devicePixelRatio || 1, cap) * qScale;
            const vw = canvas!.clientWidth || window.innerWidth || 1;
            const vh = canvas!.clientHeight || window.innerHeight || 1;
            const w = Math.floor(vw * dpr), h = Math.floor(vh * dpr);
            if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; }
            if (reduce) draw();
        }

        // Where the camera looks at time t: along the plane, leaning and rising a little.
        function basis(t: number) {
            const th = -0.35 + t * DRIFT;              // starts just short of the galactic centre
            const be = 0.10 * Math.sin(t * 0.021);     // the band wanders above and below the middle
            const ro = -0.55 + 0.14 * Math.sin(t * 0.017); // and lies on a slowly turning diagonal
            const f = norm(comb(comb(GC, Math.cos(th), GE, Math.sin(th)), Math.cos(be), GNP, Math.sin(be)));
            const u0 = norm(comb(GNP, 1, f, -dot(GNP, f)));
            const r0 = cross(f, u0);
            return { f, r: comb(r0, Math.cos(ro), u0, Math.sin(ro)), u: comb(u0, Math.cos(ro), r0, -Math.sin(ro)) };
        }

        if (epoch < 0) epoch = performance.now();
        let fade = 0;
        let fadeFrom = -1;
        let lastT = performance.now();

        function draw() {
            const now = performance.now();
            const t = reduce ? 0 : (now - epoch) / 1000;
            const W = canvas!.width, H = canvas!.height;
            const ty = Math.tan((FOV / 2) * D2R);
            const tanX = ty * (W / H);
            const { f, r, u } = basis(t);
            // Everything fades in together once the stars are in.
            const ready = starsReady && (mapReady || img.complete);
            if (ready && fadeFrom < 0) fadeFrom = now;
            fade = reduce ? (ready ? 1 : 0) : fadeFrom < 0 ? 0 : Math.min(1, (now - fadeFrom) / 2200);
            const e = fade * fade * (3 - 2 * fade);

            gl!.viewport(0, 0, W, H);
            gl!.disable(gl!.BLEND);
            gl!.useProgram(skyP);
            gl!.bindBuffer(gl!.ARRAY_BUFFER, tri);
            sa.forEach((l) => l >= 0 && gl!.disableVertexAttribArray(l));
            gl!.enableVertexAttribArray(triLoc);
            gl!.vertexAttribPointer(triLoc, 2, gl!.FLOAT, false, 0, 0);
            gl!.activeTexture(gl!.TEXTURE0);
            gl!.bindTexture(gl!.TEXTURE_2D, mwTex);
            gl!.uniform2f(su.u_res, W, H);
            gl!.uniform2f(su.u_tan, tanX, ty);
            gl!.uniform3fv(su.u_f, f); gl!.uniform3fv(su.u_r, r); gl!.uniform3fv(su.u_u, u);
            gl!.uniform1f(su.u_time, reduce ? 12 : t);
            gl!.uniform1f(su.u_gain, e);
            gl!.uniform1f(su.u_map, mapReady ? 1 : 0);
            gl!.drawArrays(gl!.TRIANGLES, 0, 3);

            if (!starsReady) return;
            gl!.enable(gl!.BLEND);
            gl!.blendFunc(gl!.ONE, gl!.ONE);
            gl!.useProgram(starP);
            gl!.disableVertexAttribArray(triLoc);
            gl!.bindBuffer(gl!.ARRAY_BUFFER, starBuf);
            [3, 3, 1, 1].reduce((off, n, i) => {
                if (sa[i] >= 0) { gl!.enableVertexAttribArray(sa[i]); gl!.vertexAttribPointer(sa[i], n, gl!.FLOAT, false, 32, off * 4); }
                return off + n;
            }, 0);
            gl!.uniform3fv(tu.u_f, f); gl!.uniform3fv(tu.u_r, r); gl!.uniform3fv(tu.u_u, u);
            gl!.uniform2f(tu.u_tan, tanX, ty);
            gl!.uniform1f(tu.u_time, t);
            gl!.uniform1f(tu.u_px, dpr);
            gl!.uniform1f(tu.u_fade, e);
            gl!.uniform1f(tu.u_twinkle, reduce ? 0 : 1);
            gl!.drawArrays(gl!.POINTS, 0, starN);
        }

        let hidden = false, raf = 0, running = false, dtAvg = 16.7, qCheck = 0;
        const born = performance.now();
        function frame() {
            if (hidden) return;
            if (canvas!.width === 0 || canvas!.height === 0) resize();
            const now = performance.now(); const dt = now - lastT; lastT = now;
            dtAvg += (Math.min(dt, 60) - dtAvg) * 0.1;
            // Quality follows the frame rate, with a grace period for the jank of mounting.
            if (++qCheck > 45) {
                qCheck = 0;
                if (now - born < 3000) dtAvg = 16.7;
                else if (dtAvg > 23.0 && qScale > 0.75) { qScale = Math.max(0.75, qScale - 0.1); resize(); }
                else if (dtAvg < 17.5 && qScale < 1.0) { qScale = Math.min(1.0, qScale + 0.1); resize(); }
            }
            draw();
            raf = requestAnimationFrame(frame);
        }

        // One flag, one loop: a doubled visibilitychange must not start a second one.
        const onVisibility = () => {
            hidden = document.hidden;
            if (hidden) { cancelAnimationFrame(raf); running = false; return; }
            if (!reduce && !running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); }
        };
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", onVisibility);
        resize();
        if (reduce) draw();
        else { running = true; raf = requestAnimationFrame(frame); }

        return () => {
            disposedHere = true;
            running = false;
            cancelAnimationFrame(raf);
            img.onload = null;
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", onVisibility);
        };
        }

        teardown = start();

        return () => {
            disposed = true;
            if (teardown) teardown();
            canvas.removeEventListener("webglcontextlost", onLost as EventListener);
            canvas.removeEventListener("webglcontextrestored", onRestored);
            const gl2 = canvas.getContext("webgl");
            const ext = gl2 && gl2.getExtension("WEBGL_lose_context");
            if (ext) ext.loseContext();
        };
        // Re-runs when the route crosses in or out of /about.
    }, [paused]);

    if (paused) return null;

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 w-full h-full block pointer-events-none"
            style={{ background: "#04050c" }}
        />
    );
}
