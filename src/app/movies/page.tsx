import type { Metadata } from "next";
import MoviesDemo from "@/features/movies/MoviesDemo";

export const metadata: Metadata = {
  title: "İzlediklerim",
  description: "İzlediğim filmler, diziler ve kişisel favorilerim.",
  alternates: { canonical: "/movies" },
};

export default function MoviesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24 pt-32 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-[1] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#a9b7c4]/[0.055] blur-[120px]"
      />

      <section className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-[#a9b7c4] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a9b7c4] shadow-[0_0_12px_#a9b7c4]" />
            Sinema günlüğü
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
            İzlediklerim<span className="text-[#a9b7c4]">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Bende iz bırakan filmler, diziler ve dönüp yeniden bakmak istediklerim.
            Arşivde ada göre arayabilir veya türüne göre süzebilirsin.
          </p>
        </header>

        <MoviesDemo />
      </section>
    </main>
  );
}
