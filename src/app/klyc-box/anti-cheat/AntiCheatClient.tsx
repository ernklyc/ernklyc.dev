"use client";

import { useMemo, useState } from "react";
import BackOrHomeLink from "@/components/BackOrHomeLink";
import SectionBackground from "@/components/ui/SectionBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/contexts/LocaleContext";
import data from "@/data/klyc-games.json";
import KlycBoxNav from "../KlycBoxNav";

interface Entry {
  title: string;
  appid: number | null;
  anticheat: string[];
  tier: "tested" | "reported" | "blocked" | "untested" | null;
}

const RISKY = new Set([
  "easy anti-cheat", "battleye", "xigncode3", "nprotect gameguard", "nexon game security", "anti-cheat expert",
  "netease anti-cheat expert", "ea anticheat", "ricochet", "hyperion", "denuvo anti-cheat", "faceit",
]);
const risky = (names: string[]) => names.filter((n) => RISKY.has(n.toLowerCase()));

const ENTRIES: Entry[] = [
  ...data.games.filter((g) => g.risky).map((g) => ({ title: g.title, appid: g.appid, anticheat: risky(g.anticheat), tier: g.tier as Entry["tier"] })),
  ...data.anticheatOnly.map((g) => ({ title: g.title, appid: g.appid, anticheat: risky(g.anticheat), tier: null })),
].sort((a, b) => a.title.localeCompare(b.title, "en"));

const TOP = Object.entries(data.byAnticheat).slice(0, 6);
const PAGE = 60;

const COPY = {
  tr: {
    back: "Ana sayfa",
    title: "Mac'te hile koruması",
    lead: "Bir oyunun Mac'te çalışmamasının en yaygın nedeni bu, ve hiçbir uyumluluk katmanının çözemediği tek sorun. 80 GB indirmeden önce bilmeye değer.",
    s1: "Neden çalışmaz",
    p1a: "Bazı hile korumaları Windows'un çekirdeğine bir sürücü yükler ve oyunun altından, işletim sisteminin içinden izler. Amaç, hile yazılımlarının sıradan bir program gibi saklanamamasıdır.",
    p1b: "Wine ise tamamen kullanıcı alanında çalışan bir çeviri katmanıdır: Windows çağrılarını macOS'a çevirir, ama altında bir Windows çekirdeği yoktur. Sürücünün yükleneceği bir yer yoktur. Bu eksik bir özellik ya da sonraki sürümde düzelecek bir hata değil, mimarinin kendisidir.",
    s2: "Hangileri etkileniyor",
    p2: "Veritabanımızda şu korumalardan birini kullanan oyunlar var (oyun sayısı):",
    p2b: "Kullanıcı alanında çalışan korumalar (örneğin VAC ve PunkBuster) Wine'da genellikle sorun çıkarmaz, bu yüzden işaretlenmez.",
    s3: "Hepsi kesin değil",
    p3: "Bir oyunun çevrimiçi modu engellenirken tek oyunculu modu çalışabilir. Bu yüzden her oyun için ayrı karar veriyoruz. Aşağıdaki liste \"çalışmaz\" değil, \"bu korumalardan birini kullanıyor\" demektir; Mac için kararı biz yorumluyoruz ve yanılabiliriz.",
    s4: "KLYC-Box ne yapıyor",
    p4a: "Oyunu satın almadan önce mağaza sayfasında \"Hile koruması\" işareti gösterir, kütüphanende çalışmayanları \"Çalışmaz\" diye etiketler ve nedenini söyler.",
    p4b: "Hile korumasını aşmaya çalışmaz ve bunun için bir yol da sunmaz. Aşmak hem şartlara aykırıdır hem de hesabının yasaklanmasına yol açabilir.",
    s5: "Çalışmayan bir oyun için",
    p5: "Oyunun Mac sürümü varsa onu kullan. Yoksa gerçek bir Windows makinesinde oynayıp görüntüyü izlemek tek gerçek yol: bulut oyun servisleri ya da evdeki Windows bilgisayarına uzaktan bağlanmak (Steam Remote Play gibi).",
    listTitle: "Hile korumalı oyunlar",
    search: "Oyun ara…",
    all: "Hepsi",
    game: "Oyun",
    protection: "Koruma",
    ours: "Bizdeki durum",
    noRecord: "Kayıt yok",
    tiers: { tested: "Test edildi", reported: "Oyuncu raporu", blocked: "Çalışmaz", untested: "Test edilmedi" },
    more: "Daha fazla göster",
    shown: "gösteriliyor",
    source: "Kaynak: Are We Anti-Cheat Yet? (MIT) ve KLYC-Box uyumluluk veritabanı (CC0). Güncellendi:",
  },
  en: {
    back: "Home",
    title: "Anti-cheat on a Mac",
    lead: "This is the most common reason a game will not run on a Mac, and the one problem no compatibility layer can solve. Worth knowing before you download 80 GB.",
    s1: "Why it cannot work",
    p1a: "Some anti-cheat systems load a driver into the Windows kernel and watch the game from underneath, inside the operating system. The point is that cheats cannot hide as ordinary programs.",
    p1b: "Wine is a translation layer that runs entirely in user space: it turns Windows calls into macOS ones, but there is no Windows kernel under it. There is nowhere for the driver to load. This is not a missing feature or a bug a later release will fix; it is the architecture.",
    s2: "Which ones are affected",
    p2: "Our database has games using one of these protections (number of games):",
    p2b: "Protections that run in user space (for example VAC and PunkBuster) usually cause no trouble under Wine, so they are not flagged.",
    s3: "Not everything is certain",
    p3: "A game's online mode can be blocked while its single-player mode works. So the decision is made per game. The list below does not say \"won't run\", it says \"uses one of these protections\"; the verdict for the Mac is our reading and we can be wrong.",
    s4: "What KLYC-Box does",
    p4a: "It shows a \"Anti-cheat\" mark on a game's store page before you buy it, labels what cannot run as \"Won't run\" in your library and says why.",
    p4b: "It does not try to get around anti-cheat and offers no way to. Doing so breaks the rules of the games and can get your account banned.",
    s5: "For a game that will not run",
    p5: "Use the game's Mac version if it has one. Otherwise the only real way is to play on an actual Windows machine and watch the picture: cloud gaming services, or connecting remotely to a Windows PC at home (like Steam Remote Play).",
    listTitle: "Games with anti-cheat",
    search: "Search games…",
    all: "All",
    game: "Game",
    protection: "Protection",
    ours: "Our status",
    noRecord: "No record",
    tiers: { tested: "Tested", reported: "Player reports", blocked: "Won't run", untested: "Not tested" },
    more: "Show more",
    shown: "shown",
    source: "Source: Are We Anti-Cheat Yet? (MIT) and the KLYC-Box compatibility database (CC0). Updated:",
  },
} as const;

