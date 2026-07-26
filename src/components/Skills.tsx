import { getSkillsContent } from "@/lib/siteContent";
import SkillsClient from "@/components/SkillsClient";

/**
 * Yeteneklerim içeriği admin panelden (/admin/content/skills) düzenlenebilir.
 * Admin tüm kategorileri silmişse bölüm hiç render edilmez (boş bir kart
 * yerine site akışında hiç görünmemesi daha temiz).
 */
export default async function Skills() {
  const content = await getSkillsContent();
  if (content.categories.length === 0) return null;
  return <SkillsClient content={content} />;
}
