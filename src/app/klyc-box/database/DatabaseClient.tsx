"use client";

import { useMemo, useState } from "react";
import BackOrHomeLink from "@/components/BackOrHomeLink";
import SectionBackground from "@/components/ui/SectionBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/contexts/LocaleContext";
import data from "@/data/klyc-games.json";
import KlycBoxNav from "../KlycBoxNav";

type Tier = "tested" | "reported" | "blocked" | "untested";
interface Row {
  id: string;
  title: string;
  appid: number | null;
  tier: Tier;
  status: string;
  renderer: string | null;
  lastVerified: string | null;
  anticheat: string[];
  risky: boolean;
}

const ROWS = data.games as Row[];
const PAGE = 60;
const ORDER: Record<Tier, number> = { tested: 0, reported: 1, blocked: 2, untested: 3 };
const RENDERERS: Record<string, string> = { dxmt: "DXMT", d3dmetal: "D3DMetal", dxvk: "DXVK", vkd3d: "vkd3d-proton", wined3d: "Wine D3D" };

const COPY = {
  tr: {
    back: "Ana sayfa",
    title: "Uyumluluk veritabanı",
    intro:
      "Hangi Windows oyunları Apple Silicon Mac'te çalışıyor, hangi grafik modunu istiyor ve en son ne zaman doğrulandı. Veri açık ve CC0 lisanslı: al, kullan.",
    honestTitle: "Bu etiketler ne demek?",
    honest:
      "Kayıtların çoğu açık uyumluluk veritabanından gelir (Highball projesi, katkıcıları ve oyuncu bildirimleri). \"Test edildi\", biri oyunu kendi Mac'inde denediğini ve çalıştığını bildirdi demektir; senin Mac'inde sonuç farklı olabilir. \"Çalışmaz\" çoğunlukla çekirdek seviyesinde hile koruması yüzündendir.",
    all: "Hepsi",
    tiers: { tested: "Test edildi", reported: "Oyuncu raporu", blocked: "Çalışmaz", untested: "Test edilmedi" } as Record<Tier, string>,
    search: "Oyun ara…",
    onlyAC: "Yalnızca hile korumalı",
    game: "Oyun",
    status: "Durum",
    renderer: "Grafik modu",
    verified: "Son doğrulama",
    shown: "gösteriliyor",
    more: "Daha fazla göster",
    none: "Aramana uyan oyun yok.",
    download: "Veriyi indir (JSON)",
    updated: "Güncellendi",
    store: "Steam'de aç",
  },
  en: {
    back: "Home",
    title: "Compatibility database",
    intro:
      "Which Windows games run on an Apple Silicon Mac, which graphics mode each one wants, and when it was last confirmed. The data is open and CC0: take it.",
    honestTitle: "What do these labels mean?",
    honest:
      "Most records come from the open compatibility database (the Highball project, its contributors and player reports). \"Tested\" means someone ran the game on their own Mac and reported that it works; your Mac may differ. \"Won't run\" is mostly down to kernel-level anti-cheat.",
    all: "All",
    tiers: { tested: "Tested", reported: "Player reports", blocked: "Won't run", untested: "Not tested" } as Record<Tier, string>,
    search: "Search games…",
    onlyAC: "Only with anti-cheat",
    game: "Game",
    status: "Status",
    renderer: "Graphics mode",
    verified: "Last confirmed",
    shown: "shown",
    more: "Show more",
    none: "No game matches your search.",
    download: "Download the data (JSON)",
    updated: "Updated",
    store: "Open on Steam",
  },
} as const;

const TIER_STYLE: Record<Tier, string> = {
  tested: "border-emerald-400/40 text-emerald-300",
  reported: "border-sky-400/40 text-sky-300",
  blocked: "border-red-400/40 text-red-300",
  untested: "border-white/20 text-gray-400",
};

