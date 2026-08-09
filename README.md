# mcebral.com

My personal site. It holds the CV, the story of how a biotechnologist from Galicia ended up working in space, and a gallery of the things I build.

Live at [mcebral.com](https://mcebral.com).

## What is in it

The site reads in three languages, English, Spanish and Galician, and the switch is real: the CV entries, the project copy and the long form About narrative are each written three times rather than run through a translator. Institution names, grades and award titles stay in their own language, because a "Premio Extraordinario Fin de Carrera" is the name of a thing and not a sentence.

Where a project has a number attached to it, the number carries the source it came from. An empty slot is honest, an invented figure is not.

There is also a Space Invaders game hidden in here. Finding it is the point.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Layout

| Path | What lives there |
|---|---|
| `src/app/` | The routes. Home, About, CV, journey, articles and contact |
| `src/components/` | The site itself. Hero, header, project cards, the game, the backgrounds |
| `src/data/` | The content. CV entries, projects and the rotating quotes, all in three languages |
| `src/context/` | The language switch |
| `scripts/` | Small tools, such as the one that regenerates the project card posters |
| `public/` | Logos, portraits, project previews and the CV |

## Stack

Next.js with the App Router, TypeScript and Tailwind. Deployed on Vercel.
