import { EXTRA_TOPIC_LABELS_TR } from "@/features/movies/server/parents-guide-labels";
import { getSearchTitles, type TmdbMediaType } from "@/features/movies/server/tmdb";

/**
 * Ebeveyn rehberi verisi DoesTheDogDie.com topluluk oylarından gelir (ücretsiz API seviyesi:
 * ticari olmayan kullanım, atıf zorunlu, 5.000 istek/ay, 30 istek/dk).
 *
 * DoesTheDogDie "şu sahne/konu var mı?" sorusuna evet/hayır oyu toplar; IMDb'deki gibi
 * hafif/orta/şiddetli derecesi YOKTUR. Bu yüzden derece uydurmuyoruz: her IMDb kategorisi için
 * yalnızca "var / bildirilmedi / veri yetersiz" ve oy sayıları + topluluk notları döndürüyoruz.
 */

const DDD_BASE_URL = "https://www.doesthedogdie.com";
const ITEM_TYPE_MOVIE = 15;
const ITEM_TYPE_TV = 16;
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const NOT_FOUND_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_TOTAL_VOTES = 10;
const MAX_UNCACHED_LOOKUPS_PER_HOUR = 60;

export class ParentsGuideConfigurationError extends Error {}
export class ParentsGuideRateLimitError extends Error {}

export type GuideCategoryId = "sex" | "violence" | "profanity" | "substances" | "frightening" | "other";

export type GuideTopic = {
  id: number;
  name: string;
  label: string;
  yes: number;
  no: number;
  notes: { text: string; votes: number }[];
};

export type GuideCategory = {
  id: GuideCategoryId;
  label: string;
  status: "present" | "none" | "unknown";
  topics: GuideTopic[];
};

export type ParentsGuide =
  | { available: false; fetchedAt: string }
  | {
      available: true;
      fetchedAt: string;
      source: { name: string; url: string; votes: number };
      categories: GuideCategory[];
    };

type DddSearchItem = { id: number; name: string; tmdbid: number | null; ItemTypeId: number };
type DddComment = { comment?: string; voteSum?: number };
type DddTopicStat = {
  yesSum: number;
  noSum: number;
  comments?: DddComment[];
  topic: { id: number; name: string; isSpoiler?: boolean; TopicCategoryId: number };
};
type DddMedia = {
  item: { id: number; numRatings: number };
  topicItemStats: DddTopicStat[];
};

const CATEGORY_LABELS: Record<GuideCategoryId, string> = {
  sex: "Cinsellik ve çıplaklık",
  violence: "Şiddet ve kan",
  profanity: "Küfür",
  substances: "Alkol, uyuşturucu ve sigara",
  frightening: "Korkutucu ve yoğun sahneler",
  other: "Diğer hassas konular",
};

const CATEGORY_ORDER: GuideCategoryId[] = ["sex", "violence", "profanity", "substances", "frightening", "other"];

