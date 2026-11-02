/**
 * Constellations, found by the pointer. Rest it near a named star in empty sky
 * and the star gets a ring and its name, while the lines of its constellation
 * draw themselves across the sky and travel with it. Move on and it all fades.
 *
 * Quiet on purpose: desktop pointers only, never over text, images or
 * controls, a short dwell before anything appears, and gone on scroll. Drawn
 * in SVG behind the page so the strokes are smooth and the text stays on top.
 * The data is 234 named stars and the 88 IAU figures, in Latin, which reads the
 * same in every language of the site.
 */

type V3 = [number, number, number];
type Data = {
    stars: [number, number, string, string][];
    names: Record<string, string>;
    lines: Record<string, [number, number][][]>;
};
export type Projector = (v: V3) => [number, number] | null;

// Hovering any of these is reading, not stargazing.
const BUSY = "a,button,input,textarea,select,label,summary,[role=button],img,video,iframe,svg,canvas,p,h1,h2,h3,h4,h5,h6,li,blockquote,figure,article,time,span,header,nav,.pc-device,.pc-strip,[data-no-sky]";
const NEAR = 28;     // px from a star to pick it
const LEAVE = 90;    // px away before it lets go
const DWELL = 180;   // ms resting before it shows

const SVGNS = "http://www.w3.org/2000/svg";

