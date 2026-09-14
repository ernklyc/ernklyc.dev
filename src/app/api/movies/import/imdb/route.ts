import { NextResponse } from "next/server";
import { findMediaByImdbId, TmdbConfigurationError } from "@/features/movies/server/tmdb";
import { isMovieOwnerRequest } from "@/features/movies/server/firebase-auth";

const IMDB_ID_PATTERN = /^tt\d{7,10}$/;

export async function POST(request: Request) {
  if (!(await isMovieOwnerRequest(request))) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmalısın." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { imdbIds?: unknown } | null;
  if (!body || !Array.isArray(body.imdbIds)) {
    return NextResponse.json({ error: "IMDb ID listesi gerekli." }, { status: 400 });
  }

  const imdbIds = [...new Set(body.imdbIds.filter((id): id is string => typeof id === "string"))]
    .map((id) => id.trim())
    .filter((id) => IMDB_ID_PATTERN.test(id));

  if (imdbIds.length === 0 || imdbIds.length > 500) {
    return NextResponse.json({ error: "1-500 arasında geçerli IMDb ID gönderilmeli." }, { status: 400 });
  }

  try {
    const results = [];
    for (let index = 0; index < imdbIds.length; index += 8) {
      const batch = imdbIds.slice(index, index + 8);
      const matched = await Promise.all(
        batch.map(async (imdbId) => ({ imdbId, media: await findMediaByImdbId(imdbId) })),
      );
      results.push(...matched);
    }
    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("IMDb import match failed", error);
    return NextResponse.json({ error: "IMDb kayıtları eşleştirilemedi." }, { status: 502 });
  }
}
