"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getHeroForAdmin, saveHero } from "@/lib/adminSiteContent";
import type { HeroContent } from "@/lib/siteContent";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function HeroContentPage() {
  const router = useRouter();
  const [values, setValues] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHeroForAdmin().then(setValues);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      await saveHero(values);
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">İsim / Başlık</label>
          <input
            required
            value={values.title}
            onChange={(e) => setValues((v) => v && { ...v, title: e.target.value })}
            className={cn(inputBase, inputBorder.default)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Unvan (alt başlık)</label>
          <input
            required
            value={values.subtitle}
            onChange={(e) => setValues((v) => v && { ...v, subtitle: e.target.value })}
            className={cn(inputBase, inputBorder.default)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Açıklama</label>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => setValues((v) => v && { ...v, description: e.target.value })}
            className={cn(inputBase, inputBorder.default, "resize-y")}
          />
        </div>

        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3 mt-4">Sosyal Medya Linkleri</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">GitHub</label>
              <input
                required
                value={values.links.github}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, github: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">LinkedIn</label>
              <input
                required
                value={values.links.linkedin}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, linkedin: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">E-posta</label>
              <input
                required
                type="email"
                value={values.links.email}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, email: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Google Play</label>
              <input
                required
                value={values.links.playStore}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, playStore: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">App Store (opsiyonel)</label>
              <input
                value={values.links.appStore ?? ""}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, appStore: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
                placeholder="https://apps.apple.com/..."
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">YouTube (opsiyonel)</label>
              <input
                value={values.links.youtube ?? ""}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, youtube: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
                placeholder="https://youtube.com/@..."
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">TikTok (opsiyonel)</label>
              <input
                value={values.links.tiktok ?? ""}
                onChange={(e) =>
                  setValues((v) => v && { ...v, links: { ...v.links, tiktok: e.target.value } })
                }
                className={cn(inputBase, inputBorder.default, "text-sm")}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <p className="text-[11px] text-gray-500">
              App Store, YouTube ve TikTok boş bırakılırsa ilgili ikon Hero ve Footer&apos;da hiç
              gösterilmez.
            </p>
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
        </div>
      </form>
    </main>
  );
}
