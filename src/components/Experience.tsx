import { getExperienceContent } from "@/lib/siteContent";
import ExperienceClient from "@/components/ExperienceClient";

/** Eğitim & İş Deneyimi içeriği admin panelden (/admin/content/experience) düzenlenebilir. */
export default async function Experience() {
  const content = await getExperienceContent();
  return <ExperienceClient content={content} />;
}
