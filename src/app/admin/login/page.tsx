"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GlassCard from "@/components/ui/GlassCard";
import SectionBackground from "@/components/ui/SectionBackground";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MOVIE_LIBRARY_OWNER_UID } from "@/features/movies/config";

function mapAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-posta veya şifre hatalı.";
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.";
    case "auth/popup-closed-by-user":
      return "Google giriş penceresi kapatıldı.";
    case "auth/account-exists-with-different-credential":
      return "Bu e-posta farklı bir giriş yöntemiyle kayıtlı. Önce mevcut yöntemle girip Google hesabını bağlamak gerekiyor.";
    default:
      return "Giriş yapılamadı. Lütfen tekrar dene.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);

  function goAfterLogin() {
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    router.replace(requestedPath?.startsWith("/") ? requestedPath : "/admin");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting("email");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      goAfterLogin();
    } catch (loginError) {
      setError(mapAuthError((loginError as { code?: string }).code ?? "auth/invalid-credential"));
    } finally {
      setSubmitting(null);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setSubmitting("google");
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
      setSubmitting(null);
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
          disabled={submitting !== null}
          onClick={handleGoogleLogin}
          className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white text-[#0b0e12] py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full text-base font-bold text-[#4285F4]">G</span>
          {submitting === "google" ? "Google ile giriliyor..." : "Google ile giriş yap"}
        </button>

        <div className="mb-5 flex items-center gap-3 text-xs text-white/30">
          <span className="h-px flex-1 bg-white/10" />
          veya e-posta
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-gray-400 mb-1.5">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(inputBase, inputBorder.default)}
              placeholder="ornek@eposta.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-gray-400 mb-1.5">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(inputBase, inputBorder.default)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting !== null}
            className="w-full rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white py-3 text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting === "email" ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
