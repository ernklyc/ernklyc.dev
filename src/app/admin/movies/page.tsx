"use client";

import ApiUsageCard from "@/features/movies/ApiUsageCard";
import MoviesDemo from "@/features/movies/MoviesDemo";

export default function AdminMoviesPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-6xl">
      <ApiUsageCard />
      <MoviesDemo />
    </main>
  );
}
