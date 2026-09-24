import { NextResponse } from "next/server";
import { getParentsGuide, ParentsGuideConfigurationError, ParentsGuideRateLimitError } from "@/features/movies/server/parents-guide";
import { TmdbConfigurationError, type TmdbMediaType } from "@/features/movies/server/tmdb";
import { translateToTurkish } from "@/features/movies/server/translate";

export const runtime = "nodejs";
export const maxDuration = 30;

type RouteContext = { params: Promise<{ mediaType: string; tmdbId: string }> };

/** Bir konunun topluluk notlarının Türkçe çevirisi (not sırasıyla; çevrilemeyen null). */
export async function GET(request: Request, context: RouteContext) {
  const { mediaType, tmdbId } = await context.params;
  const numericTmdbId = Number(tmdbId);
  const topicId = Number(new URL(request.url).searchParams.get("topic"));

  if (
    (mediaType !== "movie" && mediaType !== "tv") ||
    !Number.isSafeInteger(numericTmdbId) ||
    numericTmdbId <= 0 ||
    !Number.isSafeInteger(topicId) ||
    topicId <= 0
  ) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    const guide = await getParentsGuide(mediaType as TmdbMediaType, numericTmdbId);
    // Yalnızca rehberdeki gerçek notlar çevrilir; keyfi metin çevirtilemez (kota koruması).
    const topic = guide.available
      ? guide.categories.flatMap((category) => category.topics).find((candidate) => candidate.id === topicId)
      : undefined;
    if (!topic) return NextResponse.json({ translations: [] }, { headers: { "Cache-Control": "public, s-maxage=3600" } });

    const translations: (string | null)[] = [];
    for (const note of topic.notes) translations.push(await translateToTurkish(note.text));

    const complete = translations.every((value) => value !== null);
    return NextResponse.json(
      { translations },
      { headers: { "Cache-Control": complete ? "public, s-maxage=2592000, stale-while-revalidate=2592000" : "no-store" } },
    );
  } catch (error) {
    if (error instanceof ParentsGuideConfigurationError || error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof ParentsGuideRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error("Parents guide translation failed", error);
    return NextResponse.json({ error: "Çeviri alınamadı." }, { status: 502 });
  }
}
