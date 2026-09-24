import bakedEpisodeRatings from "@/features/movies/generated/episode-ratings.json";
import { createGunzip } from "node:zlib";
import { Readable } from "node:stream";
import { createInterface } from "node:readline";

const RATINGS_URL = "https://datasets.imdbws.com/title.ratings.tsv.gz";
const EPISODES_URL = "https://datasets.imdbws.com/title.episode.tsv.gz";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type ImdbRating = {
  averageRating: number;
  numVotes: number;
};

export type ImdbEpisodeRating = ImdbRating & {
  imdbId: string;
  seasonNumber: number;
  episodeNumber: number;
};

type CacheEntry<T> = { expiresAt: number; value: T };

const ratingCache = new Map<string, CacheEntry<ImdbRating | null>>();
const episodeCache = new Map<string, CacheEntry<ImdbEpisodeRating[]>>();

function isImdbTitleId(value: string) {
  return /^tt\d{7,10}$/.test(value);
}

async function openGzipLines(url: string) {
  // Dosyalar Next.js'in 2 MB veri-cache sınırından büyük. Sonuçları aşağıdaki
  // küçük, başlık-bazlı bellek cache'inde tutuyoruz; ham arşivi cache'e yazmıyoruz.
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok || !response.body) {
    throw new Error(`IMDb veri seti alınamadı (${response.status}).`);
  }

  const input = Readable.fromWeb(response.body as never);
  const gunzip = createGunzip();
  input.pipe(gunzip);
  return { input, gunzip, lines: createInterface({ input: gunzip, crlfDelay: Infinity }) };
}

export async function getImdbRatings(imdbIds: string[]) {
  const ids = [...new Set(imdbIds.filter(isImdbTitleId))].sort();
  const result = new Map<string, ImdbRating | null>();
  const now = Date.now();
  const missing: string[] = [];

  for (const id of ids) {
    const cached = ratingCache.get(id);
    if (cached && cached.expiresAt > now) result.set(id, cached.value);
    else missing.push(id);
  }

  if (missing.length) {
    const wanted = new Set(missing);
    const lastWanted = missing.at(-1)!;
    const stream = await openGzipLines(RATINGS_URL);

    try {
      for await (const line of stream.lines) {
        if (line.startsWith("tconst\t")) continue;
        const firstTab = line.indexOf("\t");
        if (firstTab < 0) continue;
        const id = line.slice(0, firstTab);
        if (id > lastWanted) break;
        if (!wanted.has(id)) continue;

        const [, rating, votes] = line.split("\t");
        const value = { averageRating: Number(rating), numVotes: Number(votes) };
        result.set(id, value);
        ratingCache.set(id, { expiresAt: now + CACHE_TTL_MS, value });
        wanted.delete(id);
        if (!wanted.size) break;
      }
    } finally {
      stream.lines.close();
      stream.gunzip.destroy();
      stream.input.destroy();
    }

    for (const id of wanted) {
      result.set(id, null);
      ratingCache.set(id, { expiresAt: now + CACHE_TTL_MS, value: null });
    }
  }

  return result;
}

export async function getImdbRating(imdbId: string | null | undefined) {
  if (!imdbId || !isImdbTitleId(imdbId)) return null;
  return (await getImdbRatings([imdbId])).get(imdbId) ?? null;
}

/**
 * Build sırasında (scripts/bake-episode-ratings.mjs) arşivdeki diziler için önceden hesaplanmış
 * puanlar. IMDb veri setleri her istekte ~64 MB indirildiği için canlı hesap ~20 sn sürer; gömülü
 * veri anında döner. Eski veri yanıltmasın diye 21 günden eskiyse kullanılmaz.
 */
const BAKED_MAX_AGE_MS = 21 * 24 * 60 * 60 * 1000;

function getBakedEpisodeRatings(seriesImdbId: string): ImdbEpisodeRating[] | null {
  const baked = bakedEpisodeRatings as unknown as {
    generatedAt: string | null;
    shows: Record<string, [number, number, string, number, number][]>;
  };
  if (!baked.generatedAt || Date.now() - Date.parse(baked.generatedAt) > BAKED_MAX_AGE_MS) return null;
  const rows = baked.shows[seriesImdbId];
  if (!rows?.length) return null;
  return rows.map(([seasonNumber, episodeNumber, imdbId, averageRating, numVotes]) => ({
    imdbId,
    seasonNumber,
    episodeNumber,
    averageRating,
    numVotes,
  }));
}

export async function getImdbEpisodeRatings(seriesImdbId: string) {
  if (!isImdbTitleId(seriesImdbId)) return [];
  const baked = getBakedEpisodeRatings(seriesImdbId);
  if (baked) return baked;
  const cached = episodeCache.get(seriesImdbId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const episodeIds: { imdbId: string; seasonNumber: number; episodeNumber: number }[] = [];
  const stream = await openGzipLines(EPISODES_URL);

  try {
    for await (const line of stream.lines) {
      if (line.startsWith("tconst\t")) continue;
      const [imdbId, parentId, season, episode] = line.split("\t");
      if (parentId !== seriesImdbId || season === "\\N" || episode === "\\N") continue;
      const seasonNumber = Number(season);
      const episodeNumber = Number(episode);
      if (Number.isSafeInteger(seasonNumber) && Number.isSafeInteger(episodeNumber)) {
        episodeIds.push({ imdbId, seasonNumber, episodeNumber });
      }
    }
  } finally {
    stream.lines.close();
    stream.gunzip.destroy();
    stream.input.destroy();
  }

  const ratings = await getImdbRatings(episodeIds.map((episode) => episode.imdbId));
  const episodes = episodeIds
    .map((episode) => {
      const rating = ratings.get(episode.imdbId);
      return rating ? { ...episode, ...rating } : null;
    })
    .filter((episode): episode is ImdbEpisodeRating => episode !== null)
    .sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber);

  episodeCache.set(seriesImdbId, { expiresAt: Date.now() + CACHE_TTL_MS, value: episodes });
  return episodes;
}
