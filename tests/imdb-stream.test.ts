import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { gzipSync } from "node:zlib";
import { afterEach, describe, expect, it, vi } from "vitest";

// Zaman aşımını testte kısaltmak için modülü env ile yükleriz.
async function load(timeoutMs = "600") {
  vi.resetModules();
  vi.stubEnv("IMDB_DATASET_TIMEOUT_MS", timeoutMs);
  return import("@/features/movies/server/imdb");
}

let server: Server | undefined;
afterEach(async () => {
  vi.unstubAllEnvs();
  await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
  server = undefined;
});

function serve(handler: Parameters<typeof createServer>[1]) {
  return new Promise<string>((resolve) => {
    server = createServer(handler).listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${(server!.address() as AddressInfo).port}/data.tsv.gz`));
  });
}

const tsv = ["tconst\tv", ...Array.from({ length: 2000 }, (_, i) => `tt${String(i).padStart(7, "0")}\tçok satır ${i}`)].join("\n");

describe("scanGzipLines", () => {
  it("tüm satırları okur (küçük parçalara bölünmüş akışta ve UTF-8 sınırlarında da)", async () => {
    const gz = gzipSync(Buffer.from(tsv, "utf8"));
    const url = await serve((_req, res) => {
      // Küçük parçalar: satır ve çok baytlı karakter sınırlarını zorlar.
      let offset = 0;
      const timer = setInterval(() => {
        if (offset >= gz.length) {
          clearInterval(timer);
          res.end();
          return;
        }
        res.write(gz.subarray(offset, offset + 37));
        offset += 37;
      }, 0);
    });
    const { scanGzipLines } = await load("5000");
    const lines: string[] = [];
    await scanGzipLines(url, (line) => void lines.push(line));
    expect(lines).toHaveLength(2001);
    expect(lines[0]).toBe("tconst\tv");
    expect(lines[2000]).toBe("tt0001999\tçok satır 1999");
  });

  it("visit true dönünce erken durur", async () => {
    const gz = gzipSync(Buffer.from(tsv));
    const url = await serve((_req, res) => res.end(gz));
    const { scanGzipLines } = await load("5000");
    let seen = 0;
    await scanGzipLines(url, () => (++seen === 10 ? true : undefined));
    expect(seen).toBe(10);
  });

  it("HTTP hatasında fırlatır", async () => {
    const url = await serve((_req, res) => {
      res.statusCode = 503;
      res.end("no");
    });
    const { scanGzipLines } = await load("5000");
    await expect(scanGzipLines(url, () => {})).rejects.toThrow(/503/);
  });

  it("akış ortasında bağlantı kopunca ve zaman aşımında REDDEDER ama süreci ÇÖKERTMEZ", async () => {
    const uncaught: unknown[] = [];
    const onUncaught = (error: unknown) => uncaught.push(error);
    process.on("uncaughtException", onUncaught);
    process.on("unhandledRejection", onUncaught);
    try {
      // 1) yarım gzip gönderip soketi keser
      const gz = gzipSync(Buffer.from(tsv));
      let url = await serve((req, res) => {
        res.write(gz.subarray(0, Math.floor(gz.length / 2)));
        setTimeout(() => req.socket.destroy(), 30);
      });
      let { scanGzipLines } = await load("5000");
      await expect(scanGzipLines(url, () => {})).rejects.toBeTruthy();
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;

      // 2) yanıt hiç gelmez -> zaman aşımı
      url = await serve(() => {
        /* asılı kalır */
      });
      ({ scanGzipLines } = await load("300"));
      await expect(scanGzipLines(url, () => {})).rejects.toMatchObject({ name: "TimeoutError" });

      // 3) gövde başladıktan sonra takılır -> akış ortasında zaman aşımı
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
      url = await serve((_req, res) => {
        res.write(gz.subarray(0, 20)); // gzip başlığı gider, gerisi gelmez
      });
      ({ scanGzipLines } = await load("300"));
      await expect(scanGzipLines(url, () => {})).rejects.toBeTruthy();

      await new Promise((resolve) => setTimeout(resolve, 200)); // geç gelen hatalar için pay
    } finally {
      process.off("uncaughtException", onUncaught);
      process.off("unhandledRejection", onUncaught);
    }
    expect(uncaught).toEqual([]);
  });
});
