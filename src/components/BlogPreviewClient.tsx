"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import GlassCard from "@/components/ui/GlassCard";
import { darkChip } from "@/lib/theme";
import type { BlogPost } from "@/lib/blog";

interface BlogPreviewClientProps {
  posts: BlogPost[];
}

/**
 * Ana sayfada blog yazılarını sola yaslı bir başlığın altında, tek satırlık
 * ve yana kaydırılabilir bir şeritte önizler. Her kart kapak görseliyle
 * (varsa) birlikte tek satıra kırpılmış başlık + kısa özet gösterir —
 * tıklanınca /blog/[slug]'a gider.
 *
 * SectionHeading yerine burada kendi başlığını çiziyoruz çünkü
 * SectionHeading her zaman ortalı bir alt boşluk (mb-12) ile geliyor;
 * sola yaslı, kompakt bir header için o boşluğu sıfırlamak sınıf
 * çakışmasına yol açacaktı.
 */
export default function BlogPreviewClient({ posts }: BlogPreviewClientProps) {
  const { t, locale } = useLocale();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t("blog.title")}</h2>
          <div className="h-1 w-16 mt-2 bg-gradient-to-r from-white to-transparent rounded" />
        </div>
        <Link
          href="/blog"
          className="shrink-0 text-sm text-[#A9B7C4] hover:text-[#C7D2DA] transition-colors"
        >
          {t("blog.viewAll")}
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="shrink-0 w-72 snap-start">
            <GlassCard className="h-full overflow-hidden p-0 flex flex-col hover:bg-white/[0.06] hover:border-white/20">
              <div className="h-32 w-full shrink-0 bg-gradient-to-br from-[#A9B7C4]/15 to-white/[0.02] relative">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl opacity-80">📝</div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`${darkChip} leading-none rounded-full px-2.5 py-1 text-[11px] shrink-0`}>
                    {post.tags[0] ?? "Devlog"}
                  </span>
                  <span className="text-[11px] leading-none text-gray-500 shrink-0">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <h3 className="text-white font-medium truncate">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                )}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