export default function DatabaseClient() {
  const { locale } = useLocale();
  const c = COPY[locale];
  const [tier, setTier] = useState<Tier | "all">("all");
  const [query, setQuery] = useState("");
  const [onlyAC, setOnlyAC] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: ROWS.length };
    for (const r of ROWS) m[r.tier] = (m[r.tier] ?? 0) + 1;
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) => (tier === "all" || r.tier === tier) && (!onlyAC || r.anticheat.length > 0) && (!q || r.title.toLowerCase().includes(q))).sort(
      (a, b) => ORDER[a.tier] - ORDER[b.tier] || a.title.localeCompare(b.title, "en"),
    );
  }, [tier, query, onlyAC]);

  const visible = filtered.slice(0, limit);
  const chip = (active: boolean) =>
    "rounded-full border px-3 py-1 text-xs transition-colors " + (active ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-gray-400 hover:text-white");

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <SectionBackground />
      <div className="container mx-auto max-w-5xl relative z-10 space-y-6">
        <BackOrHomeLink className="inline-flex text-sm text-gray-400 hover:text-white transition-colors">← {c.back}</BackOrHomeLink>
        <KlycBoxNav />

        <GlassCard className="p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#A9B7C4] to-white">{c.title}</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{c.intro}</p>
          <p className="mt-4 text-sm text-gray-500">
            {c.updated}: {data.generated} ·{" "}
            <a href="/klyc-box/klyc-games.json" className="text-[#A9B7C4] hover:text-[#C7D2DA]" download>
              {c.download}
            </a>
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">{c.honestTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">{c.honest}</p>
        </GlassCard>

        <div className="flex flex-wrap items-center gap-2">
          <button className={chip(tier === "all")} onClick={() => { setTier("all"); setLimit(PAGE); }}>
            {c.all} · {counts.all}
          </button>
          {(["tested", "reported", "blocked"] as Tier[]).map((t) => (
            <button key={t} className={chip(tier === t)} onClick={() => { setTier(t); setLimit(PAGE); }}>
              {c.tiers[t]} · {counts[t] ?? 0}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs text-gray-400">
            <input type="checkbox" checked={onlyAC} onChange={(e) => { setOnlyAC(e.target.checked); setLimit(PAGE); }} />
            {c.onlyAC}
          </label>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }}
          placeholder={c.search}
          aria-label={c.search}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-white/30"
        />

        <GlassCard className="overflow-hidden p-0">
          <div className="hidden grid-cols-[1fr_9rem_8rem_8rem] gap-3 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wide text-gray-500 md:grid">
            <span>{c.game}</span><span>{c.status}</span><span>{c.renderer}</span><span>{c.verified}</span>
          </div>
          {visible.length === 0 && <p className="px-5 py-8 text-sm text-gray-400">{c.none}</p>}
          <ul>
            {visible.map((r) => (
              <li key={r.id} className="grid grid-cols-1 gap-1 border-b border-white/5 px-5 py-3 text-sm md:grid-cols-[1fr_9rem_8rem_8rem] md:items-center md:gap-3">
                <span className="font-medium text-white">
                  {r.appid ? (
                    <a href={`https://store.steampowered.com/app/${r.appid}`} target="_blank" rel="noopener noreferrer" title={c.store} className="hover:text-[#C7D2DA]">
                      {r.title}
                    </a>
                  ) : (
                    r.title
                  )}
                  {r.anticheat.length > 0 && <span className="ml-2 text-xs text-amber-300/80">· {r.anticheat.join(", ")}</span>}
                </span>
                <span><span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${TIER_STYLE[r.tier]}`}>{c.tiers[r.tier]}</span></span>
                <span className="text-gray-300">{r.renderer ? (RENDERERS[r.renderer] ?? r.renderer) : "—"}</span>
                <span className="text-gray-500">{r.lastVerified ?? "—"}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{visible.length} / {filtered.length} {c.shown}</span>
          {visible.length < filtered.length && (
            <button onClick={() => setLimit((l) => l + PAGE)} className="rounded-full border border-white/20 px-5 py-2 text-white hover:bg-white/10">
              {c.more}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
