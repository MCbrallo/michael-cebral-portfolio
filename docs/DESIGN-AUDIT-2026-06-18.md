# mcebral.com — Design & Content Audit

**Date:** 2026-06-18
**Method:** Multi-agent audit (7 area readers + live site, 7 dimensional deep-dives, 1 synthesis). Key claims spot-verified against source.

---

## 1. Verdict

Today mcebral.com is a high-craft, design-forward personal site with a genuinely premium dark-editorial identity (deep black, champagne gold, serif display over a galaxy), a rare and warm trilingual /about narrative, a credible scholarship-heavy CV, and a complete hidden Space Invaders game that proves real engineering range. Its biggest strength is the writing and the visual identity: the /about story reads like a person, not a LinkedIn summary, and the brand looks expensive. The single thing most holding it back is a positioning and product gap dressed as a strategy: the site brands you a "Science Communicator" while showing zero communication work, the nav points "articles" at a hardcoded Projects gallery, the hero gives a recruiter no value proposition, and the technical foundation carries ~198MB of mostly unlicensed commercial MP3s plus a dead three.js bundle. It is a beautiful instrument playing the wrong song.

## 2. Scorecard

| Dimension | Score | One-line note |
|---|---|---|
| Visual design & art direction | 6.5/10 | Confident dark-editorial identity, but gold exists as 3 divergent values and the galaxy is muted into near-black. |
| UX, IA & navigation | 5.5/10 | Polished per-page UX on a broken spine: the articles route is a Projects gallery, hero has no value prop or CTA. |
| Content, narrative & positioning | 6/10 | Excellent voice and verifiable CV, fractured by a "communicator" claim with no communication proof. |
| Performance & code architecture | 3.5/10 | 198MB public/ (158MB commercial MP3s), dead three.js on the homepage, zero code-splitting. |
| Accessibility & inclusive design | 3/10 | No prefers-reduced-motion anywhere, no focus rings, html{zoom:0.8}, html lang stuck on "en". |
| SEO, metadata & discoverability | 2/10 | Default Next metadata only: no OG, no sitemap, no JSON-LD, every page shares one generic title. |
| Aspirational benchmark & vision | 5.5/10 | Award-tier craft punching below its strategic weight; a craft showcase masquerading as a strategy. |

## 3. What is genuinely working (do not break these)

- **The /about narrative.** Warm, specific, self-aware first-person voice ("a place full of rain, character, humour, stubbornness", "almost suspiciously tailored to my interests", "Enjoy living, learning and laughing") with an earned arc and a real emotional beat ("Both foundations believed in a kid from Lugo"). Fully native trilingual including Galician. This is your strongest single asset.
- **The visual identity and type system.** globals.css forcing all h1-h6 to Playfair at -0.03em, the Playfair/Bodoni/Inter trio, the white/60 to white/40 to white/20 opacity ladder, the translucent blurred header. It reads as authored art direction.
- **The signature hero effect.** The ChromaticText RGB-split on the name plus the click-to-cycle science quote is a memorable, high-craft "wow" moment.
- **The CV substance.** Real institutions (KTH/SciLifeLab, Karolinska, UCL, USC, ISU, ESA), concrete deliverables (NASA Rodent Research 9 spatial transcriptomics, recombinant spider silk, qPCR/ELISA/flow), real grades (9.2/10, VG), named scholarships with working links.
- **The Space Invaders game and the about music player UI.** A complete 6-sector game with a DOOM boss, synthesized Web Audio SFX, and real mobile controls; an elegant restrained player UI. Keep the craft. (The discoverability and the licensed audio are separate problems, below.)
- **Correct technical instincts where they exist.** Music and game audio are truly lazy-loaded, next/image is used well on the /about grid, decorative canvases carry aria-hidden, music is user-initiated not autoplayed.

## 4. The 5 things hurting it most

**1. You claim "Science Communicator" but communicate nothing.**
Evidence: layout.tsx title and the hero subtitle brand you a Science Communicator; the CV subtitle repeats it. Yet `src/content/` does not exist, `getAllArticles()` always returns [], every /articles/[slug] 404s, and /articles itself is a hardcoded Projects gallery (articles/page.tsx title "Projects | Michael Cebral"). The narrative even promises threads it never pays off ("never stopped cooking, competing, or telling people about where I come from", "food that makes you close your eyes") while empanada.jpeg and childhood-kitchen.jpeg sit unused in /public/about.
Fix: Either reposition honestly to what you are today (a biotech researcher moving into space, bridging the two) or ship 3-4 real science-communication pieces. The half-built Mantis-shrimp vision simulator already exists. Pick one path; do not keep asserting an unproven identity.

