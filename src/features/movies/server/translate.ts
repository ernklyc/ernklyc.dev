/**
 * Topluluk notlarının İngilizce → Türkçe otomatik çevirisi (MyMemory, ücretsiz, anahtar/kart yok).
 *
 * Ücretsiz limit anonim kullanımda günde ~5.000 karakter (e-posta verilirse ~50.000). Bu yüzden
 * yalnızca kullanıcı bir konuya dokununca çevirir, sonuçları önbelleğe alır ve günlük bütçeyi
 * aşınca çeviriyi sessizce kapatır (orijinal not görünmeye devam eder).
 * İsteğe bağlı: MYMEMORY_EMAIL tanımlanırsa limit yükselir.
 */

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

const cache = new Map<string, { expiresAt: number; value: string }>();
let budgetDay = "";
let charsToday = 0;
let quotaExhaustedDay = "";

function dailyBudget() {
  return process.env.MYMEMORY_EMAIL ? 40000 : 4000;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Çevirir; başarısız / bütçe dolu / aynı metinse null döner. */
export async function translateToTurkish(text: string): Promise<string | null> {
  const cached = cache.get(text);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const day = today();
  if (budgetDay !== day) {
    budgetDay = day;
    charsToday = 0;
  }
  if (quotaExhaustedDay === day || charsToday + text.length > dailyBudget()) return null;
  charsToday += text.length;

  const params = new URLSearchParams({ q: text.slice(0, 480), langpair: "en|tr" });
  if (process.env.MYMEMORY_EMAIL) params.set("de", process.env.MYMEMORY_EMAIL);

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      responseStatus?: number | string;
      quotaFinished?: boolean;
      responseData?: { translatedText?: string };
    };
    const translated = body.responseData?.translatedText;
    if (body.quotaFinished || Number(body.responseStatus) === 429 || /MYMEMORY WARNING/i.test(translated ?? "")) {
      quotaExhaustedDay = day;
      return null;
    }
    if (Number(body.responseStatus) !== 200 || !translated) return null;

    const value = decodeEntities(translated).trim();
    if (!value || value.toLowerCase() === text.trim().toLowerCase()) return null;
    cache.set(text, { expiresAt: Date.now() + CACHE_TTL_MS, value });
    return value;
  } catch (error) {
    console.warn("Not çevirisi alınamadı", error);
    return null;
  }
}
