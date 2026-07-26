"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import type { HeroContent } from "@/lib/siteContent";
import SplitText from "./SplitText";
import SectionBackground from "@/components/ui/SectionBackground";
import SocialLinks from "@/components/ui/SocialLinks";

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

interface HeroClientProps {
  content: HeroContent;
}

export default function HeroClient({ content }: HeroClientProps) {
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
              text={content.title}
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
              {content.subtitle}
              <span className="text-[#A9B7C4]">/&gt;</span>
            </motion.h2>
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mb-8 md:mb-12 text-gray-300 text-center text-sm md:text-base lg:text-lg leading-relaxed px-4 md:px-0"
          >
            {content.description}
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 px-4 md:px-0"
          >
            <SocialLinks
              links={content.links}
              whileHover={{ scale: 1.05, y: -2 }}
              iconClassName="w-6 h-6 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300"
            />
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
