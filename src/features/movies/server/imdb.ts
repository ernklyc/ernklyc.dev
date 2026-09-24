import bakedEpisodeRatings from "@/features/movies/generated/episode-ratings.json";
import { createGunzip } from "node:zlib";
import { Readable, pipeline } from "node:stream";
import { StringDecoder } from "node:string_decoder";

const RATINGS_URL = "https://datasets.imdbws.com/title.ratings.tsv.gz";
const EPISODES_URL = "https://datasets.imdbws.com/title.episode.tsv.gz";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const DATASET_TIMEOUT_MS = Number(process.env.IMDB_DATASET_TIMEOUT_MS) || 25_000;

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

/**
 * IMDb .tsv.gz dosyasını satır satır tarar; `visit` true dönerse erken durur.
 *
 * Satırlar SENKRON işlenir, yalnızca veri parçası (chunk) başına beklenir. Satır başına async
 * üreteç kullanmak 8 milyon satırda ölçülebilir şekilde yavaştı.
 *
 * Dosyalar Next.js'in 2 MB veri-cache sınırından büyük; ham arşivi cache'e yazmıyoruz. Akış hataları
 * (zaman aşımı, ağ kopması) `pipeline` ile gunzip'e iletilir ve `for await` içinde fırlatılır; böylece
 * yakalanmamış istisna olup süreci düşürmez. Erken çıkışta akışlar temizlenir.
 */
async function scanGzipLines(url: string, visit: (line: string) => boolean | void) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(DATASET_TIMEOUT_MS) });
  if (!response.ok || !response.body) {
    throw new Error(`IMDb veri seti alınamadı (${response.status}).`);
  }

  const input = Readable.fromWeb(response.body as never);
  const gunzip = createGunzip();
  pipeline(input, gunzip, () => {
    // Hata gunzip'i yok eder ve aşağıdaki for-await tarafından fırlatılır.
  });
  const decoder = new StringDecoder("utf8");
  let carry = "";

  try {
    for await (const chunk of gunzip) {
      const parts = (carry + decoder.write(chunk as Buffer)).split("\n");
      carry = parts.pop() ?? "";
      for (const line of parts) if (visit(line) === true) return;
    }
    carry += decoder.end();
    if (carry) visit(carry);
  } finally {
    gunzip.destroy();
    input.destroy();
  }
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
    await scanGzipLines(RATINGS_URL, (line) => {
      if (line.startsWith("tconst\t")) return;
      const firstTab = line.indexOf("\t");
      if (firstTab < 0) return;
      const id = line.slice(0, firstTab);
      if (id > lastWanted) return true;
      if (!wanted.has(id)) return;

      const [, rating, votes] = line.split("\t");
      const value = { averageRating: Number(rating), numVotes: Number(votes) };
      result.set(id, value);
      ratingCache.set(id, { expiresAt: now + CACHE_TTL_MS, value });
      wanted.delete(id);
      return !wanted.size;
    });

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

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Bayat veri göstermemek için tazelik kuralları. Yayında olan dizide yeni bölüm/puan hızlı değişir,
 * bitmiş dizide neredeyse hiç değişmez.
 */
export type EpisodeFreshness = { maxBakedAgeMs: number; memoryTtlMs: number; httpMaxAgeSec: number };

export function episodeFreshness(airing: boolean): EpisodeFreshness {
  return airing
    ? { maxBakedAgeMs: 2 * DAY_MS, memoryTtlMs: 6 * HOUR_MS, httpMaxAgeSec: 6 * 60 * 60 }
    : { maxBakedAgeMs: 30 * DAY_MS, memoryTtlMs: 7 * DAY_MS, httpMaxAgeSec: 3 * 24 * 60 * 60 };
}

/**
 * Build sırasında (scripts/bake-episode-ratings.mjs) arşivdeki diziler için önceden hesaplanmış
 * puanlar. IMDb veri setleri her soğuk istekte ~64 MB indirildiği için canlı hesap yavaştır;
 * gömülü veri anında döner. Yaş sınırı diziye göre değişir (bkz. episodeFreshness).
 */
function getBakedEpisodeRatings(seriesImdbId: string, maxAgeMs: number): ImdbEpisodeRating[] | null {
  const baked = bakedEpisodeRatings as unknown as {
    generatedAt: string | null;
    shows: Record<string, [number, number, string, number, number][]>;
  };
  if (!baked.generatedAt || Date.now() - Date.parse(baked.generatedAt) > maxAgeMs) return null;
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** İndirme/akış hatalarında (ağ kopması, zaman aşımı) sınırlı sayıda yeniden dener. */
async function withRetry<T>(label: string, task: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      console.warn(`[imdb] ${label} başarısız (${attempt}/${attempts})`, error);
      if (attempt < attempts) await sleep(1000 * attempt);
    }
  }
  throw lastError;
}

// --- Tüm puan indeksi: episode dosyası indirilirken paralel kurulur, örnek başına 24 saat tutulur ---
const PACK = 4294967296; // puan*10 * PACK + oy sayısı tek sayıda tutulur (bellek tasarrufu)
let ratingsIndex: { builtAt: number; map: Map<string, number> } | null = null;
let ratingsIndexPromise: Promise<Map<string, number>> | null = null;

