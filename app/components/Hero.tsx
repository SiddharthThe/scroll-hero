"use client";

import { useEffect, useRef, useState } from "react";
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
  const carImgRef = useRef<HTMLImageElement | null>(null);
  const statsWrapRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef(false);

  const [carSrc, setCarSrc] = useState("/porsche.png");

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinOk: "(min-width: 420px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
      const ctx = gsap.context(() => {
        const section = sectionRef.current;
        const carOuter = carOuterRef.current;
        const carMotion = carMotionRef.current;
        const carImg = carImgRef.current;
        const wipe = wipeRef.current;
        const headlineWrap = headlineWrapRef.current;
        const statsWrap = statsWrapRef.current;

        if (!section || !carOuter || !carMotion || !carImg || !wipe || !headlineWrap || !statsWrap) return;

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

      return () => ctx.revert();
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
      className="relative h-screen w-full overflow-hidden bg-[#080808]"
    >
      {/* Background glow (subtle, premium) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_40%,rgba(255,255,255,0.045),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_30%_65%,rgba(255,255,255,0.02),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Headline */}
        <div
          ref={headlineWrapRef}
          className="relative w-full max-w-[1200px]"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Muted base text (letter-by-letter load reveal) */}
          <HeadlineLetters
            className="whitespace-nowrap text-center font-bold uppercase leading-none text-white/10"
            letterClassName="hero-letter--muted inline-block text-[clamp(3.25rem,11.5vw,9rem)] tracking-[0.08em]"
          />

          {/* Bright gradient text layer (revealed by wipe) */}
          <div className="absolute inset-0 overflow-hidden whitespace-nowrap">
            <HeadlineLetters
              className="whitespace-nowrap text-center font-bold uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300"
              letterClassName="inline-block text-[clamp(3.25rem,11.5vw,9rem)] tracking-[0.08em]"
            />

            {/* Wipe cover: slides right on scroll (transform-only) */}
            <div
              ref={wipeRef}
              className="absolute inset-0 bg-[#080808]"
              style={{ willChange: "transform" }}
            />
          </div>

          {/* Underline glow */}
          <div className="pointer-events-none mx-auto mt-6 h-px w-[min(560px,80vw)] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <div className="pointer-events-none mx-auto mt-2 h-6 w-[min(520px,75vw)] bg-white/[0.06] blur-2xl" />
        </div>

        {/* Stats cards */}
        <div
          ref={statsWrapRef}
          className="mt-12 flex w-full max-w-4xl flex-col gap-4 md:flex-row md:gap-6"
          style={{ willChange: "transform, opacity" }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="hero-stat flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-6 backdrop-blur-md"
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
              setCarSrc("/porsche.png");
            }}
          />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 select-none">
        <div className="flex flex-col items-center gap-3 opacity-40">
          <span className="text-[9px] font-mono uppercase tracking-[0.38em] text-white">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
