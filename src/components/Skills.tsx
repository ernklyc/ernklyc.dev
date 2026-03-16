"use client";
import { motion } from "framer-motion";
import { FiCode, FiPenTool, FiGlobe, FiUsers, FiCpu, FiDatabase } from "react-icons/fi";
import { skills } from "@/data/skills";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

export default function Skills() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<string>("Programlama & Geliştirme");

  const iconMap: Record<string, React.ReactNode> = {
    "Programlama & Geliştirme": <FiCode className="w-5 h-5" />,
    "Tasarım": <FiPenTool className="w-5 h-5" />,
    "Diller": <FiGlobe className="w-5 h-5" />,
    "Kişisel Beceriler": <FiUsers className="w-5 h-5" />,
    "Backend & Veritabanı": <FiDatabase className="w-5 h-5" />,
    "Diğer Teknolojiler": <FiCpu className="w-5 h-5" />
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Aktif kategoriye göre becerileri filtrele
  const activeSkills = skills.find(skill => skill.category === activeTab);

  return (
    <section id="skills" className="py-16 bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.div variants={itemVariants} className="inline-block relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              {t("skills.title")}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent mx-auto"
            />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-gray-300 max-w-2xl mx-auto mt-4 text-base"
          >
            {t("skills.subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/60 to-[#0F1923]/90 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all duration-500"
        >
          <div className="flex flex-wrap justify-center gap-2 p-4 sm:p-5 border-b border-[#2A3441]/60 bg-[#0F1923]/50">
            {skills.map((skill, index) => (
              <motion.button
                key={skill.category}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(skill.category)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border
                  ${activeTab === skill.category
                    ? "bg-[#FF4655] text-white border-[#FF4655]"
                    : "bg-[#1F2731]/60 text-gray-300 border-white/10 hover:border-white/20 hover:text-white"}`}
              >
                <span className="hidden sm:inline-block">{iconMap[skill.category]}</span>
                <span className="whitespace-nowrap">{skill.category}</span>
              </motion.button>
            ))}
          </div>

          {activeSkills && (
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="p-6 sm:p-8 min-h-[10rem] flex items-center justify-center"
            >
              <div className="flex flex-wrap justify-center gap-2.5">
                {activeSkills.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={fadeIn}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center rounded-xl bg-[#1F2731]/60 border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-white/20 hover:bg-[#1F2731]/80 transition-all duration-300"
                  >
                    <span className="w-2 h-2 bg-[#FF4655] rounded-full mr-2.5 flex-shrink-0" />
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
} 