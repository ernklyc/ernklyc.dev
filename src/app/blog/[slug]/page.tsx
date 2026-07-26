import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import SectionBackground from "@/components/ui/SectionBackground";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import MarkdownContent from "@/components/ui/MarkdownContent";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Yazı bulunamadı" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <SectionBackground />
      <article className="container mx-auto max-w-3xl relative z-10">
        <GlassCard className="p-8 md:p-10">
          {post.coverImage && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 mb-8">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" unoptimized />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Chip key={tag} className="text-xs px-3 py-1">
                {tag}
              </Chip>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-8">{formatDate(post.publishedAt)}</p>

          <MarkdownContent content={post.content} />

          <div className="mt-12 pt-6 border-t border-white/10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#12161B] hover:bg-[#1A1F26] text-gray-300 hover:text-white text-sm transition-all duration-300 border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl"
            >
              ← Blog&apos;a dön
            </Link>
          </div>
        </GlassCard>
      </article>
    </main>
  );
}
