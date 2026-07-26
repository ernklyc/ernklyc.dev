"use client";

/** Sayfayı en tepeye yumuşak kaydıran küçük yardımcı hook. */
export function useScrollToTop() {
  return () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
