"use client";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  status: "published" | "draft";
  /** Ana sayfada gösterilsin mi (admin panelden sabitleme). */
  pinned: boolean;
  /** ISO tarih string'i (form içinde düzenlenebilir olsun diye Timestamp değil string tutuyoruz) */
  publishedAt: string;
}

export interface PostFormValues {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  status: "published" | "draft";
  pinned: boolean;
}

function toIsoDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

/** Admin panelde kullanılmak üzere TÜM yazıları (taslak dahil) en yeniden eskiye getirir. */
export async function getAllPostsAdmin(): Promise<AdminPost[]> {
  const snapshot = await getDocs(collection(db, "posts"));
  const posts = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      slug: data.slug || d.id,
      title: data.title || "Başlıksız",
      excerpt: data.excerpt || "",
      content: data.content || "",
      tags: data.tags || [],
      coverImage: data.coverImage,
      status: (data.status as "published" | "draft") || "draft",
      pinned: data.pinned ?? false,
      publishedAt: toIsoDate(data.publishedAt),
    } satisfies AdminPost;
  });
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostByIdAdmin(id: string): Promise<AdminPost | null> {
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    slug: data.slug || snap.id,
    title: data.title || "Başlıksız",
    excerpt: data.excerpt || "",
    content: data.content || "",
    tags: data.tags || [],
    coverImage: data.coverImage,
    status: (data.status as "published" | "draft") || "draft",
    pinned: data.pinned ?? false,
    publishedAt: toIsoDate(data.publishedAt),
  };
}

export async function createPost(values: PostFormValues): Promise<string> {
  const ref = await addDoc(collection(db, "posts"), {
    ...values,
    coverImage: values.coverImage || null,
    publishedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updatePost(id: string, values: PostFormValues): Promise<void> {
  await updateDoc(doc(db, "posts", id), {
    ...values,
    coverImage: values.coverImage || null,
  });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}
