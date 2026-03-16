export interface PlayStoreApp {
  name: string;
  description: string;
  packageId: string;
  playStoreUrl: string;
  iconUrl: string | null;
  screenshots: string[];
}

const APPS_META = [
  { name: "MF Master Online", description: "Stratejini test et, küresel oyuncularla yarış.", packageId: "com.yelbegen.minemaster" },
  { name: "HP Character Wiki", description: "Harry Potter karakter bilgi rehberi.", packageId: "com.ek.hpcharacterwiki" },
  { name: "Flag Quiz", description: "Bayrak bilgini test et.", packageId: "com.flag.quiz.yelbegen.software" },
  { name: "Link Manager", description: "Linklerini düzenle ve yönet.", packageId: "com.link.manager" },
  { name: "Heads or Tails", description: "Yazı tura, para atma uygulaması.", packageId: "com.yelbegen.software" },
  { name: "Flaying Ball", description: "Top ile eğlenceli oyun.", packageId: "www.flaying_ball.com" },
  { name: "Falling Bullets", description: "Düşen mermiler oyunu.", packageId: "com.falling.bullets" },
] as const;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function extractIconFromHtml(html: string): string | null {
  const ogImageMatch = html.match(/property=["']og:image["']\s+content=["'](https:\/\/[^"']+)["']/i);
  if (ogImageMatch?.[1]) return ogImageMatch[1];
  const playLhMatch = html.match(/content=["'](https:\/\/play-lh\.googleusercontent\.com[^"']+)["']/);
  if (playLhMatch?.[1]) return playLhMatch[1];
  return null;
}

function extractOgImage(html: string): string | null {
  const m = html.match(/property=["']og:image["']\s+content=["'](https:\/\/[^"']+)["']/i);
  return m?.[1] ?? null;
}

/** Sadece galeri ekran görüntüleri (kapak/og:image hariç). */
function extractGalleryScreenshots(
  html: string,
  excludeUrls: (string | null)[]
): string[] {
  const exclude = new Set(excludeUrls.filter(Boolean));
  const urls: string[] = [];
  const regex = /https:\/\/play-lh\.googleusercontent\.com[^"')\s]+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const url = match[0];
    if (exclude.has(url)) continue;
    if (urls.includes(url)) continue;
    urls.push(url);
    if (urls.length >= 6) break;
  }

  return urls;
}

async function fetchAppAssets(
  packageId: string
): Promise<{ iconUrl: string | null; screenshots: string[] }> {
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { iconUrl: null, screenshots: [] };
    const html = await res.text();
    const iconUrl = extractIconFromHtml(html);
    const ogImage = extractOgImage(html);
    const screenshots = extractGalleryScreenshots(html, [iconUrl, ogImage]);
    return { iconUrl, screenshots };
  } catch {
    return { iconUrl: null, screenshots: [] };
  }
}

export async function getPlayStoreAppsWithIcons(): Promise<PlayStoreApp[]> {
  const results = await Promise.all(
    APPS_META.map(async (app) => {
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(
        app.packageId
      )}`;
      const { iconUrl, screenshots } = await fetchAppAssets(app.packageId);
      return {
        name: app.name,
        description: app.description,
        packageId: app.packageId,
        playStoreUrl,
        iconUrl,
        screenshots,
      };
    })
  );
  return results;
}
