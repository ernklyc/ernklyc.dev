import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildGuide, categoryOf, isConfirmed, type DddMedia, type DddTopicStat } from "@/features/movies/server/parents-guide";

let nextId = 1;
function stat(name: string, yes: number, no: number, options: { cat?: number; spoiler?: boolean; comments?: { comment: string; voteSum: number }[] } = {}): DddTopicStat {
  return {
    yesSum: yes,
    noSum: no,
    comments: options.comments,
    topic: { id: nextId++, name, isSpoiler: options.spoiler, TopicCategoryId: options.cat ?? 99 },
  };
}
const media = (stats: DddTopicStat[], numRatings = 500): DddMedia => ({ item: { id: 42, numRatings }, topicItemStats: stats });
const guideOf = (stats: DddTopicStat[], numRatings?: number) => {
  const guide = buildGuide(media(stats, numRatings));
  if (!guide.available) throw new Error("rehber beklenirdi");
  return guide;
};
const category = (guide: ReturnType<typeof guideOf>, id: string) => guide.categories.find((c) => c.id === id)!;

beforeEach(() => {
  nextId = 1;
});

describe("categoryOf: konuları IMDb kategorilerine ayırır", () => {
  const topic = (name: string, cat = 99) => ({ id: 1, name, TopicCategoryId: cat });
  it.each([
    ["there is sexual content", 11, "sex"],
    ["there's BDSM", 11, "sex"], // büyük/küçük harf duyarsız
    ["there's blood/gore", 14, "violence"],
    ["there is obscene language/gestures", 8, "profanity"],
    ["someone uses drugs", 1, "substances"],
    ["there are jump scares", 10, "frightening"],
    ["there's flashing lights or images", 8, "frightening"],
    ["a dog dies", 56, "other"],
  ])("%s -> %s", (name, cat, expected) => {
    expect(categoryOf(topic(name, cat))).toBe(expected);
  });

  it("spoiler konuları ve 'Spoiler' kategorisini dışarıda bırakır", () => {
    expect(categoryOf({ id: 1, name: "a major character dies", isSpoiler: true, TopicCategoryId: 22 })).toBeNull();
    expect(categoryOf({ id: 2, name: "the ending is sad", TopicCategoryId: 13 })).toBeNull();
  });

  it("korku kategorisinde ama korkutucu olmayan konuları dışlar", () => {
    expect(categoryOf(topic("there's natural bodies of water", 10))).toBe("other");
  });
});

describe("isConfirmed: topluluk 'evet' eşiği", () => {
  it("en az 3 evet ve %60 evet oranı ister", () => {
    expect(isConfirmed(stat("x", 2, 0))).toBe(false); // yeterli oy yok
    expect(isConfirmed(stat("x", 3, 2))).toBe(true); // tam %60
    expect(isConfirmed(stat("x", 3, 3))).toBe(false); // %50
    expect(isConfirmed(stat("x", 100, 1))).toBe(true);
    expect(isConfirmed(stat("x", 0, 0))).toBe(false);
  });
});

describe("buildGuide", () => {
  it("doğrulanmış konuyu doğru kategoriye koyar, yes'e göre sıralar", () => {
    const guide = guideOf([
      stat("there is sexual content", 20, 1),
      stat("there are nude scenes", 90, 2),
      stat("there's a fire", 40, 1),
    ]);
    const sex = category(guide, "sex");
    expect(sex.status).toBe("present");
    expect(sex.topics.map((t) => t.name)).toEqual(["there are nude scenes", "there is sexual content"]);
    expect(category(guide, "frightening").topics.map((t) => t.name)).toEqual(["there's a fire"]);
  });

  it("doğrulanmamış / spoiler konuları listelemez", () => {
    const guide = guideOf([stat("there's torture", 2, 0), stat("someone is stabbed", 50, 0, { spoiler: true })]);
    expect(category(guide, "violence").topics).toHaveLength(0);
  });

  it("oy yeterliyse 'none', azsa 'unknown' der", () => {
    const enough = guideOf([stat("someone dies", 40, 0), stat("there's war", 1, 30)]);
    expect(category(enough, "sex").status).toBe("none");
    const few = guideOf([stat("someone dies", 1, 0)], 3);
    expect(category(few, "sex").status).toBe("unknown");
  });

  it("konu adlarını Türkçeleştirir, bilinmeyeni İngilizce bırakır", () => {
    const guide = guideOf([stat("there's blood/gore", 30, 0), stat("someone invented a new topic", 30, 0)]);
    expect(category(guide, "violence").topics[0].label).toBe("Kan ve vahşet");
    expect(category(guide, "other").topics[0].label).toBe("someone invented a new topic");
  });

  it("notları temizler: reklam/link atar, oya göre sıralar, 3 ile sınırlar, uzunu keser", () => {
    const long = "a".repeat(400);
    const guide = guideOf([
      stat("there's blood/gore", 30, 0, {
        comments: [
          { comment: "Download the RunPee app for timestamps", voteSum: 99 },
          { comment: "see http://spam.example", voteSum: 50 },
          { comment: "kısa", voteSum: 40 }, // 8 karakterden kısa
          { comment: "low vote", voteSum: 1 },
          { comment: "top note here", voteSum: 10 },
          { comment: long, voteSum: 5 },
          { comment: "second note ok", voteSum: 7 },
        ],
      }),
    ]);
    const notes = category(guide, "violence").topics[0].notes;
    expect(notes.map((n) => n.votes)).toEqual([10, 7, 5]);
    expect(notes[2].text.length).toBeLessThanOrEqual(280);
    expect(notes[2].text.endsWith("…")).toBe(true);
    expect(notes.some((n) => /runpee|http/i.test(n.text))).toBe(false);
  });

  it("kategori başına 12 (diğer için 15) konu ile sınırlar", () => {
    const many = Array.from({ length: 20 }, (_, i) => stat(`someone dies ${i}`, 30 + i, 0));
    const violence = Array.from({ length: 20 }, (_, i) => stat(i === 0 ? "someone dies" : `there's war ${i}`, 30 + i, 0));
    expect(category(guideOf(many), "other").topics).toHaveLength(15);
    // "someone dies" dışındakiler 'other' olduğundan şiddet kategorisinde tek konu kalır
    expect(category(guideOf(violence), "violence").topics).toHaveLength(1);
  });
});

