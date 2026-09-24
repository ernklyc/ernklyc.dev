import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Firestore güvenlik kuralı ile istemcilerin yazdığı alanlar arasındaki SÖZLEŞME.
 * `imdbRating/imdbVotes` kurala eklenmediği için tüm film ekleme istekleri `permission-denied`
 * ile reddedilmişti; bu test bu sınıf hatayı derleme sırasında yakalar.
 */
const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

const rules = read("firestore.rules");
const listAfter = (marker: string) => {
  const start = rules.indexOf(marker);
  expect(start, `kuralda "${marker}" bulunamadı`).toBeGreaterThan(-1);
  const list = rules.slice(start, rules.indexOf("]", start));
  return [...list.matchAll(/"([A-Za-z]+)"/g)].map((match) => match[1]);
};
const allowedTop = listAfter("request.resource.data.keys().hasOnly([");
const allowedSnapshot = listAfter("request.resource.data.snapshot.keys().hasOnly([");

/** Bir blok içindeki girinti düzeyine göre anahtarları çıkarır. */
function keysAtIndent(block: string, indent: number, quote: string) {
  const pattern = new RegExp(`^ {${indent}}${quote}?([A-Za-z]+)${quote}?:`, "gm");
  return [...block.matchAll(pattern)].map((match) => match[1]);
}

describe("Firestore kuralı ↔ istemci yükü", () => {
  it("kural beklediğimiz alanları içeriyor (test sağlaması)", () => {
    expect(allowedTop).toEqual(expect.arrayContaining(["tmdbId", "isPublic", "snapshot"]));
    expect(allowedSnapshot).toEqual(expect.arrayContaining(["title", "imdbRating", "imdbVotes"]));
  });

  it("mobil: TmdbSearchItem.toFirestore() yalnızca kuralın izin verdiği alanları yazar", () => {
    const dart = read("mobile/lib/models/tmdb_search_item.dart");
    const block = dart.slice(dart.indexOf("toFirestore()"));
    const top = keysAtIndent(block.slice(0, block.indexOf("\n  };")), 4, "'");
    const snapshotBlock = block.slice(block.indexOf("'snapshot': {"), block.indexOf("},", block.indexOf("'snapshot': {")));
    const snapshot = keysAtIndent(snapshotBlock, 6, "'");
    expect(top.length).toBeGreaterThan(5);
    expect(snapshot.length).toBeGreaterThan(4);
    expect(top.filter((key) => !allowedTop.includes(key))).toEqual([]);
    expect(snapshot.filter((key) => !allowedSnapshot.includes(key))).toEqual([]);
  });

  it("web: libraryPayload() yalnızca kuralın izin verdiği alanları yazar", () => {
    const ts = read("src/features/movies/library.ts");
    const block = ts.slice(ts.indexOf("function libraryPayload"));
    const top = keysAtIndent(block.slice(0, block.indexOf("\n  };")), 4, "");
    const snapshotBlock = block.slice(block.indexOf("snapshot: {"), block.indexOf("},", block.indexOf("snapshot: {")));
    const snapshot = keysAtIndent(snapshotBlock, 6, "");
    expect(top.length).toBeGreaterThan(5);
    expect(snapshot.length).toBeGreaterThan(4);
    expect(top.filter((key) => !allowedTop.includes(key))).toEqual([]);
    expect(snapshot.filter((key) => !allowedSnapshot.includes(key))).toEqual([]);
  });

  it("kural sayaç belgesine yalnızca +1 artışa izin veriyor", () => {
    expect(rules).toMatch(/match \/apiUsage\/\{month\}/);
    expect(rules).toMatch(/request\.resource\.data\.ddd == resource\.data\.ddd \+ 1/);
    expect(rules).toMatch(/request\.resource\.data\.ddd == 1/);
  });
});
