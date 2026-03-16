"use client";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiExternalLink, FiTag } from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  link: string;
}

export default function Blog() {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Flutter ile Mobil Uygulama Geliştirme Rehberi",
      excerpt: "Flutter framework'ü kullanarak cross-platform mobil uygulamalar geliştirme sürecinde önemli ipuçları ve best practice'ler.",
      date: "2024-01-15",
      readTime: "8 dk",
      category: "Mobil Geliştirme",
      tags: ["Flutter", "Dart", "Mobile", "Cross-platform"],
      image: "/blog/flutter-guide.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "Unity ile Oyun Geliştirme: Başlangıçtan İleri Seviyeye",
      excerpt: "Unity game engine kullanarak 2D ve 3D oyunlar geliştirme sürecinde karşılaştığım deneyimler ve öneriler.",
      date: "2024-01-10",
      readTime: "12 dk",
      category: "Oyun Geliştirme",
      tags: ["Unity", "C#", "Game Development", "2D", "3D"],
      image: "/blog/unity-development.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "Next.js 14 ile Modern Web Uygulamaları",
      excerpt: "Next.js 14'ün yeni özellikleri ve performans optimizasyonları ile modern web uygulamaları geliştirme teknikleri.",
      date: "2024-01-05",
      readTime: "10 dk",
      category: "Web Geliştirme",
      tags: ["Next.js", "React", "TypeScript", "Web"],
      image: "/blog/nextjs-guide.jpg",
      link: "#"
    },
    {
      id: 4,
      title: "UI/UX Tasarımında Figma Kullanım İpuçları",
      excerpt: "Figma ile etkili UI/UX tasarımları oluşturma, component sistemleri kurma ve takım çalışması için ipuçları.",
      date: "2023-12-28",
      readTime: "6 dk",
      category: "Tasarım",
      tags: ["Figma", "UI/UX", "Design", "Prototyping"],
      image: "/blog/figma-tips.jpg",
      link: "#"
    },
    {
      id: 5,
      title: "C# ile Desktop Uygulamaları: WPF vs WinUI",
      excerpt: "Modern desktop uygulamaları geliştirmek için WPF ve WinUI arasında karşılaştırma ve hangi durumda hangisini tercih etmeli.",
      date: "2023-12-20",
      readTime: "9 dk",
      category: "Desktop Geliştirme",
      tags: ["C#", "WPF", "WinUI", "Desktop"],
      image: "/blog/desktop-development.jpg",
      link: "#"
    },
    {
      id: 6,
      title: "Git ve GitHub: Profesyonel Proje Yönetimi",
      excerpt: "Git version control sistemi ve GitHub kullanarak profesyonel yazılım geliştirme süreçlerini optimize etme yöntemleri.",
      date: "2023-12-15",
      readTime: "7 dk",
      category: "DevOps",
      tags: ["Git", "GitHub", "Version Control", "DevOps"],
      image: "/blog/git-github.jpg",
      link: "#"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="blog" className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0F1923] dark:via-[#151F2B] dark:to-[#0F1923] scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white relative z-10">
              📝 BLOG YAZILARI
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6 text-lg">
            Teknoloji, yazılım geliştirme ve deneyimlerim üzerine yazdığım makaleler
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#1F2731]/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-[#FF4655]/20 group"
            >
              {/* Blog Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#FF4655]/20 to-[#FF4655]/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4655]/80 to-[#FF4655]/60 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">
                      {post.category === "Mobil Geliştirme" && "📱"}
                      {post.category === "Oyun Geliştirme" && "🎮"}
                      {post.category === "Web Geliştirme" && "🌐"}
                      {post.category === "Tasarım" && "🎨"}
                      {post.category === "Desktop Geliştirme" && "💻"}
                      {post.category === "DevOps" && "⚙️"}
                    </div>
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <FiExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-[#FF4655] transition-colors duration-300 leading-tight">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center gap-1 text-xs bg-[#FF4655]/10 text-[#FF4655] px-2 py-1 rounded-full"
                    >
                      <FiTag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      +{post.tags.length - 3} daha
                    </span>
                  )}
                </div>

                {/* Read More Button */}
                <a
                  href={post.link}
                  className="inline-flex items-center gap-2 text-[#FF4655] hover:text-[#FF4655]/80 font-medium text-sm transition-colors duration-300 group"
                >
                  Devamını Oku
                  <FiExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF4655] to-[#FF4655]/80 text-white px-8 py-4 rounded-full font-medium hover:from-[#FF4655]/90 hover:to-[#FF4655]/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Tüm Blog Yazılarını Görüntüle</span>
            <FiExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
