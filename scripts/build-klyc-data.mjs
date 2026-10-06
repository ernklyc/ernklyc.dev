#!/usr/bin/env node
/**
 * KLYC-Box oyun verisini siteye hazırlar.
 *
 * Kaynak: KLYC-Box deposundaki `db/games/*.json` (uyumluluk kayıtları, CC0) ve `db/anticheat.json`
 * (Are We Anti-Cheat Yet? listesi, MIT). Çıktı: `src/data/klyc-games.json`, sitedeki
 * /klyc-box/database ve /klyc-box/anti-cheat sayfalarının okuduğu küçük, düz bir dosya.
 *
 * Kullanım: node scripts/build-klyc-data.mjs [KLYC-Box deposunun yolu]
 */
import fs from "node:fs";
import path from "node:path";

const repo = process.argv[2] ?? "/Volumes/SSD/mac-game/klyc-box";
const out = path.join(process.cwd(), "src/data/klyc-games.json");

/** Uygulamadaki üç kademe: test edildi / oyuncu raporu / çalışmaz. */
function tier(status) {
  if (status === "verified-local") return "tested";
  if (status === "reported-upstream" || status === "community") return "reported";
  if (typeof status === "string" && status.startsWith("blocked-")) return "blocked";
  return "untested";
}

/** Wine'da çalışmayan ya da çekirdek seviyesinde çalışan korumalar (uygulamadaki liste ile aynı). */
const RISKY = new Set([
  "easy anti-cheat", "battleye", "xigncode3", "nprotect gameguard", "nexon game security", "anti-cheat expert",
  "netease anti-cheat expert", "ea anticheat", "ricochet", "hyperion", "denuvo anti-cheat", "faceit",
]);

const gamesDir = path.join(repo, "db/games");
const games = fs.readdirSync(gamesDir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(gamesDir, f), "utf8")));

const acFile = JSON.parse(fs.readFileSync(path.join(repo, "db/anticheat.json"), "utf8"));
const acByAppid = new Map();
for (const g of Object.values(acFile.games)) if (g.steam_appid) acByAppid.set(g.steam_appid, g);

const rows = games.map((g) => {
  const ac = g.anticheat?.names ?? acByAppid.get(g.steam_appid)?.anticheats ?? [];
  return {
    id: g.id,
    title: g.title,
    appid: g.steam_appid ?? null,
    tier: tier(g.status),
    status: g.status,
    renderer: g.renderer ?? null,
    lastVerified: g.lastVerified ?? null,
    anticheat: ac,
    risky: ac.some((n) => RISKY.has(n.toLowerCase())),
  };
}).sort((a, b) => a.title.localeCompare(b.title, "en"));

const known = new Set(rows.map((r) => r.appid).filter(Boolean));
const anticheatOnly = Object.values(acFile.games)
  .filter((g) => g.steam_appid && !known.has(g.steam_appid))
  .map((g) => ({
    title: g.title,
    appid: g.steam_appid,
    anticheat: g.anticheats,
    risky: g.anticheats.some((n) => RISKY.has(n.toLowerCase())),
  }))
  .filter((g) => g.risky)
  .sort((a, b) => a.title.localeCompare(b.title, "en"));

const count = (pred) => rows.filter(pred).length;
const byAnticheat = {};
for (const g of [...rows, ...anticheatOnly]) for (const n of g.anticheat) if (RISKY.has(n.toLowerCase())) byAnticheat[n] = (byAnticheat[n] ?? 0) + 1;

const data = {
  generated: new Date().toISOString().slice(0, 10),
  sources: { games: "KLYC-Box db/games (CC0-1.0)", anticheat: "Are We Anti-Cheat Yet? (MIT)" },
  counts: {
    games: rows.length,
    tested: count((r) => r.tier === "tested"),
    reported: count((r) => r.tier === "reported"),
    blocked: count((r) => r.tier === "blocked"),
    anticheatListed: rows.filter((r) => r.risky).length + anticheatOnly.length,
  },
  byAnticheat: Object.fromEntries(Object.entries(byAnticheat).sort((a, b) => b[1] - a[1])),
  games: rows,
  anticheatOnly,
};
fs.writeFileSync(out, JSON.stringify(data));
// The same file for download: the data is CC0, "al, kullan".
fs.mkdirSync(path.join(process.cwd(), "public/klyc-box"), { recursive: true });
fs.copyFileSync(out, path.join(process.cwd(), "public/klyc-box/klyc-games.json"));
console.log(`${out}\n  oyun: ${rows.length} (test edildi ${data.counts.tested}, oyuncu raporu ${data.counts.reported}, çalışmaz ${data.counts.blocked})\n  yalnızca hile koruması listesinde: ${anticheatOnly.length}\n  boyut: ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
