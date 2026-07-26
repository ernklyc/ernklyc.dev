import { getSkillsContent } from "@/lib/siteContent";
import SkillsClient from "@/components/SkillsClient";

/** Yeteneklerim içeriği admin panelden (/admin/content/skills) düzenlenebilir. */
export default async function Skills() {
  const content = await getSkillsContent();
  return <SkillsClient content={content} />;
}
