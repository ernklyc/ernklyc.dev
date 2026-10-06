"use client";

import { motion } from "framer-motion";
import BackOrHomeLink from "@/components/BackOrHomeLink";
import SectionBackground from "@/components/ui/SectionBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useLocale } from "@/contexts/LocaleContext";
import KlycBoxNav from "./KlycBoxNav";

/**
 * KLYC-Box tanıtım sayfası.
 *
 * İndirme ve kaynak kodu adresleri hazır olunca buraya yazılır: null iken düğmeler "Yakında"
 * olarak görünür, böylece henüz var olmayan bir adrese link verilmez. Metinler yalnızca
 * uygulamanın gerçekten yaptığı şeyleri anlatır; yeni bir özellik eklenince buraya da yazılır.
 */
const DOWNLOAD_URL: string | null = null;
const SOURCE_URL: string | null = null;
const ENGINE_URL = "https://github.com/ernklyc/klyc-engine";
const SUPPORT_EMAIL = "ernklycdev@icloud.com";

type Copy = {
  back: string;
  status: string;
  tagline: string;
  intro: string;
  download: string;
  soon: string;
  source: string;
  engine: string;
  featuresTitle: string;
  features: { title: string; text: string }[];
  trustTitle: string;
  trust: string[];
  honestTitle: string;
  honest: string[];
  needsTitle: string;
  needs: string;
  creditsTitle: string;
  creditsIntro: string;
  contactTitle: string;
  contactText: string;
  disclaimer: string;
};

