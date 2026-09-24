import { afterEach, describe, expect, it, vi } from "vitest";

async function load(env: Record<string, string> = {}) {
  vi.resetModules();
  vi.stubEnv("MYMEMORY_EMAIL", "");
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return import("@/features/movies/server/translate");
}
const memory = (text: string, extra: Record<string, unknown> = {}) =>
  new Response(JSON.stringify({ responseStatus: 200, responseData: { translatedText: text }, ...extra }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("translateToTurkish", () => {
  it("çevirir, HTML varlıklarını çözer ve sonucu önbelleğe alır", async () => {
    const { translateToTurkish } = await load();
    const fetchMock = vi.fn(async () => memory("Karakter&#39;in &quot;evi&quot; &amp; ailesi"));
    vi.stubGlobal("fetch", fetchMock);
    expect(await translateToTurkish("The character's house")).toBe(`Karakter'in "evi" & ailesi`);
    await translateToTurkish("The character's house");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("MyMemory kota uyarısını çeviri diye SUNMAZ ve gün boyu istek atmayı bırakır", async () => {
    const { translateToTurkish } = await load();
    const fetchMock = vi.fn(async () => memory("MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY", { responseStatus: 429 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await translateToTurkish("first text")).toBeNull();
    expect(await translateToTurkish("second text")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1); // ikincisi ağa çıkmadı
  });

  it("metin zaten aynıysa (çevrilemediyse) null döner", async () => {
    const { translateToTurkish } = await load();
    vi.stubGlobal("fetch", vi.fn(async () => memory("Same Text")));
    expect(await translateToTurkish("same text")).toBeNull();
  });

  it("ağ hatasında null döner (özelliği bozmaz)", async () => {
    const { translateToTurkish } = await load();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    expect(await translateToTurkish("hello there")).toBeNull();
    warn.mockRestore();
  });

  it("günlük karakter bütçesini aşınca istek atmaz", async () => {
    const { translateToTurkish } = await load(); // anonim bütçe: 4.000 karakter
    const fetchMock = vi.fn(async () => memory("çeviri"));
    vi.stubGlobal("fetch", fetchMock);
    const chunk = "x".repeat(400);
    for (let i = 0; i < 10; i += 1) await translateToTurkish(`${chunk}${i}`); // 10 x 401 = 4.010 > 4.000
    expect(fetchMock.mock.calls.length).toBeLessThan(10);
  });

  it("e-posta tanımlıysa parametre olarak gönderir ve bütçe büyür", async () => {
    const { translateToTurkish } = await load({ MYMEMORY_EMAIL: "test@example.com" });
    const fetchMock = vi.fn(async () => memory("çeviri"));
    vi.stubGlobal("fetch", fetchMock);
    await translateToTurkish("a note");
    expect(String((fetchMock.mock.calls[0] as unknown[])[0])).toContain("de=test%40example.com");
  });
});
