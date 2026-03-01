import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d]">
      <Hero />

      <section className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <p className="text-white/20 text-lg tracking-widest uppercase font-mono">
          Continue your story ↓
        </p>
      </section>
    </main>
  );
}
