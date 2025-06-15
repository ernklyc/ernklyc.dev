"use client";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

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
    }
  };
  const menuItems = [
    { label: "Ana Sayfa", href: "#home" },
    { label: "Hakkımda", href: "#about" },
    { label: "Yetenekler", href: "#skills" },
    { label: "Deneyim", href: "#experience" },
    { label: "Projeler", href: "#projects" },
    { label: "İletişim", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.35 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F1923]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 max-w-6xl flex justify-center items-center">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 justify-center w-full">
          {menuItems.map((item) => (            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative py-2 px-1 font-medium text-xs md:text-sm tracking-wide text-white hover:text-gray-300 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 rounded-lg hover:bg-[#1F2731] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4655]"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            className="md:hidden bg-[#0F1923]/95 backdrop-blur-md absolute top-full left-0 right-0 z-50"
          >
            <div className="container mx-auto py-3 flex flex-col space-y-1 px-3 sm:px-6 items-center">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 px-3 rounded-lg flex items-center text-sm w-full text-center justify-center text-white hover:bg-[#1F2731]/30 transition-colors"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}