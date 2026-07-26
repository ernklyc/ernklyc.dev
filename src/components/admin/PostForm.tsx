"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { PostFormValues } from "@/lib/adminPosts";

interface PostFormProps {
  initialValues?: PostFormValues;
  onSubmit: (values: PostFormValues) => Promise<void>;
  submitLabel: string;
}

const emptyValues: PostFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: [],
  coverImage: "",
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostForm({ initialValues, onSubmit, submitLabel }: PostFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PostFormValues>(initialValues ?? emptyValues);
  const [tagsInput, setTagsInput] = useState(initialValues?.tags.join(", ") ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** İçeriği günceller ve textarea'da imleci/seçimi verilen aralığa taşır. */
  function applyContentEdit(newValue: string, selStart: number, selEnd: number) {
    setValues((v) => ({ ...v, content: newValue }));
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(selStart, selEnd);
      }
    });
  }

  /** Seçili metni before/after ile sarar; seçim yoksa placeholder ekler ve seçili bırakır. */
  function wrapSelection(before: string, after: string, placeholder: string) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd) || placeholder;
    const newValue = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
    const newStart = selectionStart + before.length;
    applyContentEdit(newValue, newStart, newStart + selected.length);
  }

  /** İmlecin bulunduğu satır(lar)ın başına prefix ekler (başlık, alıntı, liste). */
  function prefixLines(prefix: string) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    let lineEnd = value.indexOf("\n", selectionEnd);
    if (lineEnd === -1) lineEnd = value.length;
    const segment = value.slice(lineStart, lineEnd);
    const withPrefix = segment
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : prefix + line))
      .join("\n");
    const newValue = value.slice(0, lineStart) + withPrefix + value.slice(lineEnd);
    const diff = withPrefix.length - segment.length;
    applyContentEdit(newValue, selectionStart + prefix.length, selectionEnd + diff);
  }

  /** Bir bloğu (görsel, video, kod vb.) boş satırlarla ayırarak imleç konumuna ekler. */
  function insertBlock(block: string, innerSelectionOffset?: [number, number]) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const prefix = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const suffix = after.length === 0 || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    const newValue = before + prefix + block + suffix + after;
    const blockStart = before.length + prefix.length;
    const [selStart, selEnd] = innerSelectionOffset
      ? [blockStart + innerSelectionOffset[0], blockStart + innerSelectionOffset[1]]
      : [blockStart + block.length, blockStart + block.length];
    applyContentEdit(newValue, selStart, selEnd);
  }

  function handleInsertLink() {
    const url = window.prompt("Bağlantı URL'si:");
    if (!url) return;
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd) || "bağlantı metni";
    const text = `[${selected}](${url})`;
    const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    applyContentEdit(newValue, selectionStart + text.length, selectionStart + text.length);
  }

  function handleInsertImage() {
    const url = window.prompt("Görsel URL'si:");
    if (!url) return;
    const alt = window.prompt("Görsel açıklaması (opsiyonel):") ?? "";
    insertBlock(`![${alt}](${url})`);
  }

  function handleInsertYoutube() {
    const url = window.prompt("YouTube video linki:");
    if (!url) return;
    if (!/youtu\.?be/i.test(url)) {
      window.alert("Bu bir YouTube linkine benzemiyor, yine de eklendi — kontrol et.");
    }
    insertBlock(url);
  }

  function handleInsertCode() {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const code = selected || "kod buraya";
    const block = "```\n" + code + "\n```";
    insertBlock(block, [4, 4 + code.length]);
  }

  function handleTitleChange(title: string) {
    setValues((v) => ({
      ...v,
      title,
      slug: slugTouched ? v.slug : slugify(title),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await onSubmit({ ...values, tags });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Başlık</label>
        <input
          required
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={cn(inputBase, inputBorder.default)}
          placeholder="Yazı başlığı"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Slug (URL)</label>
        <input
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues((v) => ({ ...v, slug: e.target.value }));
          }}
          className={cn(inputBase, inputBorder.default, "font-mono text-sm")}
          placeholder="orn-yazi-basligi"
        />
        <p className="text-[11px] text-gray-500 mt-1">/blog/{values.slug || "..."}</p>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Özet</label>
        <textarea
          required
          rows={2}
          value={values.excerpt}
          onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
          className={cn(inputBase, inputBorder.default, "resize-none")}
          placeholder="Liste sayfasında görünecek kısa özet"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Etiketler (virgülle ayır)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className={cn(inputBase, inputBorder.default)}
          placeholder="Devlog, Flutter, Firebase"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Kapak Görseli (URL, opsiyonel)</label>
        <input
          value={values.coverImage ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, coverImage: e.target.value }))}
          className={cn(inputBase, inputBorder.default)}
          placeholder="https://..."
        />
        {values.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.coverImage}
            alt="Kapak önizleme"
            className="mt-2 h-28 rounded-xl border border-white/10 object-cover"
          />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs text-gray-400">İçerik (Markdown)</label>
          <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            className="text-[11px] text-gray-400 hover:text-white transition-colors"
          >
            {showPreview ? "Editöre dön" : "Önizle"}
          </button>
        </div>

        {!showPreview && (
          <div className="flex flex-wrap items-center gap-1 mb-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5">
            <ToolbarButton label="Kalın" onClick={() => wrapSelection("**", "**", "kalın metin")}>
              <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton label="İtalik" onClick={() => wrapSelection("*", "*", "italik metin")}>
              <span className="italic">i</span>
            </ToolbarButton>
            <ToolbarButton label="Başlık" onClick={() => prefixLines("## ")}>
              H2
            </ToolbarButton>
            <ToolbarButton label="Alıntı" onClick={() => prefixLines("> ")}>
              &ldquo;&rdquo;
            </ToolbarButton>
            <ToolbarButton label="Liste" onClick={() => prefixLines("- ")}>
              •
            </ToolbarButton>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <ToolbarButton label="Bağlantı" onClick={handleInsertLink}>
              🔗
            </ToolbarButton>
            <ToolbarButton label="Görsel ekle" onClick={handleInsertImage}>
              🖼
            </ToolbarButton>
            <ToolbarButton label="YouTube video ekle" onClick={handleInsertYoutube}>
              ▶
            </ToolbarButton>
            <ToolbarButton label="Kod bloğu" onClick={handleInsertCode}>
              {"</>"}
            </ToolbarButton>
          </div>
        )}

        {showPreview ? (
          <GlassCard className="p-5 max-h-[420px] overflow-y-auto">
            <MarkdownContent content={values.content || "*Boş*"} />
          </GlassCard>
        ) : (
          <textarea
            ref={textareaRef}
            required
            rows={16}
            value={values.content}
            onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
            className={cn(inputBase, inputBorder.default, "font-mono text-sm resize-y")}
            placeholder="# Başlık&#10;&#10;Markdown içerik... Görsel/YouTube/kod eklemek için üstteki araç çubuğunu kullan."
          />
        )}
        <p className="text-[11px] text-gray-500 mt-1.5">
          İpucu: Görsel ve YouTube linkleri araç çubuğundan eklenebilir, paragraflar arasına
          serbestçe yerleştirilebilir. Etiketler /blog sayfasında filtre olarak otomatik görünür.
        </p>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Durum</label>
        <div className="flex gap-2">
          {(["draft", "published"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setValues((v) => ({ ...v, status }))}
              className={cn(
                "rounded-xl px-4 py-2 text-sm border transition-all duration-300",
                values.status === status
                  ? "bg-white/[0.1] border-white/20 text-white"
                  : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]"
              )}
            >
              {status === "draft" ? "Taslak" : "Yayında"}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white px-5 py-2.5 text-sm font-medium transition-all duration-300 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

function ToolbarButton({ label, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="min-w-[2rem] h-8 px-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
    >
      {children}
    </button>
  );
}