**2. ~198MB public payload, ~158MB of unlicensed commercial MP3s.**
Evidence: public/music = 158MB (song-11.mp3 = 28MB, song-6.mp3 = 15MB, 14 tracks), plus doom.mp3 16.5MB and game-music.mp3 12MB. Sixteen copyrighted tracks (Billy Joel, Oasis, Foo Fighters, A7X, Mick Gordon) redistributed verbatim from a public personal-brand site. This is bandwidth/CDN cost, slow clones and deploys, and genuine takedown/legal exposure for near-zero recruiter value.
Fix: Drop the commercial MP3s. Keep the synthesized Web Audio SFX (the impressive part). If music must stay, embed a Spotify/YouTube playlist. Move any remaining large media out of git to object storage or git-lfs.

**3. The navigation lies and the hero gives no orientation.**
Evidence: the nav item for writing routes to /articles, but that route renders a Projects gallery whose page title is "Projects", so label, URL, and content disagree. The hero (page.tsx renders only `<HeroSection/>`) has zero internal links or buttons: name, one role label, a quote, an alien gag, no value proposition, no CTA. A cold recruiter cannot answer "who is this, what does he do, where do I go".
Fix: Move Projects to /projects, align nav label, route, and title. Add one positioning sentence plus a primary CTA (View CV / See work) beneath the name. Leave /articles free for real writing.

**4. The technical foundation ships weight for nothing and breaks accessibility.**
Evidence: HeroSection.tsx:4 statically imports Stardust, which pulls the entire three.js/react-three-fiber/drei chain and is never rendered (MilkyWay and IdentityCycler also render nowhere; maath is in deps and used nowhere). No `next/dynamic` anywhere, so the 1,012-line Space Invaders sits in the homepage bundle. next.config.ts has no image/perf config beyond an Unsplash allowlist. Both galaxy videos preload="auto". And there is zero prefers-reduced-motion handling and zero focus-visible styling in the whole codebase, while html{zoom:0.8} sabotages user zoom.
Fix: Delete the dead three.js import and uninstall three/r3f/drei/maath; dynamic-import the game; add an image/perf layer to next.config; set video preload to metadata with a poster. Add a global @media (prefers-reduced-motion: reduce) reset and a `:focus-visible { outline: 2px solid var(--color-gold) }`.

**5. SEO and shareability are at the Next.js default floor.**
Evidence: no metadataBase, no Open Graph or Twitter card, no sitemap.ts, no robots.ts, no JSON-LD, no hreflang. /about, /about/cv, and /contact are all `'use client'`, so they cannot emit per-route metadata and all inherit the identical generic title. A pasted link unfurls bare; a Google search for your name surfaces one thin, undifferentiated result that undersells a scholarship-heavy founder/researcher.
Fix: Add metadataBase + OG/Twitter + a 1200x630 gold-MC-on-black image; add sitemap.ts, robots.ts, and Person JSON-LD (alumniOf KTH/Karolinska/USC/ISU, sameAs LinkedIn, awards la Caixa/Barrié); refactor the three client routes into thin server pages that export their own metadata.

## 5. Roadmap

### Quick wins (high impact, low effort)

- **Cut the music library** (impact high). Remove commercial /about and game MP3s, keep synthesized SFX, optionally embed Spotify. Kills ~158MB and the legal liability in one move.
- **Fix positioning and the nav** (impact high). Reposition the layout title and hero subtitle from "Science Communicator" to the founder/researcher framing; move Projects to /projects; remove dead Footer/Vignette/Stardust imports.
- **Anchor the hero** (impact high). Add one honest positioning line and a primary CTA beneath the name, e.g. "Biotechnology researcher working at the intersection of biology and space, now studying space business at ISU." Keep the alien gag as secondary delight.
- **Add the metadata layer** (impact high). metadataBase + OG/Twitter card + static OG image; sitemap.ts; robots.ts; Person JSON-LD. Highest impact-per-effort on the SEO axis.
- **Unify the gold and redraw the favicon** (impact high). Replace the hardcoded #FFD700 (globals.css, HeroSection.tsx:28) with var(--color-gold) #D4AF37; redraw icon.svg as a gold "MC" in Playfair/Bodoni so favicon, logo, and palette agree.
- **Swap the flat scrim for a radial gradient** (impact high). Replace layout.tsx bg-black/60 with an edge-weighted radial mask so the galaxy reads as space rather than near-black. Highest visual payoff for the bandwidth already spent.
- **Add global reduced-motion + focus rings** (impact high, a11y). One @media reduced-motion reset (swap video for poster) and one `:focus-visible` gold outline.
- **Remove dead three.js and dynamic-import the game** (impact high, perf). Strips hundreds of KB from the landing JS for zero visual loss.
- **Add a CV highlights strip** (impact high). Surface 9.2/10, la Caixa + Barrié scholarships, NASA RR-9, ESA school as a row above the timeline so a recruiter gets the proof in two seconds.
- **Sanitize off-brand copy and honour house style** (impact medium). Soften the alien "SCREW YOU! HELP" bubble, remove the risque Feynman quote, and replace the em-dash CV bullet glyph with a dot or hairline.

### Bigger bets (medium effort)

