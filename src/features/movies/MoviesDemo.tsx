"use client";

import Image from "next/image";
import { auth } from "@/lib/firebase";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FiCheck, FiFilm, FiHeart, FiLoader, FiPlus, FiSearch, FiTrash2, FiTv, FiUpload, FiX } from "react-icons/fi";
import LiveMediaDialog, { type MediaDetailTarget } from "./LiveMediaDialog";
import { addManyToLibrary, addToLibrary, removeFromLibrary, repairLibraryPublicAndRatings, setLibraryFavorite } from "./library";
import { mediaDocumentId, type LibraryItem, type MediaType, type TmdbSearchItem } from "./models";
import { useMovieLibrary } from "./useMovieLibrary";

type Filter = "all" | MediaType | "favorites";
type SortMode = "added" | "imdb-desc" | "title" | "year-desc" | "year-asc";
const filters: { id: Filter; label: string; icon?: typeof FiFilm }[] = [
  { id: "all", label: "Tümü" },
  { id: "movie", label: "Filmler", icon: FiFilm },
  { id: "tv", label: "Diziler", icon: FiTv },
  { id: "favorites", label: "Favoriler", icon: FiHeart },
];
const RATINGS_CACHE_KEY = "movie_archive_imdb_ratings_v1";
const RATING_BATCH_SIZE = 100;
const INITIAL_VISIBLE_COUNT = 60;
const LOAD_MORE_COUNT = 60;

