import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it, vi } from "vitest";

const EPISODES_URL = "title.episode.tsv.gz";
const RATINGS_URL = "title.ratings.tsv.gz";

const episodesTsv = [
  "tconst\tparentTconst\tseasonNumber\tepisodeNumber",
  "tt1000001\ttt0000001\t1\t2",
  "tt1000002\ttt0000001\t1\t1",
  "tt1000003\ttt0000002\t1\t1",
  "tt1000004\ttt0000001\t\\N\t\\N", // sezon/bölüm yok: atlanmalı
  "tt1000005\ttt0000009\t1\t1", // başka dizi
].join("\n");
const ratingsTsv = ["tconst\taverageRating\tnumVotes", "tt1000001\t8.5\t1234", "tt1000002\t9.1\t5678", "tt1000003\t7.0\t10"].join("\n");

const gz = (text: string) => new Response(gzipSync(Buffer.from(text)));

async function load(bakedFile: { generatedAt: string | null; shows: Record<string, unknown[]> } = { generatedAt: null, shows: {} }) {
  vi.resetModules();
  vi.doMock("@/features/movies/generated/episode-ratings.json", () => ({ default: bakedFile }));
  return import("@/features/movies/server/imdb");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.doUnmock("@/features/movies/generated/episode-ratings.json");
});

function stubDatasets(overrides?: { failEpisodesFirst?: boolean }) {
  let episodeCalls = 0;
  const fetchMock = vi.fn(async (input: unknown) => {
    const url = String(input);
    if (url.includes(EPISODES_URL)) {
      episodeCalls += 1;
      if (overrides?.failEpisodesFirst && episodeCalls === 1) throw new TypeError("network down");
      return gz(episodesTsv);
    }
    if (url.includes(RATINGS_URL)) return gz(ratingsTsv);
    throw new Error(`beklenmeyen istek: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  const count = (needle: string) => fetchMock.mock.calls.filter(([u]) => String(u).includes(needle)).length;
  return { count };
}

describe("episodeFreshness", () => {
  it("yayındaki dizide kısa, bitmiş dizide uzun tazelik verir", async () => {
    const { episodeFreshness } = await load();
    const airing = episodeFreshness(true);
    const ended = episodeFreshness(false);
    expect(airing.maxBakedAgeMs).toBe(2 * 24 * 3600 * 1000);
    expect(airing.httpMaxAgeSec).toBe(6 * 3600);
    expect(ended.maxBakedAgeMs).toBe(30 * 24 * 3600 * 1000);
    expect(ended.memoryTtlMs).toBeGreaterThan(airing.memoryTtlMs);
  });
});

describe("gömülü (baked) veri", () => {
  const rows = [[1, 1, "tt1000002", 9.1, 5678]];

  it("taze ise ağa çıkmadan döner", async () => {
    const stub = stubDatasets();
    const { getImdbEpisodeRatings, episodeFreshness } = await load({ generatedAt: new Date().toISOString(), shows: { tt0000001: rows } });
    const result = await getImdbEpisodeRatings("tt0000001", episodeFreshness(true));
    expect(result).toEqual([{ imdbId: "tt1000002", seasonNumber: 1, episodeNumber: 1, averageRating: 9.1, numVotes: 5678 }]);
    expect(stub.count(EPISODES_URL)).toBe(0);
  });

  it("yayındaki dizide 2 günden eskiyse KULLANILMAZ (bayat veri sunulmaz), bitmiş dizide kullanılır", async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
    const stub = stubDatasets();
    const { getImdbEpisodeRatings, episodeFreshness } = await load({ generatedAt: threeDaysAgo, shows: { tt0000001: rows } });

    await getImdbEpisodeRatings("tt0000001", episodeFreshness(false)); // bitmiş: gömülü geçerli
    expect(stub.count(EPISODES_URL)).toBe(0);

    const live = await getImdbEpisodeRatings("tt0000001", episodeFreshness(true)); // yayında: canlı hesap
    expect(stub.count(EPISODES_URL)).toBe(1);
    expect(live.map((e) => e.imdbId)).toEqual(["tt1000002", "tt1000001"]); // 1x1, 1x2 sıralı
  });

  it("geçersiz IMDb ID'sinde boş döner", async () => {
    stubDatasets();
    const { getImdbEpisodeRatings } = await load();
    expect(await getImdbEpisodeRatings("../etc/passwd")).toEqual([]);
  });
});

describe("canlı hesap", () => {
  it("puanları ve oyları doğru ayrıştırır, bölümü olmayan satırları atar", async () => {
    stubDatasets();
    const { getImdbEpisodeRatings } = await load();
    const result = await getImdbEpisodeRatings("tt0000001");
    expect(result).toEqual([
      { imdbId: "tt1000002", seasonNumber: 1, episodeNumber: 1, averageRating: 9.1, numVotes: 5678 },
      { imdbId: "tt1000001", seasonNumber: 1, episodeNumber: 2, averageRating: 8.5, numVotes: 1234 },
    ]);
  });

  it("aynı anda gelen farklı diziler TEK geçişte hesaplanır (episode dosyası 1 kez indirilir)", async () => {
    const stub = stubDatasets();
    const { getImdbEpisodeRatings } = await load();
    const [a, b] = await Promise.all([getImdbEpisodeRatings("tt0000001"), getImdbEpisodeRatings("tt0000002")]);
    expect(a).toHaveLength(2);
    expect(b).toEqual([{ imdbId: "tt1000003", seasonNumber: 1, episodeNumber: 1, averageRating: 7, numVotes: 10 }]);
    expect(stub.count(EPISODES_URL)).toBe(1);
    expect(stub.count(RATINGS_URL)).toBe(1);
  });

  it("aynı diziye eşzamanlı istekler tek hesabı paylaşır; sonra bellek önbelleğinden döner", async () => {
    const stub = stubDatasets();
    const { getImdbEpisodeRatings } = await load();
    await Promise.all([1, 2, 3].map(() => getImdbEpisodeRatings("tt0000001")));
    expect(stub.count(EPISODES_URL)).toBe(1);
    await getImdbEpisodeRatings("tt0000001");
    expect(stub.count(EPISODES_URL)).toBe(1); // önbellek
  });

  it("geçici ağ hatasında yeniden dener ve başarır", async () => {
    const stub = stubDatasets({ failEpisodesFirst: true });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getImdbEpisodeRatings } = await load();
    const result = await getImdbEpisodeRatings("tt0000001");
    expect(result).toHaveLength(2);
    expect(stub.count(EPISODES_URL)).toBe(2); // 1. deneme düştü, 2. başardı
    warn.mockRestore();
  });

  it("iki deneme de başarısız olursa hatayı iletir (sessizce boş dönmez)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("network down"))));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getImdbEpisodeRatings } = await load();
    await expect(getImdbEpisodeRatings("tt0000003")).rejects.toThrow("network down");
    warn.mockRestore();
  });
});
