import { NextResponse } from "next/server";
import {
  getLiveMediaDetails,
  TmdbConfigurationError,
  type TmdbMediaType,
} from "@/features/movies/server/tmdb";

type RouteContext = {
  params: Promise<{ mediaType: string; tmdbId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { mediaType, tmdbId } = await context.params;
  const numericTmdbId = Number(tmdbId);

  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !Number.isSafeInteger(numericTmdbId) ||
    numericTmdbId <= 0
  ) {
    return NextResponse.json({ error: "Geçersiz yapım türü veya TMDB ID." }, { status: 400 });
  }

  try {
    const data = await getLiveMediaDetails(mediaType as TmdbMediaType, numericTmdbId);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    if (error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    console.error("TMDB detail request failed", error);
    return NextResponse.json({ error: "Güncel yapım bilgileri alınamadı." }, { status: 502 });
  }
}
