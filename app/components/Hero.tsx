"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ";

const STATS = [
  { value: 58, suffix: "%", label: "Increase in pick-up point use" },
  { value: 23, suffix: "%", label: "Decrease in customer phone calls" },
  { value: 40, suffix: "%", label: "Decrease in support calls" },
];

function HeadlineLetters({
  className,
  letterClassName,
}: {
  className: string;
  letterClassName: string;
}) {
  return (
    <h1
      className={className}
      aria-label={HEADLINE}
      style={{ fontFamily: "var(--font-oswald), 'Arial Narrow', Arial, sans-serif" }}
    >
      {HEADLINE.split("").map((ch, i) => (
        <span
          key={i}
          className={letterClassName}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineWrapRef = useRef<HTMLDivElement | null>(null);
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const carOuterRef = useRef<HTMLDivElement | null>(null);
  const carMotionRef = useRef<HTMLDivElement | null>(null);
  const headlightRef = useRef<HTMLDivElement | null>(null);
  const fogRef = useRef<HTMLDivElement | null>(null);
  const carImgRef = useRef<HTMLImageElement | null>(null);
  const statsWrapRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef(false);

  // Use a relative URL so static exports work under subpaths (e.g. GitHub Pages).
  const [carSrc, setCarSrc] = useState("porsche.png");

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinOk: "(min-width: 420px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
      let heroTrigger: ScrollTrigger | null = null;

      const ctx = gsap.context(() => {
        const section = sectionRef.current;
        const carOuter = carOuterRef.current;
        const carMotion = carMotionRef.current;
        const headlight = headlightRef.current;
        const fog = fogRef.current;
        const carImg = carImgRef.current;
        const wipe = wipeRef.current;
        const headlineWrap = headlineWrapRef.current;
        const statsWrap = statsWrapRef.current;

        if (!section || !carOuter || !carMotion || !carImg || !headlight || !fog || !wipe || !headlineWrap || !statsWrap) return;

        const conditions = context.conditions as unknown as {
          pinOk?: boolean;
          reduceMotion?: boolean;
        };
        const pinEnabled = Boolean(conditions.pinOk) && !Boolean(conditions.reduceMotion);

        const mutedLetters = headlineWrap.querySelectorAll<HTMLSpanElement>(
          ".hero-letter--muted"
        );
        const statCards = statsWrap.querySelectorAll<HTMLDivElement>(".hero-stat");
        const statValues = statsWrap.querySelectorAll<HTMLElement>(".hero-stat-value");

        // Reduced motion: render a stable, fully readable hero.
        if (conditions.reduceMotion) {
          gsap.set(mutedLetters, { opacity: 1, y: 0 });
          gsap.set(statCards, { opacity: 1, y: 0, scale: 1 });
          gsap.set(wipe, { xPercent: 100 });
          gsap.set(headlight, { opacity: 0.85 });
          gsap.set(fog, { opacity: 0.25, x: -24 });

          statValues.forEach((el) => {
            const target = Number(el.getAttribute("data-value") ?? "0");
            const suffix = el.getAttribute("data-suffix") ?? "";
            el.textContent = `${Number.isFinite(target) ? Math.round(target) : 0}${suffix}`;
          });

          return;
        }

        // ── Intro (premium load) ─────────────────────────────────────────
        gsap.set(mutedLetters, { opacity: 0, y: 22 });
        gsap.set(statCards, { opacity: 0, y: 18, scale: 0.95 });
        gsap.set(carMotion, { x: 0, opacity: 1, rotate: 0, scale: 1 });
        gsap.set(wipe, { xPercent: 0 });
        // Headlights on at start (visible immediately on load)
        gsap.set(headlight, { opacity: 0.95, scale: 1 });
        gsap.set(fog, { opacity: 0.0, x: 0 });

        const intro = gsap.timeline({ delay: 0.12 });
        intro.to(mutedLetters, {
          opacity: 1,
          y: 0,
          duration: 1.35,
          ease: "power3.out",
          stagger: 0.03,
        });
        intro.to(
          statCards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.55"
        );

        // ── Master scroll timeline ───────────────────────────────────────
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            id: "hero-scroll",
            trigger: section,
            start: "top top",
            end: "+=2000",
            scrub: 1,
            pin: pinEnabled,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        heroTrigger = scrollTl.scrollTrigger ?? null;

        // Car: starts left, ends with ~20% of width still visible
        scrollTl.to(
          carMotion,
          {
            x: () => {
              const outerRect = carOuter.getBoundingClientRect();
              const motionRect = carMotion.getBoundingClientRect();
              const startLeft = outerRect.left;
              const carW = motionRect.width;
              return window.innerWidth - carW * 0.2 - startLeft;
            },
            ease: "none",
          },
          0
        );

        // Subtle scale/rotation for cinematic weight
        scrollTl.to(
          carMotion,
          { scale: 1.03, rotate: 0.4, ease: "none", transformOrigin: "50% 50%" },
          0
        );

        // Text reveal: wipe slides right, uncovering the bright gradient layer
        scrollTl.to(
          wipe,
          { xPercent: 100, ease: "none" },
          0
        );

        // Headlight glow follows the car (anchored inside the moving wrapper)
        scrollTl.to(
          headlight,
          { opacity: 0.98, scale: 1, ease: "none" },
          0.02
        );

        // Fog/smoke trail appears behind the car
        scrollTl.to(
          fog,
          { opacity: 0.28, x: -48, ease: "none" },
          0.06
        );

        // Counters: scroll-driven innerText (snapped) — elegant and minimal
        statValues.forEach((el) => {
          const target = Number(el.getAttribute("data-value") ?? "0");
          const suffix = el.getAttribute("data-suffix") ?? "";

          scrollTl.to(
            el,
            {
              innerText: target,
              snap: { innerText: 1 },
              ease: "none",
              modifiers: {
                innerText: (v: string) => `${Math.round(Number(v))}${suffix}`,
              },
            },
            0.12
          );
        });

        // Subtle fade near end (keeps it expensive, not dramatic)
        scrollTl.to(
          headlineWrap,
          { opacity: 0.78, scale: 0.985, ease: "none" },
          0.78
        );
        scrollTl.to(
          statsWrap,
          { opacity: 0.4, y: -10, ease: "none" },
          0.82
        );
        scrollTl.to(
          carMotion,
          { opacity: 0.35, ease: "none" },
          0.9
        );
      }, sectionRef);

      return () => {
        // Kill pin/spacer first to avoid DOM mismatch during unmount/HMR.
        heroTrigger?.kill(true);
        ctx.revert();
      };
    }
    );

    return () => {
      mm.revert();
      didInit.current = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-zinc-950"
    >
      <div className="relative z-10 flex h-full flex-col justify-center px-6">
        {/* Headline */}
        <div
          ref={headlineWrapRef}
          className="relative w-full max-w-[1200px] mx-auto"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Muted base text (letter-by-letter load reveal) */}
          <HeadlineLetters
            className="whitespace-nowrap text-left font-bold uppercase leading-none text-zinc-500/25"
            letterClassName="hero-letter--muted inline-block text-[clamp(3.25rem,11.5vw,9rem)] tracking-[0.1em]"
          />

          {/* Bright gradient text layer (revealed by wipe) */}
          <div className="absolute inset-0 overflow-hidden whitespace-nowrap">
            <HeadlineLetters
              className="whitespace-nowrap text-left font-bold uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400"
              letterClassName="inline-block text-[clamp(3.25rem,11.5vw,9rem)] tracking-[0.1em]"
            />

            {/* Wipe cover: slides right on scroll (transform-only) */}
            <div
              ref={wipeRef}
              className="absolute inset-0 bg-zinc-950"
              style={{ willChange: "transform" }}
            />
          </div>

          {/* Underline glow */}
          <div className="pointer-events-none mx-auto mt-6 h-px w-[min(560px,80vw)] bg-gradient-to-r from-transparent via-amber-200/35 to-transparent" />
          <div className="pointer-events-none mx-auto mt-2 h-6 w-[min(520px,75vw)] bg-amber-200/[0.08] blur-2xl" />
        </div>

        {/* Stats cards */}
        <div
          ref={statsWrapRef}
          className="mt-12 flex w-full max-w-4xl flex-col gap-4 md:flex-row md:gap-6 mx-auto"
          style={{ willChange: "transform, opacity" }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="hero-stat flex-1 rounded-2xl border border-white/15 bg-white/[0.075] px-7 py-6 backdrop-blur-sm"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="text-4xl font-semibold tabular-nums text-white md:text-5xl">
                <span
                  className="hero-stat-value"
                  data-value={s.value}
                  data-suffix={s.suffix}
                  style={{ willChange: "contents" }}
                >
                  0{s.suffix}
                </span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.26em] text-white/45">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Car (starts left, moves across with scroll) */}
      <div
        ref={carOuterRef}
        className="pointer-events-none absolute left-[clamp(18px,6vw,84px)] top-1/2 z-30 -translate-y-1/2"
      >
        <div ref={carMotionRef} style={{ willChange: "transform, opacity" }}>
          {/* Fog / smoke trail */}
          <div
            ref={fogRef}
            className="absolute left-[-120px] top-1/2 -translate-y-1/2"
            style={{ willChange: "transform, opacity" }}
            aria-hidden="true"
          >
            <div className="h-24 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.20),rgba(255,255,255,0.00))] blur-2xl" />
            <div className="-mt-10 ml-10 h-20 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.16),rgba(255,255,255,0.00))] blur-2xl" />
          </div>

          {/* Headlight / front glow */}
          <div
            ref={headlightRef}
            className="absolute right-[-110px] top-[62%] -translate-y-1/2"
            style={{ willChange: "transform, opacity", opacity: 0.95 }}
            aria-hidden="true"
          >
            <div className="h-12 w-56 bg-[radial-gradient(closest-side,rgba(255,255,255,0.48),rgba(255,255,255,0.00))] blur-2xl" />
            <div className="-mt-6 ml-12 h-10 w-72 bg-[radial-gradient(closest-side,rgba(255,80,40,0.26),rgba(255,80,40,0.00))] blur-2xl" />
          </div>

          <img
            ref={carImgRef}
            src={carSrc}
            alt="Porsche"
            className="block w-[clamp(240px,38vw,640px)] select-none"
            style={{
              filter:
                "drop-shadow(0 18px 64px rgba(0,0,0,0.85)) drop-shadow(0 0 120px rgba(255,255,255,0.06))",
              imageRendering: "auto",
            }}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            onError={() => {
              // If the asset is missing, avoid looping through broken fallbacks.
              setCarSrc("porsche.png");
            }}
          />
        </div>
      </div>

      {/* Minimal portfolio link */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <a
          href="https://siddharth-11-portfolio.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-[11px] font-mono uppercase tracking-[0.32em] text-white/45 transition hover:text-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <span className="border-b border-transparent pb-0.5 transition hover:border-white/40 focus-visible:border-white/40">
            View portfolio
          </span>
        </a>
      </div>
    </section>
  );
}
