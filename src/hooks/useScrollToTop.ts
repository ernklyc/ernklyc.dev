"use client";

/** Sayfayı en tepeye yumuşak kaydıran küçük yardımcı hook. */
export function useScrollToTop() {
  return () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
}
