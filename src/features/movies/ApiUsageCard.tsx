"use client";

import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { auth } from "@/lib/firebase";

type Usage = {
  month: string;
  ddd: { name: string; used: number; limit: number; remaining: number; note: string };
};

const numberFormat = new Intl.NumberFormat("tr-TR");

/** Yönetim paneli: harici API'lerin aylık kalan kotası. */
export default function ApiUsageCard() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Oturum bulunamadı.");
      const response = await fetch("/api/movies/usage", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const body = (await response.json()) as Usage & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Kullanım bilgisi alınamadı.");
      setUsage(body);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const ddd = usage?.ddd;
  const percent = ddd ? Math.min(100, Math.round((ddd.used / ddd.limit) * 100)) : 0;
  const barColor = percent >= 90 ? "bg-red-400" : percent >= 70 ? "bg-amber-300" : "bg-emerald-400";

  return (
    <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">API kullanımı</h2>
          <p className="mt-0.5 text-xs text-white/35">{usage ? `${usage.month} ayı` : "Bu ay"} · aylık kota</p>
        </div>
        <button type="button" onClick={load} disabled={loading} aria-label="Yenile" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/50 hover:text-white disabled:opacity-40">
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {ddd && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-white/75">{ddd.name}</span>
            <span className="text-white/50">
              <strong className="text-white">{numberFormat.format(ddd.remaining)}</strong> kaldı · {numberFormat.format(ddd.used)} / {numberFormat.format(ddd.limit)}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-white/30">{ddd.note} TMDB’nin aylık kotası yoktur, bu yüzden gösterilmez.</p>
        </div>
      )}
    </section>
  );
}
