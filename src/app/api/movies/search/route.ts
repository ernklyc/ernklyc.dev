import { NextResponse } from "next/server";
import { searchLiveMedia, TmdbConfigurationError } from "@/features/movies/server/tmdb";
import { isMovieOwnerRequest } from "@/features/movies/server/firebase-auth";

export async function GET(request: Request) {
  if (!(await isMovieOwnerRequest(request))) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmalısın." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ error: "Arama 2-100 karakter olmalı." }, { status: 400 });
  }

  try {
    return NextResponse.json({ results: await searchLiveMedia(query) });
  } catch (error) {
    if (error instanceof TmdbConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("TMDB search failed", error);
    return NextResponse.json({ error: "Arama sırasında bir sorun oluştu." }, { status: 502 });
  }
}