/** DoesTheDogDie konu adı (küçük harf) → Türkçe etiket. Bulunamayanlar İngilizce kalır. */
const TOPIC_LABELS_TR: Record<string, string> = {
  // Cinsellik ve çıplaklık
  "there is sexual content": "Cinsel içerik",
  "there are nude scenes": "Çıplaklık sahneleri",
  "someone is sexually objectified": "Biri cinsel obje olarak gösteriliyor",
  "someone loses their virginity": "Biri bekâretini kaybediyor",
  "there's bdsm": "BDSM",
  "someone masturbates": "Mastürbasyon",
  "there are incestuous relationships": "Ensest ilişki",
  "a minor is sexualized": "Reşit olmayan biri cinselleştiriliyor",
  "there's bestiality": "Hayvanla cinsellik",
  "someone is sexually assaulted": "Cinsel saldırı",
  "there's dubious consent or sexual coercion": "Şüpheli rıza / cinsel baskı",
  "there's pedophilia": "Pedofili",
  // Şiddet ve kan
  "there's blood/gore": "Kan ve vahşet",
  "there's gun violence": "Silahlı şiddet",
  "there's torture": "İşkence",
  "someone is stabbed": "Bıçaklanma",
  "someone is burned alive": "Diri diri yakılma",
  "there's cannibalism": "Yamyamlık",
  "there's decapitation": "Kafa kesme",
  "there's eye mutilation": "Göz yaralanması",
  "there's finger/toe mutilation": "Parmak sakatlama",
  "there's amputation": "Uzuv kesilmesi",
  "heads get squashed": "Kafa ezilmesi",
  "there are hangings": "Asılma",
  "somebody is choked": "Boğulma / boğma",
  "someone's throat is mutilated": "Boğaz yaralanması",
  "someone is crushed to death": "Ezilerek ölüm",
  "someone is harmed by acid": "Asitle zarar görme",
  "there's body horror": "Vücut dehşeti",
  "a corpse is shown": "Ceset gösteriliyor",
  "there are mass casualties": "Toplu ölümler",
  "there's genocide": "Soykırım",
  "there's war": "Savaş",
  "there's a nuclear explosion": "Nükleer patlama",
  "someone is beaten up by a bully": "Zorbalık / dayak",
  "there's child abuse": "Çocuk istismarı",
  "there's domestic violence": "Aile içi şiddet",
  "a woman is brutalized for spectacle": "Kadına gösteri amaçlı vahşet",
  "someone is abused with a belt": "Kemerle dayak",
  "there's corporal punishment": "Bedensel ceza",
  "someone breaks a bone": "Kemik kırılması",
  "someone falls to their death": "Düşerek ölüm",
  "someone is buried alive": "Diri diri gömülme",
  "someone drowns": "Boğularak ölüm",
  "someone is held under water": "Suyun altında tutulma",
  "someone dies": "Ölüm",
  "someone is robbed or mugged": "Soygun / gasp",
  "there's a home invasion": "Ev baskını",
  // Küfür
  "there is obscene language/gestures": "Küfürlü dil / müstehcen hareketler",
  // Alkol, uyuşturucu ve sigara
  "someone uses drugs": "Uyuşturucu kullanımı",
  "alcohol abuse": "Alkol bağımlılığı / kötüye kullanımı",
  "there's addiction": "Bağımlılık",
  "someone has a bad trip": "Kötü trip",
  "someone smokes or vapes": "Sigara / elektronik sigara",
  // Korkutucu ve yoğun sahneler
  "there are jump scares": "Ani korkutma (jump scare)",
  "there are sudden loud noises": "Ani yüksek sesler",
  "there's flashing lights or images": "Yanıp sönen ışıklar (epilepsi riski)",
  "there's screaming": "Çığlıklar",
  "there's a fire": "Yangın",
  "someone is stalked": "Takip edilme",
  "there are high-pitched noises": "Tiz sesler",
  "there are clowns": "Palyaçolar",
  "there's a claustrophobic scene": "Dar alan / klostrofobi sahnesi",
  "there's ghosts": "Hayaletler",
  "someone is possessed": "Ele geçirilme",
  "there are dolls or puppets": "Bebekler / kuklalar",
  "there are zombies": "Zombiler",
  "there are shower scenes": "Duş sahneleri",
  "there are mannequins": "Mankenler",
  // Diğer sık görülenler
  "a dog dies": "Bir köpek ölüyor",
  "there's suicide": "İntihar",
  "someone self harms": "Kendine zarar verme",
  "someone vomits": "Kusma",
  "someone cheats": "Aldatma",
  "someone has a mental illness": "Ruhsal hastalık",
  "someone has an anxiety attack": "Anksiyete atağı",
  "someone suffers from ptsd": "TSSB (travma sonrası stres)",
  "there's antisemitism": "Antisemitizm",
  "someone speaks hate speech": "Nefret söylemi",
  "a baby cries": "Bebek ağlıyor",
  "a child is abandoned by a parent or guardian": "Çocuk terk ediliyor",
  "there's racism": "Irkçılık",
  "there's homophobia": "Homofobi",
  "shaky cam is used": "Sallantılı kamera",
  "needles/syringes are used": "İğne / şırınga",
};

function topicLabel(name: string) {
  const key = name.toLowerCase();
  return TOPIC_LABELS_TR[key] ?? EXTRA_TOPIC_LABELS_TR[key] ?? name;
}

