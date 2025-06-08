"use client";
import { motion } from "framer-motion";
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-[#151F2B] via-[#0F1923] to-[#0F1923] text-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              DENEYİM & EĞİTİM
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mt-4">
            Profesyonel deneyimlerim ve eğitim geçmişim
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Deneyim Bölümü */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FF4655]/20 transition-all duration-300 h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <FiBriefcase className="text-[#FF4655]" />
                Deneyim
              </h3>
              
              <div className="space-y-8">
                {experience.map((item, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-[#FF4655]/30 pb-6 last:pb-0">
                    <div className="absolute w-4 h-4 bg-[#FF4655] rounded-full -left-[9px] top-0"></div>
                    
                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-[#FF4655] font-medium mb-2">{item.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {item.period} · {item.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMapPin className="text-gray-400" />
                        {item.location} · {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Eğitim Bölümü */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FF4655]/20 transition-all duration-300 h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <FiCalendar className="text-[#FF4655]" />
                Eğitim
              </h3>
              
              <div className="space-y-8">
                {education.map((item, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-[#FF4655]/30 pb-6 last:pb-0">
                    <div className="absolute w-4 h-4 bg-[#FF4655] rounded-full -left-[9px] top-0"></div>
                    
                    <h4 className="text-lg font-semibold text-white mb-1">{item.institution}</h4>
                    <p className="text-[#FF4655] font-medium mb-2">{item.degree}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCalendar className="text-gray-400" />
                      {item.years}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 