# Eren Kalaycı - Portfolyo Sitesi

Bu proje, Eren Kalaycı'nın kişisel portfolyo web sitesidir. Proje, Eren'in becerilerini, deneyimlerini ve projelerini sergilemek amacıyla oluşturulmuştur.

## ✨ Öne Çıkan Özellikler

* **Modern Tasarım:** Tailwind CSS ve Framer Motion kullanılarak oluşturulmuş şık ve kullanıcı dostu arayüz.
* **Hızlı Performans:** Next.js sayesinde sunucu tarafında render (SSR) ve statik site oluşturma (SSG) yetenekleri ile yüksek performans.
* **Tam Duyarlılık (Responsive):** Farklı ekran boyutlarına uyum sağlayan tasarım.
* **Kolay Güncellenebilir İçerik:** `src/data` klasörü altındaki TypeScript dosyaları (`profile.ts`, `projects.ts`, `skills.ts`, `experience.ts`, `education.ts`) üzerinden kolayca içerik yönetimi.
* **SEO Dostu:** Next.js'in SEO optimizasyonlarına uygun yapısı.

## 🛠️ Kullanılan Teknolojiler

* **Framework:** [Next.js](https://nextjs.org/)
* **Dil:** [TypeScript](https://www.typescriptlang.org/)
* **UI Kütüphanesi:** [React](https://reactjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animasyon:** [Framer Motion](https://www.framer.com/motion/)
* **Linting:** [ESLint](https://eslint.org/) (Next.js core-web-vitals ve TypeScript kuralları ile)
* **Paket Yöneticisi:** npm (veya yarn, projenize göre belirtin)

## 🚀 Kurulum ve Başlatma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone [https://github.com/ernklyc/ernklyc-web.git](https://github.com/ernklyc/ernklyc-web.git)
    cd ernklyc-web
    ```

2.  **Bağımlılıkları Yükleyin:**
    Projenin `package.json` dosyasında belirtilen paket yöneticisine göre (npm veya yarn) komutu çalıştırın.
    ```bash
    npm install
    # veya
    # yarn install
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    `package.json` dosyasındaki `dev` script'i Turbopack ile geliştirme sunucusunu başlatır.
    ```bash
    npm run dev
    # veya
    # yarn dev
    ```
    Tarayıcınızda `http://localhost:3000` adresini açarak siteyi görüntüleyebilirsiniz.

4.  **Build İşlemi:**
    Projenin üretim build'ini oluşturmak için:
    ```bash
    npm run build
    # veya
    # yarn build
    ```

5.  **Üretim Sunucusunu Başlatma:**
    Oluşturulan build'i çalıştırmak için:
    ```bash
    npm run start
    # veya
    # yarn start
    ```

## 📂 Proje Yapısı (Önemli Dosyalar ve Klasörler)

ernklyc-web/├── public/                   # Statik dosyalar (resimler, ikonlar vb.)├── src/│   ├── app/                  # Next.js App Router dosyaları│   │   ├── globals.css       # Global CSS stilleri│   │   ├── layout.tsx        # Ana layout bileşeni│   │   └── page.tsx          # Ana sayfa bileşeni│   ├── components/           # React bileşenleri (Navbar, Hero, About vb.)│   └── data/                 # Portfolyo verilerini içeren TypeScript dosyaları│       ├── profile.ts        # Kişisel profil bilgileri│       ├── projects.ts       # Proje listesi ve detayları│       ├── skills.ts         # Yetenek listesi│       ├── experience.ts     # Deneyim bilgileri│       └── education.ts      # Eğitim bilgileri├── next.config.ts            # Next.js yapılandırma dosyası├── tailwind.config.ts        # (postcss.config.mjs içinde tanımlı) Tailwind CSS yapılandırması├── postcss.config.mjs        # PostCSS yapılandırması (Tailwind CSS için)├── eslint.config.mjs         # ESLint yapılandırması├── package.json              # Proje bağımlılıkları ve scriptleri└── README.md                 # Bu dosya
## 🖼️ Resim Konfigürasyonu

`next.config.ts` dosyasında belirtilen `remotePatterns` sayesinde harici kaynaklardan resimler güvenli bir şekilde yüklenebilmektedir. İzin verilen bazı kaynaklar:
* `media1.giphy.com`
* `via.placeholder.com`
* `play-lh.googleusercontent.com`
* `raw.githubusercontent.com`
* `store-images.s-microsoft.com`
* `pbs.twimg.com`

## 🎨 Styling ve Fontlar

* **Global Stiller:** `src/app/globals.css` dosyasında Tailwind CSS importları ve temel HTML elementi stilleri bulunur.
* **Fontlar:** [Geist Sans ve Geist Mono](https://vercel.com/font) fontları `src/app/layout.tsx` dosyasında tanımlanmış ve kullanılmıştır.
* **Tema:** Açık ve koyu tema desteği CSS değişkenleri (`--background`, `--foreground`) ile `src/app/globals.css` içinde yönetilmektedir.

## 🤝 Katkıda Bulunma

Katkılarınız her zaman kabulümdür! Lütfen bir pull request açmadan önce issue açarak tartışmaya başlayın.

## 📄 Lisans

Bu proje MIT Lisansı altındadır. Daha fazla bilgi için `LICENSE` dosyasına bakın (Eğer varsa, yoksa bu satırı kaldırın veya uygun bir lisans ekleyin).

---

Eren Kalaycı ile İletişime Geçin:

* **E-posta:** [ernklyc@gmail.com](mailto:ernklyc@gmail.com)
* **GitHub:** [ernklyc](https://github.com/ernklyc)
* **LinkedIn:** [erenklyc](https://www.linkedin.com/in/erenklyc/)
