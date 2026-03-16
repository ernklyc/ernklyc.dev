"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white mb-4">
          404
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          {t("notFound.message")}
        </p>
        <Link
          href="/"
          className="inline-block text-gray-400 hover:text-white text-sm transition-colors border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl"
        >
          {t("notFound.backHome")}
        </Link>
      </div>
    </main>
  );
}
