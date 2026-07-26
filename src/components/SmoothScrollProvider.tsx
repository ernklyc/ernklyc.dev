"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Site genelinde akıcı (inertia'lı) scroll sağlayan Lenis instance'ını
 * kurar ve requestAnimationFrame döngüsüyle besler. Instance'ı
 * `window.__lenis` üzerinden dışarı açar ki navbar linkleri, "yukarı çık"
 * butonu ve hash scroll gibi yerler native `window.scrollTo` yerine
 * Lenis'in kendi (aynı fizikle çalışan) `scrollTo` metodunu kullanabilsin.
 *
 * Görsel/DOM çıktısı yok — sadece scroll davranışını yönetir.
 */
export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Mobilde native touch momentum'u bozmamak için dokunmatik kaydırmaya karışmıyoruz.
      syncTouch: false,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
