"use client";
import { motion } from "framer-motion";
import { FiCode, FiPenTool, FiGlobe, FiUsers, FiCpu, FiDatabase } from "react-icons/fi";
import { skills } from "@/data/skills";
import React, { useState } from "react";

export default function Skills() {
  const [activeTab, setActiveTab] = useState<string>("Programlama & Geliştirme");

  const iconMap: Record<string, React.ReactNode> = {
    "Programlama & Geliştirme": <FiCode className="w-5 h-5" />,
    "Tasarım": <FiPenTool className="w-5 h-5" />,
    "Diller": <FiGlobe className="w-5 h-5" />,
    "Kişisel Beceriler": <FiUsers className="w-5 h-5" />,
    "Backend & Veritabanı": <FiDatabase className="w-5 h-5" />,
    "Diğer Teknolojiler": <FiCpu className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Aktif kategoriye göre becerileri filtrele
  const activeSkills = skills.find(skill => skill.category === activeTab);

  return (
    <section id="skills" className="py-16 bg-gradient-to-br from-[#151F2B] via-[#0F1923] to-[#0F1923] text-white relative overflow-hidden scroll-mt-28">
      {/* Dekoratif elementler */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-block">
            <h2 className="text-xl md:text-3xl font-bold mb-3 text-white relative z-10">
              YETENEKLERİM
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            Profesyonel kariyerim boyunca edindiğim teknik ve kişisel becerilerim
          </p>
        </motion.div>
        
        {/* Kategori Seçici */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10"
        >
          {skills.map((skill) => (
            <button
              key={skill.category}
              onClick={() => setActiveTab(skill.category)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${activeTab === skill.category 
                  ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20' 
                  : 'bg-[#1F2731] text-gray-300 hover:bg-[#1F2731]/80'}`}
            >
              <span className="hidden md:inline-block">
                {iconMap[skill.category]}
              </span>
              {skill.category}
            </button>
          ))}
        </motion.div>
        
        {/* Beceri Kartları */}
        {activeSkills && (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="bg-[#1F2731]/50 backdrop-blur-sm rounded-xl p-6 border border-[#FF4655]/20"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-[#1F2731] text-[#FF4655] mr-4 flex-shrink-0">
                {iconMap[activeTab]}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white">
                {activeTab}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeSkills.items.map((item) => (
                <motion.div
                  key={item}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-[#1F2731] rounded-lg p-4 border border-[#FF4655]/10 hover:border-[#FF4655]/40 transition-all duration-300 group"
                >
                  <div className="flex items-center h-full">
                    <span className="w-2 h-2 bg-[#FF4655] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm md:text-base">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 italic">
                * Bu kategoride sürekli kendimi geliştirmeye devam ediyorum
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 