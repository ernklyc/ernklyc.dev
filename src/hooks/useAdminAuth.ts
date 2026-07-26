"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminAuthState {
  user: User | null;
  /** Firebase Auth henüz oturum durumunu bildirmediyse true. */
  loading: boolean;
}

/**
 * Admin sayfalarını korumak için kullanılan hook.
 *
 * Giriş yapılmamışsa otomatik olarak /admin/login'e yönlendirir. Yetkilendirme
 * asıl olarak Firestore Rules tarafında (yalnızca belirli UID yazabilir)
 * uygulanır — bu hook sadece UI tarafında oturum açmamış kullanıcıyı
 * panele sokmamak için bir kolaylık katmanıdır, güvenliğin tek kaynağı
 * değildir.
 */
export function useAdminAuth(): AdminAuthState {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      if (!nextUser) {
        router.replace("/admin/login");
      }
    });
    return unsubscribe;
  }, [router]);

  return { user, loading };
}
