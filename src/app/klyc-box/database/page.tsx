import type { Metadata } from "next";
import DatabaseClient from "./DatabaseClient";

export const metadata: Metadata = {
  title: "KLYC-Box veritabanı — hangi oyunlar Mac'te çalışıyor",
  description:
    "Hangi Windows oyunları Apple Silicon Mac'te çalışıyor, hangi grafik modunu istiyor, en son ne zaman doğrulandı. Açık (CC0) veri: al, kullan.",
  alternates: { canonical: "/klyc-box/database" },
};

export default function KlycBoxDatabasePage() {
  return <DatabaseClient />;
}
