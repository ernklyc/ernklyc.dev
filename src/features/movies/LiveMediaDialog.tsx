"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiExternalLink, FiHeart, FiLoader, FiPlay, FiX } from "react-icons/fi";
import type { MediaType } from "./models";

export type MediaDetailTarget = {
  id: number;
  title: string;
  originalTitle: string;
  year: number | null;
  mediaType: MediaType;
  posterPath: string | null;
  favorite: boolean;
  imdbId: string | null;
  imdbRating?: number | null;
  imdbVotes?: number | null;
};

type Genre = { id: number; name: string };
type Person = {
  id: number;
  name: string;
  character?: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
  roles?: { character: string; episode_count: number }[];
  total_episode_count?: number;
};
type Video = { id: string; key: string; name: string; site: string; type: string; official: boolean };
type Provider = { provider_id: number; provider_name: string; logo_path: string | null };
type Season = {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date?: string | null;
  poster_path?: string | null;
};
type Metadata = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  tagline?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  last_air_date?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  adult?: boolean;
  homepage?: string | null;
  original_language?: string;
  origin_country?: string[];
  in_production?: boolean;
  budget?: number;
  revenue?: number;
  genres?: Genre[];
  created_by?: Person[];
  production_companies?: { id: number; name: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; name: string }[];
  networks?: { id: number; name: string; logo_path?: string | null }[];
  belongs_to_collection?: { id: number; name: string; poster_path?: string | null } | null;
  external_ids?: {
    imdb_id?: string | null;
    wikidata_id?: string | null;
    facebook_id?: string | null;
    instagram_id?: string | null;
    twitter_id?: string | null;
  };
  videos?: { results?: Video[] };
  keywords?: { keywords?: { id: number; name: string }[]; results?: { id: number; name: string }[] };
  images?: {
    backdrops?: { file_path: string }[];
    posters?: { file_path: string }[];
    logos?: { file_path: string }[];
  };
  content_ratings?: { results?: { iso_3166_1: string; rating: string }[] };
  release_dates?: {
    results?: { iso_3166_1: string; release_dates: { certification: string }[] }[];
  };
  seasons?: Season[];
  "watch/providers"?: {
    results?: {
      TR?: {
        link?: string;
        flatrate?: Provider[];
        rent?: Provider[];
        buy?: Provider[];
      };
    };
  };
};
type LiveDetails = {
  fetchedAt: string;
  mediaType: "movie" | "tv";
  metadata: Metadata;
  credits: { cast?: Person[]; crew?: Person[] };
  imdbRating?: { averageRating: number; numVotes: number } | null;
};
type EpisodeRating = {
  imdbId: string;
  seasonNumber: number;
  episodeNumber: number;
  averageRating: number;
  numVotes: number;
};

