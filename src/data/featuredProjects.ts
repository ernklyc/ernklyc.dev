import type { Locale } from "@/data/translations";

/**
 * Öne çıkan projeler: "Google Play Uygulamalarım"ın üstündeki bölüm.
 * Yeni proje eklemek için diziye bir nesne eklemek yeter; görsel `public/` altına konur.
 */
export interface FeaturedProject {
  id: string;
  name: string;
  /** Kısa tür etiketi (kartın üstündeki küçük yazı). */
  kind: Record<Locale, string>;
  description: Record<Locale, string>;
  /** `public/` içindeki görsel (soldaki fotoğraf) ve boyutu. */
  image: { src: string; width: number; height: number; alt: Record<Locale, string> };
  tags: string[];
  links: { href: string; label: Record<Locale, string>; primary?: boolean }[];
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "klyc-box",
    name: "KLYC-Box",
    kind: { tr: "macOS uygulaması · Açık kaynak", en: "macOS app · Open source" },
    description: {
      tr: "Windows oyunlarını ve uygulamalarını Apple Silicon'lu Mac'te çalıştıran, ücretsiz ve açık kaynaklı bir macOS uygulaması. Steam ve Epic kütüphanen tek yerde; bir oyunun Mac'te açılıp açılmayacağını satın almadan önce oyun rehberinden görürsün. Dört dil: Türkçe, English, 简体中文, 日本語.",
      en: "A free, open source macOS app that runs Windows games and apps on Apple Silicon Macs. Your Steam and Epic libraries in one place, and a game guide that tells you whether a game opens on a Mac before you buy it. Four languages: Türkçe, English, 简体中文, 日本語.",
    },
    image: {
      src: "/klyc-box.jpg",
      width: 1272,
      height: 822,
      alt: { tr: "KLYC-Box uygulamasının Steam mağazası ekranı", en: "KLYC-Box's Steam store screen" },
    },
    tags: ["Swift", "SwiftUI", "Wine", "Next.js", "GPL-3.0"],
    links: [
      { href: "https://klycbox.ernklyc.dev", label: { tr: "Siteyi aç", en: "Open the site" }, primary: true },
      { href: "https://github.com/ernklyc/klyc-box/releases/latest/download/KLYC-Box.dmg", label: { tr: "İndir (.dmg)", en: "Download (.dmg)" } },
      { href: "https://github.com/ernklyc/klyc-box", label: { tr: "GitHub", en: "GitHub" } },
    ],
  },
];
