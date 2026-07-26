import { getAboutContent } from "@/lib/siteContent";
import AboutClient from "@/components/AboutClient";

/** Hakkımda içeriği admin panelden (/admin/content/about) düzenlenebilir. */
export default async function About() {
  const content = await getAboutContent();
  return <AboutClient content={content} />;
}
