"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

interface LogoAvatarProps {
  src?: string;
  alt?: string;
  fallbackIcon: ReactNode;
}

/**
 * Deneyim/eğitim listelerindeki logo rozeti. Kaynak resim yoksa veya
 * yüklenemezse (örn. süresi dolmuş CDN linki) otomatik olarak ikon
 * fallback'ine döner. Önceden bu mantık elle DOM manipülasyonuyla
 * yapılıyordu; artık sade bir React state.
 */
export default function LogoAvatar({ src, alt = "", fallbackIcon }: LogoAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14">
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          unoptimized
          sizes="56px"
          className="object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#12161B]/70 border border-white/10">
          {fallbackIcon}
        </div>
      )}
    </div>
  );
}
