import Hero from "./components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Content below — enters view after pinned hero finishes */}
      <section className="relative z-10 bg-[#050505] px-6 py-40">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light tracking-wide text-white/80 md:text-5xl">
            Crafted with precision
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/30 md:text-lg">
            Every animation is tied to scroll progress — smooth, intentional,
            and built for performance.
          </p>
        </div>
      </section>

      <section className="h-screen bg-[#050505]" />
    </main>
  );
}
