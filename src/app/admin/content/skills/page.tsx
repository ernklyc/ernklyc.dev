"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSkillsForAdmin, saveSkills } from "@/lib/adminSiteContent";
import type { SkillsContent } from "@/lib/siteContent";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface CategoryDraft {
  category: string;
  itemsInput: string;
}

export default function SkillsContentPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDraft[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSkillsForAdmin().then((content: SkillsContent) => {
      setCategories(
        content.categories.map((c) => ({ category: c.category, itemsInput: c.items.join(", ") }))
      );
    });
  }, []);

  function updateCategory(index: number, field: keyof CategoryDraft, value: string) {
    setCategories((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeCategory(index: number) {
    setCategories((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));
  }

  function addCategory() {
    setCategories((prev) => (prev ? [...prev, { category: "", itemsInput: "" }] : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!categories) return;
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const payload: SkillsContent = {
        categories: categories
          .map((c) => ({
            category: c.category.trim(),
            items: c.itemsInput
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean),
          }))
          .filter((c) => c.category && c.items.length > 0),
      };
      await saveSkills(payload);
      setSaved(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  if (!categories) {
    return (
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <p className="text-sm text-gray-400 mb-8">
        Her kategori bir sekme olarak görünür. Maddeleri virgülle ayırarak yaz.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {categories.map((cat, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs text-gray-400">Kategori adı</label>
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
              >
                Kategoriyi sil
              </button>
            </div>
            <input
              required
              value={cat.category}
              onChange={(e) => updateCategory(index, "category", e.target.value)}
              className={cn(inputBase, inputBorder.default, "text-sm")}
              placeholder="Örn. Programlama & Geliştirme"
            />
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Maddeler (virgülle ayır)</label>
              <textarea
                required
                rows={2}
                value={cat.itemsInput}
                onChange={(e) => updateCategory(index, "itemsInput", e.target.value)}
                className={cn(inputBase, inputBorder.default, "resize-none text-sm")}
                placeholder="Flutter & Dart, Unity & C#, Next.js"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCategory}
          className="w-full rounded-xl border border-dashed border-white/15 hover:border-white/30 text-sm text-gray-400 hover:text-white py-3 transition-all duration-300"
        >
          + Kategori ekle
        </button>

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
        </div>
      </form>
    </main>
  );
}
