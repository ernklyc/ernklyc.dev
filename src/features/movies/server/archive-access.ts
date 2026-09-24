import { NextResponse } from "next/server";
import { MOVIE_LIBRARY_OWNER_UID } from "@/features/movies/config";
import { isMovieOwnerRequest } from "@/features/movies/server/firebase-auth";

/**
 * Ağır/kotalı uçlar (bölüm puanları, ebeveyn rehberi, çeviri) yalnızca
 *  - herkese açık arşivdeki bir yapım için, ya da
 *  - arşiv sahibinin oturumuyla (ör. uygulamada aramadan önizleme)
 * çağrılabilir. Böylece rastgele ID'lerle 55 MB'lık indirmeler veya DoesTheDogDie/MyMemory
 * kotası tüketilemez.
 *
 * Üyelik, `users/{owner}/library/{tür}_{tmdbId}` belgesinin herkese açık okunmasıyla anlaşılır
 * (Firestore kuralı yalnızca isPublic == true belgelerin okunmasına izin verir).
 */

const MEMBER_TTL_MS = 10 * 60 * 1000;
const NON_MEMBER_TTL_MS = 60 * 1000;
const LOOKUP_TIMEOUT_MS = 4000;

const membership = new Map<string, { expiresAt: number; member: boolean }>();

export class ArchiveLookupError extends Error {}

export async function isPublicArchiveItem(mediaType: "movie" | "tv", tmdbId: number): Promise<boolean> {
  const key = `${mediaType}_${tmdbId}`;
  const cached = membership.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.member;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) throw new ArchiveLookupError("Firebase yapılandırması yok.");

  let response: Response;
  try {
    response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${MOVIE_LIBRARY_OWNER_UID}/library/${key}?key=${apiKey}`,
      { cache: "no-store", signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS) },
    );
  } catch {
    throw new ArchiveLookupError("Arşiv sorgusu başarısız oldu.");
  }

  let member = false;
  if (response.ok) {
    const body = (await response.json()) as { fields?: { isPublic?: { booleanValue?: boolean } } };
    member = body.fields?.isPublic?.booleanValue === true;
  } else if (response.status !== 404 && response.status !== 403) {
    // Beklenmeyen hata: yanlışlıkla "üye değil" diye önbelleğe alma.
    throw new ArchiveLookupError(`Arşiv sorgusu başarısız oldu (${response.status}).`);
  }

  membership.set(key, { expiresAt: Date.now() + (member ? MEMBER_TTL_MS : NON_MEMBER_TTL_MS), member });
  return member;
}

export type MediaAccess =
  | { allowed: true; publicArchive: boolean }
  | { allowed: false; response: NextResponse };

export async function checkMediaAccess(request: Request, mediaType: "movie" | "tv", tmdbId: number): Promise<MediaAccess> {
  let member = false;
  let lookupFailed = false;
  try {
    member = await isPublicArchiveItem(mediaType, tmdbId);
  } catch {
    lookupFailed = true;
  }
  if (member) return { allowed: true, publicArchive: true };

  if (await isMovieOwnerRequest(request)) return { allowed: true, publicArchive: false };

  if (lookupFailed) {
    return { allowed: false, response: NextResponse.json({ error: "Şu an doğrulanamadı, biraz sonra tekrar dene." }, { status: 503 }) };
  }
  return { allowed: false, response: NextResponse.json({ error: "Bu yapım arşivde değil." }, { status: 403 }) };
}

/** Test yardımcısı. */
export function resetArchiveAccessCache() {
  membership.clear();
}
