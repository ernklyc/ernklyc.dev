"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollNavbarState {
  /** Kullanıcı sayfayı biraz aşağı kaydırdı mı (arka plan opaklaşmalı mı) */
  scrolled: boolean;
  /** Navbar görünür mü (yukarı kaydırınca göster, aşağı kaydırınca gizle) */
  showNavbar: boolean;
}

/**
 * Navbar'ın scroll davranışını (arka plan opaklığı + göster/gizle) yöneten
 * ViewModel katmanı. Navbar component'i sadece bu state'i render eder,
 * scroll mantığıyla ilgilenmez.
 */
export function useScrollNavbar(): ScrollNavbarState {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrolled, showNavbar };
}
