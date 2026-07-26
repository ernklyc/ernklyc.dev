"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { profile } from "@/data/profile";
import { useLocale } from "@/contexts/LocaleContext";
import SplitText from "./SplitText";
import SectionBackground from "@/components/ui/SectionBackground";
import IconButton from "@/components/ui/IconButton";

const StickerPeel = dynamic(() => import("./StickerPeel"), {
  ssr: false,
  loading: () => <div className="w-44 h-44 rounded-full bg-[#1F2731]/40 animate-pulse" />,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function Hero() {
  const { t } = useLocale();
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden text-white pt-24 pb-12">
      <SectionBackground />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center pb-16"
        >
          {/* Profile Sticker */}
          <motion.div
            variants={itemVariants}
            className="mb-6 relative w-44 h-44"
            role="img"
            aria-label="Eren KALAYCI - Bilgisayar Mühendisi ve Mobil Uygulama Geliştiricisi"
          >
            <StickerPeel
              imageSrc="/profil_resmim.jpg"
              width={176}
              rotate={0}
              peelBackHoverPct={30}
              peelBackActivePct={40}
              peelDirection={225}
              initialPosition="center"
            />
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="mb-6 relative inline-block">
            <SplitText
              text={t("hero.title")}
              tag="h1"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              splitType="chars"
              delay={30}
              duration={0.6}
              ease="power3.out"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>

          {/* Subtitle with Typing Effect */}
          <motion.div variants={itemVariants} className="mb-4 h-6 flex items-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="text-lg md:text-xl font-medium text-gray-300"
            >
              <span className="text-[#A9B7C4]">&lt;</span>
              {t("hero.subtitle")}
              <span className="text-[#A9B7C4]">/&gt;</span>
            </motion.h2>
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mb-8 md:mb-12 text-gray-300 text-center text-sm md:text-base lg:text-lg leading-relaxed px-4 md:px-0"
          >
            {t("hero.description")}
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 px-4 md:px-0"
          >
            <IconButton href={profile.links.github} whileHover={{ scale: 1.05, y: -2 }} aria-label="GitHub">
              <FiGithub className="w-6 h-6 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>

            <IconButton href={profile.links.linkedin} whileHover={{ scale: 1.05, y: -2 }} aria-label="LinkedIn">
              <FiLinkedin className="w-6 h-6 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>

            <IconButton
              href={`mailto:${profile.email}`}
              external={false}
              whileHover={{ scale: 1.05, y: -2 }}
              aria-label="Email"
            >
              <FiMail className="w-6 h-6 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300" />
            </IconButton>

            <IconButton
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              whileHover={{ scale: 1.05, y: -2 }}
              aria-label="Google Play Store"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
                className="text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300"
                fill="currentColor"
              >
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </IconButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        onClick={() => scrollToSection("about")}
      >
        <div className="relative group flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-white/30 group-hover:border-[#A9B7C4]/70 rounded-full flex justify-center pt-2 transition-colors duration-300">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
              className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#A9B7C4] transition-colors duration-300"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-xs text-gray-400 mt-2 group-hover:text-[#A9B7C4] transition-colors duration-300 text-center"
          >
            {t("hero.discover")}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
