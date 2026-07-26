"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getExperienceForAdmin, saveExperience } from "@/lib/adminSiteContent";
import type { EducationEntry } from "@/lib/siteContent";
import type { ExperienceEntry } from "@/data/experience";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface WorkDraft {
  title: string;
  company: string;
  location: string;
  type: string;
  period: string;
  startDate: string;
  endDate: string;
  category: string;
  logo: string;
  skillsInput: string;
  highlightsInput: string;
}

function workToDraft(item: ExperienceEntry): WorkDraft {
  return {
    title: item.title,
    company: item.company,
    location: item.location,
    type: item.type,
    period: item.period,
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    category: item.category,
    logo: item.logo,
    skillsInput: item.skills.join(", "),
    highlightsInput: (item.highlights ?? []).join("\n"),
  };
}

function draftToWork(draft: WorkDraft): ExperienceEntry {
  return {
    title: draft.title.trim(),
    company: draft.company.trim(),
    location: draft.location.trim(),
    type: draft.type.trim(),
    period: draft.period.trim(),
    startDate: draft.startDate.trim() || undefined,
    endDate: draft.endDate.trim() || null,
    category: draft.category.trim(),
    logo: draft.logo.trim(),
    skills: draft.skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    highlights: draft.highlightsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

const emptyWorkDraft: WorkDraft = {
  title: "",
  company: "",
  location: "",
  type: "",
  period: "",
  startDate: "",
  endDate: "",
  category: "",
  logo: "",
  skillsInput: "",
  highlightsInput: "",
};

const emptyEducation: EducationEntry = { institution: "", degree: "", years: "", gpa: "", logo: "" };

export default function ExperienceContentPage() {
  const router = useRouter();
  const [education, setEducation] = useState<EducationEntry[] | null>(null);
  const [work, setWork] = useState<WorkDraft[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getExperienceForAdmin().then((content) => {
      setEducation(content.education);
      setWork(content.work.map(workToDraft));
    });
  }, []);

  function updateEducation(index: number, field: keyof EducationEntry, value: string) {
    setEducation((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function updateWork(index: number, field: keyof WorkDraft, value: string) {
    setWork((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!education || !work) return;
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      await saveExperience({
        education: education.filter((e) => e.institution.trim()),
        work: work.map(draftToWork).filter((w) => w.title && w.company),
      });
      setSaved(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  if (!education || !work) {
    return (
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white mb-8">Eğitim & İş Deneyimi</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">İş Deneyimi</h2>
            <button
              type="button"
              onClick={() => setWork((prev) => (prev ? [{ ...emptyWorkDraft }, ...prev] : prev))}
              className="text-[11px] text-gray-400 hover:text-white transition-colors"
            >
              + Deneyim ekle
            </button>
          </div>

          <div className="space-y-4">
            {work.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Deneyim #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setWork((prev) => prev && prev.filter((_, i) => i !== index))}
                    className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Sil
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Pozisyon" value={item.title} onChange={(v) => updateWork(index, "title", v)} />
                  <Field label="Şirket" value={item.company} onChange={(v) => updateWork(index, "company", v)} />
                  <Field label="Konum" value={item.location} onChange={(v) => updateWork(index, "location", v)} />
                  <Field
                    label="Çalışma şekli (Ofisten / Uzaktan)"
                    value={item.type}
                    onChange={(v) => updateWork(index, "type", v)}
                  />
                  <Field
                    label="Dönem metni (örn. Ağu 2025 - Günümüz)"
                    value={item.period}
                    onChange={(v) => updateWork(index, "period", v)}
                  />
                  <Field
                    label="Kategori (Staj / Tam zamanlı)"
                    value={item.category}
                    onChange={(v) => updateWork(index, "category", v)}
                  />
                  <Field
                    label="Başlangıç (YYYY-MM, opsiyonel)"
                    value={item.startDate}
                    onChange={(v) => updateWork(index, "startDate", v)}
                  />
                  <Field
                    label="Bitiş (YYYY-MM, boşsa Günümüz)"
                    value={item.endDate}
                    onChange={(v) => updateWork(index, "endDate", v)}
                  />
                  <div className="sm:col-span-2">
                    <Field label="Logo URL" value={item.logo} onChange={(v) => updateWork(index, "logo", v)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Yetenekler (virgülle ayır)"
                      value={item.skillsInput}
                      onChange={(v) => updateWork(index, "skillsInput", v)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-gray-500 mb-1">
                      Katkı/başarı maddeleri (her satıra bir madde)
                    </label>
                    <textarea
                      rows={3}
                      value={item.highlightsInput}
                      onChange={(e) => updateWork(index, "highlightsInput", e.target.value)}
                      className={cn(inputBase, inputBorder.default, "resize-y text-sm")}
                    />
                  </div>
                </div>
              </div>
            ))}
            {work.length === 0 && <p className="text-xs text-gray-500">Hiç deneyim yok.</p>}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">Eğitim</h2>
            <button
              type="button"
              onClick={() => setEducation((prev) => (prev ? [...prev, { ...emptyEducation }] : prev))}
              className="text-[11px] text-gray-400 hover:text-white transition-colors"
            >
              + Eğitim ekle
            </button>
          </div>

          <div className="space-y-4">
            {education.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Eğitim #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setEducation((prev) => prev && prev.filter((_, i) => i !== index))}
                    className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Sil
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Kurum"
                    value={item.institution}
                    onChange={(v) => updateEducation(index, "institution", v)}
                  />
                  <Field label="Derece" value={item.degree} onChange={(v) => updateEducation(index, "degree", v)} />
                  <Field
                    label="Yıllar (örn. 2021 - 2025)"
                    value={item.years}
                    onChange={(v) => updateEducation(index, "years", v)}
                  />
                  <Field
                    label="Ortalama (opsiyonel)"
                    value={item.gpa}
                    onChange={(v) => updateEducation(index, "gpa", v)}
                  />
                  <div className="sm:col-span-2">
                    <Field label="Logo URL" value={item.logo} onChange={(v) => updateEducation(index, "logo", v)} />
                  </div>
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-xs text-gray-500">Hiç eğitim kaydı yok.</p>}
          </div>
        </section>

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

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, inputBorder.default, "text-sm")}
      />
    </div>
  );
}
