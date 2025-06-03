"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiChevronRight } from "react-icons/fi";
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
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            PROJELERİM
          </h2>
          <div className="w-20 h-1 bg-[#FF4655] mx-auto mb-8"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Son projelerimden bazılarına göz atın. Daha fazla detay için lütfen GitHub ve Google Play Store profilimi ziyaret edin.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category
                  ? "bg-[#FF4655] text-white shadow-md"
                  : "bg-[#1F2731] text-gray-300 hover:bg-[#FF4655]/20 border border-[#FF4655]/30"
              }`}
            >
              {category === "all" ? "Tümü" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
              className="bg-[#1F2731] rounded-xl overflow-hidden transition-all duration-200 border border-[#FF4655]/30 hover:border-[#FF4655]/60 group"
            >
              <div className="aspect-video relative overflow-hidden bg-[#0A1017]">
                <Image
                  src={project.image || "https://via.placeholder.com/512"}
                  alt={project.name}
                  width={512}
                  height={288}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{project.name}</h3>
                  <p className="text-[#FF4655] text-sm">{project.type}</p>
                </div>
              </div>
              
              <div className="p-5 flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-[#1F2731] text-[#FF4655] text-xs font-medium rounded-full"
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
                
                <div className="flex gap-3 justify-end">
                  {/* WhatsApp IoT Messaging için özel durum */}
                  {project.name === "WhatsApp IoT Messaging" && project.githubLink ? (
                    <>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655]/20 text-white transition-colors"
                        aria-label={`GitHub repository for ${project.name}`}
                      >
                        <FiGithub className="w-4 h-4" />
                        <span className="text-sm">GitHub</span>
                        <FiChevronRight className="w-3 h-3" />
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655]/20 text-white transition-colors"
                        aria-label={`GitHub repository for ${project.name}`}
                      >
                        <FiGithub className="w-4 h-4" />
                        <span className="text-sm">GitHub</span>
                        <FiChevronRight className="w-3 h-3" />
                      </a>
                    </>
                  ) : (
                    <>
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655]/20 text-white transition-colors"
                          aria-label={`GitHub repository for ${project.name}`}
                        >
                          <FiGithub className="w-4 h-4" />
                          <span className="text-sm">GitHub</span>
                          <FiChevronRight className="w-3 h-3" />
                        </a>
                      )}
                      {project.link.includes('play.google.com') && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655]/20 text-white transition-colors"
                          aria-label={`Google Play Store link for ${project.name}`}
                        >
                          <FaGooglePlay className="w-4 h-4" />
                          <span className="text-sm">Play Store</span>
                          <FiChevronRight className="w-3 h-3" />
                        </a>
                      )}
                      {!project.link.includes('play.google.com') && project.link !== project.githubLink && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1F2731] hover:bg-[#FF4655]/20 text-white transition-colors"
                          aria-label={`Demo or link for ${project.name}`}
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span className="text-sm">Web Sayfasına Git</span>
                          <FiChevronRight className="w-3 h-3" />
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
          <div className="text-center py-12">
            <p className="text-gray-300">
              Bu kategoride henüz proje bulunamadı.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 