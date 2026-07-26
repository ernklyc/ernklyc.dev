import { profile } from "@/data/profile";
import { getHeroContent } from "@/lib/siteContent";

const SITE_URL = "https://ernklyc.dev";

/** Öne çıkan uygulamalar (WebSite/SoftwareApplication schema için). */
const FEATURED_APPS = [
  { name: "Link Manager", applicationCategory: "ProductivityApplication", packageId: "com.link.manager" },
  { name: "HP Character Wiki", applicationCategory: "ReferenceApplication", packageId: "com.ek.hpcharacterwiki" },
  { name: "MF Master Online", applicationCategory: "GameApplication", packageId: "com.yelbegen.minemaster" },
] as const;

/**
 * Arama motorlarına "bu hesapların hepsi aynı kişi" sinyalini veren `sameAs`
 * listesi — GitHub, LinkedIn, Instagram, YouTube, App Store, TikTok, Play
 * Store hesaplarını birbirine bağlar (entity consolidation). Sosyal linkler
 * artık admin panelden (/admin/content/hero) yönetildiği için buradaki
 * GitHub/LinkedIn/YouTube/App Store/TikTok/Play Store değerleri Firestore'dan
 * canlı okunuyor; Instagram ve Twitter için (henüz admin panelde alanı
 * olmadığından) statik profile.ts fallback kullanılıyor.
 */
export default async function StructuredData() {
  const hero = await getHeroContent();
  const sameAs = [
    hero.links.linkedin,
    profile.links.twitter,
    hero.links.github,
    profile.links.instagram,
    hero.links.youtube,
    hero.links.appStore,
    hero.links.tiktok,
    hero.links.playStore,
  ].filter((url): url is string => Boolean(url));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    // Google SERP'te büyük harfli isimleri "düzeltip" gösteriyor — biz de
    // aynı normal yazımı (Eren Kalaycı) kanonik isim olarak veriyoruz,
    // alternateName ile büyük harfli/varyant aramaları da eşleşsin diye.
    "name": "Eren Kalaycı",
    "givenName": "Eren",
    "familyName": "Kalaycı",
    // Yaygın yazım varyasyonları (büyük harf, Türkçe karaktersiz, kullanıcı
    // adı) — Google'ın farklı yazım biçimlerini aynı kişiye bağlaması için.
    "alternateName": [
      "Eren KALAYCI",
      "eren kalaycı",
      "Eren Kalayici",
      "Eren Kalayıcı",
      "ernklyc",
      "Eren K.",
    ],
    "jobTitle": profile.title,
    "email": profile.email,
    "url": SITE_URL,
    "sameAs": sameAs,
    "image": `${SITE_URL}/profil_resmim.jpg`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": profile.location,
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Erzincan Binali Yıldırım Üniversitesi",
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Glass Padel",
    },
    "knowsAbout": [
      "Flutter",
      "Dart",
      "Swift",
      "SwiftUI",
      "React",
      "Next.js",
      "TypeScript",
      "Unity",
      "C#",
      "Laravel",
      "PHP",
      "Firebase",
      "Mobil Uygulama Geliştirme",
      "Oyun Geliştirme",
      "Web Geliştirme",
      "Web Tasarımı",
      "Yazılım Mühendisliği",
      "Bilgisayar Mühendisliği",
    ],
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": `Eren Kalaycı Portfolio`,
    "description": `Eren Kalaycı - ${profile.bio.short}`,
    "author": { "@id": `${SITE_URL}#person` },
    "url": SITE_URL,
    "keywords":
      "Eren Kalaycı, Eren KALAYCI, eren kalaycı, Eren Kalayici, ernklyc, Eren Kalaycı Flutter, " +
      "Eren Kalaycı Swift, Eren Kalaycı Unity, Eren Kalaycı yazılım mühendisi, " +
      "Eren Kalaycı bilgisayar mühendisi, Eren Kalaycı mobil uygulama geliştirici, " +
      "Eren Kalaycı oyun geliştirici, Eren Kalaycı web tasarım, Eren Kalaycı web geliştirici, " +
      "Eren Kalaycı LinkedIn, Eren Kalaycı GitHub, Eren Kalaycı Instagram, Eren Kalaycı YouTube, " +
      "Eren Kalaycı Trabzon, bilgisayar mühendisi, yazılım mühendisi",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Eren Kalaycı Portfolio",
    "url": SITE_URL,
    "description": profile.bio.short,
    "author": { "@id": `${SITE_URL}#person` },
    "inLanguage": ["tr", "en"],
  };

  const softwareApplicationSchemas = FEATURED_APPS.map((app) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "applicationCategory": app.applicationCategory,
    "operatingSystem": "ANDROID",
    "offers": {
      "@type": "Offer",
      "url": `https://play.google.com/store/apps/details?id=${encodeURIComponent(app.packageId)}`,
    },
    "author": { "@id": `${SITE_URL}#person` },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...personSchema, "@id": `${SITE_URL}#person` }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {softwareApplicationSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

