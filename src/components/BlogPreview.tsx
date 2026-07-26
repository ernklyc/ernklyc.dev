import { getHomePosts } from "@/lib/blog";
import SectionBackground from "@/components/ui/SectionBackground";
import BlogPreviewClient from "@/components/BlogPreviewClient";

/**
 * Ana sayfa akışında blog yazılarını gösteren section. Hiç yazı yoksa
 * (henüz blog boşsa) section'ı hiç render etmez — boş bir başlık akışta
 * tuhaf durmasın diye. Başlık/çeviri işini client tarafındaki
 * BlogPreviewClient üstleniyor çünkü useLocale hook'u server component'te
 * kullanılamıyor.
 *
 * Gösterilen yazılar: admin panelden "Ana sayfada göster" ile sabitlenenler
 * (getHomePosts) — hiç sabitlenmiş yazı yoksa en son yayınlananlara düşer.
 */
export default async function BlogPreview() {
  const posts = await getHomePosts(10);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-14 scroll-mt-20">
      <SectionBackground />
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-10">
        <BlogPreviewClient posts={posts} />
      </div>
    </section>
  );
}
