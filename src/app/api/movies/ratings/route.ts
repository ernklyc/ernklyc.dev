import { NextResponse } from "next/server";
import { getImdbRatings } from "@/features/movies/server/imdb";

type RatingsRequest = {
  imdbIds?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RatingsRequest;
  const imdbIds = Array.isArray(body.imdbIds)
    ? [...new Set(body.imdbIds.filter((id): id is string => typeof id === "string" && /^tt\d{7,10}$/.test(id)))]
    : [];

  if (!imdbIds.length) {
    return NextResponse.json({ ratings: {} });
  }

  if (imdbIds.length > 250) {
    return NextResponse.json({ error: "Tek seferde en fazla 250 IMDb ID gönderilebilir." }, { status: 400 });
  }

  try {
    const ratings = await getImdbRatings(imdbIds);
    return NextResponse.json(
      {
        ratings: Object.fromEntries([...ratings.entries()].map(([id, rating]) => [id, rating])),
      },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch (error) {
    console.error("IMDb rating batch failed", error);
    return NextResponse.json({ error: "IMDb puanları alınamadı." }, { status: 502 });
  }
}