const DETAIL_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const EPISODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const imageUrl = (path: string | null | undefined, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export default function LiveMediaDialog({
  item,
  onClose,
  onFavorite,
}: {
  item: MediaDetailTarget;
  onClose: () => void;
  onFavorite?: (item: MediaDetailTarget) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState<LiveDetails | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeRating[] | null>(null);
  const [episodesRequested, setEpisodesRequested] = useState(false);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = detailCacheKey(item.mediaType, item.id);
    const cachedDetails = readTimedCache<LiveDetails>(cacheKey, DETAIL_CACHE_TTL_MS);
    setDetails(cachedDetails);
    setEpisodes(null);
    setEpisodesRequested(false);
    setEpisodesLoading(false);
    setError("");

    fetch(`/api/movies/${item.mediaType}/${item.id}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as LiveDetails | { error?: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "Detaylar alınamadı.");
        const nextDetails = body as LiveDetails;
        writeTimedCache(cacheKey, nextDetails);
        setDetails(nextDetails);
      })
      .catch((requestError: Error) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });

    return () => controller.abort();
  }, [item.id, item.mediaType]);

  function loadEpisodes() {
    if (item.mediaType !== "tv" || episodesRequested) return;
    const cacheKey = episodeCacheKey(item.id);
    const cachedEpisodes = readTimedCache<EpisodeRating[]>(cacheKey, EPISODE_CACHE_TTL_MS);
    if (cachedEpisodes) {
      setEpisodesRequested(true);
      setEpisodes(cachedEpisodes);
      return;
    }
    const controller = new AbortController();
    setEpisodesRequested(true);
    setEpisodesLoading(true);
    fetch(`/api/movies/tv/${item.id}/episodes`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as { episodes?: EpisodeRating[] };
        if (response.ok) {
          const nextEpisodes = body.episodes ?? [];
          writeTimedCache(cacheKey, nextEpisodes);
          setEpisodes(nextEpisodes);
        }
      })
      .catch(() => setEpisodes([]))
      .finally(() => setEpisodesLoading(false));
  }

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("movie-detail-open");
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.classList.remove("movie-detail-open");
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] h-[100dvh] overflow-y-auto overscroll-contain bg-black/90 p-0 backdrop-blur-xl sm:p-5"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} detayı`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto min-h-[100dvh] max-w-6xl overflow-hidden bg-[#0b0e12] pb-[env(safe-area-inset-bottom)] shadow-2xl sm:min-h-full sm:rounded-3xl sm:border sm:border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Detayı kapat"
          className="fixed right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-xl sm:absolute"
        >
          <FiX />
        </button>

        {!details && !error && <DetailSkeleton item={item} />}

        {error && (
          <div className="grid min-h-[70vh] place-items-center px-6 text-center">
            <div>
              <p className="font-medium text-rose-300">Güncel bilgiler alınamadı</p>
              <p className="mt-2 text-sm text-white/45">{error}</p>
            </div>
          </div>
        )}

        {details && <DetailContent item={item} details={details} episodes={episodes} episodesLoading={episodesLoading} onLoadEpisodes={loadEpisodes} onFavorite={onFavorite} />}
      </div>
    </div>,
    document.body,
  );
}

function DetailSkeleton({ item }: { item: MediaDetailTarget }) {
  return (
    <div className="min-h-[70vh] animate-pulse">
      <div className="relative min-h-[340px] overflow-hidden bg-white/[0.035]">
        {item.posterPath && (
          <Image src={imageUrl(item.posterPath, "w342")!} alt="" fill sizes="100vw" quality={40} className="object-cover opacity-20 blur-md" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e12] via-[#0b0e12]/75 to-black/40" />
        <div className="relative flex min-h-[340px] items-end gap-5 px-5 pb-7 pt-20 sm:px-9">
          <div className="hidden aspect-[2/3] w-44 rounded-2xl bg-white/[0.08] sm:block" />
          <div className="w-full max-w-3xl">
            <div className="h-4 w-36 rounded-full bg-white/[0.08]" />
            <div className="mt-5 h-12 w-3/4 rounded-2xl bg-white/[0.1]" />
            <div className="mt-4 h-4 w-1/2 rounded-full bg-white/[0.07]" />
            <div className="mt-7 flex gap-3">
              <div className="h-10 w-28 rounded-xl bg-white/[0.08]" />
              <div className="h-10 w-24 rounded-xl bg-white/[0.08]" />
              <div className="h-10 w-32 rounded-xl bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5 px-5 py-8 sm:px-9">
        <div className="h-5 w-32 rounded-full bg-white/[0.08]" />
        <div className="space-y-3">
          <div className="h-4 rounded-full bg-white/[0.07]" />
          <div className="h-4 w-5/6 rounded-full bg-white/[0.07]" />
          <div className="h-4 w-2/3 rounded-full bg-white/[0.07]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-20 rounded-xl bg-white/[0.055]" />)}
        </div>
      </div>
    </div>
  );
}

function DetailContent({
  item,
  details,
  episodes,
  episodesLoading,
  onLoadEpisodes,
  onFavorite,
}: {
  item: MediaDetailTarget;
  details: LiveDetails;
  episodes: EpisodeRating[] | null;
  episodesLoading: boolean;
  onLoadEpisodes: () => void;
  onFavorite?: (item: MediaDetailTarget) => void;
}) {
  const metadata = details.metadata;
  const title = metadata.title ?? metadata.name ?? item.title;
  const originalTitle = metadata.original_title ?? metadata.original_name;
  const releaseDate = metadata.release_date ?? metadata.first_air_date;
  const cast = details.credits.cast ?? [];
  const crew = details.credits.crew ?? [];
  const directors = crew.filter((person) => person.job === "Director");
  const creators = metadata.created_by ?? [];
  const allCrew = uniquePeople([
    ...(item.mediaType === "movie" ? directors : creators),
    ...crew,
  ]);
  const videos = (metadata.videos?.results ?? []).filter(
    (video) => video.site === "YouTube" && (video.official || video.type === "Trailer"),
  );
  const trailer = videos.find((video) => video.type === "Trailer") ?? videos[0];
  const providerInfo = metadata["watch/providers"]?.results?.TR;
  const providers = uniqueProviders([
    ...(providerInfo?.flatrate ?? []),
    ...(providerInfo?.rent ?? []),
    ...(providerInfo?.buy ?? []),
  ]);
  const keywords = metadata.keywords?.keywords ?? metadata.keywords?.results ?? [];
  const gallery = [
    ...(metadata.images?.backdrops ?? []),
    ...(metadata.images?.posters ?? []),
  ];
  const certification = getCertification(metadata);
  const runtime = metadata.runtime ?? metadata.episode_run_time?.[0];
  const imdbRating = details.imdbRating ?? (typeof item.imdbRating === "number"
    ? { averageRating: item.imdbRating, numVotes: item.imdbVotes ?? 0 }
    : null);
  const poster = imageUrl(metadata.poster_path ?? item.posterPath, "w342");
  const backdrop = imageUrl(metadata.backdrop_path, "w1280");
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    [],
  );

  return (
    <div>
      <div className="relative min-h-[360px] overflow-hidden">
        {backdrop && (
          <Image src={backdrop} alt="" fill priority sizes="100vw" quality={72} className="object-cover opacity-45" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e12] via-[#0b0e12]/45 to-black/25" />
        <div className="relative flex min-h-[360px] items-end gap-5 px-5 pb-7 pt-20 sm:px-8">
          {poster && (
            <div className="relative hidden aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-2xl md:block">
              <Image src={poster} alt={`${title} posteri`} fill sizes="192px" quality={74} className="object-cover" />
            </div>
          )}
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a9b7c4]">
              {item.mediaType === "movie" ? "Film" : "Dizi"} · Canlı TMDB bilgisi
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
            {originalTitle && originalTitle !== title && (
              <p className="mt-2 text-white/45">{originalTitle}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/70">
              {releaseDate && <InfoPill>{formatDate(releaseDate, dateFormatter)}</InfoPill>}
              {runtime && <InfoPill>{formatRuntime(runtime)}</InfoPill>}
              {metadata.number_of_seasons && <InfoPill>{metadata.number_of_seasons} sezon</InfoPill>}
              {metadata.number_of_episodes && <InfoPill>{metadata.number_of_episodes} bölüm</InfoPill>}
              {metadata.genres?.map((genre) => <InfoPill key={genre.id}>{genre.name}</InfoPill>)}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {imdbRating && (
                <div className="rounded-xl border border-[#f5c518]/25 bg-[#f5c518]/10 px-3.5 py-2">
                  <span className="text-xl font-bold text-[#f5c518]">★ {imdbRating.averageRating.toFixed(1)}</span>
                  <span className="ml-2 text-xs text-white/45">IMDb · {imdbRating.numVotes.toLocaleString("tr-TR")} oy</span>
                </div>
              )}
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 font-medium text-black"
                >
                  <FiPlay /> Fragman
                </a>
              )}
              {onFavorite && <button
                type="button"
                onClick={() => onFavorite(item)}
                className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 ${
                  item.favorite ? "border-rose-300/30 bg-rose-500/20 text-rose-200" : "border-white/15 text-white/70"
                }`}
              >
                <FiHeart className={item.favorite ? "fill-current" : ""} />
                {item.favorite ? "Favorilerimde" : "Favoriye ekle"}
              </button>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-7 px-5 pb-10 sm:px-8">
        {metadata.tagline && <p className="text-base italic text-white/65 sm:text-lg">“{metadata.tagline}”</p>}
        <Section title="Hikâye">
          <p className="max-w-4xl text-sm leading-7 text-white/60 sm:text-base">{metadata.overview || "Türkçe açıklama henüz bulunmuyor."}</p>
        </Section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Fact label={item.mediaType === "movie" ? "Yönetmen" : "Yaratıcı"} value={(item.mediaType === "movie" ? directors : creators).map((person) => person.name).join(", ") || "—"} />
          <Fact label="Yayın tarihi" value={releaseDate ? formatDate(releaseDate, dateFormatter) : "—"} />
          <Fact label="Durum" value={metadata.status || "—"} />
          {metadata.production_countries?.length || metadata.origin_country?.length ? <Fact label="Ülke" value={metadata.production_countries?.map((country) => country.name).join(", ") || metadata.origin_country?.join(", ") || "—"} /> : null}
          {certification && <Fact label="Yaş sınırı" value={certification} />}
          <Fact label="IMDb ID" value={metadata.external_ids?.imdb_id || item.imdbId || "—"} />
        </div>

        <Section title={`Oyuncular · ${cast.length}`} subtitle="TMDB’de kayıtlı tüm oyuncular">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin]">
            {cast.map((person, index) => (
              <a
                key={`${person.id}-${index}`}
                href={`https://www.themoviedb.org/person/${person.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-36 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-white/25 sm:w-40"
              >
                <div className="relative aspect-[2/3] bg-white/5">
                  {person.profile_path ? (
                    <Image src={imageUrl(person.profile_path, "w185")!} alt={person.name} fill sizes="180px" quality={70} className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-3xl text-white/20">{person.name.charAt(0)}</div>
                  )}
                </div>
                <div className="p-3">
                  <strong className="block truncate text-sm text-white/85">{person.name}</strong>
                  <span className="mt-1 block text-xs leading-5 text-white/40">{castRole(person)}</span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        <Section title="Türkiye’de izle">
          {providers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <div key={provider.provider_id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 pr-3">
                  {provider.logo_path && <Image src={imageUrl(provider.logo_path, "w92")!} alt="" width={34} height={34} className="rounded-lg" />}
                  <span className="text-sm text-white/75">{provider.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">Türkiye için güncel sağlayıcı kaydı bulunamadı.</p>
          )}
        </Section>

        {item.mediaType === "tv" && (
          <EpisodeHeatmap episodes={episodes} loading={episodesLoading} onLoad={onLoadEpisodes} />
        )}

        <CollapsibleSection title="Detay arşivi" subtitle="Ekip, teknik bilgiler, görseller ve dış bağlantılar">
          <div className="space-y-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {metadata.last_air_date && <Fact label="Son yayın tarihi" value={formatDate(metadata.last_air_date, dateFormatter)} />}
              <Fact label="Orijinal dil" value={metadata.original_language?.toUpperCase() || "—"} />
              <Fact label="Konuşulan diller" value={metadata.spoken_languages?.map((language) => language.name || language.english_name).join(", ") || "—"} />
              <Fact label="Yapım şirketleri" value={metadata.production_companies?.map((company) => company.name).join(", ") || "—"} />
              {metadata.networks?.length ? <Fact label="Kanallar / ağlar" value={metadata.networks.map((network) => network.name).join(", ")} /> : null}
              {metadata.belongs_to_collection && <Fact label="Koleksiyon" value={metadata.belongs_to_collection.name} />}
              {typeof metadata.budget === "number" && metadata.budget > 0 && <Fact label="Bütçe" value={formatMoney(metadata.budget)} />}
              {typeof metadata.revenue === "number" && metadata.revenue > 0 && <Fact label="Hasılat" value={formatMoney(metadata.revenue)} />}
              {item.mediaType === "tv" && <Fact label="Yapım devam ediyor mu?" value={metadata.in_production ? "Evet" : "Hayır"} />}
              <Fact label="Son güncelleme" value={formatDate(details.fetchedAt, dateFormatter)} />
            </div>

            {allCrew.length > 0 && (
          <Section title={`Yapım ekibi · ${allCrew.length}`} subtitle="TMDB’de kayıtlı tüm ekip">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:thin]">
              {allCrew.map((person) => (
                <div key={personKey(person)} className="w-56 shrink-0 snap-start rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <strong className="text-sm text-white/85">{person.name}</strong>
                  <p className="mt-1 text-xs text-white/40">{person.job ?? person.department ?? "Yaratıcı"}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {keywords.length > 0 && (
          <Section title={`Anahtar kelimeler · ${keywords.length}`}>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => <span key={keyword.id} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/55">{keyword.name}</span>)}
            </div>
          </Section>
        )}

        {videos.length > 0 && (
          <Section title={`Videolar · ${videos.length}`}>
            <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:thin]">
              {videos.map((video) => (
                <a key={video.id} href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank" rel="noreferrer" className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/70 transition hover:border-white/25 hover:text-white">
                  <FiPlay className="shrink-0 text-lg" /><span className="line-clamp-2">{video.name}</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {gallery.length > 0 && (
          <Section title={`Görseller · ${gallery.length}`} subtitle="Backdrop ve posterler">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-5 [scrollbar-width:thin]">
              {gallery.map((image, index) => (
                <a key={`${image.file_path}-${index}`} href={imageUrl(image.file_path, "original")!} target="_blank" rel="noreferrer" className="relative aspect-video w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:w-96">
                  <Image src={imageUrl(image.file_path, "w500")!} alt={`${title} görseli ${index + 1}`} fill sizes="384px" quality={70} className="object-cover" />
                </a>
              ))}
            </div>
          </Section>
        )}

            {item.mediaType === "tv" && metadata.seasons && (
          <Section title={`Sezonlar · ${metadata.number_of_seasons ?? metadata.seasons.length}`}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {metadata.seasons.map((season) => (
                <div key={season.id} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {season.poster_path && <Image src={imageUrl(season.poster_path, "w185")!} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="py-1">
                    <strong className="text-sm text-white/85">{season.name}</strong>
                    <p className="mt-1 text-xs text-white/45">{season.episode_count} bölüm</p>
                    {season.air_date && <p className="mt-1 text-xs text-white/30">{formatDate(season.air_date, dateFormatter)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
          {(metadata.external_ids?.imdb_id || item.imdbId) && <ExternalLink href={`https://www.imdb.com/title/${metadata.external_ids?.imdb_id || item.imdbId}/`}>IMDb</ExternalLink>}
          <ExternalLink href={`https://www.themoviedb.org/${item.mediaType}/${item.id}`}>TMDB</ExternalLink>
          {providerInfo?.link && <ExternalLink href={providerInfo.link}>İzleme seçenekleri</ExternalLink>}
          {metadata.homepage && <ExternalLink href={metadata.homepage}>Resmî site</ExternalLink>}
          {metadata.external_ids?.wikidata_id && <ExternalLink href={`https://www.wikidata.org/wiki/${metadata.external_ids.wikidata_id}`}>Wikidata</ExternalLink>}
          {metadata.external_ids?.instagram_id && <ExternalLink href={`https://www.instagram.com/${metadata.external_ids.instagram_id}/`}>Instagram</ExternalLink>}
          {metadata.external_ids?.facebook_id && <ExternalLink href={`https://www.facebook.com/${metadata.external_ids.facebook_id}`}>Facebook</ExternalLink>}
          {metadata.external_ids?.twitter_id && <ExternalLink href={`https://x.com/${metadata.external_ids.twitter_id}`}>X</ExternalLink>}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function EpisodeHeatmap({ episodes, loading, onLoad }: { episodes: EpisodeRating[] | null; loading: boolean; onLoad: () => void }) {
  if (episodes === null) {
    return <Section title="Bölüm puanları" subtitle="IMDb bölüm puanlarını yalnızca istersen yükleriz">
      <button type="button" onClick={onLoad} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/70 hover:bg-white/[0.08] disabled:opacity-60">
        {loading ? <FiLoader className="animate-spin" /> : null}
        {loading ? "Bölüm puanları yükleniyor…" : "Bölüm puanlarını yükle"}
      </button>
    </Section>;
  }
  if (!episodes.length) return null;

  const seasons = [...new Set(episodes.map((episode) => episode.seasonNumber))];
  const bySeason = new Map(
    seasons.map((season) => [
      season,
      episodes
        .filter((episode) => episode.seasonNumber === season)
        .sort((a, b) => a.episodeNumber - b.episodeNumber),
    ]),
  );

  return (
    <Section title={`Bölüm puanları · ${episodes.length}`} subtitle="IMDb puanı · satıra dokununca IMDb açılır">
      <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-3 pr-2 [scrollbar-width:thin]">
        {seasons.map((season) => (
          <div key={season} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-white">Sezon {season}</h4>
              <span className="text-xs text-white/35">{bySeason.get(season)?.length ?? 0} bölüm</span>
            </div>
            <div className="space-y-1.5">
              {(bySeason.get(season) ?? []).map((episode) => (
                <a
                  key={episode.imdbId}
                  href={`https://www.imdb.com/title/${episode.imdbId}/`}
                  target="_blank"
                  rel="noreferrer"
                  title={`${episode.numVotes.toLocaleString("tr-TR")} oy`}
                  className="grid grid-cols-[72px_56px_1fr] items-center gap-3 rounded-lg border border-white/5 bg-white/[0.025] px-3 py-2 text-sm transition hover:border-white/15 hover:bg-white/[0.06]"
                >
                  <span className="font-medium text-white/70">S{season} · E{episode.episodeNumber}</span>
                  <span className="grid h-9 place-items-center rounded-md text-xs font-bold text-black" style={{ backgroundColor: ratingColor(episode.averageRating) }}>{episode.averageRating.toFixed(1)}</span>
                  <span className="truncate text-xs text-white/35">{episode.numVotes.toLocaleString("tr-TR")} oy · IMDb</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/30">Kaynak: IMDb non-commercial datasets. Puanlar günlük veri setinden gelir.</p>
    </Section>
  );
}

function ratingColor(rating: number) {
  if (rating >= 9) return "#55a9dd";
  if (rating >= 8) return "#65bd7d";
  if (rating >= 7) return "#f2d15d";
  if (rating >= 6) return "#e9a84f";
  return "#d75b52";
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-white/35">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function CollapsibleSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[0.025] p-4 open:bg-white/[0.035]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span>
          <span className="block text-lg font-semibold text-white">{title}</span>
          {subtitle && <span className="mt-1 block text-xs text-white/35">{subtitle}</span>}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45 group-open:bg-white/10">Aç</span>
      </summary>
      <div className="mt-6">{children}</div>
    </details>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">{children}</span>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><span className="block text-xs text-white/35">{label}</span><strong className="mt-1.5 block text-sm text-white/80">{value}</strong></div>;
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white">{children}<FiExternalLink /></a>;
}

function uniquePeople(people: Person[]) {
  const seen = new Set<string>();
  return people.filter((person) => {
    const key = personKey(person);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function personKey(person: Person) {
  return `${person.id}-${person.job ?? person.department ?? "creator"}`;
}

function uniqueProviders(providers: Provider[]) {
  return providers.filter((provider, index, all) => all.findIndex((value) => value.provider_id === provider.provider_id) === index);
}

function castRole(person: Person) {
  if (person.roles?.length) {
    const roles = person.roles.slice(0, 2).map((role) => role.character).join(" · ");
    return `${roles}${person.total_episode_count ? ` · ${person.total_episode_count} bölüm` : ""}`;
  }
  return person.character || "Rol bilgisi yok";
}

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} sa ${rest} dk` : `${rest} dk`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCertification(metadata: Metadata) {
  const tvRatings = metadata.content_ratings?.results ?? [];
  const tvRating = tvRatings.find((entry) => entry.iso_3166_1 === "TR") ?? tvRatings.find((entry) => entry.iso_3166_1 === "US");
  if (tvRating?.rating) return tvRating.rating;

  const movieRatings = metadata.release_dates?.results ?? [];
  const movieRating = movieRatings.find((entry) => entry.iso_3166_1 === "TR") ?? movieRatings.find((entry) => entry.iso_3166_1 === "US");
  return movieRating?.release_dates.find((entry) => entry.certification)?.certification || "";
}

function formatDate(value: string, formatter: Intl.DateTimeFormat) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatter.format(date);
}

function detailCacheKey(mediaType: MediaType, id: number) {
  return `movie_detail_cache_v2_${mediaType}_${id}`;
}

function episodeCacheKey(id: number) {
  return `movie_episode_cache_v2_${id}`;
}

function readTimedCache<T>(key: string, ttlMs: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { cachedAt?: number; value?: T };
    if (!cached.cachedAt || Date.now() - cached.cachedAt > ttlMs) return null;
    return cached.value ?? null;
  } catch {
    return null;
  }
}

function writeTimedCache<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify({ cachedAt: Date.now(), value }));
  } catch {
    // Storage can be full/blocked; live data still renders.
  }
}