export default function MoviesDemo() {
  const { user, items, loading, error, isOwner } = useMovieLibrary();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("imdb-desc");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [ratings, setRatings] = useState<Record<string, { averageRating: number; numVotes: number } | null>>(() => readRatingsCache());
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [, startTransition] = useTransition();
  const repairedSignatureRef = useRef("");

  const missingRatingIds = useMemo(() => [...new Set(items
    .filter((item) => item.imdbId && typeof item.snapshot.imdbRating !== "number" && !(item.imdbId in ratings))
    .map((item) => item.imdbId as string))].sort(), [items, ratings]);

  useEffect(() => {
    if (!missingRatingIds.length) return;

    let cancelled = false;
    Promise.all(chunk(missingRatingIds, RATING_BATCH_SIZE).map(async (imdbIds) => {
      const response = await fetch("/api/movies/ratings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imdbIds }),
      });
      if (!response.ok) return Object.fromEntries(imdbIds.map((id) => [id, null]));
      const body = (await response.json()) as { ratings?: Record<string, { averageRating: number; numVotes: number }> };
      return Object.fromEntries(imdbIds.map((id) => [id, body.ratings?.[id] ?? null]));
    })).then((parts) => {
      if (!cancelled) setRatings((current) => ({ ...current, ...Object.assign({}, ...parts) }));
    }).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [missingRatingIds]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeFilter, genreFilter, query, sortMode, yearFilter]);

  useEffect(() => {
    writeRatingsCache(ratings);
  }, [ratings]);

  useEffect(() => {
    if (!user || !isOwner || !items.length) return;
    const repairItems = items.filter((item) => !item.isPublic || (item.imdbId && ratings[item.imdbId] && typeof item.snapshot.imdbRating !== "number"));
    if (!repairItems.length) return;
    const signature = repairItems.map((item) => `${item.id}:${item.isPublic ? 1 : 0}:${ratings[item.imdbId ?? ""]?.averageRating ?? ""}`).join("|");
    if (signature === repairedSignatureRef.current) return;
    repairedSignatureRef.current = signature;
    repairLibraryPublicAndRatings(user.uid, repairItems, ratings).catch(() => undefined);
  }, [isOwner, items, ratings, user]);

  const visibleItems = useMemo(() => {
      const normalizedQuery = normalize(query.trim());
    const filtered = items.filter((item) => {
      const matchesFilter = activeFilter === "all" || (activeFilter === "favorites" ? item.favorite : item.mediaType === activeFilter);
      const matchesGenre = genreFilter === "all" || item.snapshot.genres.includes(genreFilter);
      const matchesYear = yearFilter === "all" || String(item.snapshot.year ?? "") === yearFilter;
      const matchesQuery = !normalizedQuery || normalize(item.snapshot.title).includes(normalizedQuery) || normalize(item.snapshot.originalTitle).includes(normalizedQuery) || String(item.snapshot.year ?? "").includes(normalizedQuery);
      return matchesFilter && matchesGenre && matchesYear && matchesQuery;
    });
    return filtered.toSorted((a, b) => {
      if (sortMode === "title") return a.snapshot.title.localeCompare(b.snapshot.title, "tr");
      if (sortMode === "year-desc") return (b.snapshot.year ?? 0) - (a.snapshot.year ?? 0);
      if (sortMode === "year-asc") return (a.snapshot.year ?? 9999) - (b.snapshot.year ?? 9999);
      if (sortMode === "imdb-desc") return imdbRatingOf(b, ratings) - imdbRatingOf(a, ratings);
      return timestampMillis(b.addedAt) - timestampMillis(a.addedAt);
    });
  }, [activeFilter, genreFilter, items, query, ratings, sortMode, yearFilter]);

  const selectedItem = selectedId ? items.find((item) => item.id === selectedId) ?? null : null;
  const renderedItems = visibleItems.slice(0, visibleCount);
  const movieCount = items.filter((item) => item.mediaType === "movie").length;
  const tvCount = items.length - movieCount;
  const favoriteCount = items.filter((item) => item.favorite).length;
  const genres = useMemo(() => [...new Set(items.flatMap((item) => item.snapshot.genres))].sort((a, b) => a.localeCompare(b, "tr")), [items]);
  const years = useMemo(() => [...new Set(items.map((item) => item.snapshot.year).filter((year): year is number => typeof year === "number"))].sort((a, b) => b - a), [items]);

  async function toggleFavorite(item: LibraryItem) {
    if (user && isOwner) await setLibraryFavorite(user.uid, item, !item.favorite);
  }

  return (
    <div>
      {isOwner && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div>
            <p className="text-sm font-medium text-white/80">Arşivin gerçek zamanlı bağlı</p>
            <p className="mt-1 text-xs text-white/35">Web ve mobil aynı Firestore arşivini kullanır.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CsvImportButton uid={user!.uid} existingIds={new Set(items.map((item) => item.id))} onNotice={setNotice} />
            <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#a9b7c4] px-4 text-sm font-semibold text-[#0b0e12]"><FiPlus /> Yapım ekle</button>
          </div>
        </div>
      )}

      {notice && <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-100"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Bildirimi kapat"><FiX /></button></div>}

      <div className="mb-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={items.length} label="Toplam yapım" /><StatCard value={movieCount} label="Film" /><StatCard value={tvCount} label="Dizi" /><StatCard value={favoriteCount} label="Favori" />
      </div>

      <div className="sticky top-4 z-30 mb-9 space-y-3 rounded-2xl border border-white/10 bg-[#0b0e12]/85 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl md:top-6">
        <div className="md:flex md:items-center md:gap-3">
        <label className="relative block min-w-0 flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/40" /><span className="sr-only">Arşivde ara</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="İzlediklerinde ara..." className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#a9b7c4]/60" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/50 hover:bg-white/10"><FiX /></button>}
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto md:mt-0">{filters.map((filter) => {
          const Icon = filter.icon;
          const count = filter.id === "favorites" ? favoriteCount : filter.id === "movie" ? movieCount : filter.id === "tv" ? tvCount : items.length;
          return <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} className={`flex h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm transition ${activeFilter === filter.id ? "bg-[#a9b7c4] font-medium text-[#0b0e12]" : "border border-white/10 bg-white/[0.035] text-white/65"}`}>{Icon && <Icon />}{filter.label}<span className={activeFilter === filter.id ? "text-black/50" : "text-white/30"}>{count}</span></button>;
        })}</div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Select label="Tür" value={genreFilter} onChange={setGenreFilter} options={[["all", "Tüm türler"], ...genres.map((genre) => [genre, genre] as [string, string])]} />
          <Select label="Yıl" value={yearFilter} onChange={setYearFilter} options={[["all", "Tüm yıllar"], ...years.map((year) => [String(year), String(year)] as [string, string])]} />
          <Select label="Sırala" value={sortMode} onChange={(value) => setSortMode(value as SortMode)} options={[["added", "Son eklenen"], ["imdb-desc", "IMDb puanı"], ["title", "Ada göre"], ["year-desc", "Yeni yıl"], ["year-asc", "Eski yıl"]]} />
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.22em] text-[#a9b7c4]/60">Kişisel arşiv</p><h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{sectionTitle(activeFilter)}</h2></div><span className="text-sm text-white/35">{visibleItems.length} sonuç</span></div>

      {loading ? <div className="grid min-h-64 place-items-center text-white/45"><FiLoader className="animate-spin text-3xl" /></div>
        : error ? <EmptyState title="Arşiv yüklenemedi" description={error} />
        : visibleItems.length ? <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:gap-x-6">{renderedItems.map((item) => <LibraryCard key={item.id} item={item} imdbRating={imdbRatingOf(item, ratings)} isOwner={isOwner} onOpen={() => startTransition(() => setSelectedId(item.id))} onFavorite={() => toggleFavorite(item)} onRemove={() => user && removeFromLibrary(user.uid, item)} />)}</div>
          {visibleItems.length > renderedItems.length && <div className="mt-10 flex justify-center"><button type="button" onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)} className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70 hover:bg-white/[0.06]">Daha fazla göster · {visibleItems.length - renderedItems.length} kaldı</button></div>}
        </>
        : <EmptyState title={isOwner ? "Arşivin henüz boş" : "Henüz yapım yok"} description={isOwner ? "TMDB’de arayıp izlediğin ilk filmi veya diziyi ekle." : "Eren arşive yapım eklediğinde burada görünecek."} />}

      {selectedItem && <LiveMediaDialog item={libraryToDetailTarget(selectedItem)} onClose={() => setSelectedId(null)} onFavorite={isOwner ? () => toggleFavorite(selectedItem) : undefined} />}
      {searchOpen && user && <SearchDialog uid={user.uid} existingIds={new Set(items.map((item) => item.id))} onClose={() => setSearchOpen(false)} onNotice={setNotice} />}
    </div>
  );
}

