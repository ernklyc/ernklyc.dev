"use client";

import { useEffect, useState } from "react";
import SectionBackground from "@/components/ui/SectionBackground";
import GlassCard from "@/components/ui/GlassCard";

/**
 * Hands off a community-invite link to the Ironlog app via its custom
 * scheme. If Ironlog is installed, Android/iOS intercepts this navigation
 * before it ever reaches the fallback UI below (Universal/App Links via
 * `.well-known/assetlinks.json` + `apple-app-site-association` handle the
 * `https://ernklyc.dev/join/*` URL directly; this `ironlog://` attempt is
 * the backstop for a browser that opened the link without that OS-level
 * verification kicking in). If it isn't installed, nothing happens and the
 * fallback shows shortly after.
 */
export default function JoinRedirect({ code }: { code: string }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFallback(true), 1500);
    window.location.href = `ironlog://join/${code}`;
    return () => window.clearTimeout(timer);
  }, [code]);

  return (
    <main className="min-h-screen flex items-center justify-center text-white px-4 relative overflow-hidden">
      <SectionBackground />
      <GlassCard className="relative z-10 max-w-md w-full p-8 text-center">
        {!showFallback ? (
          <>
            <div
              className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-white/20 border-t-[#A9B7C4] animate-spin"
              aria-hidden="true"
            />
            <p className="text-gray-300">Ironlog açılıyor…</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-3 text-white">Ironlog yüklü değil</h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              Bu bağlantı seni bir Ironlog topluluğuna davet ediyor. Uygulama şu an
              sadece test kullanıcılarına açık — davet kodunu kullanmak için önce
              Ironlog&apos;u telefonuna kurman gerekiyor.
            </p>
            <div className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 mb-6">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Davet kodu</p>
              <p className="font-mono text-lg tracking-widest text-[#A9B7C4]">{code}</p>
            </div>
            <p className="text-sm text-gray-400">
              Uygulamayı kuran kişiden APK&apos;yı iste, sonra Topluluklar
              ekranından bu kodu elle girebilirsin.
            </p>
          </>
        )}
      </GlassCard>
    </main>
  );
}
