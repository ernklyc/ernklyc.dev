"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { t as tFn, type Locale } from "@/data/translations";

const STORAGE_KEY = "locale";
const DEFAULT_OUT_MS = 260;
const DEFAULT_IN_DELAY_MS = 120;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  isTransitioning: boolean;
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "tr";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "tr" || stored === "en") return stored;
  return "tr";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!mounted) return;

    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    scrollTop();
    const raf1 = window.requestAnimationFrame(scrollTop);
    const raf2 = window.requestAnimationFrame(scrollTop);
    const t1 = window.setTimeout(scrollTop, 60);
    const t2 = window.setTimeout(scrollTop, 180);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const body = document.body;

    if (isTransitioning) {
      html.classList.add("locale-transitioning");
      body.classList.add("locale-transitioning");
      return;
    }

    html.classList.remove("locale-transitioning");
    body.classList.remove("locale-transitioning");

    return () => {
      html.classList.remove("locale-transitioning");
      body.classList.remove("locale-transitioning");
    };
  }, [isTransitioning, mounted]);

  const setLocale = useCallback((next: Locale) => {
    if (next === locale) return;
    clearTimers();
    setIsTransitioning(true);

    const outId = window.setTimeout(() => {
      setLocaleState(next);
      const inId = window.setTimeout(() => {
        setIsTransitioning(false);
      }, DEFAULT_IN_DELAY_MS);
      timeoutsRef.current.push(inId);
    }, DEFAULT_OUT_MS);

    timeoutsRef.current.push(outId);
  }, [clearTimers, locale]);

  const t = useCallback(
    (key: string) => tFn(locale, key),
    [locale]
  );

  const value: LocaleContextValue = { locale, setLocale, isTransitioning, isNavigating, setIsNavigating, t };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
