# The Filament — hyperrealistic frame-by-scroll film (Lugo to ESTEC)

**Date:** 2026-06-18
**Method:** 6-agent research and direction studio (scroll-video tech, typography, real location refs, Higgsfield production, CV fit, synthesis). Higgsfield CLI + ffmpeg verified live this session.

---

## The approach

One champagne gold thread is the only continuous object in Michael's life, and the site is built so the thread is literally never cut. You scroll and a single pinned canvas paints a hyperrealistic film of six real places, while the gold thread, baked into every frame, travels unbroken: a rain rivulet on the Roman wall of Lugo, the Camino across Santiago, a stone column at UCL, spun spider silk and a transcriptomics star field at Karolinska, the ISU lake at Strasbourg, and finally an orbital path at ESTEC that curves back over the Atlantic to the Galician coast where it began.

It fuses the three things Michael actually is into one image: a Galician with deep roots, a biologist whose own lab work made real spider silk, and a space scientist heading into ESA. The film is the seduction and the emotion. The CV is the proof. The two are kept strictly separate so the spectacle never floats free of fact. Gold is a spotlight on no more than five percent of any frame.

## Recommended technique (decided)

**A device-tiered AVIF image sequence painted to one high-DPI 2D canvas, scrubbed by GSAP ScrollTrigger over Lenis smooth scroll.** This is the Apple AirPods Pro / MacBook technique. It is the only path that gives frame-exact, stutter-free scrubbing of hyperrealistic footage with full control to composite the gold thread on top of each frame.

