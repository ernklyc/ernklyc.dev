"use client";
import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import type { AboutContent } from "@/lib/siteContent";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

interface AboutClientProps {
  content: AboutContent;
}

export default function AboutClient({ content }: AboutClientProps) {
  const { t } = useLocale();

  return (
    <section id="about" className="py-24 text-white relative overflow-hidden scroll-mt-20">
      <SectionBackground />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <SectionHeading title={t("about.title")} />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 items-stretch mb-8">
          {/* Sol Taraf - Penguen Karakteri ve Bilgiler */}
          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard className="p-6 group h-full">
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 h-full">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-2xl overflow-hidden border border-white/10">
                    <Image
                      src={content.avatarUrl}
                      alt="Eren KALAYCI - Bilgisayar Mühendisi ve Mobil Uygulama Geliştiricisi Penguen Animasyonu"
                      width={256}
                      height={256}
                      loading="lazy"
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{content.name}</h3>
                  <p className="text-[#A9B7C4] text-sm md:text-base font-semibold px-2">{content.role}</p>
                </div>

                <Chip dotColor="#A9B7C4" className="px-4 py-2.5 text-sm">
                  <FiGlobe className="text-[#A9B7C4] w-4 h-4" />
                  <span className="text-white text-sm font-medium">{content.location}</span>
                </Chip>
              </div>
            </GlassCard>
          </motion.div>

          {/* Sağ Taraf - Detaylı Açıklama */}
          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <GlassCard className="p-6 group h-full">
              <div className="relative z-10 h-full flex flex-col">
                <motion.h3 whileHover={{ x: 5 }} className="text-xl font-semibold mb-6 text-white flex items-center">
                  <span className="text-[#A9B7C4] mr-2 text-2xl">&lt;</span>
                  Merhaba, Ben {content.name}
                  <span className="text-[#A9B7C4] ml-2 text-2xl">/&gt;</span>
                </motion.h3>

                <div className="space-y-4 text-gray-300 leading-relaxed flex-grow">
                  {content.paragraphs.map((paragraph) => (
                    <motion.div
                      key={paragraph.slice(0, 24)}
                      whileHover={{ x: 5 }}
                      className="relative pl-4 border-l-2 border-white/20 hover:border-white/40 transition-colors duration-300"
                    >
                      <div className="absolute -left-1.5 top-1.5 w-2 h-2 bg-[#A9B7C4] rounded-full"></div>
                      <p className="text-[0.95rem]">{paragraph}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
