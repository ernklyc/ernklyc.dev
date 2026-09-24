import { beforeEach, describe, expect, it, vi } from "vitest";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const publicDoc = (isPublic: boolean) => json({ fields: { isPublic: { booleanValue: isPublic } } });

async function load(isOwner: boolean) {
  vi.resetModules();
  vi.doMock("@/features/movies/server/firebase-auth", () => ({ isMovieOwnerRequest: async () => isOwner }));
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "test-project");
  vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-key");
  return import("@/features/movies/server/archive-access");
}
const request = () => new Request("https://example.com/api");

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("checkMediaAccess", () => {
  it("herkese açık arşivdeki yapıma girişsiz izin verir (CDN'de paylaşılabilir)", async () => {
    const { checkMediaAccess } = await load(false);
    vi.stubGlobal("fetch", vi.fn(async () => publicDoc(true)));
    expect(await checkMediaAccess(request(), "tv", 1396)).toEqual({ allowed: true, publicArchive: true });
  });

  it("arşivde olmayan yapıma girişsiz 403 döner", async () => {
    const { checkMediaAccess } = await load(false);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    const result = await checkMediaAccess(request(), "tv", 5);
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.response.status).toBe(403);
  });

  it("isPublic=false (gizli) belge üye sayılmaz", async () => {
    const { checkMediaAccess } = await load(false);
    vi.stubGlobal("fetch", vi.fn(async () => publicDoc(false)));
    const result = await checkMediaAccess(request(), "movie", 5);
    expect(result.allowed).toBe(false);
  });

  it("Firestore kuralı reddederse (403) üye değil sayılır", async () => {
    const { checkMediaAccess } = await load(false);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 403 })));
    const result = await checkMediaAccess(request(), "movie", 5);
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.response.status).toBe(403);
  });

  it("sahibin oturumu arşiv dışı yapıma izin verir ama özel (paylaşımsız) işaretler", async () => {
    const { checkMediaAccess } = await load(true);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    expect(await checkMediaAccess(request(), "tv", 5)).toEqual({ allowed: true, publicArchive: false });
  });

  it("arşiv sorgusu çökerse: girişsizde 503 (kapalı başarısız), sahipte izin", async () => {
    let mod = await load(false);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    const denied = await mod.checkMediaAccess(request(), "tv", 5);
    expect(denied.allowed).toBe(false);
    if (!denied.allowed) expect(denied.response.status).toBe(503);

    mod = await load(true);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    expect((await mod.checkMediaAccess(request(), "tv", 5)).allowed).toBe(true);
  });

  it("beklenmeyen hatayı 'üye değil' diye önbelleğe ALMAZ", async () => {
    const { checkMediaAccess } = await load(false);
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 500 })).mockResolvedValueOnce(publicDoc(true));
    vi.stubGlobal("fetch", fetchMock);
    expect((await checkMediaAccess(request(), "movie", 9)).allowed).toBe(false);
    expect((await checkMediaAccess(request(), "movie", 9)).allowed).toBe(true); // ikinci denemede taze sorgu
  });

  it("üyelik sonucunu önbelleğe alır", async () => {
    const { checkMediaAccess } = await load(false);
    const fetchMock = vi.fn(async () => publicDoc(true));
    vi.stubGlobal("fetch", fetchMock);
    await checkMediaAccess(request(), "movie", 3);
    await checkMediaAccess(request(), "movie", 3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
