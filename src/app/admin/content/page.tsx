import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";

const sections = [
  {
    href: "/admin/content/hero",
    title: "Ana Ekran (Hero)",
    description: "İsim, unvan, açıklama metni ve sosyal medya linkleri.",
  },
  {
    href: "/admin/content/about",
    title: "Hakkımda",
    description: "Profil görseli, konum ve tanıtım paragrafları.",
  },
  {
    href: "/admin/content/skills",
    title: "Yeteneklerim",
    description: "Yetenek kategorileri ve her kategorideki maddeler.",
  },
  {
    href: "/admin/content/experience",
    title: "Eğitim & İş Deneyimi",
    description: "Eğitim geçmişi ve iş deneyimi zaman çizelgesi.",
  },
];

export default function ContentHubPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <p className="text-sm text-gray-400 mb-8">
        Ana sayfadaki bu bölümleri buradan düzenleyebilirsin — değişiklikler koda dokunmadan
        (en fazla 60 saniye içinde) canlı sitede görünür.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <GlassCard className="p-5 h-full hover:bg-white/[0.06] hover:border-white/20">
              <h2 className="text-white font-medium mb-1.5">{section.title}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{section.description}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </main>
  );
}
