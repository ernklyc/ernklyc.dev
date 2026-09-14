import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { profile } from "@/data/profile";
import { skills as staticSkills } from "@/data/skills";
import { education as staticEducation } from "@/data/education";
import { experience as staticExperience, type ExperienceEntry } from "@/data/experience";

/**
 * Ana sayfa içeriği (Hero, Hakkımda, Yeteneklerim, Deneyim) artık admin
 * panelden düzenlenebilir — Firestore'daki `siteContent/{hero,about,skills,experience}`
 * dokümanlarından okunur. Doküman henüz oluşturulmamışsa (admin panelden hiç
 * kaydedilmemişse) veya Firestore'a erişilemezse, site hiç bozulmasın diye
 * mevcut statik veriler (src/data/*) fallback olarak kullanılır.
 */

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
    playStore: string;
    /** Opsiyonel — boşsa Hero ve Footer'daki ilgili ikon hiç gösterilmez. */
    youtube?: string;
    appStore?: string;
    tiktok?: string;
  };
}

export interface AboutContent {
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  paragraphs: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface SkillsContent {
  categories: SkillCategory[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  years: string;
  gpa: string;
  logo: string;
}

export interface ExperienceContent {
  education: EducationEntry[];
  work: ExperienceEntry[];
}

const defaultHero: HeroContent = {
  title: profile.name,
  subtitle: profile.title,
  description:
    "Merhaba, ben Eren KALAYCI. Aktif olarak Flutter ile mobil uygulama geliştirme üzerine yoğunlaşmaktayım. Hobi olarak ise Unity ile oyunlar geliştiriyor ve modern web siteleri tasarlıyorum. Eren KALAYCI olarak geliştirdiğim mobil uygulamaları, oyunları ve web sitelerini yayınlıyorum.",
  links: {
    github: profile.links.github,
    linkedin: profile.links.linkedin,
    email: profile.email,
    playStore: profile.links.playStore,
    youtube: profile.links.youtube ?? "",
    appStore: "",
    tiktok: "",
  },
};

const defaultAbout: AboutContent = {
  name: "Eren KALAYCI",
  role: "Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi",
  location: profile.location,
  avatarUrl:
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2xteHR5bGdleXIwejF5YzRlcXRvenc5dml6bXZnNHJ0ZnE3YXp1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1vlBgKjXEz1jTtsuiH/giphy.gif",
  paragraphs: [
    "Bilgisayar Mühendisliği mezunu, Flutter/Dart odaklı bir mobil uygulama geliştiricisiyim. Glass Padel'de 15.000'den fazla kayıtlı ve 800'den fazla günlük aktif kullanıcısı olan canlı bir platformun geliştirilmesinde aktif rol alıyorum; rezervasyon, turnuva, açık maç ve uygulama içi pazaryeri akışlarına katkı sağlıyor, RevenueCat ile abonelik/IAP entegrasyonlarında görev alıyorum.",
    "Firebase, REST API ve temiz mimari (MVVM, Riverpod/Bloc, Clean Architecture) ile gerçek ürün geliştirme deneyimine sahibim. Flutter'ın yanında Unity & C# ile oyunlar geliştiriyor, Laravel & PHP ile yönetim panelleri de yazıyorum. Bu sitenin kendisi de dahil olmak üzere Next.js, React ve modern web teknolojileriyle çeşitli projeler üretiyorum.",
    "Teknolojik gelişmeleri yakından takip ederek kendimi sürekli geliştirir, yeni yazılım ve framework'lere hızla adapte olurum. Analitik düşünme ve problem çözme becerilerimle teknik yetkinliklerimi birleştirerek, yazılım geliştirme süreçlerine etkin katkı sağlarım. Öğrenmeyi seven, yenilikleri takip eden ve gelişimi önemseyen bir profesyonel anlayışla hareket ederim.",
  ],
};

const defaultSkills: SkillsContent = { categories: staticSkills };

const defaultExperience: ExperienceContent = {
  education: staticEducation,
  work: staticExperience,
};

async function readDoc(sectionId: string): Promise<Record<string, unknown> | null> {
  if (!isFirebaseConfigured) return null;

  try {
    const snap = await getDoc(doc(db, "siteContent", sectionId));
    if (!snap.exists()) return null;
    return snap.data();
  } catch (error) {
    console.error(`siteContent/${sectionId} alınamadı:`, error);
    return null;
  }
}

export async function getHeroContent(): Promise<HeroContent> {
  const data = await readDoc("hero");
  if (!data) return defaultHero;
  const links = data.links as HeroContent["links"] | undefined;
  return {
    title: (data.title as string) || defaultHero.title,
    subtitle: (data.subtitle as string) || defaultHero.subtitle,
    description: (data.description as string) || defaultHero.description,
    links: {
      github: links?.github || defaultHero.links.github,
      linkedin: links?.linkedin || defaultHero.links.linkedin,
      email: links?.email || defaultHero.links.email,
      playStore: links?.playStore || defaultHero.links.playStore,
      // Opsiyonel linkler — admin boş bırakırsa (veya hiç doldurmadıysa) boş
      // string kalır, ilgili ikon Hero/Footer'da hiç render edilmez.
      youtube: links?.youtube ?? defaultHero.links.youtube,
      appStore: links?.appStore ?? defaultHero.links.appStore,
      tiktok: links?.tiktok ?? defaultHero.links.tiktok,
    },
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const data = await readDoc("about");
  if (!data) return defaultAbout;
  return {
    name: (data.name as string) || defaultAbout.name,
    role: (data.role as string) || defaultAbout.role,
    location: (data.location as string) || defaultAbout.location,
    avatarUrl: (data.avatarUrl as string) || defaultAbout.avatarUrl,
    paragraphs: Array.isArray(data.paragraphs) ? (data.paragraphs as string[]) : defaultAbout.paragraphs,
  };
}

/**
 * Not: Doküman Firestore'da hiç yoksa (admin panelden hiç kaydedilmemişse)
 * statik varsayılanlara düşülür. Ama doküman VARSA ve admin bilerek tüm
 * maddeleri silmişse (dizi boş), bu artık gerçek bir tercih — eski statik
 * veriye geri dönmeyip ilgili bölüm boş/gizli gösterilir.
 */
export async function getSkillsContent(): Promise<SkillsContent> {
  const data = await readDoc("skills");
  if (!data || !Array.isArray(data.categories)) return defaultSkills;
  return { categories: data.categories as SkillCategory[] };
}

export async function getExperienceContent(): Promise<ExperienceContent> {
  const data = await readDoc("experience");
  if (!data) return defaultExperience;
  return {
    education: Array.isArray(data.education) ? (data.education as EducationEntry[]) : defaultExperience.education,
    work: Array.isArray(data.work) ? (data.work as ExperienceEntry[]) : defaultExperience.work,
  };
}
