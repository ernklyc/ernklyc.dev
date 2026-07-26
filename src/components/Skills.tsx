"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiCode, FiPenTool, FiGlobe, FiUsers, FiCpu, FiDatabase } from "react-icons/fi";
import { skills } from "@/data/skills";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Programlama & Geliştirme": <FiCode className="w-5 h-5" />,
  "Tasarım": <FiPenTool className="w-5 h-5" />,
  "Diller": <FiGlobe className="w-5 h-5" />,
  "Kişisel Beceriler": <FiUsers className="w-5 h-5" />,
  "Backend & Veritabanı": <FiDatabase className="w-5 h-5" />,
  "Diğer Teknolojiler": <FiCpu className="w-5 h-5" />,
};

const fadeIn = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

export default function Skills() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<string>(skills[0]?.category ?? "");
  const activeSkills = skills.find((skill) => skill.category === activeTab);

  return (
    <section id="skills" className="py-24 text-white relative overflow-hidden scroll-mt-20">
      <SectionBackground />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <SectionHeading title={t("skills.title")} subtitle={t("skills.subtitle")} />

        <GlassCard className="overflow-hidden">
          <div className="flex flex-wrap justify-center gap-2 p-4 sm:p-5 border-b border-white/10 bg-white/[0.03]">
            {skills.map((skill, index) => {
              const isActive = activeTab === skill.category;
              return (
                <motion.button
                  key={skill.category}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(skill.category)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border",
                    isActive
                      ? "bg-[#12161B] text-white border-white/20 shadow-md shadow-black/50"
                      : "bg-white/[0.06] backdrop-blur-sm text-gray-300 border-white/10 hover:bg-white/[0.1] hover:border-white/20 hover:text-white"
                  )}
                >
                  <span className="hidden sm:inline-block">{CATEGORY_ICONS[skill.category]}</span>
                  <span className="whitespace-nowrap">{skill.category}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeSkills && (
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                variants={staggerContainer}
                className="p-6 sm:p-8 min-h-[10rem] flex items-center justify-center"
              >
                <div className="flex flex-wrap justify-center gap-2.5">
                  {activeSkills.items.map((item) => (
                    <Chip
                      key={item}
                      interactive
                      dotColor="#A9B7C4"
                      variants={fadeIn}
                      whileHover={{ scale: 1.06, y: -2 }}
                      className="px-4 py-2.5 text-sm hover:text-white"
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}