const COPY: Record<"tr" | "en", Copy> = {
  tr: {
    back: "Ana sayfa",
    status: "Yakında · ilk sürüm hazırlanıyor",
    tagline: "Mac'te Windows oyunları.",
    intro:
      "KLYC-Box, Steam ve Epic Games kütüphaneni Apple Silicon Mac'inde çalıştıran, ücretsiz ve açık kaynak bir macOS uygulaması. Kendi mağazası, dürüst uyumluluk etiketleri, çökme teşhisi ve indirme yönetimi var.",
    download: "İndir",
    soon: "Yakında",
    source: "Kaynak kodu",
    engine: "Motor dosyaları (GitHub)",
    featuresTitle: "Neler yapıyor",
    features: [
      { title: "Steam ve Epic tek yerde", text: "İkisinin kütüphanesi, mağazası ve indirmeleri tek uygulamada. Oyunlar kendi Windows ortamında çalışır; Mac'ine bir şey bulaşmaz." },
      { title: "Kendi mağazası", text: "Steam mağazasını Mac'e göre süz: Mac sürümü olanlar, Steam Deck, fiyat, indirim, Türkçe dil desteği. Arama, kategoriler ve istek listesi." },
      { title: "Dürüst uyumluluk etiketleri", text: "Test edildi, oyuncu raporu, çalışmaz, test edilmedi. Her etiketin kaynağı ve tarihi var. Hile korumalı oyunlar önceden işaretlenir." },
      { title: "Çökme teşhisi", text: "Oyun hemen kapanırsa günlükten nedenini okur: eksik Visual C++ ya da .NET, hile koruması, grafik hatası. Çözümü varsa tek tıkla sunar." },
      { title: "İndirme yönetimi", text: "Epic indirmelerinde yüzde, hız, kalan süre; duraklat ve devam et. Steam indirmelerinde hız ve kalan süre." },
      { title: "Görev yöneticisi ve ısı", text: "Çalışan oyunun bellek ve işlemci kullanımı, Mac ısınınca uyarı, tek tıkla durdurma." },
      { title: "Oyun başına ayar", text: "Kare hızı sınırı (180 Hz ekranlar dahil), grafik modu, başlatma seçenekleri, gölge önbelleği temizleme." },
      { title: "Masaüstü kısayolu", text: "Oyunun kendi simgesiyle masaüstüne kısayol. Çift tıkla, oyna." },
    ],
    trustTitle: "Güvenle",
    trust: [
      "Ücretsiz ve açık kaynak (GPL-3.0). Hiçbir özellik için para almaz, ticari olmayacak.",
      "Veri toplamaz: analitik ya da takip kodu yok.",
      "İndirdiği motor dosyaları, uygulamanın içindeki SHA-256 özetleriyle doğrulanır.",
      "Apple'ın D3DMetal'i uygulamayla dağıtılmaz; Apple'ın lisansını uygulama içinde sen kabul edersin.",
    ],
    honestTitle: "Dürüst olalım",
    honest: [
      "Her oyun çalışmaz. Easy Anti-Cheat, BattlEye gibi çekirdek seviyesinde hile koruması kullanan çevrimiçi oyunlar Mac'te çalışmaz; KLYC-Box bunları önceden söyler.",
      "Korsan oyunlar ya da hile korumalarını aşmak için değildir.",
      "Bu bir Wine uygulamasıdır: performans oyuna ve Mac'ine göre değişir.",
    ],
    needsTitle: "Gereksinimler",
    needs: "Apple Silicon (M1 ve üstü) ve macOS 14 ya da daha yenisi. Wine'ın Intel kodu için Rosetta gerekir; uygulama gerekirse kurulumunu önerir.",
    creditsTitle: "Teşekkürler",
    creditsIntro: "KLYC-Box, başkalarının emeğinin üzerine kurulu. Başta Highball projesi ve yazarı Gauthier Piarrette olmak üzere:",
    contactTitle: "Destek ve geri bildirim",
    contactText: "Bir sorun, öneri ya da test sonucu için yaz:",
    disclaimer: "KLYC-Box; Valve, Epic Games ya da Apple ile bağlantılı değildir ve onlar tarafından onaylanmamıştır. Steam, Epic Games ve Apple, sahiplerinin markalarıdır.",
  },
  en: {
    back: "Home",
    status: "Coming soon · first release in preparation",
    tagline: "Windows games on your Mac.",
    intro:
      "KLYC-Box is a free, open source macOS app that runs your Steam and Epic Games library on an Apple Silicon Mac. It has its own store, honest compatibility labels, crash diagnosis and download management.",
    download: "Download",
    soon: "Soon",
    source: "Source code",
    engine: "Engine files (GitHub)",
    featuresTitle: "What it does",
    features: [
      { title: "Steam and Epic in one place", text: "Both libraries, stores and downloads in one app. Games run in their own Windows environment; nothing leaks onto your Mac." },
      { title: "Its own store", text: "Filter the Steam store for the Mac: games with a Mac build, Steam Deck, price, discounts, Turkish language support. Search, categories and a wishlist." },
      { title: "Honest compatibility labels", text: "Tested, player reports, won't run, not tested. Every label has a source and a date. Games with anti-cheat are flagged up front." },
      { title: "Crash diagnosis", text: "If a game closes at once it reads the log for the reason: a missing Visual C++ or .NET, an anti-cheat, a graphics fault. When there is a fix it offers it in one click." },
      { title: "Download management", text: "Epic downloads show percent, speed and time left, with pause and resume. Steam downloads show speed and time left." },
      { title: "Task manager and heat", text: "Memory and processor use of the running game, a warning when the Mac runs hot, one-click stop." },
      { title: "Per-game settings", text: "Frame rate cap (180 Hz displays included), graphics mode, launch options, clearing the shader cache." },
      { title: "Desktop shortcut", text: "A shortcut with the game's own icon on the Desktop. Double-click to play." },
    ],
    trustTitle: "Trust",
    trust: [
      "Free and open source (GPL-3.0). It takes no money for any feature and will not be commercial.",
      "It collects no data: no analytics or tracking code.",
      "The engine files it downloads are checked against SHA-256 checksums inside the app.",
      "Apple's D3DMetal is not distributed with the app; you accept Apple's license inside the app.",
    ],
    honestTitle: "Let's be honest",
    honest: [
      "Not every game runs. Online games with kernel-level anti-cheat such as Easy Anti-Cheat or BattlEye do not run on a Mac; KLYC-Box tells you before you try.",
      "It is not for pirated games or for getting around anti-cheat.",
      "It is a Wine app: performance depends on the game and your Mac.",
    ],
    needsTitle: "Requirements",
    needs: "Apple Silicon (M1 or newer) and macOS 14 or later. Wine's Intel code needs Rosetta; the app offers to install it when needed.",
    creditsTitle: "Thanks",
    creditsIntro: "KLYC-Box stands on other people's work. First of all the Highball project and its author Gauthier Piarrette, and:",
    contactTitle: "Support and feedback",
    contactText: "For a problem, a suggestion or a test result, write to:",
    disclaimer: "KLYC-Box is not affiliated with or approved by Valve, Epic Games or Apple. Steam, Epic Games and Apple are their owners' trademarks.",
  },
};

