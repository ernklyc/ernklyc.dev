"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAboutForAdmin, saveAbout } from "@/lib/adminSiteContent";
import type { AboutContent } from "@/lib/siteContent";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function AboutContentPage() {
  const router = useRouter();
  const [values, setValues] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAboutForAdmin().then(setValues);
  }, []);

  function updateParagraph(index: number, text: string) {
    setValues((v) => {
      if (!v) return v;
      const paragraphs = [...v.paragraphs];
      paragraphs[index] = text;
      return { ...v, paragraphs };
    });
  }

  function removeParagraph(index: number) {
    setValues((v) => {
      if (!v) return v;
      return { ...v, paragraphs: v.paragraphs.filter((_, i) => i !== index) };
    });
  }

  function addParagraph() {
    setValues((v) => (v ? { ...v, paragraphs: [...v.paragraphs, ""] } : v));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const paragraphs = values.paragraphs.map((p) => p.trim()).filter(Boolean);
      await saveAbout({ ...values, paragraphs });
      setValues({ ...values, paragraphs });
      setSaved(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  if (!values) {
    return (
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white mb-8">Hakkımda</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">İsim</label>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((v) => v && { ...v, name: e.target.value })}
            className={cn(inputBase, inputBorder.default)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Unvan</label>
          <input
            required
            value={values.role}
            onChange={(e) => setValues((v) => v && { ...v, role: e.target.value })}
            className={cn(inputBase, inputBorder.default)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Konum</label>
          <input
            required
            value={values.location}
            onChange={(e) => setValues((v) => v && { ...v, location: e.target.value })}
            className={cn(inputBase, inputBorder.default)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Görsel URL (gif/resim)</label>
          <input
            required
            value={values.avatarUrl}
            onChange={(e) => setValues((v) => v && { ...v, avatarUrl: e.target.value })}
            className={cn(inputBase, inputBorder.default, "text-sm")}
          />
          {values.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.avatarUrl}
              alt="Önizleme"
              className="mt-2 h-28 w-28 rounded-xl border border-white/10 object-cover"
            />
          )}
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-2 mt-4">
            <label className="block text-xs text-gray-400">Tanıtım Paragrafları</label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-[11px] text-gray-400 hover:text-white transition-colors"
            >
              + Paragraf ekle
            </button>
          </div>
          <div className="space-y-3">
            {values.paragraphs.map((paragraph, index) => (
              <div key={index} className="relative">
                <textarea
                  rows={3}
                  value={paragraph}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  className={cn(inputBase, inputBorder.default, "resize-y text-sm pr-9")}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  title="Paragrafı sil"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            {values.paragraphs.length === 0 && (
              <p className="text-xs text-gray-500">Hiç paragraf yok. Yukarıdan ekleyebilirsin.</p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && !error && <p className="text-sm text-emerald-400">Kaydedildi.</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white px-5 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/content")}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Geri
          </button>
        </div>
      </form>
    </main>
  );
}
