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
          className="mb-16 text-center"
        >
          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              PROJELERİM
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mt-4">
            Son projelerimden bazılarına göz atın. Daha fazla detay için lütfen GitHub ve Google Play Store profilimi ziyaret edin.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20"
                  : "bg-[#1F2731] text-gray-300 hover:bg-[#FF4655]/10 border border-[#FF4655]/30"
              }`}
            >
              {category === "all" ? "Tümü" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="group relative bg-gradient-to-br from-[#1F2731]/80 to-[#0F1923]/90 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF4655]/10 border border-[#1F2731] hover:border-[#FF4655]/30 h-full flex flex-col"
            >
              {/* Görsel Bölümü */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF4655]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <Image
                  src={project.image || "https://via.placeholder.com/600"}
                  alt={project.name}
                  width={600}
                  height={350}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  style={{ objectFit: "cover" }}
                />
                
                {/* Proje Tipi Etiketi */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-[#FF4655]/80 text-white text-xs font-medium rounded-full backdrop-blur-md shadow-lg">
                    {project.type}
                  </span>
                </div>
              </div>
              
              {/* İçerik Bölümü */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#FF4655] transition-colors duration-300 line-clamp-1">{project.name}</h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-[#1F2731] text-[#FF4655] text-xs font-medium rounded-full border border-[#FF4655]/20 group-hover:border-[#FF4655]/40 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2.5 py-1 bg-[#1F2731] text-gray-300 text-xs font-medium rounded-full">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Bağlantılar */}
                <div className="flex gap-3 mt-auto">
                  {/* WhatsApp IoT Messaging için özel durum */}
                  {project.name === "WhatsApp IoT Messaging" && project.githubLink ? (
                    <>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655] text-white transition-colors group/btn flex-1 justify-center"
                        aria-label={`GitHub repository for ${project.name}`}
                      >
                        <FiGithub className="w-4 h-4" />
                        <span className="text-sm truncate max-w-[80px]">Mobile App</span>
                        <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655] text-white transition-colors group/btn flex-1 justify-center"
                        aria-label={`GitHub repository for ${project.name}`}
                      >
                        <FiGithub className="w-4 h-4" />
                        <span className="text-sm truncate max-w-[80px]">IoT Device</span>
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
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655] text-white transition-colors group/btn flex-1 justify-center"
                          aria-label={`GitHub repository for ${project.name}`}
                        >
                          <FiGithub className="w-4 h-4" />
                          <span className="text-sm truncate max-w-[80px]">GitHub</span>
                          <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </a>
                      )}
                      {project.link.includes('play.google.com') && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655] text-white transition-colors group/btn flex-1 justify-center"
                          aria-label={`Google Play Store link for ${project.name}`}
                        >
                          <FaGooglePlay className="w-4 h-4" />
                          <span className="text-sm truncate max-w-[80px]">Play Store</span>
                          <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </a>
                      )}
                      {!project.link.includes('play.google.com') && project.link !== project.githubLink && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655] text-white transition-colors group/btn flex-1 justify-center"
                          aria-label={`Demo or link for ${project.name}`}
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span className="text-sm truncate max-w-[80px]">Web</span>
                          <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-[#1F2731]/50 to-[#0F1923]/60 backdrop-blur-sm border border-[#FF4655]/10 rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1F2731] flex items-center justify-center border border-[#FF4655]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF4655]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Proje Bulunamadı</h3>
            <p className="text-gray-300 mb-2">
              Bu kategoride henüz proje bulunamadı.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 