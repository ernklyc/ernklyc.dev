"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { FiArrowLeft } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// Tüm admin sayfalarının başlığı ve "geri" hedefi TEK yerden (burada) yönetilir.
// Sayfaların kendi içinde ayrıca başlık/geri butonu OLMAMALI — çift görünür.
//
// NOT: Yazı listesi ayrı bir /admin/posts sayfası değil, doğrudan /admin
// dashboard'unun kendisi — bu yüzden yeni/düzenle sayfalarının "geri"si /admin'e gider.
const CONTENT_SECTION_TITLES: Record<string, string> = {
  hero: "Ana Ekran (Hero)",
  about: "Hakkımda",
  skills: "Yeteneklerim",
  experience: "Eğitim & İş Deneyimi",
};

function getNavigation(pathname: string) {
  if (pathname === "/admin") return { title: "Admin Paneli", backHref: null };
  if (pathname === "/admin/posts/new") return { title: "Yeni Yazı", backHref: "/admin" };
  if (pathname.match(/^\/admin\/posts\/.*\/edit$/)) return { title: "Yazıyı Düzenle", backHref: "/admin" };
  if (pathname === "/admin/content") return { title: "Site İçeriği", backHref: "/admin" };
  if (pathname === "/admin/movies") return { title: "Film Arşivi", backHref: "/admin" };
  const contentMatch = pathname.match(/^\/admin\/content\/([^/]+)/);
  if (contentMatch) {
    return {
      title: CONTENT_SECTION_TITLES[contentMatch[1]] ?? "İçeriği Düzenle",
      backHref: "/admin/content",
    };
  }
  return { title: "Admin", backHref: null };
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const { user, loading } = useAdminAuth();
  const nav = getNavigation(pathname);

  // Login sayfası kendi başına serbest — guard'a takılmasın. Yine de site
  // arkaplanının (Beams) sızmaması için opak bir zemin veriyoruz.
  if (isLoginPage) {
    return <div className="relative z-10 min-h-screen bg-[#0B0E12]">{children}</div>;
  }

  if (loading) {
    return (
      <main className="relative z-10 min-h-screen bg-[#0B0E12] flex items-center justify-center text-gray-400 text-sm">
        Yükleniyor...
      </main>
    );
  }

  if (!user) {
    // useAdminAuth zaten /admin/login'e yönlendiriyor, bu sadece yönlendirme
    // tamamlanana kadar boş bir an göstermemek için.
    return <div className="relative z-10 min-h-screen bg-[#0B0E12]" />;
  }

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#0B0E12]">
      <div className="border-b border-white/10 bg-[#0B0E12]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {nav.backHref && (
              <button
                onClick={() => router.push(nav.backHref!)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/[0.08] rounded transition-all"
                title="Geri"
              >
                <FiArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-sm font-medium text-white">{nav.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Çıkış yap
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