function SearchDialog({ uid, existingIds, onClose, onNotice }: { uid: string; existingIds: Set<string>; onClose: () => void; onNotice: (message: string) => void }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState<TmdbSearchItem[]>([]); const [loading, setLoading] = useState(false); const [busyId, setBusyId] = useState(""); const [error, setError] = useState("");
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setLoading(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true); setError("");
      try { const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal, headers: await ownerAuthHeaders() }); const body = await response.json() as { results?: TmdbSearchItem[]; error?: string }; if (!response.ok) throw new Error(body.error || "Arama yapılamadı."); setResults(body.results ?? []); }
      catch (requestError) { if ((requestError as Error).name !== "AbortError") setError((requestError as Error).message); }
      finally { setLoading(false); }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  async function add(media: TmdbSearchItem) {
    const documentId = mediaDocumentId(media.mediaType, media.tmdbId);
    if (existingIds.has(documentId)) { onNotice(`${media.title} zaten arşivinde.`); return; }
    setBusyId(documentId);
    try {
      const detailResponse = await fetch(`/api/movies/${media.mediaType}/${media.tmdbId}`); const details = await detailResponse.json() as { metadata?: { external_ids?: { imdb_id?: string | null }; genres?: { name: string }[] }; imdbRating?: { averageRating: number; numVotes: number } | null };
      await addToLibrary(uid, { ...media, imdbId: details.metadata?.external_ids?.imdb_id ?? media.imdbId, genres: details.metadata?.genres?.map((genre) => genre.name) ?? media.genres, imdbRating: details.imdbRating?.averageRating ?? media.imdbRating, imdbVotes: details.imdbRating?.numVotes ?? media.imdbVotes });
      onNotice(`${media.title} izlediklerine eklendi.`);
    } catch (addError) { setError((addError as Error).message || "Yapım eklenemedi."); }
    finally { setBusyId(""); }
  }

  return <div className="fixed inset-0 z-[1100] h-[100dvh] overflow-y-auto bg-black/90 p-4 backdrop-blur-xl" data-lenis-prevent role="dialog" aria-modal="true"><div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0b0e12] p-5 shadow-2xl sm:p-7">
    <div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-semibold text-white">Film veya dizi ekle</h2><p className="mt-1 text-sm text-white/40">TMDB’nin güncel kataloğunda ara.</p></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white"><FiX /></button></div>
    <label className="relative mt-6 block"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Örn. Interstellar, Breaking Bad..." className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-white outline-none focus:border-white/30" /></label>
    {loading && <div className="grid h-32 place-items-center"><FiLoader className="animate-spin text-2xl text-white/45" /></div>}{error && <p className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
    <div className="mt-5 space-y-3">{results.map((media) => { const id = mediaDocumentId(media.mediaType, media.tmdbId); const exists = existingIds.has(id); return <div key={id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">{media.posterPath && <Image src={`https://image.tmdb.org/t/p/w185${media.posterPath}`} alt="" fill sizes="64px" className="object-cover" />}</div><div className="min-w-0 flex-1"><strong className="block truncate text-white/85">{media.title}</strong><p className="mt-1 text-xs text-white/40">{media.mediaType === "movie" ? "Film" : "Dizi"} · {media.year ?? "Yıl bilinmiyor"}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-white/35">{media.overview}</p></div><button disabled={exists || busyId === id} onClick={() => add(media)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#a9b7c4] text-black disabled:opacity-40" aria-label="Arşive ekle">{exists ? <FiCheck /> : busyId === id ? <FiLoader className="animate-spin" /> : <FiPlus />}</button></div>; })}</div>
  </div></div>;
}

function CsvImportButton({ uid, existingIds, onNotice }: { uid: string; existingIds: Set<string>; onNotice: (message: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false);
  async function importCsv(file?: File) {
    if (!file) return; setBusy(true);
    try {
      const text = await file.text(); const imdbIds = [...new Set(text.match(/\btt\d{7,10}\b/g) ?? [])]; if (!imdbIds.length) throw new Error("CSV içinde IMDb title ID bulunamadı.");
      const response = await fetch("/api/movies/import/imdb", { method: "POST", headers: { "content-type": "application/json", ...(await ownerAuthHeaders()) }, body: JSON.stringify({ imdbIds }) }); const body = await response.json() as { results?: { imdbId: string; media: TmdbSearchItem | null }[]; error?: string }; if (!response.ok) throw new Error(body.error || "CSV eşleştirilemedi.");
      const matched = body.results ?? []; const additions = matched.map((entry) => entry.media).filter((media): media is TmdbSearchItem => Boolean(media)).filter((media) => !existingIds.has(mediaDocumentId(media.mediaType, media.tmdbId))); await addManyToLibrary(uid, additions);
      const notFound = matched.filter((entry) => !entry.media).length; const skipped = matched.length - notFound - additions.length; onNotice(`IMDb içe aktarma tamamlandı: ${additions.length} eklendi, ${skipped} zaten vardı, ${notFound} eşleşmedi.`);
    } catch (importError) { onNotice((importError as Error).message || "CSV içe aktarılamadı."); }
    finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; }
  }
  return <><input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => importCsv(event.target.files?.[0])} /><button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-white/70 disabled:opacity-50">{busy ? <FiLoader className="animate-spin" /> : <FiUpload />} IMDb CSV</button></>;
}

function LibraryCard({ item, imdbRating, isOwner, onOpen, onFavorite, onRemove }: { item: LibraryItem; imdbRating: number; isOwner: boolean; onOpen: () => void; onFavorite: () => void; onRemove: () => void }) {
  return <article className="group min-w-0"><div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => event.key === "Enter" && onOpen()} className="relative aspect-[2/3] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#12161b] shadow-xl shadow-black/25 transition duration-500 group-hover:-translate-y-1 group-hover:border-white/25">
    {item.snapshot.posterPath ? <Image src={`https://image.tmdb.org/t/p/w500${item.snapshot.posterPath}`} alt={`${item.snapshot.title} posteri`} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" /> : <div className="grid h-full place-items-center text-4xl text-white/15"><FiFilm /></div>}<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" /><span className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">{item.mediaType === "movie" ? "Film" : "Dizi"}</span>
    {imdbRating >= 0 && <span className="absolute bottom-3 left-3 rounded-lg bg-[#f5c518] px-2.5 py-1 text-xs font-extrabold text-black">★ {imdbRating.toFixed(1)}</span>}
    <button onClick={(event) => { event.stopPropagation(); onFavorite(); }} disabled={!isOwner} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md ${item.favorite ? "border-rose-300/30 bg-rose-500/85 text-white" : "border-white/15 bg-black/45 text-white/70"}`} aria-label="Favori"><FiHeart className={item.favorite ? "fill-current" : ""} /></button>
    {isOwner && <div className="absolute bottom-3 left-3 right-3 flex justify-end gap-2 opacity-0 transition group-hover:opacity-100"><button onClick={(event) => { event.stopPropagation(); if (window.confirm(`${item.snapshot.title} arşivden kaldırılsın mı?`)) onRemove(); }} className="grid h-9 w-9 place-items-center rounded-full border border-rose-300/20 bg-black/70 text-rose-300" title="Arşivden kaldır"><FiTrash2 /></button></div>}
  </div><div className="px-1 pt-3"><h3 className="truncate font-medium text-white/90">{item.snapshot.title}</h3><p className="mt-1 flex items-center gap-2 text-xs text-white/35"><span>{item.snapshot.year ?? "—"}</span></p></div></article>;
}

function StatCard({ value, label }: { value: number; label: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4"><strong className="block text-2xl font-semibold text-white">{value}</strong><span className="mt-0.5 block text-sm text-white/40">{label}</span></div>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return <label className="block">
    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/30">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm text-white outline-none focus:border-[#a9b7c4]/60">
      {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue} className="bg-[#0b0e12] text-white">{optionLabel}</option>)}
    </select>
  </label>;
}
function EmptyState({ title, description }: { title: string; description: string }) { return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] text-center"><div className="px-6"><FiSearch className="mx-auto mb-3 text-2xl text-white/25" /><p className="font-medium text-white/75">{title}</p><p className="mt-1 text-sm text-white/35">{description}</p></div></div>; }
function normalize(value: string) { return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function sectionTitle(filter: Filter) { return filter === "favorites" ? "Favorilerim" : filter === "movie" ? "İzlediğim filmler" : filter === "tv" ? "İzlediğim diziler" : "Tüm izlediklerim"; }
function imdbRatingOf(item: LibraryItem, ratings: Record<string, { averageRating: number } | null>) { return item.snapshot.imdbRating ?? (item.imdbId ? ratings[item.imdbId]?.averageRating : undefined) ?? -1; }
function libraryToDetailTarget(item: LibraryItem): MediaDetailTarget { return { id: item.tmdbId, title: item.snapshot.title, originalTitle: item.snapshot.originalTitle, year: item.snapshot.year, mediaType: item.mediaType, posterPath: item.snapshot.posterPath, favorite: item.favorite, imdbId: item.imdbId }; }
async function ownerAuthHeaders() { const token = await auth.currentUser?.getIdToken(); if (!token) throw new Error("Oturum bulunamadı."); return { Authorization: `Bearer ${token}` }; }
function readRatingsCache(): Record<string, { averageRating: number; numVotes: number } | null> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(RATINGS_CACHE_KEY) ?? "{}") as Record<string, { averageRating: number; numVotes: number } | null>;
  } catch {
    return {};
  }
}
function writeRatingsCache(ratings: Record<string, { averageRating: number; numVotes: number } | null>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RATINGS_CACHE_KEY, JSON.stringify(ratings));
  } catch {
    // localStorage can be unavailable in private browsing; ignore.
  }
}
function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}
function timestampMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value) return (value as { toMillis: () => number }).toMillis();
  return 0;
}