async function buildRatingsIndex() {
  const map = new Map<string, number>();
  await scanGzipLines(RATINGS_URL, (line) => {
    const firstTab = line.indexOf("\t");
    if (firstTab < 0 || line.startsWith("tconst\t")) return;
    const secondTab = line.indexOf("\t", firstTab + 1);
    const average = Math.round(parseFloat(line.slice(firstTab + 1, secondTab)) * 10);
    const votes = parseInt(line.slice(secondTab + 1), 10);
    if (Number.isFinite(average) && Number.isFinite(votes)) map.set(line.slice(0, firstTab), average * PACK + votes);
  });
  return map;
}

function getRatingsIndex(): Promise<Map<string, number>> {
  if (ratingsIndex && Date.now() - ratingsIndex.builtAt < CACHE_TTL_MS) return Promise.resolve(ratingsIndex.map);
  ratingsIndexPromise ??= withRetry("puan indeksi", buildRatingsIndex)
    .then((map) => {
      ratingsIndex = { builtAt: Date.now(), map };
      return map;
    })
    .finally(() => {
      ratingsIndexPromise = null;
    });
  return ratingsIndexPromise;
}

type RawEpisode = { imdbId: string; seasonNumber: number; episodeNumber: number };

/** Episode dosyasını TEK geçişte tarar; verilen tüm dizilerin bölümlerini toplar. */
async function scanEpisodes(seriesIds: Set<string>) {
  const found = new Map<string, RawEpisode[]>();
  await scanGzipLines(EPISODES_URL, (line) => {
    const firstTab = line.indexOf("\t");
    const secondTab = line.indexOf("\t", firstTab + 1);
    if (firstTab < 0 || secondTab < 0) return;
    const parentId = line.slice(firstTab + 1, secondTab);
    if (!seriesIds.has(parentId)) return;
    const [imdbId, , season, episode] = line.split("\t");
    if (season === "\\N" || episode === "\\N") return;
    const seasonNumber = Number(season);
    const episodeNumber = Number(episode);
    if (!Number.isSafeInteger(seasonNumber) || !Number.isSafeInteger(episodeNumber)) return;
    const list = found.get(parentId) ?? [];
    list.push({ imdbId, seasonNumber, episodeNumber });
    found.set(parentId, list);
  });
  return found;
}

// --- Aynı anda gelen istekleri birleştirme (coalescing) ---
type Waiter = { resolve: (value: ImdbEpisodeRating[]) => void; reject: (reason: unknown) => void };
type Pending = { ttlMs: number; waiters: Waiter[] };
const COALESCE_WINDOW_MS = 1200;
let pending = new Map<string, Pending>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const inFlight = new Map<string, Promise<ImdbEpisodeRating[]>>();

async function runBatch(batch: Map<string, Pending>) {
  const started = Date.now();
  try {
    const [found, ratings] = await Promise.all([
      withRetry("episode taraması", () => scanEpisodes(new Set(batch.keys()))),
      getRatingsIndex(),
    ]);
    for (const [seriesId, entry] of batch) {
      const episodes = (found.get(seriesId) ?? [])
        .flatMap((episode) => {
          const packed = ratings.get(episode.imdbId);
          if (packed === undefined) return [];
          return [{ ...episode, averageRating: Math.floor(packed / PACK) / 10, numVotes: packed % PACK }];
        })
        .sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber);
      episodeCache.set(seriesId, { expiresAt: Date.now() + entry.ttlMs, value: episodes });
      for (const waiter of entry.waiters) waiter.resolve(episodes);
    }
    console.info(`[imdb] ${batch.size} dizi tek geçişte hesaplandı (${((Date.now() - started) / 1000).toFixed(1)} sn)`);
  } catch (error) {
    for (const entry of batch.values()) for (const waiter of entry.waiters) waiter.reject(error);
  }
}

function computeLive(seriesImdbId: string, ttlMs: number) {
  const existing = inFlight.get(seriesImdbId);
  if (existing) return existing; // aynı dizi için tek hesap, herkes aynı sonucu bekler

  const promise = new Promise<ImdbEpisodeRating[]>((resolve, reject) => {
    const entry = pending.get(seriesImdbId) ?? { ttlMs, waiters: [] };
    entry.waiters.push({ resolve, reject });
    pending.set(seriesImdbId, entry);
    // Kısa pencerede gelen farklı diziler aynı 55 MB'lık geçişi paylaşır.
    flushTimer ??= setTimeout(() => {
      const batch = pending;
      pending = new Map();
      flushTimer = null;
      void runBatch(batch);
    }, COALESCE_WINDOW_MS);
  }).finally(() => inFlight.delete(seriesImdbId));

  inFlight.set(seriesImdbId, promise);
  return promise;
}

export async function getImdbEpisodeRatings(seriesImdbId: string, freshness: EpisodeFreshness = episodeFreshness(false)) {
  if (!isImdbTitleId(seriesImdbId)) return [];
  const baked = getBakedEpisodeRatings(seriesImdbId, freshness.maxBakedAgeMs);
  if (baked) return baked;
  const cached = episodeCache.get(seriesImdbId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  return computeLive(seriesImdbId, freshness.memoryTtlMs);
}
