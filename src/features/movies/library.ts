import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MOVIE_LIBRARY_OWNER_UID } from "./config";
import {
  mediaDocumentId,
  type LibraryItem,
  type TmdbSearchItem,
} from "./models";

export function subscribeToLibrary(
  uid: string | null,
  onItems: (items: LibraryItem[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  const owner = uid === MOVIE_LIBRARY_OWNER_UID;
  const libraryRef = collection(db, "users", MOVIE_LIBRARY_OWNER_UID, "library");
  const libraryQuery = owner ? query(libraryRef) : query(libraryRef, where("isPublic", "==", true));

  return onSnapshot(
    libraryQuery,
    (snapshot) => {
      const items = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Omit<LibraryItem, "id">),
      }));
      items.sort((a, b) => timestampMillis(b.addedAt) - timestampMillis(a.addedAt));
      onItems(items);
    },
    (error) => {
      console.error("Film arşivi dinlenemedi", error);
      onError("Film arşivi yüklenemedi.");
    },
  );
}

export async function addToLibrary(uid: string, media: TmdbSearchItem) {
  assertOwner(uid);
  const id = mediaDocumentId(media.mediaType, media.tmdbId);
  const reference = doc(db, "users", uid, "library", id);
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(reference);
    if (existing.exists()) return;
    transaction.set(reference, libraryPayload(media));
  });
}

export async function addManyToLibrary(uid: string, mediaItems: TmdbSearchItem[]) {
  assertOwner(uid);
  const unique = [...new Map(mediaItems.map((media) => [mediaDocumentId(media.mediaType, media.tmdbId), media])).values()];
  const missing: TmdbSearchItem[] = [];
  const libraryRef = collection(db, "users", uid, "library");

  for (let start = 0; start < unique.length; start += 30) {
    const chunk = unique.slice(start, start + 30);
    const ids = chunk.map((media) => mediaDocumentId(media.mediaType, media.tmdbId));
    const existing = await getDocs(query(libraryRef, where(documentId(), "in", ids)));
    const existingIds = new Set(existing.docs.map((item) => item.id));
    missing.push(...chunk.filter((media) => !existingIds.has(mediaDocumentId(media.mediaType, media.tmdbId))));
  }

  for (let start = 0; start < missing.length; start += 450) {
    const batch = writeBatch(db);
    for (const media of missing.slice(start, start + 450)) {
      const id = mediaDocumentId(media.mediaType, media.tmdbId);
      batch.set(doc(db, "users", uid, "library", id), libraryPayload(media));
    }
    await batch.commit();
  }
}

export async function setLibraryFavorite(uid: string, item: LibraryItem, favorite: boolean) {
  assertOwner(uid);
  await updateDoc(doc(db, "users", uid, "library", item.id), {
    favorite,
    updatedAt: serverTimestamp(),
  });
}

export async function setLibraryPublic(uid: string, item: LibraryItem, isPublic: boolean) {
  assertOwner(uid);
  await updateDoc(doc(db, "users", uid, "library", item.id), {
    isPublic,
    updatedAt: serverTimestamp(),
  });
}

export async function removeFromLibrary(uid: string, item: LibraryItem) {
  assertOwner(uid);
  await deleteDoc(doc(db, "users", uid, "library", item.id));
}

function libraryPayload(media: TmdbSearchItem) {
  return {
    tmdbId: media.tmdbId,
    imdbId: media.imdbId,
    mediaType: media.mediaType,
    favorite: false,
    isPublic: false,
    snapshot: {
      title: media.title,
      originalTitle: media.originalTitle,
      year: media.year,
      posterPath: media.posterPath,
      genres: media.genres,
    },
    addedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function assertOwner(uid: string) {
  if (uid !== MOVIE_LIBRARY_OWNER_UID) throw new Error("Bu işlem için yetkin yok.");
}

function timestampMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value) {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}
