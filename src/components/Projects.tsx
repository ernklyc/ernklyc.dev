"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { FaGooglePlay } from "react-icons/fa";
import { projects } from "@/data/projects";
import Image from "next/image";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const categories = ["all", "Web", "Flutter", "Unity", "IoT", "C#"];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => 
        project.type === activeFilter || 
        (activeFilter === "all" ? true : false)
      );

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

        {/* Enhanced Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-16 px-4"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group px-4 md:px-6 py-2 md:py-3 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-500 ${
                activeFilter === category
                  ? "bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white border border-[#FF4655]/50"
                  : "bg-[#1F2731]/50 backdrop-blur-sm text-gray-300 hover:bg-[#FF4655]/10 border border-[#FF4655]/20 hover:border-[#FF4655]/40"
              }`}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {category === "all" ? "Tümü" : category}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Optimized Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 px-4 md:px-0">
          {filteredProjects.map((project, index) => (
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
              {/* Simplified Image Section */}
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={project.image || "https://via.placeholder.com/400x240"}
                  alt={`${project.name} proje görseli - ${project.description.substring(0, 50)}`}
                  width={400}
                  height={240}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectFit: "cover" }}
                />
                
                {/* Type Badge */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white text-xs font-semibold rounded-full">
                    {project.type}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-sm md:text-base mb-2 md:mb-3 group-hover:text-[#FF4655] transition-colors duration-300 line-clamp-1">
                  {project.name}
                </h3>
                
                <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#2A3441]/80 to-[#1F2731]/80 text-[#FF4655] text-xs font-semibold rounded-lg border border-[#FF4655]/30 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-3 py-1 bg-gradient-to-r from-[#2A3441]/80 to-[#1F2731]/80 text-[#FF4655] text-xs font-semibold rounded-lg border border-[#FF4655]/30 hover:border-[#FF4655] hover:bg-[#FF4655]/10 transition-all cursor-pointer hover:scale-105"
                    >
                      +{project.technologies.length - 2}
                    </button>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2.5">
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
        
        {/* Enhanced Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-gradient-to-br from-[#1F2731]/30 via-[#1A252F]/20 to-[#0F1923]/40 backdrop-blur-xl border border-[#FF4655]/20 rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4655]/5 to-transparent opacity-50"></div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#1F2731] to-[#2A3441] flex items-center justify-center border-2 border-[#FF4655]/30 relative z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#FF4655]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Proje Bulunamadı</h3>
            <p className="text-gray-300 mb-4 text-lg relative z-10">
              Bu kategoride henüz proje bulunmuyor.
            </p>
            <p className="text-gray-400 text-sm relative z-10">
              Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.
            </p>
          </motion.div>
        )}
      </div>

      {/* Technology Details Popup */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1F2731]/95 to-[#151F2B]/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border-2 border-[#FF4655]/20 shadow-[0_0_50px_rgba(255,70,85,0.15)] relative overflow-hidden"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF4655]/10 to-transparent rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#FF4655]/5 to-transparent rounded-full blur-2xl -z-10" />
              
              <div className="flex items-start justify-between mb-6 relative">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {selectedProject.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-4 text-gray-400 hover:text-white transition-all p-2.5 hover:bg-[#FF4655]/10 rounded-xl hover:rotate-90 duration-300 border border-transparent hover:border-[#FF4655]/30"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="border-t border-[#FF4655]/20 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#FF4655] to-[#FF4655]/50 rounded-full" />
                  <h4 className="text-base font-bold text-white">Technologies</h4>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {selectedProject.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="px-4 py-2 bg-gradient-to-r from-[#2A3441] to-[#1F2731] text-[#FF4655] text-sm font-semibold rounded-xl border border-[#FF4655]/30 hover:border-[#FF4655] hover:shadow-[0_0_20px_rgba(255,70,85,0.3)] transition-all hover:scale-105"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 