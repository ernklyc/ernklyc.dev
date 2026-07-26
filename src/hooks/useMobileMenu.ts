"use client";

import { useEffect, useRef, useState } from "react";

interface MobileMenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * Mobil menünün açık/kapalı state'ini, Escape tuşu ile kapatmayı ve
 * odak (focus) yönetimini kapsayan ViewModel. Navbar bu hook'u kullanarak
 * erişilebilirlik mantığını kendi JSX'inden ayırır.
 */
export function useMobileMenu(): MobileMenuState {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      firstLinkRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  return {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
    close: () => setIsOpen(false),
    menuButtonRef,
    firstLinkRef,
  };
}
