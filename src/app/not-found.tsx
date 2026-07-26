"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import FuzzyText from "@/components/FuzzyText";
import Noise from "@/components/Noise";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white flex items-center justify-center px-4 overflow-hidden">
      <Noise patternAlpha={12} />
      <div className="text-center max-w-md relative z-10">
        <div role="heading" aria-level={1} aria-label="404" className="flex justify-center mb-4">
          <FuzzyText
            fontSize="clamp(3.75rem, 15vw, 6rem)"
            fontWeight={800}
            color="#A9B7C4"
            baseIntensity={0.15}
            hoverIntensity={0.4}
            fuzzRange={20}
          >
            404
          </FuzzyText>
        </div>
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
