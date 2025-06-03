"use client";
import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { profile } from "@/data/profile";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-[#0F1923] via-[#121A24] to-[#0F1923] text-white scroll-mt-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FF4655] p-1 mx-auto overflow-hidden bg-[#0F1923]">
              <Image 
                src="/profil_resmim.jpg" 
                alt={profile.name} 
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-2 text-[#FF4655]"
          >
            Eren KALAYCI
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl font-medium mb-4 text-gray-300"
          >
            Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-xl mb-8 text-gray-300 text-center text-sm md:text-base"
          >
            Aktif olarak Flutter ile mobil uygulama geliştirme üzerine yoğunlaşmaktayım. Hobi olarak ise Unity ile oyunlar geliştiriyor ve ayrıca modern web siteleri tasarlıyorum. Geliştirdiğim yenilikçi mobil uygulamaları ve oyunları Google Play Store&apos;da yayınlıyorum.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-[#FF4655]/10 p-2 rounded-full transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-[#FF4655]/10 p-2 rounded-full transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="bg-[#1F2731] hover:bg-[#FF4655]/10 p-2 rounded-full transition-all duration-300"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
            <a
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-[#FF4655]/10 p-2 rounded-full transition-all duration-300 flex items-center justify-center"
              aria-label="Google Play Store"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="white">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <motion.div 
                animate={{ 
                  y: [0, 8, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
                className="w-1 h-1 rounded-full bg-white"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 