const SEX_TOPICS = new Set(
  [
    "there is sexual content",
    "there are nude scenes",
    "someone is sexually objectified",
    "someone loses their virginity",
    "there's bdsm",
    "someone masturbates",
    "there are incestuous relationships",
    "a minor is sexualized",
    "there's bestiality",
    "someone is sexually assaulted",
    "there's dubious consent or sexual coercion",
    "there's pedophilia",
  ].map((name) => name.toLowerCase()),
);
const SUBSTANCE_TOPICS = new Set([
  "someone uses drugs",
  "alcohol abuse",
  "there's addiction",
  "someone has a bad trip",
  "someone smokes or vapes",
]);
const PROFANITY_TOPICS = new Set(["there is obscene language/gestures"]);
const VIOLENCE_TOPICS = new Set([
  "there's blood/gore",
  "there's gun violence",
  "there's torture",
  "someone is stabbed",
  "someone is burned alive",
  "there's cannibalism",
  "there's decapitation",
  "there's eye mutilation",
  "there's finger/toe mutilation",
  "there's amputation",
  "heads get squashed",
  "there are hangings",
  "somebody is choked",
  "someone's throat is mutilated",
  "someone is crushed to death",
  "someone is harmed by acid",
  "there's body horror",
  "a corpse is shown",
  "there are mass casualties",
  "there's genocide",
  "there's war",
  "there's a nuclear explosion",
  "someone is beaten up by a bully",
  "there's child abuse",
  "there's domestic violence",
  "a woman is brutalized for spectacle",
  "someone is abused with a belt",
  "there's corporal punishment",
  "someone breaks a bone",
  "someone falls to their death",
  "someone is buried alive",
  "someone drowns",
  "someone is held under water",
  "someone dies",
  "someone is robbed or mugged",
  "there's a home invasion",
]);
const FEAR_CATEGORY_ID = 10;
const FEAR_EXTRA_TOPICS = new Set([
  "there are sudden loud noises",
  "there's flashing lights or images",
  "there's screaming",
  "there's a fire",
  "someone is stalked",
  "there are high-pitched noises",
]);
const FEAR_EXCLUDED_TOPICS = new Set([
  "there's natural bodies of water",
  "there's a countdown or time pressure",
  "there's a scene with extreme heights",
]);
const SPOILER_CATEGORY_ID = 13;

function categoryOf(topic: DddTopicStat["topic"]): GuideCategoryId | null {
  if (topic.isSpoiler || topic.TopicCategoryId === SPOILER_CATEGORY_ID) return null;
  const name = topic.name.toLowerCase();
  if (SEX_TOPICS.has(name)) return "sex";
  if (SUBSTANCE_TOPICS.has(name)) return "substances";
  if (PROFANITY_TOPICS.has(name)) return "profanity";
  if (VIOLENCE_TOPICS.has(name)) return "violence";
  if ((topic.TopicCategoryId === FEAR_CATEGORY_ID && !FEAR_EXCLUDED_TOPICS.has(name)) || FEAR_EXTRA_TOPICS.has(name)) {
    return "frightening";
  }
  return "other";
}

/** Topluluk "evet" diyorsa konuyu doğrulanmış sayarız: en az 3 evet ve evet oranı ≥ %60. */
function isConfirmed(stat: DddTopicStat) {
  const total = stat.yesSum + stat.noSum;
  return stat.yesSum >= 3 && total > 0 && stat.yesSum / total >= 0.6;
}

const JUNK_NOTE = /runpee|download|app store|play store|subscribe|http/i;

function cleanNotes(comments: DddComment[] | undefined) {
  return (comments ?? [])
    .map((comment) => ({ text: (comment.comment ?? "").replace(/\s+/g, " ").trim(), votes: comment.voteSum ?? 0 }))
    .filter((comment) => comment.text.length >= 8 && !JUNK_NOTE.test(comment.text))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)
    .map((comment) => ({
      text: comment.text.length > 280 ? `${comment.text.slice(0, 277)}…` : comment.text,
      votes: comment.votes,
    }));
}

