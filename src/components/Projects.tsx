"use client";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { FaGooglePlay } from "react-icons/fa";
import { projects } from "@/data/projects";
import Image from "next/image";

export default function Projects() {
  return (
    <section id="projects" className="py-16 bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white scroll-mt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <div className="inline-block relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              PROJELERİM
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent relative"
            >
            </motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mt-8 leading-relaxed"
          >
            Yaratıcılık ve teknolojinin buluştuğu noktada ortaya çıkan projelerim. Her biri farklı bir hikaye anlatıyor.
          </motion.p>
        </motion.div>

        {/* Optimized Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 px-4 md:px-0">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4, 
                delay: (index % 4) * 0.05,
                ease: "easeOut"
              }}
              className="group relative bg-gradient-to-br from-[#1F2731]/90 via-[#1A252F]/80 to-[#0F1923]/95 rounded-2xl overflow-hidden transition-all duration-300 border border-[#2A3441]/60 hover:border-[#FF4655]/50 h-full flex flex-col hover:-translate-y-1"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={project.image || "https://via.placeholder.com/400x240"}
                  alt={project.name}
                  width={400}
                  height={240}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectFit: "cover" }}
                />
              </div>
              
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-sm md:text-base mb-2 md:mb-3 group-hover:text-[#FF4655] transition-colors duration-300 line-clamp-1">
                  {project.name}
                </h3>
                                
                <div className="flex gap-2.5 mt-auto">
                  {project.name === "WhatsApp IoT Messaging" && project.githubLink ? (
                    <>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2A3441]/70 to-[#1F2731]/70 hover:from-[#FF4655]/20 hover:to-[#FF6B7A]/20 text-white text-xs font-semibold transition-all duration-300 flex-1 border border-[#3A4451]/60 hover:border-[#FF4655]/50"
                      >
                        <FiGithub className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2A3441]/70 to-[#1F2731]/70 hover:from-[#FF4655]/20 hover:to-[#FF6B7A]/20 text-white text-xs font-semibold transition-all duration-300 flex-1 border border-[#3A4451]/60 hover:border-[#FF4655]/50"
                      >
                        <FiGithub className="w-3.5 h-3.5" />
                        <span>IoT</span>
                      </a>
                    </>
                  ) : (
                    <>
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2A3441]/70 to-[#1F2731]/70 hover:from-[#FF4655]/20 hover:to-[#FF6B7A]/20 text-white text-xs font-semibold transition-all duration-300 flex-1 border border-[#3A4451]/60 hover:border-[#FF4655]/50"
                        >
                          <FiGithub className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.link.includes('play.google.com') && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2A3441]/70 to-[#1F2731]/70 hover:from-[#FF4655]/20 hover:to-[#FF6B7A]/20 text-white text-xs font-semibold transition-all duration-300 flex-1 border border-[#3A4451]/60 hover:border-[#FF4655]/50"
                        >
                          <FaGooglePlay className="w-3.5 h-3.5" />
                          <span>Play</span>
                        </a>
                      )}
                      {!project.link.includes('play.google.com') && project.link !== project.githubLink && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2A3441]/70 to-[#1F2731]/70 hover:from-[#FF4655]/20 hover:to-[#FF6B7A]/20 text-white text-xs font-semibold transition-all duration-300 flex-1 border border-[#3A4451]/60 hover:border-[#FF4655]/50"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 