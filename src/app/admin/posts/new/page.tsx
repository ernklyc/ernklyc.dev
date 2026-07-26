"use client";

import PostForm from "@/components/admin/PostForm";
import { createPost, type PostFormValues } from "@/lib/adminPosts";

export default function NewPostPage() {
  async function handleSubmit(values: PostFormValues) {
    await createPost(values);
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <PostForm onSubmit={handleSubmit} submitLabel="Yazıyı Oluştur" />
    </main>
  );
}
