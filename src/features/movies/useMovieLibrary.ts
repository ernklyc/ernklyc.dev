"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { MOVIE_LIBRARY_OWNER_UID } from "./config";
import { subscribeToLibrary } from "./library";
import type { LibraryItem } from "./models";

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
      setUser(nextUser);
      setLoading(true);
      setError("");
      unsubscribeLibrary?.();
      unsubscribeLibrary = subscribeToLibrary(
        nextUser?.uid ?? null,
        (nextItems) => {
          setItems(nextItems);
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
