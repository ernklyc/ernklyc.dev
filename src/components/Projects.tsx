"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiArrowRight } from "react-icons/fi";
import { FaGooglePlay } from "react-icons/fa";
import { projects } from "@/data/projects";
import Image from "next/image";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const categories = ["all", "Web", "Flutter", "Unity", "IoT"];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => 
        project.type === activeFilter || 
        (activeFilter === "all" ? true : false)
      );

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-[#0F1923] via-[#0F1923] to-[#151F2B] text-white scroll-mt-28">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            PROJELERİM
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FF4655]/80 to-[#FF4655]/20 mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Son projelerimden bazılarına göz atın. Daha fazla detay için lütfen GitHub ve Google Play Store profilimi ziyaret edin.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === category
                  ? "bg-[#FF4655]/20 text-white backdrop-blur-sm border border-[#FF4655]/40"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
              }`}
            >
              {category === "all" ? "Tümü" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 2) * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-[#FF4655]/20 shadow-2xl"
            >
              <div className="relative">
                <Image
                  src={project.image || "https://via.placeholder.com/600"}
                  alt={project.name}
                  width={600}
                  height={350}
                  className="w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 aspect-[16/9]"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300"></div>
                
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-[#FF4655]/20 text-white/90 text-xs font-medium rounded-full backdrop-blur-md border border-[#FF4655]/30">
                      {project.type}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">{project.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 border border-[#FF4655]/40 text-[#FF4655] text-xs font-medium rounded-full bg-black/30 backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {/* WhatsApp IoT Messaging için özel durum */}
                      {project.name === "WhatsApp IoT Messaging" && project.githubLink ? (
                        <>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4655]/80 hover:bg-[#FF4655] text-white font-medium text-sm transition-all shadow-lg group/btn"
                            aria-label={`GitHub repository for ${project.name}`}
                          >
                            <FiGithub className="w-4 h-4" />
                            <span>GitHub</span>
                            <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </a>
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4655]/80 hover:bg-[#FF4655] text-white font-medium text-sm transition-all shadow-lg group/btn"
                            aria-label={`GitHub repository for ${project.name}`}
                          >
                            <FiGithub className="w-4 h-4" />
                            <span>GitHub</span>
                            <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </a>
                        </>
                      ) : (
                        <>
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4655]/80 hover:bg-[#FF4655] text-white font-medium text-sm transition-all shadow-lg group/btn"
                              aria-label={`GitHub repository for ${project.name}`}
                            >
                              <FiGithub className="w-4 h-4" />
                              <span>GitHub</span>
                              <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                            </a>
                          )}
                          {project.link.includes('play.google.com') && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4655]/80 hover:bg-[#FF4655] text-white font-medium text-sm transition-all shadow-lg group/btn"
                              aria-label={`Google Play Store link for ${project.name}`}
                            >
                              <FaGooglePlay className="w-4 h-4" />
                              <span>Play Store</span>
                              <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                            </a>
                          )}
                          {!project.link.includes('play.google.com') && project.link !== project.githubLink && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4655]/80 hover:bg-[#FF4655] text-white font-medium text-sm transition-all shadow-lg group/btn"
                              aria-label={`Demo or link for ${project.name}`}
                            >
                              <FiExternalLink className="w-4 h-4" />
                              <span>Web Sayfası</span>
                              <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <p className="text-white/80">
              Bu kategoride henüz proje bulunamadı.
            </p>
            <p className="text-white/60 text-sm mt-2">
              Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 