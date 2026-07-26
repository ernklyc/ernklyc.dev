"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAllPostsAdmin, deletePost, type AdminPost } from "@/lib/adminPosts";
import GlassCard from "@/components/ui/GlassCard";
import { darkChip } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await getAllPostsAdmin();
    setPosts(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" yazısını silmek istediğine emin misin? Bu işlem geri alınamaz.`)) return;
    setDeletingId(id);
    try {
      await deletePost(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">Blog Yazıları</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white px-4 py-2 text-sm font-medium transition-all duration-300"
        >
          + Yeni Yazı
        </Link>
      </div>

      <Link
        href="/admin/content"
        className="mb-8 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-300"
      >
        <span>Site içeriğini düzenle (Hero, Hakkımda, Yeteneklerim, Deneyim)</span>
        <span aria-hidden="true">→</span>
      </Link>

      {posts === null && <p className="text-gray-400 text-sm">Yükleniyor...</p>}

      {posts !== null && posts.length === 0 && (
        <p className="text-gray-400 text-sm">Henüz yazı yok.</p>
      )}

      <div className="space-y-3">
        {posts?.map((post) => (
          <GlassCard key={post.id} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-medium truncate">{post.title}</h2>
                <span
                  className={cn(
                    darkChip,
                    "rounded-full px-2 py-0.5 text-[11px] shrink-0",
                    post.status === "published" ? "text-emerald-300" : "text-amber-300"
                  )}
                >
                  {post.status === "published" ? "Yayında" : "Taslak"}
                </span>
                {post.pinned && (
                  <span className={cn(darkChip, "rounded-full px-2 py-0.5 text-[11px] shrink-0")}>
                    📌 Ana sayfada
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">/blog/{post.slug}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-xs text-gray-300 hover:text-white transition-colors"
              >
                Düzenle
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                disabled={deletingId === post.id}
                className="text-xs text-red-400/80 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                {deletingId === post.id ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
