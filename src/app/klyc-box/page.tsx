import type { Metadata } from "next";
import KlycBoxClient from "./KlycBoxClient";

export const metadata: Metadata = {
  title: "KLYC-Box — Mac'te Windows oyunları",
  description:
    "KLYC-Box: Steam ve Epic Games kütüphaneni Apple Silicon Mac'inde çalıştıran, ücretsiz ve açık kaynak macOS uygulaması. Kendi mağazası, dürüst uyumluluk etiketleri, çökme teşhisi ve indirme yönetimi.",
  keywords: [
    "KLYC-Box",
    "Mac'te Windows oyunları",
    "Apple Silicon oyun",
    "Wine macOS",
    "Steam Mac Windows oyunu",
    "Epic Games Mac",
    "Eren Kalaycı",
  ],
  alternates: { canonical: "/klyc-box" },
  openGraph: {
    title: "KLYC-Box — Mac'te Windows oyunları",
    description: "Steam ve Epic oyunlarını Apple Silicon Mac'inde çalıştıran ücretsiz, açık kaynak macOS uygulaması.",
    url: "https://ernklyc.dev/klyc-box",
    type: "website",
  },
};

export default function KlycBoxPage() {
  return <KlycBoxClient />;
}