export default function AntiCheatClient() {
  const { locale } = useLocale();
  const c = COPY[locale];
  const [name, setName] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENTRIES.filter((e) => (name === "all" || e.anticheat.includes(name)) && (!q || e.title.toLowerCase().includes(q)));
  }, [name, query]);
  const visible = filtered.slice(0, limit);

  const chip = (active: boolean) =>
    "rounded-full border px-3 py-1 text-xs transition-colors " + (active ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-gray-400 hover:text-white");

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <SectionBackground />
      <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
        <BackOrHomeLink className="inline-flex text-sm text-gray-400 hover:text-white transition-colors">← {c.back}</BackOrHomeLink>
        <KlycBoxNav />

        <GlassCard className="p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#A9B7C4] to-white">{c.title}</h1>
          <p className="mt-4 leading-relaxed text-gray-300">{c.lead}</p>
        </GlassCard>

        <GlassCard className="space-y-8 p-6 md:p-10">
          <section>
            <h2 className="text-2xl font-semibold">{c.s1}</h2>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p1a}</p>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p1b}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">{c.s2}</h2>
            <p className="mt-3 text-gray-300">{c.p2}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOP.map(([n, count]) => (
                <li key={n} className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-200">{n} · {count}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-400">{c.p2b}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">{c.s3}</h2>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p3}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">{c.s4}</h2>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p4a}</p>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p4b}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">{c.s5}</h2>
            <p className="mt-3 leading-relaxed text-gray-300">{c.p5}</p>
          </section>
        </GlassCard>

        <h2 className="pt-2 text-2xl font-semibold">{c.listTitle}</h2>
        <div className="flex flex-wrap gap-2">
          <button className={chip(name === "all")} onClick={() => { setName("all"); setLimit(PAGE); }}>{c.all} · {ENTRIES.length}</button>
          {TOP.map(([n, count]) => (
            <button key={n} className={chip(name === n)} onClick={() => { setName(n); setLimit(PAGE); }}>{n} · {count}</button>
          ))}
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
          <div className="hidden grid-cols-[1fr_12rem_9rem] gap-3 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wide text-gray-500 md:grid">
            <span>{c.game}</span><span>{c.protection}</span><span>{c.ours}</span>
          </div>
          <ul>
            {visible.map((e) => (
              <li key={`${e.appid}-${e.title}`} className="grid grid-cols-1 gap-1 border-b border-white/5 px-5 py-3 text-sm md:grid-cols-[1fr_12rem_9rem] md:items-center md:gap-3">
                <span className="font-medium text-white">
                  {e.appid ? (
                    <a href={`https://store.steampowered.com/app/${e.appid}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C7D2DA]">{e.title}</a>
                  ) : e.title}
                </span>
                <span className="text-amber-300/80">{e.anticheat.join(", ")}</span>
                <span className="text-gray-400">{e.tier ? c.tiers[e.tier] : c.noRecord}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{visible.length} / {filtered.length} {c.shown}</span>
          {visible.length < filtered.length && (
            <button onClick={() => setLimit((l) => l + PAGE)} className="rounded-full border border-white/20 px-5 py-2 text-white hover:bg-white/10">{c.more}</button>
          )}
        </div>
        <p className="text-xs text-gray-600">{c.source} {data.generated}</p>
      </div>
    </main>
  );
}