function buildGuide(media: DddMedia): ParentsGuide {
  const totalVotes = media.topicItemStats.reduce((sum, stat) => sum + stat.yesSum + stat.noSum, 0);
  const enoughData = media.item.numRatings >= MIN_TOTAL_VOTES && totalVotes >= MIN_TOTAL_VOTES * 3;
  const grouped = new Map<GuideCategoryId, GuideTopic[]>();

  for (const stat of media.topicItemStats) {
    const category = categoryOf(stat.topic);
    if (!category || !isConfirmed(stat)) continue;
    const topics = grouped.get(category) ?? [];
    topics.push({
      id: stat.topic.id,
      name: stat.topic.name,
      label: topicLabel(stat.topic.name),
      yes: stat.yesSum,
      no: stat.noSum,
      notes: cleanNotes(stat.comments),
    });
    grouped.set(category, topics);
  }

  const categories = CATEGORY_ORDER.map((id): GuideCategory => {
    const topics = (grouped.get(id) ?? []).sort((a, b) => b.yes - a.yes).slice(0, id === "other" ? 15 : 12);
    return {
      id,
      label: CATEGORY_LABELS[id],
      status: topics.length ? "present" : enoughData ? "none" : "unknown",
      topics,
    };
  });

  return {
    available: true,
    fetchedAt: new Date().toISOString(),
    source: { name: "DoesTheDogDie.com", url: `${DDD_BASE_URL}/media/${media.item.id}`, votes: media.item.numRatings },
    categories,
  };
}

async function dddFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.DDD_API_KEY;
  if (!apiKey) throw new ParentsGuideConfigurationError("DDD_API_KEY tanımlı değil.");

  const response = await fetch(`${DDD_BASE_URL}${path}`, {
    headers: { accept: "application/json", "X-API-KEY": apiKey },
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (response.status === 429) throw new ParentsGuideRateLimitError("DoesTheDogDie istek sınırı doldu.");
  if (!response.ok) throw new Error(`DoesTheDogDie isteği başarısız oldu (${response.status}).`);
  return response.json() as Promise<T>;
}

const guideCache = new Map<string, { expiresAt: number; value: ParentsGuide }>();
let lookupWindowStartedAt = 0;
let lookupsInWindow = 0;

/** Örnek başına saatlik üst sınır: rastgele ID'lerle aylık 5.000 istek kotasının tüketilmesini zorlaştırır. */
function reserveLookup() {
  const now = Date.now();
  if (now - lookupWindowStartedAt > 60 * 60 * 1000) {
    lookupWindowStartedAt = now;
    lookupsInWindow = 0;
  }
  if (lookupsInWindow >= MAX_UNCACHED_LOOKUPS_PER_HOUR) {
    throw new ParentsGuideRateLimitError("Ebeveyn rehberi için saatlik sorgu sınırı doldu.");
  }
  lookupsInWindow += 1;
}

export async function getParentsGuide(mediaType: TmdbMediaType, tmdbId: number): Promise<ParentsGuide> {
  const key = `${mediaType}_${tmdbId}`;
  const cached = guideCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  reserveLookup();
  let titles: string[];
  try {
    ({ titles } = await getSearchTitles(mediaType, tmdbId));
  } catch (error) {
    // TMDB'de böyle bir yapım yoksa rehber de yoktur.
    if (error instanceof Error && error.message.includes("(404)")) {
      const missing: ParentsGuide = { available: false, fetchedAt: new Date().toISOString() };
      guideCache.set(key, { expiresAt: Date.now() + NOT_FOUND_TTL_MS, value: missing });
      return missing;
    }
    throw error;
  }
  const wantedType = mediaType === "movie" ? ITEM_TYPE_MOVIE : ITEM_TYPE_TV;

  let match: DddSearchItem | undefined;
  for (const title of titles) {
    const search = await dddFetch<{ items?: DddSearchItem[] }>(`/dddsearch?q=${encodeURIComponent(title)}`);
    match = (search.items ?? []).find((item) => item.tmdbid === tmdbId && item.ItemTypeId === wantedType);
    if (match) break;
  }

  let guide: ParentsGuide;
  let ttl = CACHE_TTL_MS;
  if (!match) {
    guide = { available: false, fetchedAt: new Date().toISOString() };
    ttl = NOT_FOUND_TTL_MS;
  } else {
    guide = buildGuide(await dddFetch<DddMedia>(`/media/${match.id}`));
  }

  guideCache.set(key, { expiresAt: Date.now() + ttl, value: guide });
  return guide;
}
