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

const SITE_URL = "https://ernklyc.dev";

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
    authors: [{ name: "Eren Kalaycı", url: SITE_URL }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Eren Kalaycı"],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
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

  // BlogPosting yapılandırılmış verisi — yazıyı "Eren KALAYCI" kişi
  // şemasına (StructuredData.tsx'teki Person, aynı @id) bağlar, arama
  // motorlarına yazarlık ve içerik ilişkisini netleştirir.
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    keywords: post.tags.join(", "),
    author: { "@id": `${SITE_URL}#person` },
    publisher: { "@id": `${SITE_URL}#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    url: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen text-white pt-32 pb-20 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <SectionBackground />
      <article className="container mx-auto max-w-3xl px-4 md:px-6 lg:px-8 relative z-10">
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
