/**
 * Harici API kota takibi.
 *
 * - DoesTheDogDie: kalan kotayı veren bir başlık/uç yok; kendi isteklerimizi Firestore'daki
 *   `apiUsage/{YYYY-MM}` belgesinde sayıyoruz (ücretsiz seviye: 5.000 istek/ay).
 *   Yalnızca bu uygulamanın sunucusunun yaptığı istekler sayılır.
 * - TMDB: aylık kota yok (yalnızca saniyelik hız sınırı), bu yüzden gösterilmez.
 */

export const DDD_MONTHLY_LIMIT = 5000;

const projectId = () => process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = () => process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export function usageMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function documentPath(month: string) {
  return `projects/${projectId()}/databases/(default)/documents/apiUsage/${month}`;
}

/** DoesTheDogDie'ye giden her istek için sayacı +1 artırır. Hata verirse özelliği bozmaz. */
export async function recordDddRequest() {
  if (!projectId() || !apiKey()) return;
  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents:commit?key=${apiKey()}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          writes: [
            {
              transform: {
                document: documentPath(usageMonthKey()),
                fieldTransforms: [{ fieldPath: "ddd", increment: { integerValue: "1" } }],
              },
            },
          ],
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) console.warn(`DoesTheDogDie kullanım sayacı yazılamadı (${response.status}).`);
  } catch (error) {
    console.warn("DoesTheDogDie kullanım sayacı güncellenemedi", error);
  }
}

/** Sahibin ID token'ıyla bu ayın sayacını okur (kurallar okumayı yalnızca sahibe verir). */
export async function readDddUsage(idToken: string) {
  const month = usageMonthKey();
  const response = await fetch(
    `https://firestore.googleapis.com/v1/${documentPath(month)}?key=${apiKey()}`,
    { headers: { Authorization: `Bearer ${idToken}` }, cache: "no-store" },
  );
  if (response.status === 404) return { month, used: 0 };
  if (!response.ok) throw new Error(`Kullanım okunamadı (${response.status}).`);
  const body = (await response.json()) as { fields?: { ddd?: { integerValue?: string } } };
  return { month, used: Number(body.fields?.ddd?.integerValue ?? 0) };
}