// --- getParentsGuide: DoesTheDogDie eşleştirme ve önbellek ---
describe("getParentsGuide", () => {
  const fixtureMedia = {
    item: { id: 7, numRatings: 100 },
    topicItemStats: [{ yesSum: 50, noSum: 1, comments: [], topic: { id: 1, name: "there is sexual content", TopicCategoryId: 11 } }],
  };

  async function load(getSearchTitles: () => Promise<{ titles: string[]; year: number | null }>) {
    vi.resetModules();
    vi.doMock("@/features/movies/server/tmdb", () => ({ getSearchTitles }));
    vi.doMock("@/features/movies/server/api-usage", () => ({ recordDddRequest: async () => {} }));
    vi.stubEnv("DDD_API_KEY", "test-key");
    return import("@/features/movies/server/parents-guide");
  }
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

  it("tmdbid VE tür eşleşmesini ister (aynı ID'li farklı türü seçmez)", async () => {
    const { getParentsGuide } = await load(async () => ({ titles: ["Some Show"], year: 2020 }));
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/dddsearch")) return json({ items: [{ id: 1, name: "Some Show", tmdbid: 555, ItemTypeId: 15 }] }); // film, biz dizi arıyoruz
      return json(fixtureMedia);
    });
    vi.stubGlobal("fetch", fetchMock);
    const guide = await getParentsGuide("tv", 555);
    expect(guide.available).toBe(false);
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("/media/"))).toBe(false);
  });

  it("eşleşince rehberi kurar ve sonucu önbellekler", async () => {
    const { getParentsGuide } = await load(async () => ({ titles: ["Some Movie"], year: 2020 }));
    const fetchMock = vi.fn(async (url: string) =>
      String(url).includes("/dddsearch") ? json({ items: [{ id: 7, name: "Some Movie", tmdbid: 555, ItemTypeId: 15 }] }) : json(fixtureMedia),
    );
    vi.stubGlobal("fetch", fetchMock);
    const first = await getParentsGuide("movie", 555);
    expect(first.available).toBe(true);
    const callsAfterFirst = fetchMock.mock.calls.length;
    await getParentsGuide("movie", 555);
    expect(fetchMock.mock.calls.length).toBe(callsAfterFirst); // ikincisi önbellekten
  });

  it("anahtar yoksa yapılandırma hatası fırlatır", async () => {
    const mod = await load(async () => ({ titles: ["X"], year: null }));
    vi.stubEnv("DDD_API_KEY", "");
    vi.stubGlobal("fetch", vi.fn());
    await expect(mod.getParentsGuide("movie", 1)).rejects.toBeInstanceOf(mod.ParentsGuideConfigurationError);
  });

  it("TMDB'de olmayan yapım için 'yok' döner (hata değil)", async () => {
    const { getParentsGuide } = await load(async () => {
      throw new Error("TMDB isteği başarısız oldu (404).");
    });
    vi.stubGlobal("fetch", vi.fn());
    expect((await getParentsGuide("movie", 999999999)).available).toBe(false);
  });
});
