# The Filament — production reference pack

**Date:** 2026-06-18
**Purpose:** everything needed to generate the hyperrealistic /journey film when Michael gives the go. No video has been generated yet, this is the gathered resource set.

**Assets workspace:** `C:\Users\34646\mcebral-journey-assets\`
- `reference/own/` — Michael's authentic photos copied from the repo
- `reference/web/` — license-clear web references downloaded per location
- `clips/` — Higgsfield output clips (empty until generation)
- `frames/` — extracted AVIF/WebP frame sequences (empty until generation)

All web references are Creative Commons or public domain (reusable). CC BY SA images need a credit line if any reference image is ever shown directly. The plan uses them only as image-to-video inputs, but the attributions are listed below to be safe.

---

## Per chapter references

### CH.01 — Lugo, the Roman wall
- **His own:** `reference/own/lugo-walls.png`, `lugo-sign.jpeg` (authentic Muralla, use as the identity and color anchor). `galicia-coast.jpeg` / `galicia-atlantic.png` for the Atlantic drizzle and blue hour grade.
- **Web hero (dolly along the adarve toward the cathedral):** `reference/web/01-lugo-adarve.jpg` — *Adarve de las Murallas de Lugo*, CC BY SA 3.0 ES, Pedro M. Martínez Corada (Wikimedia Commons).
- **Web aerial (full oval of the wall):** `reference/web/01-lugo-aerial.jpg` — *Lugo 2023 Roman Walls*, CC BY SA 4.0, Fernando Pascullo.
- **Framing:** low forward perspective down the wet adarve, granite parapet leading to the cathedral towers, drizzle, blue hour.
- **Thread:** born from a rain seam in the granite joints, runs ahead along the wall, lifts toward the cathedral and exits into the Atlantic drizzle.

### CH.02 — Santiago de Compostela, USC and the Camino
- **His own:** none of Santiago. Galician granite and mist mood only from `galicia-*`.
- **Web hero (Obradoiro facade across the square):** `reference/web/02-santiago-obradoiro.jpg` — *Catedral de Santiago, Obradoiro facade*, CC BY SA 3.0, Luis Miguel Bugallo Sánchez (Lmbuga). Regrade to golden hour and wet granite.
- **Web Camino beat:** `reference/web/02-santiago-camino.jpg` — Camino de Santiago, Pexels License (free, no attribution required), Jose Lorenzo Muñoz.
- **Framing:** centered symmetrical frontal from mid square, ~25 to 40 m back, wet granite foreground leading in, empty of people.
- **Thread:** arrives as the painted yellow Camino arrow and scallop shell on stone, runs across the square, rises up the facade axis, exits into the mist above the spires.

### CH.03 — London, UCL
- **His own:** none. `strasbourg-selfie.jpg` only as a cool overcast European stone tonal cue.
- **Web hero:** `reference/web/03-london-ucl-wilkins.jpg` — *Wilkins Building 1, UCL, London*, CC BY SA 3.0, David Iliff (Diliff), a renowned architectural photographer, clean head on symmetry.
- **Framing:** straight on slightly low frontal from the Main Quad, ten Corinthian columns and pediment in the lower two thirds, green copper dome centered above, overcast, wet reflective pavement.
- **Thread:** enters along the wet quad from screen left, climbs the central steps and a Portland stone column, exits over the rim of the copper dome.

### CH.04 — Stockholm, Karolinska Institutet (the fusion, the climax)
- **His own:** `reference/own/parents-karolinska.jpeg` (authentic Karolinska, the emotional anchor).
- **Web hero (faceted glass):** `reference/web/04-stockholm-aulamedica.jpg` — *Aula Medica, Karolinska Institutet*, CC BY SA 4.0, Sinikka Halme. The curved triangular glass skin in cold clear light.
- **Web alternate (green double shell):** `reference/web/04-stockholm-biomedicum.jpg` — *Biomedicum, Solna, 2019*, CC BY SA 4.0, Holger Ellgaard.
- **Also needs (generative, not photographed):** a macro of spider silk fibre, and a spatial transcriptomics figure that reads as a star field. Generate these with `nano_banana_2` from the prompts in the plan.
- **Framing:** tight three quarter of the faceted facade, low cold Nordic sun raking the panes, then a macro of a gold fibre drawn into a scaffold, then a rack focus that turns a grid of expression spots into a star field.
- **Thread:** catches on a glass facet, refracts down the skin, becomes spun spider silk on the bench, then the silk turned star field lifts off.

### CH.05 — Strasbourg, International Space University
- **His own:** `reference/own/strasbourg-selfie.jpg` (Strasbourg context, the transition in). No photo of the ISU campus itself.
- **Web hero (the real ISU building):** `reference/web/05-strasbourg-isu.jpg` — ISU Central Campus front facade, 1 rue Jean Dominique Cassini, Illkirch Graffenstaden, CC BY SA 3.0, Roland Burckel (Archi-Wiki). Pink limestone and glazing. Relight to dusk and add the lake reflection and a ground station dome in the AI step.
- **Framing:** wide slightly low three quarter at dusk, full pink limestone and glass facade mirrored in the campus lake, a satellite antenna or dome at one edge, twilight.
- **Thread:** skims across the lake surface, climbs the facade, slips into the curve of the ground station dome, exits skyward.

### CH.06 — ESTEC, ESA, Noordwijk (destination)
- **His own:** `reference/own/esa-simulation.jpeg`, `iss-module.jpeg` (authentic ESA detail inserts). Galician coast photos can double as North Sea dune and water texture.
- **Web hero (aerial campus among dunes):** `reference/web/06-estec-aerial.jpg` — *Aerial view of ESA's technical centre ESTEC*, CC BY SA 3.0 IGO, official ESA imagery (Jan Van Haarlem / Gallery Imaging for ESA).
- **Web ground level:** `reference/web/06-estec-building.jpg` — *ESTEC building with ESA logo*, CC BY SA 4.0, Hnapel.
- **Web final orbital resolve:** `reference/web/06-earth-at-night.jpg` — *The Earth at Night* (VIIRS city lights), public domain (NASA). Crop to Europe so the thread lands on a node near the Netherlands then curves to Galicia.
- **Framing:** wide slightly elevated of the campus pressed against the dune line and the grey blue North Sea, flat maritime light, then a clean Earth at night for the orbital pull back.
- **Thread:** runs the North Sea horizon, threads the marram grass to the rooftops, lifts into the night, resolves into a city lights node, exits at the planet's curve and curves home to Galicia.

---

## Higgsfield production parameters (verified)

CLI authed as michaelcebralclase@gmail.com, Pro, 249 credits. ffmpeg 6.0 installed. Models confirmed present.

**Pipeline per chapter (three stages):**
1. **Still + thread placement:** `nano_banana_2` (Nano Banana Pro). Feed the real reference photo above, insert the single champagne gold thread `#D4AF37` at the exact enter and exit positions, lock the near black palette, output a START still and a matching END still pointing to the next chapter. Author chapter N's end still and N+1's start still at the same thread position for a match cut.
2. **Motion:** `seedance_2_0`. Params confirmed: `aspect_ratio 16:9`, `resolution 1080p`, `duration 8 to 10`, `bitrate_mode high`, `mode std`, `genre` per chapter (`noir` for Lugo, `drama` for Santiago and London, `epic` for Stockholm, Strasbourg and ESTEC). Pass the START and END stills via the `medias` array as start_image and end_image. Prompt describes only the slow camera move and the thread behaviour.
3. **Finish (hero chapters Santiago, Stockholm, ESTEC):** `cinematic_studio_video_3_5`. Params confirmed: `camera_model_id`, `camera_lens_id`, `camera_focal_length_id`, `camera_aperture_id`, `color_grading` (all object ids), `genre`, `resolution 1080p`. Resolve one shared focal length id and one shared color grading id and reuse them on all three hero chapters for a continuous film feel.

