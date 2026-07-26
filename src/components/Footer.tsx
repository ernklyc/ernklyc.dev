import { getHeroContent } from "@/lib/siteContent";
import FooterClient from "@/components/FooterClient";

/**
 * Footer'daki sosyal medya ikonları Hero ile aynı kaynaktan (admin panelde
 * /admin/content/hero altında düzenlenen linkler) besleniyor — tek yerden
 * yönetim, iki yerde ayrı ayrı link girmeye gerek yok.
 */
export default async function Footer() {
  const { links } = await getHeroContent();
  return <FooterClient links={links} />;
}
