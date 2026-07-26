import { getHeroContent } from "@/lib/siteContent";
import HeroClient from "@/components/HeroClient";

/**
 * Hero içeriği (isim, unvan, açıklama, sosyal linkler) admin panelden
 * (/admin/content/hero) düzenlenebilir. Sunucu tarafında Firestore'dan
 * okunup client component'e prop olarak geçiliyor — animasyonlar
 * (framer-motion, SplitText, StickerPeel) client tarafında kalıyor.
 */
export default async function Hero() {
  const content = await getHeroContent();
  return <HeroClient content={content} />;
}
