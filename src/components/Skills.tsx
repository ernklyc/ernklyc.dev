"use client";
import { motion } from "framer-motion";
import { FiCode, FiPenTool, FiGlobe, FiUsers, FiCpu, FiDatabase, FiTrendingUp } from "react-icons/fi";
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
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
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
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              YETENEKLERİM
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
            Sürekli gelişen teknoloji dünyasında edindiğim uzmanlık alanlarım
          </motion.p>
        </motion.div>
        
        {/* Kategori Seçici */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {skills.map((skill, index) => (
            <motion.button
              key={skill.category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(skill.category)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border backdrop-blur-sm
                ${activeTab === skill.category 
                  ? 'bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white border-[#FF4655]/50' 
                  : 'bg-[#1F2731]/60 text-gray-300 hover:bg-[#FF4655]/10 border-[#2A3441]/50 hover:border-[#FF4655]/30'}`}
            >
              <span className="hidden sm:inline-block">
                {iconMap[skill.category]}
              </span>
              <span className="whitespace-nowrap">{skill.category}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Beceri Kartları */}
        {activeSkills && (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="bg-gradient-to-br from-[#1F2731]/60 to-[#151F2B]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/40 transition-all duration-500"
          >
            <motion.div 
              variants={fadeInUp}
              className="flex items-center mb-6"
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] mr-4 flex-shrink-0">
                {iconMap[activeTab]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {activeTab}
                </h3>
                <p className="text-gray-400 text-sm">Uzmanlık Alanım</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeSkills.items.map((item) => (
                <motion.div
                  key={item}
                  variants={fadeInUp}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#1F2731]/80 rounded-xl p-3 border border-[#FF4655]/10 hover:border-[#FF4655]/40 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center h-full">
                    <motion.span 
                      className="w-2 h-2 bg-[#FF4655] rounded-full mr-3 flex-shrink-0"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-medium">
                      {item}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={fadeInUp}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-400 italic flex items-center justify-center gap-2">
                <FiTrendingUp className="w-3 h-3" />
                Bu kategoride sürekli kendimi geliştirmeye devam ediyorum
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 