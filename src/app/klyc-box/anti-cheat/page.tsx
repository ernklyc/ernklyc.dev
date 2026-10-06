import type { Metadata } from "next";
import AntiCheatClient from "./AntiCheatClient";

export const metadata: Metadata = {
  title: "Mac'te hile koruması: ne çalışır, ne çalışmaz — KLYC-Box",
  description:
    "Bazı hile korumaları Mac'te neden hiç çalışmaz, hangi oyunlar etkileniyor ve çalışmayan bir oyun için ne yapabilirsin. KLYC-Box bunu oyunu almadan önce söyler.",
  alternates: { canonical: "/klyc-box/anti-cheat" },
};

export default function KlycBoxAntiCheatPage() {
  return <AntiCheatClient />;
}
