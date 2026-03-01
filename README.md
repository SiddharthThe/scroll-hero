# Scroll-Driven Hero Section Animation (ITZFIZZ)

A premium scroll-driven hero section inspired by the reference demo:

https://paraschaturvedi.github.io/car-scroll-animation

This project demonstrates smooth scroll-linked animations using GSAP and modern frontend architecture with Next.js.

---

## 🔗 Required Links

- Live Webpage: https://cinematic-scroll-hero.vercel.app/
- GitHub Repository: https://github.com/SiddharthThe/scroll-hero

---

## 📌 Overview

This project recreates a cinematic, above-the-fold hero section featuring:

- Letter-spaced headline: **WELCOME ITZFIZZ**
- Impact metric/stat cards
- Smooth intro animation (headline + stats)
- Scroll-driven object movement
- Pinned hero section using GSAP ScrollTrigger
- Scroll-synced animation timeline (`scrub: 1`)
- Clean, minimal, premium design

The animation is fully tied to scroll progress — not time-based autoplay.

---

## 🛠 Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Vercel (Deployment)

---

## 🎬 Animation Architecture

A single master GSAP timeline controls:

1. Letter-by-letter headline reveal
2. Statistic card fade & scale animation
3. Animated numeric counters
4. Horizontal object movement synced to scroll
5. Subtle opacity refinement near the end of the scroll

Key ScrollTrigger configuration:

```js
scrollTrigger: {
	trigger: sectionRef.current,
	start: "top top",
	end: "+=2000",
	scrub: 1,
	pin: true,
	anticipatePin: 1
}
```

🚀 Running Locally

Install dependencies:

npm install

Start development server:

npm run dev
