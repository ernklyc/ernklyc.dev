import {
  collection,
  query,
  where,
  getDocs,
  limit as fbLimit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  /** Ana sayfada gösterilmek üzere admin panelden sabitlenmiş mi. */
  pinned: boolean;
  /** ISO tarih string'i (Firestore Timestamp'ten dönüştürülmüş, serileştirilebilir) */
  publishedAt: string;
}

interface RawPostData {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  coverImage?: string;
  status?: "published" | "draft";
  pinned?: boolean;
  publishedAt?: Timestamp | string;
}

function toIsoDate(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}

function mapDoc(id: string, data: RawPostData): BlogPost {
  return {
    slug: data.slug || id,
    title: data.title || "Başlıksız",
    excerpt: data.excerpt || "",
    content: data.content || "",
    tags: data.tags || [],
    coverImage: data.coverImage,
    pinned: data.pinned ?? false,
    publishedAt: toIsoDate(data.publishedAt),
  };
}

function byNewestFirst(a: BlogPost, b: BlogPost): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

/**
 * Yayınlanmış (status === "published") tüm yazıları en yeniden eskiye getirir.
 * Not: Bilerek sıralamayı Firestore sorgusunda değil kod tarafında yapıyoruz —
 * `where` + `orderBy`'ı farklı alanlarda birlikte kullanmak composite index
 * gerektirir. Kişisel bir blogda yazı sayısı az olacağı için bu, index
 * yönetimiyle uğraşmamak adına daha pratik.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("status", "==", "published"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data() as RawPostData)).sort(byNewestFirst);
  } catch (error) {
    console.error("Blog yazıları alınamadı:", error);
    return [];
  }
}

/** Ana sayfada önizleme için son N yazıyı getirir. */
export async function getRecentPosts(count = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

/**
 * Ana sayfada gösterilecek yazıları getirir: admin panelden "sabitlenmiş"
 * (pinned) yazılar öncelikli, hiç sabitlenmiş yazı yoksa en son yayınlanan
 * N yazıya düşer. Böylece homepage'i güncel tutmak için her yazıyı elle
 * sabitlemek zorunda kalmıyorsun.
 */
export async function getHomePosts(count = 8): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const pinned = posts.filter((p) => p.pinned);
  if (pinned.length > 0) return pinned.slice(0, count);
  return posts.slice(0, count);
}

/** Slug'a göre tek bir yayınlanmış yazıyı getirir. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("slug", "==", slug),
      where("status", "==", "published"),
      fbLimit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return mapDoc(doc.id, doc.data() as RawPostData);
  } catch (error) {
    console.error("Blog yazısı alınamadı:", error);
    return null;
  }
}

/** Tüm etiketleri (tekrarsız) küçük harf duyarsız şekilde toplar. */
export function collectTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
