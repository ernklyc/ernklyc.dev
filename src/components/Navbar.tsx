"use client";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useSmoothScrollNav } from "@/hooks/useSmoothScrollNav";
import LocaleSwitch from "@/components/ui/LocaleSwitch";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { t, isTransitioning, isNavigating } = useLocale();
  const navActive = isTransitioning || isNavigating;

  // Admin paneli kendi üst çubuğunu (email + çıkış yap) kullanıyor —
  // portfolyo navbar'ıyla üst üste binmesin diye burada hiç render etmiyoruz.
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const { scrolled, showNavbar } = useScrollNavbar();
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu, menuButtonRef, firstLinkRef } =
    useMobileMenu();
  const { menuItems, handleNavClick } = useSmoothScrollNav(closeMenu);

  if (isAdminRoute) return null;

  return (
    <motion.nav
      data-site-navbar
      initial={{ y: 0 }}
      animate={{
        y: showNavbar ? 0 : -100,
        opacity: navActive ? 0.92 : 1,
        filter: navActive ? "blur(1.2px) saturate(0.97)" : "blur(0px) saturate(1)",
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/70 backdrop-blur-md" : ""
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 max-w-6xl flex justify-center items-center">
        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-5 xl:space-x-8 justify-center items-center w-full">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              download={item.isDownload ? true : undefined}
              onClick={item.isDownload ? undefined : (e) => handleNavClick(e, item.href)}
              className="py-2 px-1 font-medium text-sm tracking-wide text-white hover:text-[#A9B7C4] transition-colors focus:outline-none"
              aria-label={item.isDownload ? t("nav.cvDownload") : t(item.labelKey)}
            >
              {t(item.labelKey)}
            </a>
          ))}
          <LocaleSwitch size="sm" className="ml-4" />
        </div>
        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-[#1A1F26] transition-colors focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <FiMenu className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 z-50 bg-[#0F1923]/65 backdrop-blur-xl"
          >
            <div className="container mx-auto py-3 flex flex-col space-y-1 px-3 sm:px-6 items-center">
              {menuItems.map((item, index) => (
                <a
                  key={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  download={item.isDownload ? true : undefined}
                  className="py-2 px-3 rounded-lg flex items-center text-sm w-full text-center justify-center text-white hover:bg-[#1A1F26] transition-colors focus:outline-none"
                  onClick={item.isDownload ? closeMenu : (e) => handleNavClick(e, item.href)}
                  aria-label={item.isDownload ? t("nav.cvDownload") : t(item.labelKey)}
                >
                  {t(item.labelKey)}
                </a>
              ))}
              <div className="relative flex items-center gap-1 mt-2 pt-2 w-full justify-center">
                <LocaleSwitch size="md" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
