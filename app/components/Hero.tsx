"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = ["WELCOME", "ITZFIZZ"];
const STATS = [
  { value: "85%", label: "Performance" },
  { value: "120+", label: "Projects" },
  { value: "4.9★", label: "Rating" },
];

const INTRO_EASE = "expo.out";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const visualWrapRef = useRef<HTMLDivElement>(null);
  const visualInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgFarRef = useRef<HTMLDivElement>(null);
  const bgNearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = headlineRef.current?.querySelectorAll<HTMLSpanElement>(".hero-letter");
      const statItems = statsRef.current?.querySelectorAll<HTMLDivElement>(".hero-stat");
      const statDividers = statsRef.current?.querySelectorAll<HTMLDivElement>(".hero-divider");

      if (!letters?.length || !statItems?.length) return;

      // Initial load sequence: progressive reveal with blur reduction
      // to establish a polished first impression before scroll takeover.
      const intro = gsap.timeline({
        defaults: { ease: INTRO_EASE, duration: 1.1 },
        delay: 0.12,
      });

      gsap.set(letters, { opacity: 0, y: 30, filter: "blur(10px)" });
      gsap.set(statItems, { opacity: 0, y: 20, filter: "blur(8px)" });
      gsap.set(visualWrapRef.current, { opacity: 0, y: 84, scale: 0.9 });
      if (statDividers?.length) gsap.set(statDividers, { scaleY: 0 });

      intro.to(letters, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.028,
      });

      intro.to(
        statItems,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.09,
          duration: 0.8,
        },
        "-=0.42"
      );

      if (statDividers?.length) {
        intro.to(
          statDividers,
          {
            scaleY: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "sine.out",
          },
          "-=0.36"
        );
      }

      intro.to(
        visualWrapRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.45,
          ease: "power3.out",
        },
        "-=0.66"
      );

      // Scroll-linked cinematic sequence with layered depth.
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "sine.inOut" },
      });

      scrollTl.to(bgFarRef.current, { yPercent: -12, opacity: 0.55 }, 0);
      scrollTl.to(bgNearRef.current, { yPercent: -22, opacity: 0.36 }, 0);

      scrollTl.to(
        contentRef.current,
        {
          scale: 0.94,
          yPercent: -7,
          opacity: 0.9,
        },
        0
      );

      scrollTl.to(
        headlineRef.current,
        {
          yPercent: -20,
          opacity: 0.28,
        },
        0.04
      );

      scrollTl.to(
        statsRef.current,
        {
          yPercent: -12,
          opacity: 0.42,
        },
        0.08
      );

      scrollTl.to(
        visualWrapRef.current,
        {
          xPercent: 64,
          yPercent: -12,
          scale: 0.76,
          opacity: 0,
        },
        0
      );

      scrollTl.to(
        visualInnerRef.current,
        {
          xPercent: -18,
          scale: 1.08,
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-neutral-950"
    >
      <div
        ref={bgFarRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_38%,rgba(255,255,255,0.09),transparent_72%)]"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        ref={bgNearRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_60%_64%,rgba(255,255,255,0.06),transparent_78%)]"
        style={{ willChange: "transform, opacity" }}
      />

      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h1
          ref={headlineRef}
          className="mb-12 flex flex-wrap items-center justify-center gap-x-8 text-4xl font-light tracking-[0.2em] text-white sm:text-5xl md:text-7xl lg:text-8xl"
          aria-label="WELCOME ITZFIZZ"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {HEADLINE_WORDS.map((word, wi) => (
            <span
              key={wi}
              className="flex gap-x-[0.12em] sm:gap-x-[0.14em] md:gap-x-[0.16em]"
            >
              {word.split("").map((char, ci) => (
                <span
                  key={`${wi}-${ci}`}
                  className="hero-letter inline-block"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <dl
          ref={statsRef}
          className="flex items-center gap-7 sm:gap-11 md:gap-16"
          style={{ willChange: "transform, opacity" }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-7 sm:gap-11 md:gap-16">
              <div className="hero-stat">
                <dt className="text-[11px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                  {stat.value}
                </dd>
              </div>

              {i < STATS.length - 1 && (
                <div
                  className="hero-divider h-10 w-px origin-center bg-white/15"
                  style={{ willChange: "transform" }}
                />
              )}
            </div>
          ))}
        </dl>
      </div>

      <div
        ref={visualWrapRef}
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 [will-change:transform,opacity]"
        style={{ willChange: "transform, opacity" }}
      >
        <div
          ref={visualInnerRef}
          className="relative h-[360px] w-[260px] overflow-hidden rounded-t-[2rem] border border-white/15 bg-white/5 sm:h-[440px] sm:w-[320px] md:h-[520px] md:w-[380px]"
          style={{ willChange: "transform" }}
        >
          <Image
            src="/hero-visual.svg"
            alt="Abstract futuristic interface"
            fill
            priority
            sizes="(max-width: 768px) 260px, (max-width: 1024px) 320px, 380px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        </div>
      </div>
    </section>
  );
}