**Frame extraction:** concat the eight segments with `ffmpeg -f concat -c copy master.mp4`, then `ffmpeg -i master.mp4 -vf fps=30,scale=1600:-1 frames/frame_%04d.avif` (plus WebP and JPEG at q78), mobile ladder `fps=24,scale=900:-1`. Drop the frames into the repo and swap `journeyFrames.ts` `drawFrame` to `drawImage` of the loaded sequence.

**Prompt safety:** no named living people, no ESA/NASA/Karolinska/ISU/UCL logos in frame (render landmarks generically, the overlay names the institution), phrase negatives positively (uninhabited, tack sharp).

**Credits:** 249 prototypes 1 to 3 chapters. The full film (8 segments plus iteration plus 2 to 3 hero finishes) will exceed 249, budget a top up before the full run.

---

## Typography (to download when building)
- **Premium:** Tiempos Fine + Söhne (klim.co.nz), ABC Diatype Mono (abcdinamo.com). Self host WOFF2.
- **Budget, Awwwards grade, ship first:** PP Editorial New (pangrampangram.com, free for personal), Inter Display + Inter, Space Mono (Google Fonts). Self host WOFF2.
- Roles: serif = story and place, grotesque = institution, mono = every verifiable number.

---

## When ready to generate
1. Confirm a credit top up if doing more than 1 to 3 chapters.
2. Resolve and lock one shared `camera_focal_length_id` + `color_grading id`.
3. Start with CH.01 Lugo as the proof of concept (reference `01-lugo-adarve.jpg` + his `lugo-walls.png`).
4. Review the look, then roll the remaining chapters with the same thread, lens and grade.
