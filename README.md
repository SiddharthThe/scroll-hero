# Scroll Hero

A high-performance scroll-driven hero section inspired by modern motion design principles.

## 🚀 Overview

This project recreates a premium hero section with:

- Staggered headline intro animation
- Sequential statistic reveals
- Scroll-linked motion using GSAP ScrollTrigger
- Smooth transform-based animations
- Performance-focused architecture

The animation is tied directly to scroll progress (scrub-based), ensuring fluid and natural interaction.

---

## 🛠 Tech Stack

- Next.js
- React
- Tailwind CSS
- GSAP + ScrollTrigger

---

## 🎯 Key Features

- Scroll-driven animation (scrub-based)
- Transform-only motion (no layout thrashing)
- Staggered intro animation
- Parallax-style visual movement
- Optimized performance
- Clean component structure

---

## ⚡ Performance Considerations

- Only `transform` and `opacity` are animated
- No raw scroll event listeners
- GSAP context cleanup to prevent memory leaks
- Optimized for smooth 60fps motion

---

## 🌍 Live Demo

[Live Website Link Here]

---

## 📦 Installation

```bash
npm install
npm run dev
