# 🚀 Eren KALAYCI - Portfolio Website

Modern ve responsive kişisel portfolio websitesi. Next.js, TypeScript, Tailwind CSS ve Framer Motion ile geliştirilmiştir.

## ✨ Özellikler

- **Modern Tasarım**: Gradient arka planlar, animasyonlar ve premium UI/UX
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Performance**: Optimized build ve lazy loading
- **Animasyonlar**: Framer Motion ile smooth animasyonlar
- **Dark Theme**: Profesyonel koyu tema
- **SEO Optimized**: Meta tags ve structured data
- **AI Chat Widget**: Google Generative AI (Gemini) entegrasyonu ile akıllı sohbet asistanı
- **Gizlilik Politikaları**: HP Character Wiki, Movie Face AI ve Link Manager uygulamaları için gizlilik politikası sayfaları

## 🛠️ Teknolojiler

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Vercel Ready

## 📦 Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/ernklyc/ernklyc-web.git

# Proje dizinine gidin
cd ernklyc-web

# Bağımlılıkları yükleyin
npm install

# Environment variables oluşturun
# .env.local dosyası oluşturun (bkz. .env.example)
# GOOGLE_API_KEY=your_google_ai_api_key_here   # AI Chat için (Gemini)
# GITHUB_TOKEN=your_github_token_here          # Opsiyonel; GitHub repo listesi için rate limit artırır

# Development server'ı başlatın
npm run dev
```

## 🚀 Deployment

```bash
# Production build oluşturun
npm run build

# Production server'ı başlatın
npm start
```

## 📁 Proje Yapısı

```
src/
├── app/                     # Next.js App Router
│   ├── api/
│   │   └── chat/           # AI Chat API endpoint
│   ├── privacy-policy/     # HP Character Wiki gizlilik politikası
│   ├── movie-face-ai-privacy/  # Movie Face AI gizlilik politikası
│   ├── link-manager-privacy/   # Link Manager gizlilik politikası
│   └── link-manager-terms/     # Link Manager kullanım şartları
├── components/              # React bileşenleri
│   ├── About.tsx           # Hakkımda bölümü
│   ├── Achievements.tsx    # Başarılar
│   ├── AISupport.tsx       # AI Chat Widget
│   ├── Analytics.tsx       # GitHub Stats
│   ├── Blog.tsx            # Blog bölümü
│   ├── ChatWidget.tsx      # Chat arayüzü
│   ├── Contact.tsx         # İletişim formu
│   ├── Experience.tsx      # Deneyim & Eğitim
│   ├── Footer.tsx          # Footer bileşeni
│   ├── GitHubStats.tsx     # GitHub istatistikleri
│   ├── Hero.tsx            # Ana sayfa hero
│   ├── Loading.tsx         # Loading animasyonu
│   ├── Navbar.tsx          # Navigation bar
│   ├── Projects.tsx        # Projeler showcase
│   ├── Skills.tsx          # Yetenekler
│   └── Testimonials.tsx    # Referanslar
├── data/                   # Statik veri dosyaları
│   ├── achievements.ts
│   ├── education.ts
│   ├── experience.ts
│   ├── profile.ts
│   ├── projects.ts
│   └── skills.ts
└── styles/                 # Global stiller
```

## 🎨 Özelleştirme

### Renk Teması
Ana renk: `#FF4655` (Kırmızı accent)
Arka plan: Gradient dark theme

### Animasyonlar
- Scroll-triggered animations
- Hover effects
- Loading animations
- Smooth transitions

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Geliştirme

```bash
# Development mode
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Eren KALAYCI**
- 🌐 Website: [ernklyc.vercel.app](https://ernklyc.vercel.app)
- 📧 Email: ernklyc@gmail.com
- 💼 LinkedIn: [erenklyc](https://linkedin.com/in/erenklyc)
- 🐱 GitHub: [ernklyc](https://github.com/ernklyc)
- 📱 Play Store: [Developer Page](https://play.google.com/store/apps/dev?id=6576291249346115918)

## 🎮 Yayınlanan Uygulamalar

- **HP Character Wiki**: Harry Potter karakterleri ansiklopedisi ([Play Store](https://play.google.com/store/apps/details?id=com.ek.hpcharacterwiki))
- **Link Manager**: Link yönetimi uygulaması ([Play Store](https://play.google.com/store/apps/details?id=com.link.manager))
- **Movie Face AI**: AI destekli yüz eşleştirme oyunu
- **MF Master Online**: Mayın tarlası oyunu
- **Flag Quiz**: Bayrak bilgi yarışması
- Ve daha fazlası...

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
