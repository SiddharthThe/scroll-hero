# Scroll-Driven Hero Section (ITZFIZZ)

Recreation of the scroll-driven hero animation inspired by:
https://paraschaturvedi.github.io/car-scroll-animation

## Links (required)

- Live webpage: <ADD_LIVE_LINK_HERE>
- GitHub repo: <ADD_REPO_LINK_HERE>

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- GSAP + ScrollTrigger

## What’s implemented

- Above-the-fold hero with letter-spaced headline
- On-load intro: headline reveal + staggered stats
- Scroll-linked animation: pinned, scrubbed motion with GSAP ScrollTrigger
- Performance: transform/opacity animations, no raw scroll listeners

## Local Development

```bash
npm install
npm run dev
```

## Build a submission folder (`dist/`)

This repo is configured to generate a static export and copy it into `dist/`:

```bash
npm run build:dist
```

## Notes for GitHub Pages

GitHub Pages serves sites under `/<repo>/`. For that, set `NEXT_PUBLIC_BASE_PATH` when building:

```bash
set NEXT_PUBLIC_BASE_PATH=/your-repo-name
npm run build:dist
```

