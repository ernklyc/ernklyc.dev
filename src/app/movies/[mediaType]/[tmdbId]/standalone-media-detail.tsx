"use client";

import { useRouter } from "next/navigation";
import LiveMediaDialog from "@/features/movies/LiveMediaDialog";
import type { MediaType } from "@/features/movies/models";

export default function StandaloneMediaDetail({
  mediaType,
  tmdbId,
}: {
  mediaType: MediaType;
  tmdbId: number;
}) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#080b0f]">
      <LiveMediaDialog
        item={{
          id: tmdbId,
          title: "Yapım",
          originalTitle: "",
          year: null,
          mediaType,
          posterPath: null,
          favorite: false,
          imdbId: null,
        }}
        onClose={() => router.push("/movies")}
      />
    </main>
  );
}
