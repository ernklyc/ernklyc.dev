"use client";
import { motion } from "framer-motion";
import { FiGlobe, FiGithub, FiLinkedin } from "react-icons/fi";
import { profile } from "@/data/profile";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#0F1923] via-[#151F2B] to-[#0F1923] text-white relative overflow-hidden scroll-mt-20">
      {/* Dekoratif elementler */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF4655]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              HAKKIMDA
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          {/* Sol Taraf - Kişisel Bilgiler */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="bg-[#1F2731]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/30 hover:border-[#FF4655]/60 transition-all duration-200 shadow-xl relative overflow-hidden group h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent opacity-30"></div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-full h-auto rounded-t-2xl overflow-hidden mb-4">
                  <Image 
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2xteHR5bGdleXIwejF5YzRlcXRvenc5dml6bXZnNHJ0ZnE3YXp1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1vlBgKjXEz1jTtsuiH/giphy.gif" 
                    alt="Hakkımda Kapak Gif"
                    width={400}
                    height={300}
                    unoptimized={true}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">Eren KALAYCI</h3>
                <p className="text-[#FF4655] text-sm">Bilgisayar Mühendisi & Mobil Uygulama Geliştirici</p>
              </div>
              
              <div className="space-y-4 mb-6 flex-grow">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1F2731] border border-[#FF4655]/20 flex items-center justify-center flex-shrink-0 self-center">
                    <FiGlobe className="text-[#FF4655] w-4 h-4" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-400 text-xs">Konum</p>
                    <p className="text-white text-sm">Türkiye / Trabzon</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center mt-auto">
                <a 
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1F2731] hover:bg-[#FF4655] p-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-xs"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a 
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1F2731] hover:bg-[#FF4655] p-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-xs"
                >
                  <FiLinkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://play.google.com/store/apps/dev?id=6576291249346115918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1F2731] hover:bg-[#FF4655] p-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="white">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <span>Google Play Store</span>
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Sağ Taraf - Özgeçmiş */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            <div className="bg-[#1F2731]/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#FF4655]/30 hover:border-[#FF4655]/60 transition-all duration-200 shadow-xl relative overflow-hidden h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                <span className="text-[#FF4655] mr-2">&lt;</span>
                Merhaba, Ben Eren
                <span className="text-[#FF4655] ml-2">/&gt;</span>
              </h3>
              
              <div className="prose prose-sm md:prose-base text-gray-300 max-w-none flex-grow">
                <p className="mb-4 relative">
                  <span className="text-[#FF4655] font-mono text-base absolute -left-4 opacity-60">*</span>
                  Dijital dünyada yenilikçi çözümler üreten bir yazılım geliştiricisiyim. İleriye dönük projeleri ve özgün fikirleri hayata geçirerek, kullanıcılar için değer yaratan uygulamalar, oyunlar ve web çözümleri geliştirmeye odaklanıyorum. Temel motivasyonum, belirlenen hedeflere ulaşarak etkili ve ölçülebilir sonuçlar elde etmektir.
                </p>
                
                <p className="mb-4 relative">
                  <span className="text-[#FF4655] font-mono text-base absolute -left-4 opacity-60">*</span>
                  Flutter platformunda Android için mobil uygulamalar ve Unity motoruyla Android ile Masaüstü sistemler için oyunlar geliştirme konusunda deneyime sahibim. Şu anda aktif olarak Flutter ile mobil uygulama geliştirme süreçlerine odaklanmış durumdayım. Ayrıca, modern web teknolojileriyle çeşitli projeler geliştirmekteyim. Projelerimde kullanıcı deneyimini ve tasarımını merkeze alarak, estetik ve yüksek işlevselliğe sahip profesyonel çıktılar sunmaktayım.
                </p>
                
                <p className="mb-0 relative">
                  <span className="text-[#FF4655] font-mono text-base absolute -left-4 opacity-60">*</span>
                  Teknolojik gelişmeleri yakından takip ederek kendimi sürekli geliştirir, yeni yazılım ve framework&apos;lere hızla adapte olurum. Analitik düşünme ve problem çözme becerilerimle teknik yetkinliklerimi birleştirerek, yazılım geliştirme süreçlerine etkin katkı sağlarım. İşbirlikçi bir yaklaşımla ekip çalışmalarında üzerime düşen görevleri titizlikle yerine getirir, ortak hedeflere ulaşmak amacıyla çözüm odaklı ve yapıcı önerilerle ekibe destek olurum; Öğrenmeyi seven, yenilikleri takip eden ve gelişimi önemseyen bir profesyonel anlayışla hareket ederim.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 