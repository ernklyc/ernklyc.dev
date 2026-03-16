"use client";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { profile } from "@/data/profile";
import { useLocale } from "@/contexts/LocaleContext";

export default function Navbar() {
  const { locale, setLocale, t, isTransitioning, isNavigating } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const navActive = isTransitioning || isNavigating;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      firstMenuLinkRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Navbar arka planı
      setScrolled(currentScrollY > 50);

      // Navbar gizle/göster
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNavbar(false); // aşağı kaydırınca gizle
      } else {
        setShowNavbar(true); // yukarı kaydırınca göster
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);

    if (pathname !== "/") {
      setIsMenuOpen(false);
      router.push(`/${href}`);
      return;
    }

    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Viewport yüksekliğini al
      const viewportHeight = window.innerHeight;
      const elementHeight = targetElement.offsetHeight;
      
      // Eğer element küçükse tam merkeze konumlandır, değilse üstten başlat
      let offsetPosition;
      if (elementHeight < viewportHeight) {
        // Element küçükse merkeze al
        const elementPosition = targetElement.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - (viewportHeight - elementHeight) / 2;
      } else {
        // Element büyükse üstten başlat (navbar yüksekliği kadar boşluk bırak)
        offsetPosition = targetElement.offsetTop - 80;
      }
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Mobile menüyü kapat
      setIsMenuOpen(false);
      return;
    }

    router.push(`/${href}`);
    setIsMenuOpen(false);
  };
  const menuItems = [
    { labelKey: "nav.home", href: "#home" },
    { labelKey: "nav.about", href: "#about" },
    { labelKey: "nav.skills", href: "#skills" },
    { labelKey: "nav.experience", href: "#experience" },
    { labelKey: "nav.projects", href: "#projects" },
    { labelKey: "nav.contact", href: "#contact" },
    ...(profile.links.cv ? [{ labelKey: "nav.cvDownload", href: profile.links.cv, isDownload: true as const }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: showNavbar ? 0 : -100,
        opacity: navActive ? 0.92 : 1,
        filter: navActive ? "blur(1.2px) saturate(0.97)" : "blur(0px) saturate(1)",
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(15,25,35,0.6)] backdrop-blur-[14px] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 max-w-6xl flex justify-center items-center">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 justify-center items-center w-full">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              download={"isDownload" in item && item.isDownload ? true : undefined}
              onClick={"isDownload" in item && item.isDownload ? undefined : (e) => handleNavClick(e, item.href)}
              className="py-2 px-1 font-medium text-xs md:text-sm tracking-wide text-white hover:text-[#FF4655] transition-colors focus:outline-none"
              aria-label={"isDownload" in item && item.isDownload ? t("nav.cvDownload") : `${t(item.labelKey)}`}
            >
              {t(item.labelKey)}
            </a>
          ))}
          <div className="relative flex items-center ml-4 rounded-lg p-0.5 overflow-hidden bg-white/5">
            <motion.div
              initial={false}
              animate={{ x: locale === "tr" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
              className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-[#FF4655]"
            />
            <button
              type="button"
              onClick={() => setLocale("tr")}
              disabled={isTransitioning}
              className={`relative z-10 w-9 px-2 py-1 text-xs font-medium rounded-md transition-colors duration-300 ${locale === "tr" ? "text-white" : "text-gray-400 hover:text-white"} ${isTransitioning ? "opacity-80" : "opacity-100"}`}
              aria-label="Türkçe"
            >
              TR
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              disabled={isTransitioning}
              className={`relative z-10 w-9 px-2 py-1 text-xs font-medium rounded-md transition-colors duration-300 ${locale === "en" ? "text-white" : "text-gray-400 hover:text-white"} ${isTransitioning ? "opacity-80" : "opacity-100"}`}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          className="md:hidden text-white p-2 rounded-lg hover:bg-[#1F2731] transition-colors focus:outline-none"
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
            className="md:hidden absolute top-full left-0 right-0 z-50 bg-[rgba(15,25,35,0.65)] backdrop-blur-[14px]"
          >
            <div className="container mx-auto py-3 flex flex-col space-y-1 px-3 sm:px-6 items-center">
              {menuItems.map((item, index) => (
                <a
                  key={item.href}
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={item.href}
                  download={"isDownload" in item && item.isDownload ? true : undefined}
                  className="py-2 px-3 rounded-lg flex items-center text-sm w-full text-center justify-center text-white hover:text-[#FF4655] hover:bg-[#1F2731]/30 transition-colors focus:outline-none"
                  onClick={"isDownload" in item && item.isDownload ? () => setIsMenuOpen(false) : (e) => handleNavClick(e, item.href)}
                  aria-label={"isDownload" in item && item.isDownload ? t("nav.cvDownload") : t(item.labelKey)}
                >
                  {t(item.labelKey)}
                </a>
              ))}
              <div className="relative flex items-center gap-1 mt-2 pt-2 w-full justify-center">
                <div className="relative flex items-center rounded-lg p-0.5 overflow-hidden bg-white/5">
                  <motion.div
                    initial={false}
                    animate={{ x: locale === "tr" ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
                    className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-[#FF4655]"
                  />
                <button
                  type="button"
                  onClick={() => setLocale("tr")}
                  disabled={isTransitioning}
                  className={`relative z-10 w-12 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ${locale === "tr" ? "text-white" : "text-gray-400 hover:text-white"} ${isTransitioning ? "opacity-80" : "opacity-100"}`}
                  aria-label="Türkçe"
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  disabled={isTransitioning}
                  className={`relative z-10 w-12 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 ${locale === "en" ? "text-white" : "text-gray-400 hover:text-white"} ${isTransitioning ? "opacity-80" : "opacity-100"}`}
                  aria-label="English"
                >
                  EN
                </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}