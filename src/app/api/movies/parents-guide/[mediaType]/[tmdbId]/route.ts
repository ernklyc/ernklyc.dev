import { NextResponse } from "next/server";
import { checkMediaAccess } from "@/features/movies/server/archive-access";
import {
  getParentsGuide,
  ParentsGuideConfigurationError,
  ParentsGuideRateLimitError,
} from "@/features/movies/server/parents-guide";
import { TmdbConfigurationError, type TmdbMediaType } from "@/features/movies/server/tmdb";

export const runtime = "nodejs";
export const maxDuration = 30;

type RouteContext = { params: Promise<{ mediaType: string; tmdbId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { mediaType, tmdbId } = await context.params;
  const numericTmdbId = Number(tmdbId);

  if ((mediaType !== "movie" && mediaType !== "tv") || !Number.isSafeInteger(numericTmdbId) || numericTmdbId <= 0) {
    return NextResponse.json({ error: "Geçersiz yapım türü veya TMDB ID." }, { status: 400 });
  }

  const access = await checkMediaAccess(request, mediaType as TmdbMediaType, numericTmdbId);
  if (!access.allowed) return access.response;

  try {
    const guide = await getParentsGuide(mediaType as TmdbMediaType, numericTmdbId);
    const days = guide.available ? 30 : 7;
    return NextResponse.json(guide, {
      headers: {
        "Cache-Control": access.publicArchive
          ? `public, s-maxage=${days * 86400}, stale-while-revalidate=${days * 86400}`
          : "private, max-age=600",
      },
    });
  } catch (error) {
    if (error instanceof ParentsGuideConfigurationError || error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof ParentsGuideRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": "3600" } });
    }
    console.error("Parents guide request failed", error);
    return NextResponse.json({ error: "Ebeveyn rehberi alınamadı." }, { status: 502 });
  }
}
