"use client";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { profile } from "@/data/profile";
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript, SiFramer } from "react-icons/si";
import { useLocale } from "@/contexts/LocaleContext";
import TransitionLink from "@/components/TransitionLink";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionBackground from "@/components/ui/SectionBackground";
import IconButton from "@/components/ui/IconButton";
import Chip from "@/components/ui/Chip";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const TECHNOLOGIES = [
  { icon: SiNextdotjs, name: "Next.js", color: "text-white" },
  { icon: SiReact, name: "React", color: "text-gray-300" },
  { icon: SiTailwindcss, name: "Tailwind", color: "text-gray-300" },
  { icon: SiTypescript, name: "TypeScript", color: "text-gray-300" },
  { icon: SiFramer, name: "Framer", color: "text-gray-300" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "HP Character Wiki Privacy" },
  { href: "/movie-face-ai-privacy", label: "Movie Face AI Privacy" },
  { href: "/link-manager-privacy", label: "Link Manager Privacy" },
  { href: "/link-manager-terms", label: "Link Manager Terms" },
  { href: "/artifusion-privacy", label: "Artifusion Privacy" },
  { href: "/artifusion-terms", label: "Artifusion Terms" },
  { href: "/artifusion-support", label: "Artifusion Support" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  const scrollToTop = useScrollToTop();

  return (
    <footer className="text-white border-t border-white/10 relative overflow-hidden">
      <SectionBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl py-10 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <SectionHeading title={t("footer.title")} className="mb-3" />
            <p className="text-gray-300 max-w-md text-center text-sm leading-relaxed">
              {t("footer.subtitle")}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex space-x-4 mb-8">
            <IconButton href={profile.links.github} aria-label="GitHub">
              <FiGithub className="w-5 h-5 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>
            <IconButton href={profile.links.linkedin} aria-label="LinkedIn">
              <FiLinkedin className="w-5 h-5 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>
            <IconButton href={`mailto:${profile.email}`} external={false} aria-label="Email">
              <FiMail className="w-5 h-5 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>
            <IconButton
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              aria-label="Google Play Store"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 512 512"
                className="text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300"
                fill="currentColor"
              >
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </IconButton>
          </motion.div>

          {/* Technologies - Compact */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-gray-400 mb-3 text-xs font-medium uppercase tracking-wide">Site Teknolojileri</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TECHNOLOGIES.map((tech, index) => (
                <Chip
                  key={tech.name}
                  interactive
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="py-1.5 px-2.5"
                >
                  <tech.icon className={`${tech.color} w-3.5 h-3.5`} />
                  <span className="text-gray-300 text-xs font-medium">{tech.name}</span>
                </Chip>
              ))}
            </div>
          </motion.div>

          {/* Scroll to Top */}
          <motion.button
            variants={itemVariants}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#12161B] hover:bg-[#1A1F26] border border-white/10 hover:border-white/20 text-white p-3 rounded-xl transition-all duration-300 mb-6"
            aria-label={t("footer.backToTop")}
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8"
        >
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-gray-400">
            <p className="text-center sm:text-left">&copy; {year} Eren KALAYCI. {t("footer.rights")}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {LEGAL_LINKS.map((link, index) => (
                <span key={link.href} className="flex items-center gap-x-3">
                  <TransitionLink href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </TransitionLink>
                  {index !== LEGAL_LINKS.length - 1 && (
                    <span className="text-white/20" aria-hidden="true">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