const CREDITS: { name: string; license: string; url: string }[] = [
  { name: "Highball", license: "GPL-3.0", url: "https://github.com/gauthierpiarrette/highball" },
  { name: "Wine", license: "LGPL-2.1+", url: "https://www.winehq.org" },
  { name: "Sikarugir", license: "LGPL-2.1", url: "https://github.com/Sikarugir-App" },
  { name: "DXMT", license: "MIT", url: "https://github.com/3Shain/dxmt" },
  { name: "DXVK", license: "zlib", url: "https://github.com/doitsujin/dxvk" },
  { name: "MoltenVK", license: "Apache-2.0", url: "https://github.com/KhronosGroup/MoltenVK" },
  { name: "Winetricks", license: "LGPL-2.1", url: "https://github.com/Winetricks/winetricks" },
  { name: "Legendary", license: "GPL-3.0", url: "https://github.com/legendary-gl/legendary" },
  { name: "Sparkle", license: "MIT", url: "https://sparkle-project.org" },
  { name: "Are We Anti-Cheat Yet?", license: "MIT", url: "https://areweanticheatyet.com" },
];

const linkClass = "text-[#A9B7C4] hover:text-[#C7D2DA] transition-colors font-medium";

function ActionButton({ href, children, primary }: { href: string | null; children: React.ReactNode; primary?: boolean }) {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border border-white/10 bg-white/[0.03] text-gray-500`}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${primary ? "bg-white text-black hover:bg-[#C7D2DA]" : "border border-white/20 text-white hover:bg-white/10"}`}
    >
      {children}
    </a>
  );
}

export default function KlycBoxClient() {
  const { locale } = useLocale();
  const c = COPY[locale];

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <SectionBackground />
      <div className="container mx-auto max-w-5xl relative z-10 space-y-8">
        <BackOrHomeLink className="inline-flex text-sm text-gray-400 hover:text-white transition-colors">
          ← {c.back}
        </BackOrHomeLink>
        <KlycBoxNav />

        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GlassCard className="p-8 md:p-12">
            <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs tracking-wide text-[#A9B7C4]">
              {c.status}
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#A9B7C4] to-white">
              KLYC-Box
            </h1>
            <p className="mt-2 text-2xl md:text-3xl font-semibold text-white">{c.tagline}</p>
            <p className="mt-5 max-w-3xl text-gray-300 leading-relaxed">{c.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionButton href={DOWNLOAD_URL} primary>
                {DOWNLOAD_URL ? c.download : `${c.download} · ${c.soon}`}
              </ActionButton>
              <ActionButton href={SOURCE_URL}>{SOURCE_URL ? c.source : `${c.source} · ${c.soon}`}</ActionButton>
              <ActionButton href={ENGINE_URL}>{c.engine}</ActionButton>
            </div>
          </GlassCard>
        </motion.section>

        {/* Features */}
        <section>
          <h2 className="mb-5 text-2xl font-semibold">{c.featuresTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.05 }}
              >
                <GlassCard className="h-full p-6">
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">{f.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust + honest */}
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold">{c.trustTitle}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-300">
              {c.trust.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold">{c.honestTitle}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-gray-300">
              {c.honest.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Requirements */}
        <GlassCard className="p-6 md:p-8">
          <h2 className="text-xl font-semibold">{c.needsTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{c.needs}</p>
        </GlassCard>

        {/* Credits */}
        <GlassCard className="p-6 md:p-8">
          <h2 className="text-xl font-semibold">{c.creditsTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{c.creditsIntro}</p>
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {CREDITS.map((cr) => (
              <li key={cr.name} className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-2">
                <a href={cr.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {cr.name}
                </a>
                <span className="text-xs text-gray-500">{cr.license}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Contact */}
        <GlassCard className="p-6 md:p-8">
          <h2 className="text-xl font-semibold">{c.contactTitle}</h2>
          <p className="mt-3 text-sm text-gray-300">
            {c.contactText}{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="mt-6 text-xs leading-relaxed text-gray-500">{c.disclaimer}</p>
        </GlassCard>
      </div>
    </main>
  );
}
