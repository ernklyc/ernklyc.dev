/**
 * Build sırasında (npm "prebuild") arşivdeki dizilerin IMDb bölüm puanlarını önceden hesaplar.
 *
 * Neden: IMDb veri setleri (title.episode 55 MB + title.ratings 9 MB) her istekte indirilince ilk
 * "Bölüm puanlarını yükle" ~20 sn sürüyor. Arşivdeki dizileri tek geçişte hesaplayıp
 * src/features/movies/generated/episode-ratings.json içine gömüyoruz; API bu dosyadan anında döner.
 * Arşivde olmayan diziler eskisi gibi canlı hesaplanır.
 *
 * Yalnızca Vercel'de (VERCEL=1) veya FORCE_BAKE=1 ile çalışır; hata verirse build'i DÜŞÜRMEZ,
 * boş dosya yazar (canlı hesaplama devreye girer).
 */
import { createGunzip } from "node:zlib";
import { Readable } from "node:stream";
import { createInterface } from "node:readline";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

const OUTPUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "features", "movies", "generated", "episode-ratings.json");
const OWNER_UID = "zYIbbfB5YpfCG6KHLJMpVlhT3B62";
const EPISODES_URL = "https://datasets.imdbws.com/title.episode.tsv.gz";
const RATINGS_URL = "https://datasets.imdbws.com/title.ratings.tsv.gz";

function loadLocalEnv() {
  const file = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

function write(shows) {
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify({ generatedAt: Object.keys(shows).length ? new Date().toISOString() : null, shows }));
}

async function archiveSeries() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) throw new Error("Firebase ortam değişkenleri yok.");

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${OWNER_UID}:runQuery?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "library" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                { fieldFilter: { field: { fieldPath: "isPublic" }, op: "EQUAL", value: { booleanValue: true } } },
                { fieldFilter: { field: { fieldPath: "mediaType" }, op: "EQUAL", value: { stringValue: "tv" } } },
              ],
            },
          },
        },
      }),
    },
  );
  if (!response.ok) throw new Error(`Arşiv okunamadı (${response.status}).`);
  const rows = await response.json();
  const ids = new Set();
  for (const row of rows) {
    const imdbId = row.document?.fields?.imdbId?.stringValue;
    if (imdbId && /^tt\d{7,10}$/.test(imdbId)) ids.add(imdbId);
  }
  return ids;
}

async function gzipLines(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok || !response.body) throw new Error(`Veri seti alınamadı (${response.status}).`);
  const gunzip = createGunzip();
  Readable.fromWeb(response.body).pipe(gunzip);
  return createInterface({ input: gunzip, crlfDelay: Infinity });
}

async function main() {
  if (!process.env.VERCEL && !process.env.FORCE_BAKE) {
    console.log("[bake] Vercel dışında atlandı (FORCE_BAKE=1 ile zorla).");
    return;
  }
  loadLocalEnv();
  const started = Date.now();

  const seriesIds = await archiveSeries();
  console.log(`[bake] arşivde IMDb ID'li ${seriesIds.size} dizi`);
  if (!seriesIds.size) return write({});

  // 1) Tek geçişte tüm dizilerin bölümleri
  const episodes = new Map(); // seriesId -> [{id, s, e}]
  for await (const line of await gzipLines(EPISODES_URL)) {
    const tab1 = line.indexOf("\t");
    const tab2 = line.indexOf("\t", tab1 + 1);
    if (tab1 < 0 || tab2 < 0) continue;
    const parent = line.slice(tab1 + 1, tab2);
    if (!seriesIds.has(parent)) continue;
    const [id, , season, episode] = line.split("\t");
    if (season === "\\N" || episode === "\\N") continue;
    const s = Number(season);
    const e = Number(episode);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(e)) continue;
    if (!episodes.has(parent)) episodes.set(parent, []);
    episodes.get(parent).push({ id, s, e });
  }

  // 2) Tek geçişte bu bölümlerin puanları
  const wanted = new Set();
  for (const list of episodes.values()) for (const ep of list) wanted.add(ep.id);
  const ratings = new Map();
  for await (const line of await gzipLines(RATINGS_URL)) {
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const id = line.slice(0, tab);
    if (!wanted.has(id)) continue;
    const [, average, votes] = line.split("\t");
    ratings.set(id, [Number(average), Number(votes)]);
  }

  // 3) Kompakt çıktı: [sezon, bölüm, imdbId, puan, oy]
  const shows = {};
  for (const [seriesId, list] of episodes) {
    const rows = list
      .filter((ep) => ratings.has(ep.id))
      .sort((a, b) => a.s - b.s || a.e - b.e)
      .map((ep) => [ep.s, ep.e, ep.id, ...ratings.get(ep.id)]);
    if (rows.length) shows[seriesId] = rows;
  }
  write(shows);
  const total = Object.values(shows).reduce((sum, rows) => sum + rows.length, 0);
  console.log(`[bake] ${Object.keys(shows).length} dizi, ${total} bölüm puanı gömüldü (${((Date.now() - started) / 1000).toFixed(1)} sn)`);
}

main().catch((error) => {
  console.warn("[bake] başarısız, canlı hesaplamaya düşülecek:", error?.message ?? error);
  try {
    write({});
  } catch {
    // yazılamıyorsa mevcut dosya kalır
  }
});
