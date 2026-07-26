"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";
import { darkSegmentIndicator, darkSegmentTrack } from "@/lib/theme";

interface LocaleSwitchProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * TR/EN segmented dil değiştirici. Önceden Navbar'ın hem masaüstü hem
 * mobil menüsünde birebir kopyalanmıştı; artık tek component, iki yerde
 * de aynı davranış ve görünüm garanti.
 */
export default function LocaleSwitch({ size = "sm", className }: LocaleSwitchProps) {
  const { locale, setLocale, isTransitioning } = useLocale();

  const buttonSize =
    size === "sm" ? "w-9 px-2 py-1 text-xs" : "w-12 px-3 py-1.5 text-sm";

  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg p-0.5 overflow-hidden",
        darkSegmentTrack,
        className
      )}
    >
      <motion.div
        initial={false}
        animate={{ x: locale === "tr" ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
        className={cn(
          "absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md",
          darkSegmentIndicator
        )}
      />
      {(["tr", "en"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLocale(lng)}
          disabled={isTransitioning}
          className={cn(
            "relative z-10 font-medium rounded-md transition-colors duration-300",
            buttonSize,
            locale === lng ? "text-white" : "text-gray-400 hover:text-white",
            isTransitioning ? "opacity-80" : "opacity-100"
          )}
          aria-label={lng === "tr" ? "Türkçe" : "English"}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
