"use client";
import { useEffect } from 'react';

// Global window interface tanımları
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function Analytics() {
  useEffect(() => {    // Google Analytics 4
    if (typeof window !== 'undefined') {
      window.gtag = window.gtag || function (...args: unknown[]) {
        (window.dataLayer = window.dataLayer || []).push(args);
      };
      
      // Sayfa görüntüleme
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  return null;
}
