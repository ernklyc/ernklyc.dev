"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const { user, loading } = useAdminAuth();

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
        <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between">
          <span className="text-sm text-gray-400">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Çıkış yap
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
