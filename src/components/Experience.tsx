import { getExperienceContent } from "@/lib/siteContent";
import ExperienceClient from "@/components/ExperienceClient";

/**
 * Eğitim & İş Deneyimi içeriği admin panelden (/admin/content/experience)
 * düzenlenebilir. Admin hem eğitim hem iş deneyimini tamamen silmişse bölüm
 * hiç render edilmez; sadece biri boşsa diğeri normal şekilde gösterilir.
 */
export default async function Experience() {
  const content = await getExperienceContent();
  if (content.education.length === 0 && content.work.length === 0) return null;
  return <ExperienceClient content={content} />;
}
