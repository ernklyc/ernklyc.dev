"use client";
import { motion } from "framer-motion";
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  return (
    <section id="experience" className="py-16 bg-gradient-to-br from-[#151F2B] via-[#0F1923] to-[#0A0F1C] text-white relative overflow-hidden scroll-mt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              DENEYİM & EĞİTİM
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto text-base mt-4"
          >
            Profesyonel yolculuğum ve akademik geçmişim
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Deneyim Bölümü */}
          <motion.div variants={itemVariants} className="group">
            <div className="bg-gradient-to-br from-[#1F2731]/60 to-[#151F2B]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/40 transition-all duration-500 h-full group-hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] mr-4 group-hover:scale-110 transition-transform duration-300">
                  <FiBriefcase className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Profesyonel Deneyim</h3>
                  <p className="text-gray-400 text-sm">Kariyer Yolculuğum</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-[#FF4655]/30 pb-6 last:pb-0 group/item"
                  >
                    <motion.div 
                      className="absolute w-3 h-3 bg-[#FF4655] rounded-full -left-[7px] top-1 group-hover/item:scale-125 transition-transform duration-300"
                      whileHover={{ scale: 1.5 }}
                    />
                    
                    <h4 className="text-base font-semibold text-white mb-1 group-hover/item:text-[#FF4655] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-[#FF4655] font-medium mb-2 text-sm">{item.company}</p>
                    
                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {item.period} · {item.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        {item.location} · {item.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Eğitim Bölümü */}
          <motion.div variants={itemVariants} className="group">
            <div className="bg-gradient-to-br from-[#1F2731]/60 to-[#151F2B]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/40 transition-all duration-500 h-full group-hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] mr-4 group-hover:scale-110 transition-transform duration-300">
                  <FaGraduationCap className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Akademik Geçmiş</h3>
                  <p className="text-gray-400 text-sm">Eğitim Hayatım</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {education.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-[#FF4655]/30 pb-6 last:pb-0 group/item"
                  >
                    <motion.div 
                      className="absolute w-3 h-3 bg-[#FF4655] rounded-full -left-[7px] top-1 group-hover/item:scale-125 transition-transform duration-300"
                      whileHover={{ scale: 1.5 }}
                    />
                    
                    <h4 className="text-base font-semibold text-white mb-1 group-hover/item:text-[#FF4655] transition-colors duration-300">
                      {item.institution}
                    </h4>
                    <p className="text-[#FF4655] font-medium mb-2 text-sm">{item.degree}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FiCalendar className="w-3 h-3" />
                      {item.years}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 