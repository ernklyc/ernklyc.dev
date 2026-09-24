import { afterEach, describe, expect, it, vi } from "vitest";
import { DDD_MONTHLY_LIMIT, readDddUsage, recordDddRequest, usageMonthKey } from "@/features/movies/server/api-usage";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("usageMonthKey", () => {
  it("UTC yıl-ay verir", () => {
    expect(usageMonthKey(new Date("2026-09-24T23:59:00Z"))).toBe("2026-09");
    expect(usageMonthKey(new Date("2026-01-01T00:00:00Z"))).toBe("2026-01");
  });
});

describe("recordDddRequest", () => {
  it("sayacı yalnızca +1 artıran bir yazma gönderir", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "proj");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    await recordDddRequest();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain(":commit?key=key");
    const body = JSON.parse(String(init.body));
    expect(body.writes).toHaveLength(1);
    expect(body.writes[0].transform.fieldTransforms).toEqual([{ fieldPath: "ddd", increment: { integerValue: "1" } }]);
    expect(body.writes[0].transform.document).toContain(`/apiUsage/${usageMonthKey()}`);
  });

  it("yazım 403/ağ hatası olsa da özelliği bozmaz, uyarı loglar", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "proj");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 403 })));
    await expect(recordDddRequest()).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled(); // sessiz başarısızlık olmasın
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    await expect(recordDddRequest()).resolves.toBeUndefined();
    warn.mockRestore();
  });
});

describe("readDddUsage", () => {
  it("belge yoksa 0, varsa sayıyı döner; hatada fırlatır", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "proj");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    expect((await readDddUsage("t")).used).toBe(0);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ fields: { ddd: { integerValue: "137" } } }))));
    expect((await readDddUsage("t")).used).toBe(137);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 403 })));
    await expect(readDddUsage("t")).rejects.toThrow();
    expect(DDD_MONTHLY_LIMIT).toBe(5000);
  });
});
