# Film / Dizi Arşivi

## Kesin mimari

```text
Next.js (/movies + korumalı API route'ları) ─┐
                                             ├─ Firebase Auth + Firestore
Flutter (Android / iOS) ─────────────────────┘
              │
              └─ Next.js API ─ TMDB + IMDb non-commercial datasets
```

- Web sitesi Next.js olarak kalır; Flutter Web kullanılmaz.
- Web ve mobil aynı Firebase kullanıcısı ile aynı Firestore belgelerini gerçek zamanlı dinler.
- TMDB erişim jetonu yalnızca Next.js sunucusunda bulunur. Mobil uygulamaya veya tarayıcı paketine gömülmez.
- IMDb puanları TMDB puanından türetilmez. IMDb'nin günlük, kişisel/kar amacı gütmeyen veri setinden okunur.
- Yönetim işlemleri hem Firebase ID token kontrolü hem Firestore kurallarıyla sahibin UID'sine kilitlidir.

## Firestore modeli

```text
users/{ownerUid}/library/{movie_123|tv_456}
```

```json
{
  "tmdbId": 123,
  "imdbId": "tt1234567",
  "mediaType": "movie",
  "favorite": false,
  "isPublic": false,
  "snapshot": {
    "title": "Başlık",
    "originalTitle": "Original title",
    "year": 2026,
    "posterPath": "/poster.jpg",
    "genres": ["Dram"]
  },
  "addedAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

Belge kimliği `mediaType_tmdbId` biçimindedir. Bu nedenle aynı film veya dizi ikinci kez oluşamaz. `snapshot`, listeyi hızlı açmak için gereken küçük görünüm bilgisidir; tam metadata Firestore'a kopyalanmaz.

## Akışlar

- Arama: Firebase oturumu → korumalı `/api/movies/search` → TMDB multi search → kullanıcı arşive ekler.
- Detay: `/api/movies/{movie|tv}/{tmdbId}` → TMDB detay, görseller, oyuncular, ekip, videolar, external ID ve TR sağlayıcıları + IMDb günlük puanı.
- Dizi bölümleri: `/api/movies/tv/{tmdbId}/episodes` → IMDb episode/rating veri setleri → sezon/bölüm ısı haritası.
- CSV: tarayıcı/mobil IMDb ID'lerini çıkarır → korumalı import endpoint'i TMDB `/find` ile eşleştirir → var olan deterministik belgeler atlanır → sonuç özeti gösterilir.
- Android Share: paylaşılan düz metinden `tt...` çıkarılır → aynı import endpoint'iyle eşleştirilir → arşive eklenir.

## Mobil çalıştırma

Simülatörde yerel Next.js sunucusu varsayılan olarak kullanılır. Fiziksel cihaz veya yayın sürümünde canlı alan adı verilmelidir:

```bash
flutter run --dart-define=API_BASE_URL=https://ernklyc.dev
```

Android emülatör yerel geliştirmede `10.0.2.2:4173`, iOS simülatör `127.0.0.1:4173` kullanır.

## Ebeveyn rehberi

- Kaynak: DoesTheDogDie.com topluluk oyları (ücretsiz API seviyesi; ticari olmayan kullanım, atıf zorunlu, 5.000 istek/ay, 30 istek/dk).
- Akış: detay ekranında "Ebeveyn rehberi" açılınca `/api/movies/parents-guide/{movie|tv}/{tmdbId}` çağrılır → TMDB'den İngilizce/orijinal başlık → DoesTheDogDie `dddsearch` (TMDB ID + tür eşleşmesi) → `media/{id}`.
- DoesTheDogDie'de IMDb'deki gibi hafif/orta/şiddetli derecesi yoktur; sadece "var mı" evet/hayır oyları ve yorumlar vardır. Bu yüzden derece uydurulmaz, kategori başına "Var / Bildirilmedi / Yeterli oy yok" gösterilir. Bir konu için en az 3 evet ve %60 evet oranı aranır.
- Kotayı korumak için sonuç sunucuda ve CDN'de 30 gün (bulunamayanlar 7 gün) önbelleğe alınır; örnek başına saatte en fazla 60 yeni sorgu yapılır.
- Anahtar yalnızca sunucuda (`DDD_API_KEY`, Vercel env) durur; mobil/tarayıcı paketine girmez.
- Notların Türkçesi: kullanıcı bir konuya dokununca `/api/movies/parents-guide/{type}/{id}/translate?topic={id}` yalnızca o konunun gerçek notlarını MyMemory ile çevirir (ücretsiz, anahtarsız; anonim ~5.000 karakter/gün). Sonuçlar 30 gün önbelleğe alınır, günlük bütçe dolarsa çeviri sessizce kapanır ve orijinal not görünmeye devam eder. `MYMEMORY_EMAIL` tanımlanırsa limit yükselir.
- Kota göstergesi: `/api/movies/usage` (yalnızca sahip). DoesTheDogDie istekleri Firestore'daki `apiUsage/{YYYY-MM}` sayacında tutulur. TMDB'nin aylık kotası yoktur.

## Bölüm puanları: hız ve tazelik

- Arşivdeki diziler build'de (`scripts/bake-episode-ratings.mjs`, `prebuild`) tek geçişte hesaplanıp `src/features/movies/generated/episode-ratings.json` içine gömülür; API bu veriyi anında döner.
- Arşivde olmayan diziler canlı hesaplanır: episode (55 MB) ve puan (9 MB) dosyaları PARALEL indirilir, kısa pencerede (1,2 sn) gelen farklı diziler TEK geçişte birleştirilir, aynı diziye gelen eşzamanlı istekler tek hesabı paylaşır. İndirme hatalarında/zaman aşımında (25 sn) 2 kez denenir; başarısız olursa `502` döner ve istemcide "Tekrar dene" çıkar. Akış hataları yakalanmamış istisna olmaz (`pipeline`), süreç düşmez.
- Bayat veri göstermemek için tazelik dizinin TMDB durumuna bağlıdır: yayındaki dizide gömülü veri en fazla 2 gün, bellek önbelleği ve HTTP `s-maxage` 6 saat; biten/iptal edilmiş dizide 30 gün / 7 gün / 3 gün. `stale-while-revalidate` kullanılmaz; istemci önbelleği 6 saat.
- Yayındaki dizilerin gömülü verisi 2 günden eskiyse canlı hesaba düşülür (yavaş ama taze). Sürekli hızlı + taze için günlük yeniden deploy (Vercel Deploy Hook) önerilir.
- Test için `IMDB_DATASET_TIMEOUT_MS` ile zaman aşımı kısaltılabilir.
