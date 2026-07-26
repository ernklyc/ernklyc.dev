"use client";

import { decode } from "blurhash";
import { useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type BlurHashLoadingProps = {
  label?: string;
  minHeightClass?: string;
  hash?: string;
};

const DEFAULT_HASH = "L03S6RIn00#R#7WXJ7sC00jY~XX9";

/**
 * Section/route lazy-load fallback'i. Sitenin animasyonlu Beams arka planı
 * global layout'ta zaten render edildiği için burada opak/farklı bir arka
 * plan KOYMUYORUZ — sadece o arka planın üzerine oturan şeffaf bir spinner
 * gösteriyoruz. Böylece yüklenme anlarında ani renk/tema sıçraması olmuyor.
 */
export default function BlurHashLoading({
  label,
  minHeightClass = "min-h-screen",
  hash = DEFAULT_HASH,
}: BlurHashLoadingProps) {
  const { locale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultLabel = locale === "tr" ? "Sayfa yükleniyor" : "Page loading";
  const resolvedLabel = label ?? defaultLabel;
  const sentenceCaseLabel = resolvedLabel
    ? `${resolvedLabel.charAt(0).toUpperCase()}${resolvedLabel.slice(1).toLowerCase()}`
    : defaultLabel;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 48;
    const height = 32;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pixels = decode(hash, width, height);
    const imageData = context.createImageData(width, height);
    imageData.data.set(pixels);
    context.putImageData(imageData, 0, 0);
  }, [hash]);

  return (
    <div className={`relative overflow-hidden ${minHeightClass}`}>
      <canvas
        ref={canvasRef}
        width={48}
        height={32}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl"
      />

      <div className="relative z-10 flex h-full min-h-[inherit] items-center justify-center text-white">
        <div className="boot-loader-content">
          <div className="boot-loader-spinner" />
          <p className="boot-loader-text">{sentenceCaseLabel}</p>
        </div>
      </div>
    </div>
  );
}
