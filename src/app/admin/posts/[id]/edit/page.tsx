"use client";

import { use, useEffect, useState } from "react";
import PostForm from "@/components/admin/PostForm";
import { getPostByIdAdmin, updatePost, type AdminPost, type PostFormValues } from "@/lib/adminPosts";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<AdminPost | null | undefined>(undefined);

  useEffect(() => {
    getPostByIdAdmin(id).then(setPost);
  }, [id]);

  async function handleSubmit(values: PostFormValues) {
    await updatePost(id, values);
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      {post === undefined && <p className="text-gray-400 text-sm">Yükleniyor...</p>}
      {post === null && <p className="text-gray-400 text-sm">Yazı bulunamadı.</p>}
      {post && (
        <PostForm
          initialValues={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            tags: post.tags,
            coverImage: post.coverImage ?? "",
            status: post.status,
            pinned: post.pinned,
          }}
          onSubmit={handleSubmit}
          submitLabel="Değişiklikleri Kaydet"
        />
      )}
    </main>
  );
}
