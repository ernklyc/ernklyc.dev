"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/blog";
import { collectTags } from "@/lib/blog";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

interface BlogListClientProps {
  posts: BlogPost[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const tags = useMemo(() => collectTags(posts), [posts]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => post.tags.includes(activeTag));
  }, [posts, activeTag]);

  if (posts.length === 0) {
    return (
      <GlassCard className="p-8 md:p-10 text-center">
        <p className="text-gray-300">
          Henüz yayınlanmış bir yazı yok. Yakında burada olacak.
        </p>
      </GlassCard>
    );
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300",
              activeTag === null
                ? "bg-[#12161B] text-white border-white/20 shadow-md shadow-black/50"
                : "bg-white/[0.06] backdrop-blur-sm text-gray-300 border-white/10 hover:bg-white/[0.1] hover:border-white/20 hover:text-white"
            )}
          >
            Tümü
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300",
                activeTag === tag
                  ? "bg-[#12161B] text-white border-white/20 shadow-md shadow-black/50"
                  : "bg-white/[0.06] backdrop-blur-sm text-gray-300 border-white/10 hover:bg-white/[0.1] hover:border-white/20 hover:text-white"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link href={`/blog/${post.slug}`} className="block h-full group">
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Chip key={tag} className="text-xs px-3 py-1">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-white group-hover:text-[#A9B7C4] transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
