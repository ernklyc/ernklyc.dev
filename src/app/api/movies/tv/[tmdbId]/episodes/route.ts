import { NextResponse } from "next/server";
import { episodeFreshness, getImdbEpisodeRatings } from "@/features/movies/server/imdb";
import { getTvIdentity, TmdbConfigurationError } from "@/features/movies/server/tmdb";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteContext = { params: Promise<{ tmdbId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const tmdbId = Number((await context.params).tmdbId);
  if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0) {
    return NextResponse.json({ error: "Geçersiz TMDB ID." }, { status: 400 });
  }

  try {
    const { imdbId, airing } = await getTvIdentity(tmdbId);
    if (!imdbId) return NextResponse.json({ imdbId: null, episodes: [] });

    const freshness = episodeFreshness(airing);
    const episodes = await getImdbEpisodeRatings(imdbId, freshness);
    // stale-while-revalidate YOK: süre dolunca bayat veri değil, taze veri sunulur.
    return NextResponse.json(
      { imdbId, airing, episodes, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": `public, s-maxage=${freshness.httpMaxAgeSec}` } },
    );
  } catch (error) {
    if (error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("IMDb episode ratings request failed", error);
    return NextResponse.json({ error: "IMDb bölüm puanları alınamadı." }, { status: 502 });
  }
}
