"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MAX_RETRY = 25;
const RETRY_MS = 120;

function scrollToSection(id: string) {
  const targetElement = document.getElementById(id);
  if (!targetElement) return false;

  const viewportHeight = window.innerHeight;
  const elementHeight = targetElement.offsetHeight;

  let offsetPosition: number;
  if (elementHeight < viewportHeight) {
    const elementPosition = targetElement.getBoundingClientRect().top;
    offsetPosition = elementPosition + window.pageYOffset - (viewportHeight - elementHeight) / 2;
  } else {
    offsetPosition = targetElement.offsetTop - 80;
  }

  window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" });
  return true;
}

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const rawHash = window.location.hash;
    if (!rawHash || rawHash.length <= 1) return;

    const targetId = decodeURIComponent(rawHash.slice(1));

    if (scrollToSection(targetId)) return;

    let retryCount = 0;
    const timer = window.setInterval(() => {
      retryCount += 1;
      const done = scrollToSection(targetId);
      if (done || retryCount >= MAX_RETRY) {
        window.clearInterval(timer);
      }
    }, RETRY_MS);

    return () => window.clearInterval(timer);
  }, [pathname]);

  return null;
}
