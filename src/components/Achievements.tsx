"use client";
import { motion } from "framer-motion";
import { FiAward, FiExternalLink } from "react-icons/fi";
import { achievements } from "@/data/achievements";

export default function Achievements() {
  return (
    <section id="achievements" className="py-20 bg-gradient-to-br from-[#151F2B] via-[#0F1923] to-[#151F2B] text-white scroll-mt-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              SERTİFİKALAR & BAŞARILAR
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mt-4">
            Profesyonel gelişimimi destekleyen sertifikalar ve başarılar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-[#1F2731]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20 hover:border-[#FF4655]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF4655]/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FF4655]/10 flex items-center justify-center mr-4">
                  <FiAward className="w-6 h-6 text-[#FF4655]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF4655] transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400">{achievement.issuer} • {achievement.date}</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
              
              {achievement.link !== "#" && (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF4655] hover:text-white transition-colors text-sm"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Sertifikayı Görüntüle
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
