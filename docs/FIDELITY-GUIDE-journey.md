# Journey Film — Fidelity First Guide

**Date:** 2026-06-18. How to keep every landmark looking like the real one (igualita), natural, never fake. Fidelity is lost in two places: the still edit (the model invents fake architecture) and the video (the camera invents geometry when it moves too much). Every rule kills invention at both stages.

## 1. The fidelity recipe (decided)

**Core rule.** Treat the real reference photo as ground truth. In nano_banana_2 change ONLY light, weather, sky and grade, never geometry. In seedance_2_0 use ONE slow simple move, short, 1080p, neutral realism genre. The fewer regeneration passes between the real photo and the final frame, the more faithful the result.

**Two paths:**
- **Light regrade** (nano_banana_2 then seedance): when the real sky fights the mood or the facade is tolerant (modern, angular, repeating panels). Used for Lugo, Karolinska, Strasbourg, ESTEC.
- **Skip the still** (real photo straight into seedance as start_image): for the most iconic, geometry critical buildings where one wrong column reads instantly as fake. Used for Santiago Obradoiro and UCL Wilkins. Preserves 100 percent real geometry because nothing is regenerated before motion. Only regrade first if the real sky is genuinely poor.

**nano_banana_2 locked-architecture prompt** (paste, swap brackets):
```
Photorealistic edit of this exact photograph of [LANDMARK]. Keep the architecture,
geometry, proportions, stonework, perspective and the exact number and position of
every [merlon / window / column / arch / glass panel] identical to the reference.
Do not add, remove, move or invent any structural element. Change ONLY the light,
weather, sky and colour grade to [soft golden hour light, warm cinematic grade].
Remove any people and fill with logical matching texture consistent with the
surroundings. Keep it indistinguishable from a real photograph. No AI smoothing,
no extra ornament, no invented detail, no garbled text.
```
Settings: resolution 2k, aspect_ratio matching the reference crop.

**seedance_2_0 realism-lock motion prompt** (paste, swap the move):
```
Slow, smooth, stable, gentle [push in]. Maintain original geometry, materials,
proportions and stonework. No morphing, no warping, no invented detail, consistent
lighting and shadow direction. No people enter the frame.
```
Fixed rules:
- **One move per clip.** Safe order: fixed locked off > slow push in or dolly 2 to 5 percent > slow pull back > very gentle lateral parallax. **Banned for landmarks:** orbit, aerial fly through, banking, handheld, fast zoom, rack focus, any combined move (they force the model to invent the unseen back and sides).
- Never reveal geometry the source frame did not show (no flying around the cathedral, no going over the wall).
- **Duration 4 to 5s** per landmark (hallucination grows with length). Need more screen time, cut two short clips rather than one long take.
- **Genre:** neutral documentary or cinematic realism, never stylised or fantasy.
- **Resolution 1080p** so fine stone, glass and ornament stays sharp (no texture swimming).
- People out at the still stage (semantic fill), plus "no people enter the frame" in the video prompt.

**Per city decision table**

| Location | Path | Lock | Move | Duration |
|---|---|---|---|---|
| Lugo Muralla adarve | Light regrade | merlon count, grey slate masonry, semicircular towers; no pointed crenellations or moat | slow dolly forward | 5s |
| Santiago Obradoiro | Skip the still | (if used) twin baroque towers, St James figure, double staircase | slow push in | 4 to 5s |
| London UCL Wilkins | Skip the still | (if used) Corinthian column count, pediment, dome | slow push in or locked off | 4 to 5s |
| Stockholm Aula Medica | Light regrade | triangular glass panel grid count, plaza; add frost and one spider silk fibre only | slow push in or gentle parallax | 5s |
| Strasbourg ISU | Light regrade | grey block, dark glass curtain wall, ISU lawn sign; lowest res so keep move minimal | locked off or tiny push | 5s |
| ESTEC aerial | Light regrade (aerial justified, ref is already aerial) | building footprint and dune coastline | slow shallow forward drift, NOT a banking orbit | 4 to 5s |

Note on transitions: the banned moves apply to landmark clips. The transition clips fly through sky, sea, cloud and snow (no landmark geometry to break) and start and end on the fixed real city frames, so flights there are fine.

## 2. Faithfulness checklist (redo if any fails)

1. Recognisable, a local would say "that is the real one, igualita".
2. Counts match: same columns, towers, windows, merlons, glass panels as the reference, none added, removed or moved.
3. Proportions and perspective match, no bent or leaning verticals.
4. No invented ornament, fake signage or garbled text.
5. No morph, warp or swim on stone, glass or rooflines across the clip.
6. No people, and no half formed figures appearing mid clip.
7. Light physically consistent (one source, correct shadow direction), weather suits the place.
8. No synthetic AI sheen, passes as a real photograph or film frame.
9. The camera did only what the frame contained, never revealed an unseen side.
10. Edges stay sharp at 1080p, no melting under motion.

Redo trigger: fail 2, 3, 4 or 6 = identity or architecture broken, regenerate with stronger lock wording or switch to skip the still. Fail 5, 9 or 10 = motion too aggressive, reduce to a slower, shorter or locked move.

## 3. Confirmed reference set (verified live, HTTP 200)

Downloaded to `mcebral-journey-assets/reference/web` (plus upload-safe 2048px copies in `reference/web-small`).

- **Lugo Muralla:** primary `01-lugo-adarve.jpg` (current, working) and `01b-lugo-adarve.jpg` (dead-on adarve, Fausto Alava-Moreno, CC BY-SA 2.0). Identity anchor `01c-lugo-towers.jpg` (semicircular towers, D.Rovchak, CC BY-SA 4.0).
- **Santiago Cathedral:** `02-santiago-obradoiro.jpg` (current, the Obradoiro facade, already generated faithfully) plus verified backup `02b-santiago-obradoiro-verified.jpg` (Jose Luiz Bernardes Ribeiro, CC BY-SA 3.0).
- **London UCL:** `03-london-ucl-wilkins.jpg` (real Wilkins portico, keep, no change).
- **Stockholm Karolinska:** upgrade to `04-stockholm-aulamedica-winter.jpg` (Karolinska aula 2016, real December winter light, 4666x3365, Holger.Ellgaard, CC BY-SA 4.0) so snow, frost and the constellation read are real not invented. Keeps `04-stockholm-aulamedica.jpg` as alternate.
- **Strasbourg ISU:** `05-strasbourg-isu.jpg` (genuine ISU Central Campus, keep).
- **ESTEC:** swap to `06-estec-aerial-esa.jpg` (official ESA aerial ESA292679, 7360x4912, ESA / Anneke Le Floc'h, CC BY-SA 3.0 IGO) for a guaranteed attributable source. Keeps `06-estec-aerial.jpg` as backup.

## 4. Notes
- The two already generated clips (Lugo adarve dolly, Santiago facade push) prove the light-touch path works. Do not escalate to heavier edits. Keep them unless we want the enrichment pass.
- Going forward, generate every remaining city clip with the recipe above. London skips the still. Stockholm uses the winter reference. ESTEC uses the official ESA aerial with a shallow drift, not an orbit.
- Record author and license per file in project credits, honour share alike on any published derivative.