- **Turn outbound projects into internal case studies** (impact high). Build /projects/[slug] with problem, approach, visuals, outcome, and the outbound link as a secondary CTA. Keeps visitors on-site at peak intent and lifts dwell time + SEO.
- **Make the three client routes server-renderable** (impact high). Thin server page.tsx exporting metadata, rendering the existing client UI as a child, so /about, /about/cv, /contact get distinct titles/descriptions/OG.
- **Ship the flagship Mantis science-communication piece** (impact high). Write the MDX, add the paired images, add an honest caption clarifying the simulator is an artistic illustration of polarized/hyperspectral perception, not a calibrated reconstruction. Converts the positioning from claim to evidence and proves the dead pipeline.
- **Make i18n real and persistent** (impact medium). App Router [locale] segments or next-intl: persist locale, sync html lang, emit hreflang, localize metadata, wire the orphaned emailDesc/linkedinDesc keys. Either write a genuine Galician CV or hide GL where it falls back to Spanish.
- **Move the /about essay to a data layer** (impact medium). Extract the triplicated trilingual narrative into a per-language content array with each paragraph carrying its photo id by name. Kills 300 lines of duplication and makes PhotoLinks reference-safe (several currently point at the wrong figure).
- **Replace html{zoom:0.8} with a fluid clamp-based type/space scale** (impact medium). Intentional cross-browser density that respects user zoom and fixes rem math.
- **Refactor the game and about page into typed, data-driven modules** (impact medium). Type the gameRef `any` state, extract duplicated normal/boss logic, split the 853-line about page.

### Moonshots (high effort, high ceiling)

- **The "Signal" trajectory map.** Replace the empty /about/experiences stub (currently "[ Map area cleared ]") with a country-clustered world map of Lugo → London → Santiago → Stockholm → Strasbourg, using experiences.json which is already keyed SE/GB/ES/FR/BE, tied to the sector/signal motif. An explorable narrative only you could have.
- **Rebuild the homepage as a guided first-impression flow.** Hero value-prop + CTA → credibility strip (la Caixa/Barrié/ISU/Karolinska/NASA RR-9 logos) → featured projects → contact, all on one scroll, with the ambient art direction and alien kept as delight.
- **Decide the 3D story for real.** Either mount one tuned, reduced-motion r3f scene that visualizes meaningful space/orbital data behind the hero, or delete three/drei entirely. Right now it is the worst of both: shipped weight, zero payoff.
- **A compounding science-comm engine.** Once /articles is real: RSS, JSON-LD Article schema, per-slug OG images, reading-time, and a "field notes from biotech to space" framing so the site becomes a living body of work that builds authority over time. Add a CI performance budget (Lighthouse CI + bundle-analyzer) so regressions fail the build.

## 6. Kill list

- **The ~158MB of commercial MP3s** (public/music, doom.mp3, game-music.mp3). Legal exposure plus bandwidth for near-zero recruiter value. Replace with synthesized SFX + an optional embed.
- **The three.js / r3f / drei / maath dependency chain.** One consumer (Stardust) that renders nothing. Delete and uninstall.
- **Dead components and routes.** Stardust, MilkyWay, IdentityCycler (render nowhere), CVSection.tsx (unused, inconsistent old design system), Vignette (commented out), and the empty /about/experiences stub. Either mount Footer.tsx globally (it has the closing CTA the site lacks) or delete it too.
- **The redundant token source of truth.** Delete the :root block; keep @theme inline as the single source. Reconcile the divergent white/glass values. Drop unused --color-gold-dim and --color-glass-highlight.
- **Redundant assets.** The three unused 0.8-1.1MB about PNGs (galicia-forest, lugo-walls, galicia-atlantic), and the duplicate logo PNG+SVG pairs (keep SVG only). Convert remaining raster assets to AVIF/WebP.
- **Off-brand copy.** The "SCREW YOU! HELP" alien bubble and the "Physics is like sex" quote. Witty stays; unprofessional goes.
- **html{zoom:0.8}.** A fragile hack; replace with a real scale.
- **The dead i18n wiring.** Unused emailDesc/linkedinDesc keys, unused toggleLanguage, the stale "en/es" comment. Wire them in or remove them.

## 7. Next-version vision

The elevated mcebral.com keeps every gram of its current craft but finally tells the truth and points it at your career. A cold visitor lands and within five seconds reads who you are (a biotech researcher bridging biology and space, ISU, Karolinska, ESA), sees the proof (a credibility strip of scholarships and NASA RR-9), and has a clear next action, all over a galaxy that actually looks like a galaxy. The work lives on-site as real case studies that link out rather than leaking every visitor off-domain, and the "Science Communication" claim is earned by at least one flagship explainer built on the Mantis pipeline. The trilingual promise is real: /es and /gl serve persistent, crawlable, hreflang-tagged pages that reinforce the Lugo identity the story leans on. Under the hood it is lean, fast, accessible, and legally clean: no commercial MP3s, no dead 3D bundle, reduced-motion respected, every shared link unfurling a branded gold-MC card. The same instrument, now playing the right song, working as a compounding authority engine for a founder who is genuinely rare.
