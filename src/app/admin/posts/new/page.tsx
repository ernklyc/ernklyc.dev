"use client";

import PostForm from "@/components/admin/PostForm";
import { createPost, type PostFormValues } from "@/lib/adminPosts";

export default function NewPostPage() {
  async function handleSubmit(values: PostFormValues) {
    await createPost(values);
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white mb-8">Yeni Yazı</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Yazıyı Oluştur" />
    </main>
  );
}
