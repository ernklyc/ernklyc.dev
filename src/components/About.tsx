"use client";
import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";
import Image from "next/image";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
    <section id="about" className="py-12 bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white relative overflow-hidden scroll-mt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500 opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.div variants={itemVariants} className="inline-block relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -inset-4 bg-gradient-to-r from-[#FF4655]/20 via-transparent to-[#FF4655]/20 rounded-lg blur-xl"
            ></motion.div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#FF4655] relative z-10">
              HAKKIMDA
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent animate-pulse"></div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
          {/* Sol Taraf - Penguen Karakteri ve Bilgiler */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#2A3441] via-[#1F2731] to-[#151F2B] rounded-2xl p-6 border border-[#FF4655]/20 relative overflow-hidden group h-full">
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 h-full">
                {/* Penguen GIF - Daha küçük boyut */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-[#FF4655]/10">
                    <Image 
                      src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2xteHR5bGdleXIwejF5YzRlcXRvenc5dml6bXZnNHJ0ZnE3YXp1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1vlBgKjXEz1jTtsuiH/giphy.gif" 
                      alt="Penguen Animasyonu"
                      width={256}
                      height={256}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Bilgiler */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Eren KALAYCI</h3>
                  <p className="text-[#FF4655] text-sm font-semibold">Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi</p>
                </div>

                {/* Konum Bilgisi - Yeni minimal tasarım */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1F2731]/60 border border-[#FF4655]/20 backdrop-blur-sm"
                >
                  <FiGlobe className="text-[#FF4655] w-4 h-4" />
                  <span className="text-white text-sm font-medium">Türkiye, Trabzon</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Sağ Taraf - Detaylı Açıklama */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#2A3441] via-[#1F2731] to-[#151F2B] rounded-2xl p-6 border border-[#FF4655]/20 shadow-xl relative overflow-hidden group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4655]/0 via-[#FF4655]/5 to-[#FF4655]/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 h-full flex flex-col">
                <motion.h3 
                  whileHover={{ x: 5 }}
                  className="text-xl font-bold mb-6 text-white flex items-center"
                >
                  <span className="text-[#FF4655] mr-2 text-2xl">&lt;</span>
                  Merhaba, Ben Eren
                  <span className="text-[#FF4655] ml-2 text-2xl">/&gt;</span>
                </motion.h3>
                
                <div className="space-y-4 text-gray-300 leading-relaxed flex-grow">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="relative pl-4 border-l-2 border-[#FF4655]/30 hover:border-[#FF4655]/60 transition-colors duration-300"
                  >
                    <div className="absolute -left-1.5 top-1.5 w-2 h-2 bg-[#FF4655] rounded-full shadow-lg"></div>
                    <p className="text-sm">
                      Dijital dünyada yenilikçi çözümler üreten bir yazılım geliştiricisiyim. İleriye dönük projeleri ve özgün fikirleri hayata geçirerek, kullanıcılar için değer yaratan uygulamalar, oyunlar ve web çözümleri geliştirmeye odaklanıyorum. Temel motivasyonum, belirlenen hedeflere ulaşarak etkili ve ölçülebilir sonuçlar elde etmektir.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="relative pl-4 border-l-2 border-[#FF4655]/30 hover:border-[#FF4655]/60 transition-colors duration-300"
                  >
                    <div className="absolute -left-1.5 top-1.5 w-2 h-2 bg-[#FF4655] rounded-full shadow-lg"></div>
                    <p className="text-sm">
                      <span className="text-[#FF4655] font-semibold">Flutter</span> platformunda Android için mobil uygulamalar ve{" "}
                      <span className="text-[#FF4655] font-semibold">Unity</span> motoruyla Android ile Masaüstü sistemler için oyunlar geliştirme konusunda deneyime sahibim. Şu anda aktif olarak Flutter ile mobil uygulama geliştirme süreçlerine odaklanmış durumdayım. Ayrıca, modern web teknolojileriyle çeşitli projeler geliştirmekteyim. Projelerimde kullanıcı deneyimini ve tasarımını merkeze alarak, estetik ve yüksek işlevselliğe sahip profesyonel çıktılar sunmaktayım.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="relative pl-4 border-l-2 border-[#FF4655]/30 hover:border-[#FF4655]/60 transition-colors duration-300"
                  >
                    <div className="absolute -left-1.5 top-1.5 w-2 h-2 bg-[#FF4655] rounded-full shadow-lg"></div>
                    <p className="text-sm">
                      Teknolojik gelişmeleri yakından takip ederek kendimi sürekli geliştirir, yeni yazılım ve framework&apos;lere hızla adapte olurum. Analitik düşünme ve problem çözme becerilerimle teknik yetkinliklerimi birleştirerek, yazılım geliştirme süreçlerine etkin katkı sağlarım. İşbirlikçi bir yaklaşımla ekip çalışmalarında üzerime düşen görevleri titizlikle yerine getirir, ortak hedeflere ulaşmak amacıyla çözüm odaklı ve yapıcı önerilerle ekibe destek olurum; Öğrenmeyi seven, yenilikleri takip eden ve gelişimi önemseyen bir profesyonel anlayışla hareket ederim.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 