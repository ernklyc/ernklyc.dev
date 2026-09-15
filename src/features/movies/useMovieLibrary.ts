"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { MOVIE_LIBRARY_OWNER_UID } from "./config";
import { subscribeToLibrary } from "./library";
import type { LibraryItem } from "./models";

const LIBRARY_CACHE_PREFIX = "movie_library_cache_v1";

export function useMovieLibrary() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      setError("Firebase yapılandırması bulunamadı.");
      return;
    }

    let unsubscribeLibrary: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      const owner = nextUser?.uid === MOVIE_LIBRARY_OWNER_UID;
      const cacheKey = `${LIBRARY_CACHE_PREFIX}_${owner ? "owner" : "public"}`;
      const cachedItems = readLibraryCache(cacheKey);
      setUser(nextUser);
      if (cachedItems.length) setItems(cachedItems);
      setLoading(!cachedItems.length);
      setError("");
      unsubscribeLibrary?.();
      unsubscribeLibrary = subscribeToLibrary(
        nextUser?.uid ?? null,
        (nextItems) => {
          setItems(nextItems);
          writeLibraryCache(cacheKey, nextItems);
          setLoading(false);
        },
        (message) => {
          setError(message);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLibrary?.();
    };
  }, []);

  return {
    user,
    items,
    loading,
    error,
    isOwner: user?.uid === MOVIE_LIBRARY_OWNER_UID,
  };
}

function readLibraryCache(key: string): LibraryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { cachedAt?: number; items?: LibraryItem[] };
    if (!parsed.cachedAt || Date.now() - parsed.cachedAt > 12 * 60 * 60 * 1000) return [];
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function writeLibraryCache(key: string, items: LibraryItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify({ cachedAt: Date.now(), items }));
  } catch {
    // Ignore blocked/full localStorage; Firebase remains source of truth.
  }
}
