# 🚀 Eren KALAYCI — Portfolio & Devlog

Next.js ile geliştirilmiş, Firebase destekli kişisel portfolyo sitesi. Ana sayfadaki tüm içerik
(Hero, Hakkımda, Yeteneklerim, Deneyim) ve blog yazıları koda dokunmadan, şifre korumalı bir admin
panelinden yönetilir.

🔗 **Canlı site:** [ernklyc.dev](https://ernklyc.dev)

## ✨ Özellikler

- **Tam dinamik ana sayfa** — Hero, Hakkımda, Yeteneklerim ve Eğitim/Deneyim bölümleri Firestore'dan
  okunur ve admin panelden düzenlenebilir; hiçbir doküman kaydedilmemişse siteyi bozmadan statik
  varsayılanlara düşer.
- **Blog / devlog** — Firestore tabanlı yazılar, etiket filtreleme, kapak görseli, YouTube gömme,
  kod bloğu ve markdown desteği; ana sayfada yatay kaydırılabilir bir şerit halinde önizlenir
  (admin panelden "sabitlenen" yazılar önceliklidir).
- **Şifre korumalı admin paneli** — Firebase Authentication ile tek kullanıcı (site sahibi)
  girişi, Firestore Security Rules ile UID bazlı yazma yetkisi.
- **Bot koruması** — Firebase App Check (reCAPTCHA v3).
- **GitHub & Google Play entegrasyonu** — profildeki açık kaynak repoları ve yayınlanan mobil
  uygulamaları otomatik listeler.
- **Akıcı scroll** — Lenis ile GPU destekli, momentum'lu kaydırma.
- **Çok dilli** — Türkçe / İngilizce arayüz.
- **SEO & performans** — App Router, ISR, `sitemap.ts`/`robots.ts`, yapılandırılmış veri (JSON-LD).

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4 |
| Animasyon | Framer Motion, GSAP, Lenis |
| 3D / Görsel efektler | Three.js, React Three Fiber |
| Backend / CMS | Firebase (Firestore, Authentication, App Check) |
| İçerik | react-markdown + remark-gfm |

## 🚀 Başlarken

```bash
git clone https://github.com/ernklyc/ernklyc.dev.git
cd ernklyc.dev
npm install
```

`.env.example` dosyasını `.env.local` olarak kopyala ve kendi Firebase projenin bilgilerini gir:

```bash
cp .env.example .env.local
```

Gerekli değişkenler `.env.example` içinde açıklamalarıyla birlikte listelidir (Firebase config,
opsiyonel App Check reCAPTCHA anahtarı, opsiyonel GitHub token).

```bash
npm run dev
```

Site [http://localhost:3000](http://localhost:3000) adresinde açılır.

### Firestore kuralları

Admin paneli ve blog, `firestore.rules` dosyasındaki kurallarla korunur (yazma sadece site
sahibinin Firebase Auth UID'i ile mümkün). Kendi Firebase projende kullanacaksan kuralları deploy
etmeyi unutma:

```bash
firebase deploy --only firestore:rules
```

## 📁 Proje Yapısı (özet)

```
src/
  app/            # Next.js App Router sayfaları (public + /admin)
  components/      # UI bileşenleri (Server/Client ayrımıyla)
  lib/              # Firestore erişimi, admin CRUD, yardımcılar
  data/             # Statik fallback veriler (deneyim, eğitim, yetenekler)
  contexts/         # Dil (tr/en) context'i
  hooks/            # Scroll, auth, form hook'ları
```

## 📜 Scriptler

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run build` | Prodüksiyon derlemesi |
| `npm run start` | Derlenmiş uygulamayı çalıştırır |
| `npm run lint` | ESLint kontrolü |

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Eren KALAYCI**
- 🌐 Website: [ernklyc.dev](https://ernklyc.dev)
- 📧 Email: ernklyc@gmail.com
- 💼 LinkedIn: [erenklyc](https://linkedin.com/in/erenklyc)
- 🐱 GitHub: [ernklyc](https://github.com/ernklyc)
- 📱 Play Store: [Developer Page](https://play.google.com/store/apps/dev?id=6576291249346115918)

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
