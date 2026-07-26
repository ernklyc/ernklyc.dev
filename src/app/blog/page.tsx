import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Eren KALAYCI'nın blog yazıları: devlog kayıtları, araştırdığı konular ve paylaştığı içerikler.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
      <SectionBackground />
      <section className="container mx-auto max-w-5xl relative z-10">
        <SectionHeading
          title="BLOG"
          subtitle="Devlog kayıtları, araştırdığım konular ve paylaşmak istediklerim."
        />
        <BlogListClient posts={posts} />
      </section>
    </main>
  );
}
