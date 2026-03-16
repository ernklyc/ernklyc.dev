"use client";

import { decode } from "blurhash";
import { useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";

type BlurHashLoadingProps = {
  label?: string;
  accent?: "red" | "blue";
  minHeightClass?: string;
  hash?: string;
};

const DEFAULT_HASH = "L03S6RIn00#R#7WXJ7sC00jY~XX9";

export default function BlurHashLoading({
  label,
  accent = "red",
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

  const spinnerTopColor = accent === "blue" ? "#60a5fa" : "#ff4655";

  return (
    <div className={`relative overflow-hidden bg-[#0F1923] ${minHeightClass}`}>
      <canvas
        ref={canvasRef}
        width={48}
        height={32}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C]/80 via-[#0F1923]/70 to-[#151F2B]/85" />

      <div className="relative z-10 flex h-full min-h-[inherit] items-center justify-center text-white">
        <div className="boot-loader-content">
          <div className="boot-loader-spinner" style={{ borderTopColor: spinnerTopColor }} />
          <p className="boot-loader-text">{sentenceCaseLabel}</p>
        </div>
      </div>
    </div>
  );
}
