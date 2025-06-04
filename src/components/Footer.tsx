"use client";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { profile } from "@/data/profile";
import { useEffect, useState } from "react";
import { SiNextdotjs, SiReact, SiTailwindcss, SiTypescript, SiFramer } from "react-icons/si";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#0F1923] text-white border-t border-[#1F2731]">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">EREN KALAYCI</h2>
          <p className="text-gray-300 max-w-md text-center mb-6">
            Flutter, Unity ve web teknolojilerinde uzmanlaşmış Bilgisayar Mühendisi & Mobil Uygulama Geliştirici.
          </p>
          
          <div className="flex space-x-4 mb-8">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-gray-700 p-3 rounded-full transition-all duration-300"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-gray-700 p-3 rounded-full transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="bg-[#1F2731] hover:bg-gray-700 p-3 rounded-full transition-all duration-300"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
            <a
              href="https://play.google.com/store/apps/dev?id=6576291249346115918"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1F2731] hover:bg-gray-700 p-3 rounded-full transition-all duration-300"
              aria-label="Google Play Store"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill="white">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
            </a>
          </div>
          
          {/* Site Teknolojileri */}
          <div className="mb-8">
            <h3 className="text-gray-400 mb-3 text-sm font-medium">Bu site aşağıdaki teknolojiler ile oluşturulmuştur</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-[#1F2731] py-2 px-3 rounded-md">
                <SiNextdotjs className="text-white w-5 h-5" />
                <span className="text-gray-300 text-sm">Next.js</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1F2731] py-2 px-3 rounded-md">
                <SiReact className="text-blue-400 w-5 h-5" />
                <span className="text-gray-300 text-sm">React</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1F2731] py-2 px-3 rounded-md">
                <SiTailwindcss className="text-cyan-400 w-5 h-5" />
                <span className="text-gray-300 text-sm">Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1F2731] py-2 px-3 rounded-md">
                <SiTypescript className="text-blue-500 w-5 h-5" />
                <span className="text-gray-300 text-sm">TypeScript</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1F2731] py-2 px-3 rounded-md">
                <SiFramer className="text-purple-400 w-5 h-5" />
                <span className="text-gray-300 text-sm">Framer Motion</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={scrollToTop}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 mb-8"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-5 h-5" />
          </button>
        </div>
        
        <div className="pt-8 border-t border-[#1F2731]/50 text-center text-gray-400 text-sm">
          <p>&copy; {year ?? ''} Eren KALAYCI. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 