"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GlassCard from "@/components/ui/GlassCard";
import SectionBackground from "@/components/ui/SectionBackground";
import { MOVIE_LIBRARY_OWNER_UID } from "@/features/movies/config";

function mapAuthError(code: string): string {
  switch (code) {
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.";
    case "auth/popup-closed-by-user":
      return "Google giriş penceresi kapatıldı.";
    case "auth/unauthorized-domain":
      return "Bu alan adı Firebase'de yetkilendirilmemiş.";
    case "auth/popup-blocked":
      return "Tarayıcı Google penceresini engelledi. Açılır pencerelere izin ver.";
    default:
      return "Giriş yapılamadı. Lütfen tekrar dene.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function goAfterLogin() {
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    router.replace(requestedPath?.startsWith("/") ? requestedPath : "/admin");
  }

  async function handleGoogleLogin() {
    setError(null);
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      if (result.user.uid !== MOVIE_LIBRARY_OWNER_UID) {
        await signOut(auth);
        setError("Bu Google hesabı arşiv sahibiyle eşleşmiyor. ernklyc@gmail.com ile aynı Firebase kullanıcısına bağlı olmalı.");
        return;
      }
      goAfterLogin();
    } catch (loginError) {
      setError(mapAuthError((loginError as { code?: string }).code ?? "auth/unknown"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-24">
      <SectionBackground />
      <GlassCard className="w-full max-w-sm p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Admin Girişi</h1>
        <p className="text-sm text-gray-400 mb-6">Blog ve film arşivi yönetimine erişmek için giriş yap.</p>

        <button
          type="button"
          disabled={submitting}
          onClick={handleGoogleLogin}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white text-[#0b0e12] py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full text-base font-bold text-[#4285F4]">G</span>
          {submitting ? "Google ile giriliyor..." : "Google ile giriş yap"}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </GlassCard>
    </main>
  );
}
