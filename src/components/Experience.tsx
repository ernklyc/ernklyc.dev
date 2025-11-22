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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
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

        {/* Deneyim ve Eğitim - Yatay Timeline */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Horizontal timeline line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF4655]/30 to-transparent hidden md:block" />
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-6 items-stretch">
            {/* Deneyim Kartları */}
            {experience.map((item, index) => (
              <motion.div
                key={`exp-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 group/item"
              >
                <div className="bg-gradient-to-br from-[#1F2731]/80 to-[#151F2B]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,70,85,0.2)] relative h-full">
                  {/* Top dot with icon */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] rounded-full border-4 border-[#151F2B] group-hover/item:scale-110 transition-transform duration-300 flex items-center justify-center">
                    <FiBriefcase className="text-white w-4 h-4" />
                  </div>
                  
                  <div className="text-center pt-4">
                    <h4 className="text-base font-bold text-white mb-2 group-hover/item:text-[#FF4655] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-[#FF4655] font-semibold mb-3 text-sm">{item.company}</p>
                    
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center justify-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{item.period}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Eğitim Kartları */}
            {education.map((item, index) => (
              <motion.div
                key={`edu-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (experience.length + index) * 0.1 }}
                className="flex-1 group/item"
              >
                <div className="bg-gradient-to-br from-[#1F2731]/80 to-[#151F2B]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,70,85,0.2)] relative h-full">
                  {/* Top dot with icon */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] rounded-full border-4 border-[#151F2B] group-hover/item:scale-110 transition-transform duration-300 flex items-center justify-center">
                    <FaGraduationCap className="text-white w-4 h-4" />
                  </div>
                  
                  <div className="text-center pt-4">
                    <h4 className="text-base font-bold text-white mb-2 group-hover/item:text-[#FF4655] transition-colors duration-300">
                      {item.institution}
                    </h4>
                    <p className="text-[#FF4655] font-semibold mb-3 text-sm">{item.degree}</p>
                    
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                      <FiCalendar className="w-3 h-3" />
                      <span>{item.years}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 