export function createConstellations(svg: SVGSVGElement, label: HTMLElement, toVec: (ra: number, dec: number) => V3, kick: () => void) {
    let data: Data | null = null;
    let stars: { v: V3; name: string; c: string }[] = [];
    let loading = false;
    const ptr = { x: 0, y: 0, free: false, inside: false };
    let W = 1, H = 1;

    let cand = -1, candSince = 0;     // the star under the pointer, and since when
    let shown = -1;                   // the star with the ring and the name
    let group: SVGGElement | null = null;
    let figure: { paths: SVGPathElement[]; polys: V3[][]; dots: SVGCircleElement[]; dotV: V3[] } | null = null;
    let figureOf = "";

    const ring = document.createElementNS(SVGNS, "circle");
    ring.setAttribute("class", "sky-ring");
    ring.setAttribute("r", "9");
    svg.append(ring);
    const nameEl = document.createElement("b");
    const consEl = document.createElement("span");
    label.append(nameEl, consEl);

    function load() {
        if (data || loading) return;
        loading = true;
        fetch("/sky/constellations.json").then((r) => r.json()).then((d: Data) => {
            data = d;
            stars = d.stars.map(([ra, dec, name, c]) => ({ v: toVec(ra, dec), name, c }));
        }).catch(() => { loading = false; });
    }

    function onMove(e: PointerEvent) {
        if (e.pointerType !== "mouse") return;
        const rect = svg.getBoundingClientRect();
        ptr.x = ((e.clientX - rect.left) / rect.width) * W;
        ptr.y = ((e.clientY - rect.top) / rect.height) * H;
        const el = e.target as Element | null;
        ptr.free = !(el && el.closest && el.closest(BUSY));
        ptr.inside = true;
        load();
        kick();
    }
    const onLeave = () => { ptr.inside = false; kick(); };
    // Scrolling means reading: the sky steps back until the pointer moves again.
    const onScroll = () => { ptr.free = false; kick(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    function drawFigure(c: string) {
        if (c === figureOf) return;
        figureOf = c;
        // The old figure fades where it is; the new one draws itself in.
        if (group) {
            const old = group;
            old.classList.remove("is-on");
            old.classList.add("is-out");
            setTimeout(() => old.remove(), 800);
        }
        group = null; figure = null;
        if (!c || !data?.lines[c]) return;
        const g = document.createElementNS(SVGNS, "g");
        g.setAttribute("class", "sky-cons");
        const polys = data.lines[c].map((seg) => seg.map(([ra, dec]) => toVec(ra, dec)));
        const paths = polys.map((_, i) => {
            const p = document.createElementNS(SVGNS, "path");
            p.setAttribute("pathLength", "1");
            p.style.transitionDelay = `${i * 70}ms`;
            g.append(p);
            return p;
        });
        // One dot per star of the figure, however many lines meet there.
        const seen = new Map<string, V3>();
        data.lines[c].forEach((seg) => seg.forEach(([ra, dec]) => { const k = `${ra},${dec}`; if (!seen.has(k)) seen.set(k, toVec(ra, dec)); }));
        const dotV = [...seen.values()];
        const dots = dotV.map(() => {
            const d = document.createElementNS(SVGNS, "circle");
            d.setAttribute("r", "1.4");
            g.append(d);
            return d;
        });
        svg.insertBefore(g, ring);
        group = g;
        figure = { paths, polys, dots, dotV };
        // Drawn once at its start, then let go on the next frame so the strokes animate.
        requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("is-on")));
    }

    /** Called with every frame of the sky. `active` is false until the sky has faded in. */
    function update(project: Projector, w: number, h: number, active: boolean) {
        W = w; H = h;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const now = performance.now();

        // Who is under the pointer.
        let best = -1;
        if (active && data && ptr.inside && ptr.free) {
            let bd = NEAR * NEAR;
            for (let i = 0; i < stars.length; i++) {
                const s = project(stars[i].v);
                if (!s) continue;
                const d = (s[0] - ptr.x) ** 2 + (s[1] - ptr.y) ** 2;
                if (d < bd) { bd = d; best = i; }
            }
        }
        if (best !== cand) { cand = best; candSince = now; }

        // Show after a short rest; let go only once the pointer is well away.
        let next = shown;
        if (cand >= 0 && cand !== shown && now - candSince > DWELL) next = cand;
        if (shown >= 0 && cand < 0) {
            const s = project(stars[shown].v);
            const far = !s || (s[0] - ptr.x) ** 2 + (s[1] - ptr.y) ** 2 > LEAVE * LEAVE;
            if (far || !ptr.free || !ptr.inside || !active) next = -1;
        }
        if (next !== shown) {
            shown = next;
            if (shown >= 0) {
                nameEl.textContent = stars[shown].name;
                consEl.textContent = data!.names[stars[shown].c] ?? stars[shown].c;
            }
            ring.classList.toggle("is-on", shown >= 0);
            label.classList.toggle("is-on", shown >= 0);
            drawFigure(shown >= 0 ? stars[shown].c : "");
        }

        // Everything rides with the sky.
        if (figure) {
            figure.paths.forEach((p, i) => {
                let d = "", pen = false;
                for (const v of figure!.polys[i]) {
                    const s = project(v);
                    if (!s) { pen = false; continue; }
                    d += `${pen ? "L" : "M"}${s[0].toFixed(1)} ${s[1].toFixed(1)}`;
                    pen = true;
                }
                p.setAttribute("d", d);
            });
            figure.dots.forEach((dot, i) => {
                const s = project(figure!.dotV[i]);
                dot.style.display = s ? "" : "none";
                if (s) { dot.setAttribute("cx", s[0].toFixed(1)); dot.setAttribute("cy", s[1].toFixed(1)); }
            });
        }
        if (shown >= 0) {
            const s = project(stars[shown].v);
            if (s) {
                ring.setAttribute("cx", s[0].toFixed(1));
                ring.setAttribute("cy", s[1].toFixed(1));
                // The name sits to the right of its star, or to the left near the edge.
                const left = s[0] > w - 220;
                label.dataset.side = left ? "left" : "right";
                label.style.transform = `translate(${(s[0] + (left ? -18 : 18)).toFixed(1)}px, ${s[1].toFixed(1)}px) translate(${left ? "-100%" : "0"}, -50%)`;
            }
        }
    }

    function dispose() {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
        svg.replaceChildren();
        label.replaceChildren();
        label.classList.remove("is-on");
    }

    return { update, dispose };
}
