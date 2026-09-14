import type { TmdbSearchItem } from "@/features/movies/models";
import { getImdbRating } from "@/features/movies/server/imdb";

export type TmdbMediaType = "movie" | "tv";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export class TmdbConfigurationError extends Error {}

async function tmdbFetch<T>(path: string, searchParams?: Record<string, string>): Promise<T> {
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!token) {
    throw new TmdbConfigurationError("TMDB_API_READ_TOKEN tanımlı değil.");
  }

  const url = new URL(`${TMDB_API_BASE_URL}${path}`);
  url.searchParams.set("language", "tr-TR");

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`TMDB isteği başarısız oldu (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

/**
 * Puanları özellikle döndürmüyoruz. Bu servis TMDB'yi yalnızca güncel metadata,
 * görseller, ekip, oyuncular, videolar ve Türkiye sağlayıcıları için kullanır.
 */
export async function getLiveMediaDetails(mediaType: TmdbMediaType, tmdbId: number) {
  const [details, credits] = await Promise.all([
    tmdbFetch<Record<string, unknown>>(`/${mediaType}/${tmdbId}`, {
      append_to_response:
        mediaType === "movie"
          ? "external_ids,videos,watch/providers,keywords,release_dates,images"
          : "external_ids,videos,watch/providers,keywords,content_ratings,images",
      include_image_language: "tr,en,null",
    }),
    mediaType === "movie"
      ? tmdbFetch<Record<string, unknown>>(`/movie/${tmdbId}/credits`)
      : tmdbFetch<Record<string, unknown>>(`/tv/${tmdbId}/aggregate_credits`),
  ]);

  const metadata = { ...details };
  delete metadata.vote_average;
  delete metadata.vote_count;
  const externalIds = metadata.external_ids as { imdb_id?: string | null } | undefined;
  let imdbRating = null;
  try {
    imdbRating = await getImdbRating(externalIds?.imdb_id);
  } catch (error) {
    console.warn("IMDb rating lookup failed; TMDB details will still be returned", error);
  }

  return {
    fetchedAt: new Date().toISOString(),
    mediaType,
    metadata,
    credits,
    imdbRating,
  };
}

export async function getExternalImdbId(mediaType: TmdbMediaType, tmdbId: number) {
  const ids = await tmdbFetch<{ imdb_id?: string | null }>(`/${mediaType}/${tmdbId}/external_ids`);
  return ids.imdb_id ?? null;
}

type TmdbSearchResult = {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  genre_ids?: number[];
};

type TmdbFindResponse = {
  movie_results?: TmdbSearchResult[];
  tv_results?: TmdbSearchResult[];
};

export async function searchLiveMedia(query: string): Promise<TmdbSearchItem[]> {
  const response = await tmdbFetch<{ results?: TmdbSearchResult[] }>("/search/multi", {
    query,
    include_adult: "false",
    page: "1",
  });

  return (response.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => normalizeSearchItem(item, item.media_type as TmdbMediaType, null));
}

export async function findMediaByImdbId(imdbId: string): Promise<TmdbSearchItem | null> {
  const [response, rating] = await Promise.all([
    tmdbFetch<TmdbFindResponse>(`/find/${imdbId}`, {
      external_source: "imdb_id",
    }),
    getImdbRating(imdbId).catch(() => null),
  ]);
  const movie = response.movie_results?.[0];
  if (movie) return normalizeSearchItem(movie, "movie", imdbId, rating);
  const tv = response.tv_results?.[0];
  if (tv) return normalizeSearchItem(tv, "tv", imdbId, rating);
  return null;
}

function normalizeSearchItem(
  item: TmdbSearchResult,
  mediaType: TmdbMediaType,
  imdbId: string | null,
  imdbRating?: { averageRating: number; numVotes: number } | null,
): TmdbSearchItem {
  const title = item.title ?? item.name ?? "Başlıksız";
  const originalTitle = item.original_title ?? item.original_name ?? title;
  const releaseDate = item.release_date ?? item.first_air_date ?? "";
  const parsedYear = Number(releaseDate.slice(0, 4));

  return {
    tmdbId: item.id,
    imdbId,
    mediaType,
    title,
    originalTitle,
    year: Number.isSafeInteger(parsedYear) ? parsedYear : null,
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    overview: item.overview ?? "",
    genreIds: item.genre_ids ?? [],
    genres: [],
    imdbRating: imdbRating?.averageRating ?? null,
    imdbVotes: imdbRating?.numVotes ?? null,
  };
}
