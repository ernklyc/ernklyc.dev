"use client";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { profile } from "@/data/profile";
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript, SiFramer } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white border-t border-[#FF4655]/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-10 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              EREN KALAYCI
            </h2>
            <p className="text-gray-300 max-w-md text-center text-sm leading-relaxed">
              Flutter, Unity ve web teknolojilerinde uzmanlaşmış Bilgisayar Mühendisi & Mobil Uygulama Geliştirici.
            </p>
          </motion.div>
          
          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex space-x-4 mb-8">
            <motion.a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#1F2731]/60 hover:bg-[#FF4655]/20 p-3 rounded-xl transition-all duration-300 border border-[#2A3441]/50 hover:border-[#FF4655]/40 backdrop-blur-sm"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5 text-gray-300 group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            <motion.a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#1F2731]/60 hover:bg-[#FF4655]/20 p-3 rounded-xl transition-all duration-300 border border-[#2A3441]/50 hover:border-[#FF4655]/40 backdrop-blur-sm"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5 text-gray-300 group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            <motion.a
              href={`mailto:${profile.email}`}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#1F2731]/60 hover:bg-[#FF4655]/20 p-3 rounded-xl transition-all duration-300 border border-[#2A3441]/50 hover:border-[#FF4655]/40 backdrop-blur-sm"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5 text-gray-300 group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            <motion.a
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#1F2731]/60 hover:bg-[#FF4655]/20 p-3 rounded-xl transition-all duration-300 border border-[#2A3441]/50 hover:border-[#FF4655]/40 backdrop-blur-sm"
              aria-label="Google Play Store"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" className="text-gray-300 group-hover:text-[#FF4655] transition-colors duration-300" fill="currentColor">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </motion.a>
          </motion.div>
          
          {/* Technologies - Compact */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-gray-400 mb-3 text-xs font-medium uppercase tracking-wide">Site Teknolojileri</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: SiNextdotjs, name: "Next.js", color: "text-white" },
                { icon: SiReact, name: "React", color: "text-blue-400" },
                { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-400" },
                { icon: SiTypescript, name: "TypeScript", color: "text-blue-500" },
                { icon: SiFramer, name: "Framer", color: "text-purple-400" }
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="flex items-center gap-1.5 bg-[#1F2731]/40 hover:bg-[#FF4655]/10 py-1.5 px-2.5 rounded-lg transition-all duration-300 border border-[#2A3441]/30 hover:border-[#FF4655]/30"
                >
                  <tech.icon className={`${tech.color} w-3.5 h-3.5`} />
                  <span className="text-gray-300 text-xs font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Scroll to Top */}
          <motion.button
            variants={itemVariants}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] hover:from-[#FF4655]/90 hover:to-[#FF6B7A]/90 text-white p-3 rounded-xl transition-all duration-300 mb-6"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6 border-t border-[#FF4655]/20 text-center"
        >
          <div className="text-gray-400 text-xs space-y-2">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span>&copy; {year} Eren KALAYCI.</span>
            </p>
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <a href="/privacy-policy" className="text-gray-300 hover:text-white hover:underline">HP Character Wiki Privacy Policy</a>
              <span className="text-gray-500">|</span>
              <a href="/movie-face-ai-privacy" className="text-gray-300 hover:text-white hover:underline">Movie Face AI Privacy Policy</a>
            </p>
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <a href="/link-manager-privacy" className="text-gray-300 hover:text-white hover:underline">Link Manager Privacy Policy</a>
              <span className="text-gray-500">|</span>
              <a href="/link-manager-terms" className="text-gray-300 hover:text-white hover:underline">Link Manager Terms of Service</a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}