- **Rejected: `<video>` + currentTime.** Smooth seeking forces a keyframe interval of 1, which inflates file size 5 to 10x and still stutters on mobile Safari. Kept only as the pre-scroll hero loop and slow-connection fallback.
- **Rejected: full react-three-fiber.** Rebuilding Galician rain and the Muralla as real-time 3D would cost months and look worse than Higgsfield renders. WebGL is used surgically: a thin additive-blend shader only for the gold thread glow and the chapter 4 transcriptomics-to-starfield particle moment.
- **Division of labour:** GSAP for the scroll cinema and frame scrub (outside React's render cycle), framer-motion (already in the project) for the chapter text overlays and gold micro-interactions.

## Typography (decided, with a budget path)

The current Playfair + Bodoni + Inter is the right silhouette but built from Google defaults whose hairline serifs vibrate over moving footage. Keep the architecture, swap to authored faces with sturdier mid-weights, and add the mono accent the stack lacks. The three voices get strict jobs, and that separation is the credibility mechanism.

| Role | Premium | Budget (self-hosted, Awwwards-grade) | Job |
|---|---|---|---|
| Display | **Tiempos Fine** (Klim) | PP Editorial New (Pangram Pangram) | Story and place |
| Body | **Söhne** (Klim) | Inter Display + Inter | Institutions and copy |
| Accent mono | **ABC Diatype Mono** (Dinamo) | Space Mono | Telemetry and every hard number |

Sources: klim.co.nz/fonts/tiempos-fine, klim.co.nz/fonts/sohne, abcdinamo.com/typefaces/diatype, pangrampangram.com/products/editorial-new. *Serif = story, grotesque = institution, mono = verifiable fact.* The numbers then read as measured instrument data, not boasted marketing.

## The six-chapter storyboard

Every chapter: the thread enters frame left/low and exits right/high, handing off to the next place. One gold proof token per chapter, traceable to a real line in experiences.json.

### CH.01 — Lugo, Galicia (origin)
- **Scene:** slow dolly along the adarve of the Muralla de Lugo (the only intact Roman wall circuit in the world), wet slate and granite, lichen-darkened towers, the cathedral beyond, Galician orballo, blue hour.
- **Thread:** born from a rain rivulet on the wet stone, runs forward along the walkway, exits toward the Camino road south.
- **On screen:** *Lugo* · `43.0097 N 7.5567 W / CH.01 / ORIGIN` · "Where the thread is born. Atlantic stone, rain, and roots."
- **CV card:** identity only, no role, no grade. The honest opening that makes everything after it credible.
- **Higgsfield prompt:** *Hyperrealistic cinematic dolly along the top walkway of the ancient Roman wall of Lugo, near black editorial palette, wet slate and granite parapet, lichen darkened towers, a cathedral silhouette beyond, soft Atlantic drizzle, overcast pearl grey sky, blue hour. A single continuous champagne gold thread (hex D4AF37) is born from a crack low in the wet stone and rises as one unbroken luminous filament, exiting top right, the only saturated element. Very slow push, 35mm, shallow DOF, tack sharp on the thread, uninhabited, photoreal, subtle film grain, anamorphic. Noir.*

### CH.02 — Santiago de Compostela (USC, the Camino)
- **Scene:** slow push across the empty wet granite Praza do Obradoiro toward the Baroque cathedral facade at golden hour, a lone pilgrim silhouette. Brief lab inset: the thread reads for a beat as a qPCR amplification curve.
- **Thread:** enters as the painted yellow Camino arrow on granite, resolves into the gold thread, runs across as brass scallop-shell markers, exits over the cathedral roofline north.
- **On screen:** *Santiago de Compostela* · `CH.02 / THE WAY` · telemetry `USC Biotechnology · 9.2/10 · Academic Excellence Scholarship` · "The Camino is the thread. Three lab placements at CiMUS."
- **CV card:** USC Biotechnology 2019-2023, **9.2/10 + Academic Excellence Scholarship**; three CiMUS placements rolled into one sub-line (full split lives on the CV page).

### CH.03 — London (UCL)
- **Scene:** symmetrical dolly up the Main Quad toward the Wilkins Building Corinthian portico and green copper dome, cool London overcast, wet pavement. Fluorescence inset of glowing 3D tumour spheroids echoing the dome.
- **Thread:** climbs a Portland stone column as a fine gold vein, lifts into the grey sky, arcs north to Stockholm.
- **On screen:** *London* · `CH.03 / THE PROBE` · `UCL · Pereira-Acedo Lab · 3D tumour spheroids` · "Building tumours in miniature to test light driven medicine."
- **CV card:** Research Intern, Pereira-Acedo Lab, UCL, Jul-Sep 2022.

### CH.04 — Stockholm (Karolinska + KTH/SciLifeLab) — the fusion, the climax
- **Scene:** the longest beat, the motif transforms twice. Open on the faceted glass of Aula Medica / Biomedicum in cold Nordic winter light, then a macro of a single gold spider-silk fibre drawn into a 3D scaffold, then a rack focus that turns a spatial transcriptomics grid into a star field. Biology and space fuse here.
- **Thread:** enters as a frost line on the glass, becomes spun silk on the bench, then the silk-turned-starfield lifts off toward Strasbourg.
- **On screen:** *Stockholm* · `CH.04 / THE FUSION` · `Karolinska MSc Biomedicine, VG, full la Caixa · Anna Rising Lab, recombinant spider silk · SciLifeLab + KTH, NASA Rodent Research 9, spatial transcriptomics`.
- **CV card:** a taller three-row stacked card (allowed 2-3 gold tokens because the spider silk literally becomes the thread).

### CH.05 — Strasbourg (ISU) — liftoff
- **Scene:** low shot across the glassy ISU campus lake at dusk (Illkirch-Graffenstaden), pink limestone facade, satellite ground-station dome, mirror-still water.
- **Thread:** skims the lake, climbs the facade, arcs off the satellite dish toward orbit.
- **On screen:** *Strasbourg* · `CH.05 / LIFTOFF` · `ISU MSc Space Science · Barrié Foundation full scholarship` · "The bench lifts off. Biology trades the lab for orbit."
- **CV card:** MSc Space Science, ISU, 2025-2027, Barrié scholarship.

### CH.06 — ESTEC, ESA, Noordwijk — destination
- **Scene:** final aerial pull-up from a low modernist campus among marram-grass dunes by the North Sea, flat Dutch maritime light. The thread becomes a true orbital path that curves over the Atlantic and resolves on the green rainy Galician coast, closing the loop on Lugo.
- **On screen:** *ESTEC* · `CH.06 / DESTINATION` · "The thread completes its orbit and curves home to Galicia."
- **CV card:** labelled honestly as **Destination**, not a current job. The genuine ESA credential surfaced is the ESA/ELGRA Gravity summer school (2024). *This is the single biggest credibility decision (see open questions).*

## Higgsfield production plan (CLI verified ready)

**Verified live this session:** ffmpeg 6.0 installed; Higgsfield CLI on PATH; authenticated as `michaelcebralclase@gmail.com`, **Pro plan, 249 credits**. No MCP reconnect needed.

**Models (exact `job_set_type` ids):** `nano_banana_2` (reference still + thread placement), `soul_location` (clean no-people plates when no real photo), `seedance_2_0` (image-to-video workhorse, accepts start_image and end_image), `cinematic_studio_video_3_5` (finishing model with physical camera params), `kling3_0` (cheap low-motion substitute), `gpt_image_2` (typography plates).

**Three-stage pipeline per chapter:**
1. **Still** — run a real reference photo through `nano_banana_2` (4k 16:9) to place the gold thread exactly where it enters/exits and lock the near-black palette. Produce a START still and a matching END still pointing toward the next chapter. *Placing the thread at the still stage is what guarantees cross-cut continuity.*
2. **Motion** — feed both stills into `seedance_2_0` as `--start-image` / `--end-image` with a prompt describing only the camera move and the thread, `--duration 8-10 --resolution 1080p --aspect_ratio 16:9 --genre drama` (noir for Lugo, epic for ESTEC).
3. **Finish** — re-drive the 3 hero chapters (Santiago, Stockholm, ESTEC) through `cinematic_studio_video_3_5` with ONE shared `camera_focal_length_id` and ONE shared `color_grading id` reused everywhere. *Reusing one lens and grade is the biggest lever for a continuous film feel.*

**Gold-thread consistency, four enforcement levers:** match-cut on the thread (author N's end still = N+1's start still position/thickness/angle); palette lock; reference reuse (carry one master thread still into every chapter); seed and style discipline (identical prompt template, same genre and lens family).

**Frame extraction:** download each clip, concat 8 segments with `ffmpeg -f concat -c copy master.mp4`, then `ffmpeg -i master.mp4 -vf fps=30,scale=1600:-1 frames/frame_%04d.avif` (plus WebP/JPEG at q78), and a mobile ladder at `fps=24,scale=900:-1`. Verify the thread is present in frame 0001 and the final frame of every chapter at the same screen position.

**Prompt safety:** Higgsfield rejects nsfw and ip_detected. No named living people, no ESA/NASA/Karolinska/ISU logos in frame. Render landmarks generically and let the typographic overlay name the institution. Phrase negatives positively ("uninhabited", not "no people").

**Credits:** 249 is enough to prototype 1-3 chapters. The full 6-8 hero clips plus iteration will exceed 249, so budget a top-up before the full run.

## Scroll tech spec

- **Frames:** ~900-1200 desktop total (150-200/chapter) at 30fps; 880 portrait on mobile. (Apple shipped 148 for one reveal; OPTIKKA shipped 1182 desktop / 880 mobile, so this is the proven range.)
- **Resolution tiers:** desktop 1600x900, tablet 1280x720, mobile 900x1600; canvas DPR capped at 2 (1.5 mobile).
- **Format:** AVIF first (20-30% smaller than WebP in 2026), WebP fallback, JPEG safety net, q75-82.
- **Payload:** ~30-60MB full desktop sequence, acceptable only because it is never loaded upfront. Initial paint = first 10-15 frames (<1MB) so LCP/TTI stay healthy; stream the rest from the Vercel edge with immutable cache headers.
- **Libraries:** Lenis + GSAP ScrollTrigger + one 2D canvas; framer-motion for text overlays only.
- **Wiring:** `const lenis = new Lenis({autoRaf:false}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);` One ScrollTrigger pins the canvas (`start top top, end +=600%, pin true, scrub 1`), maps progress to `frame = round(progress*(N-1))`. Six overlays keyed to scrub sub-ranges. `ScrollTrigger.refresh()` once after fonts load.
- **Preloading (OPTIKKA three-stage):** load frames 0-9 immediately; background-queue the rest with a 4-6 concurrency pool; dynamic look-ahead/behind. Decode off main thread with `createImageBitmap`/`img.decode`, keep a bounded LRU of ImageBitmaps.
- **Reduced motion + a11y (non-negotiable):** if `prefers-reduced-motion` or `saveData`, skip ScrollTrigger and render six static hero stills in a normal document. Canvas is `aria-hidden`; the full Lugo-to-ESTEC narrative lives as semantic crawlable HTML so screen readers and SEO get the story. Visible "Reduce motion" and "Skip to CV" controls. Every CV fact is real text in the overlays, never only painted into pixels.

## How the CV stays credible

The film is the hook, the CV page is the proof, and a recruiter must never scrub 60 seconds to learn what Michael did. **Two surfaces, one source of truth (`experiences.json`) plus the persistent PDF.**

- **`/journey`** (new cinematic film): museum-label cards that are a beautiful lossy projection of the JSON, ending in a full-bleed "Read the full CV / Download CV" gateway and a champagne-on-black **proof wall** (all scholarships + the USC, UCL, KI, SciLifeLab, ISU, ESA logos already in `/public/logos`).
- **`/about/cv`** (kept intact): the fast, filterable, recruiter-scannable view. Add only a small "Watch the journey" link and per-entry anchor IDs (`#santiago`, `#sweden`) so cards deep-link to the exact row.
- **Museum-label card:** quiet, lower-left, thin gold hairline, near-black 60-70% backdrop-blur panel for legibility, max ~360px on mobile. Fields: chapter+city (mono caps gold), dates (tabular mono), role (Tiempos), institution (Söhne), exactly one gold proof token.
- **Recruiter-in-seconds guarantees:** persistent top-right Download CV (reuse `Magnetic`); reduced-motion routes straight to `/about/cv`; the six-dot chapter rail doubles as a table of contents to jump to the Sweden NASA + spider silk stop.
- **Governance:** extend each `experiences.json` entry with a small `film` block (`chapter, city, proofLine, goldToken, cvAnchor`) so the film, the CV page and the PDF can never drift. One source, three faces.

## Design system (text over moving footage)

- **Color:** base near-black `#0A0A0B` (warmer than pure black); body type pure white or warm paper `#F4F1EA`; gold `#D4AF37` reserved for the filament, chapter numerals, the active node, single emphasized words, hairline rules, and the alien/Space Invaders canon. Gold tint ramp for receding telemetry: `#D4AF37` active, `#9A8430` idle, `#5E5320` ghost. Never set body in gold.
- **Scrim (NN/g rule, test the lightest pixel under the text):** a directional gradient scrim behind only the text-bearing third of the frame, first stop pushed to 0.72 on bright chapters (Obradoiro sun, Stockholm snow), plus a 2-4px backdrop blur inside the scrim band. Maintain WCAG 4.5:1 body / 3:1 large display at the worst pixel; bump display weight rather than darkening the whole frame.
- **Setting (8px grid):** display Tiempos `clamp(64px, 9vw, 180px)`, tracking -0.015em, line-height 0.96; body Söhne 20px, measure 60-66 chars, never justified, never below 18px over video; mono telemetry 13-14px, +0.04em, tabular figures locked so coordinates do not jitter on scroll. Title lockups on a consistent baseline at ~62% viewport height so the type reads as one continuous HUD.
- **Motion:** type does not slide, it **resolves** via mask reveal + blur(6px to 0) over 0.7-0.9s, ease [0.16,1,0.3,1], like a focus pull. The gold thread draw (SVG stroke-dashoffset on scroll) leads the title by ~150ms so the thread always arrives first. Exit by defocus, not flat fade. Honor reduced-motion.

## Production checklist

1. Confirm credits and top up (full film exceeds 249; 249 is enough to prototype).
2. Source one high-res real reference photo per place (CC-licensed or owned), or generate clean plates with `soul_location`.
3. Lock the thread enter/exit convention and storyboard the six handoffs as one continuous line before any generation.
4. Resolve one shared `camera_focal_length_id` + `color_grading id` and reuse on all hero chapters.
5. Generate START/END stills per chapter with `nano_banana_2` (feed N's end frame into N+1's start for a literal match cut).
6. Run `seedance_2_0` per chapter (16:9, 1080p, 8-10s, audio off, identical structure prompt).
7. Finish Santiago, Stockholm, ESTEC through `cinematic_studio_video_3_5` with shared lens and grade.
8. Author the ESTEC end still so the orbit curves back to Lugo's bearing.
9. Concat with ffmpeg, extract AVIF/WebP/JPEG at fps=30 scale=1600 q78 + mobile ladder fps=24 scale=900.
10. Verify the thread position in frame 0001 and the last frame of every chapter.
11. Self-host the fonts as WOFF2 (premium or budget build) behind a near-black FOUT mask.
12. Build `/journey`: Lenis + GSAP canvas scrub, ParallelQueue preloader, bounded LRU bitmap cache, six framer-motion overlays.
13. Museum-label cards from `experiences.json`, one gold token each, Sweden three-row variant.
14. Persistent Download CV, Skip to CV, six-dot rail, reduced-motion/Save-Data static fallback, closing proof wall.
15. Extend `experiences.json` with the `film` block; add anchors and a "Watch the journey" link on `/about/cv`.
16. Layer the hidden Space Invaders + alien as overlays above the scrub canvas.
17. `ScrollTrigger.refresh()` after fonts load; QA on mobile Safari, Save-Data, reduced-motion; verify contrast at the lightest pixel.
18. Deploy frames to Vercel edge with immutable cache; confirm LCP loads only the first 10-15 frames.

## Open questions for Michael

1. **ESTEC status (biggest credibility decision):** a real ESTEC position/traineeship to add to the JSON, or aspirational destination? If aspirational, the final card reads "Destination, ESTEC, ESA" and surfaces the real ESA/ELGRA 2024 school as the genuine credential.
2. **Fonts:** buy the premium stack (Klim + Dinamo) or ship the free build (PP Editorial New + Inter + Space Mono)?
3. **Route:** does the film become the new homepage at `/`, or live at `/journey` with the current homepage preserved?
4. **WebGL thread layer:** ship the baked-in thread first and add the shader glow + chapter-4 particle morph as phase two, or build them from the start?
5. **Mobile cut:** full 880-frame portrait sequence, or a shorter condensed chapter cut to protect data and memory?
6. **Easter eggs during the film:** keep the Space Invaders + alien inside the journey scroll, or only on the resolved CV and contact surfaces after the film lands?
