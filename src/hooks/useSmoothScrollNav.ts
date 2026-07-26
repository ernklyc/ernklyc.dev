"use client";

import { usePathname, useRouter } from "next/navigation";

export interface NavMenuItem {
  labelKey: string;
  href: string;
  isDownload?: true;
  /** "#..." anchor'lar gibi sayfa içi kaydırma değil, tam sayfa yönlendirmesi (örn. /blog) */
  isRoute?: true;
}

export const navMenuItems: NavMenuItem[] = [
  { labelKey: "nav.home", href: "#home" },
  { labelKey: "nav.about", href: "#about" },
  { labelKey: "nav.skills", href: "#skills" },
  { labelKey: "nav.experience", href: "#experience" },
  { labelKey: "nav.projects", href: "#projects" },
  { labelKey: "nav.blog", href: "#blog" },
  { labelKey: "nav.contact", href: "#contact" },
];

/**
 * Navbar linklerine tıklandığında sayfa içi yumuşak kaydırmayı ve
 * gerekirse ana sayfaya yönlendirmeyi yöneten ViewModel.
 */
export function useSmoothScrollNav(onNavigate?: () => void) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (!href.startsWith("#")) {
      onNavigate?.();
      router.push(href);
      return;
    }

    const targetId = href.substring(1);

    if (pathname !== "/") {
      onNavigate?.();
      router.push(`/${href}`);
      return;
    }

    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const viewportHeight = window.innerHeight;
      const elementHeight = targetElement.offsetHeight;

      let offsetPosition: number;
      if (elementHeight < viewportHeight) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        offsetPosition =
          elementPosition + window.pageYOffset - (viewportHeight - elementHeight) / 2;
      } else {
        offsetPosition = targetElement.offsetTop - 80;
      }

      if (window.__lenis) {
        window.__lenis.scrollTo(Math.max(0, offsetPosition));
      } else {
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
      onNavigate?.();
      return;
    }

    router.push(`/${href}`);
    onNavigate?.();
  };

  return { menuItems: navMenuItems, handleNavClick };
}
