"use client";
import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { profile } from "@/data/profile";
import Image from "next/image";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF4655]/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500 opacity-40"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => {
          const positions = [
            { left: 10, top: 20 }, { left: 80, top: 15 }, { left: 25, top: 70 },
            { left: 90, top: 60 }, { left: 15, top: 85 }, { left: 70, top: 25 },
            { left: 45, top: 90 }, { left: 60, top: 10 }, { left: 30, top: 50 },
            { left: 85, top: 40 }, { left: 20, top: 35 }, { left: 75, top: 80 },
            { left: 40, top: 65 }, { left: 95, top: 30 }, { left: 5, top: 75 },
            { left: 65, top: 45 }, { left: 35, top: 20 }, { left: 55, top: 85 },
            { left: 12, top: 55 }, { left: 88, top: 75 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FF4655]/30 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Profile Image with Enhanced Animation */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="mb-6 relative group"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/20 p-1 overflow-hidden bg-gradient-to-br from-[#1F2731] to-[#0F1923] shadow-lg">
              <Image 
                src="/profil_resmim.jpg" 
                alt={profile.name} 
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </motion.div>
          
          {/* Main Title with Gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 relative"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              Eren KALAYCI
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"
            />
          </motion.h1>
          
          {/* Subtitle with Typing Effect */}
          <motion.div
            variants={itemVariants}
            className="mb-4 h-6 flex items-center"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="text-lg md:text-xl font-medium text-gray-300"
            >
              <span className="text-[#FF4655]">&lt;</span>
              Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi
              <span className="text-[#FF4655]">/&gt;</span>
            </motion.h2>
          </motion.div>
          
          {/* Enhanced Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mb-12 text-gray-300 text-center text-base md:text-lg leading-relaxed"
          >
            Aktif olarak Flutter ile mobil uygulama geliştirme üzerine yoğunlaşmaktayım. Hobi olarak ise Unity ile oyunlar geliştiriyor ve ayrıca modern web siteleri tasarlıyorum. Geliştirdiğim yenilikçi mobil uygulamaları ve oyunları Google Play Store&apos;da yayınlıyorum.
          </motion.p>
          
          {/* Social Links with Enhanced Design */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-6 mb-8"
          >
            <motion.a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-4 bg-[#1F2731]/30 backdrop-blur-sm border border-white/10 hover:border-[#FF4655]/50 rounded-2xl transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub className="w-6 h-6 text-white group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            
            <motion.a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-4 bg-[#1F2731]/30 backdrop-blur-sm border border-white/10 hover:border-[#FF4655]/50 rounded-2xl transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-6 h-6 text-white group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            
            <motion.a
              href={`mailto:${profile.email}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-4 bg-[#1F2731]/30 backdrop-blur-sm border border-white/10 hover:border-[#FF4655]/50 rounded-2xl transition-all duration-300"
              aria-label="Email"
            >
              <FiMail className="w-6 h-6 text-white group-hover:text-[#FF4655] transition-colors duration-300" />
            </motion.a>
            
            <motion.a
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-4 bg-[#1F2731]/30 backdrop-blur-sm border border-white/10 hover:border-[#FF4655]/50 rounded-2xl transition-all duration-300"
              aria-label="Google Play Store"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className="text-white group-hover:text-[#FF4655] transition-colors duration-300" fill="currentColor">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </motion.a>
          </motion.div>
          
        </motion.div>
      </div>

      {/* Scroll Indicator - Sayfanın En Altında */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        onClick={() => scrollToSection('about')}
      >
        <div className="relative group flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-white/30 group-hover:border-[#FF4655]/70 rounded-full flex justify-center pt-2 transition-colors duration-300">
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
              className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#FF4655] transition-colors duration-300"
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-xs text-gray-400 mt-2 group-hover:text-[#FF4655] transition-colors duration-300 text-center"
          >
            Keşfet
          </motion.p>
        </div>
      </motion.div>
      
      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
} 