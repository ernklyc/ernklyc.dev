"use client";
import { motion } from "framer-motion";
import { FiStar, FiLinkedin, FiUser } from "react-icons/fi";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  linkedin?: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      position: "Proje Yöneticisi",
      company: "TechCorp",
      avatar: "/avatars/avatar1.jpg",
      rating: 5,
      text: "Eren ile çalışmak harika bir deneyimdi. Flutter projemizde gösterdiği teknik yetkinlik ve problem çözme becerisi çok etkileyiciydi. Zamanında teslimat ve kaliteli kod yazımı konusunda son derece profesyonel.",
      linkedin: "https://linkedin.com/in/ahmetyilmaz"
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      position: "UI/UX Designer",
      company: "DesignStudio",
      avatar: "/avatars/avatar2.jpg",
      rating: 5,
      text: "Eren'in tasarımlarımı mobil uygulamaya dönüştürme becerisi mükemmel. Her detayı özenle uyguladı ve kullanıcı deneyimini ön planda tuttu. Kesinlikle tekrar çalışmak isterim.",
      linkedin: "https://linkedin.com/in/zeynepkaya"
    },
    {
      id: 3,
      name: "Mehmet Özkan",
      position: "Yazılım Geliştirici",
      company: "StartupXYZ",
      avatar: "/avatars/avatar3.jpg",
      rating: 5,
      text: "Unity ile geliştirdiğimiz oyun projesinde Eren'in katkıları çok değerliydi. C# bilgisi ve oyun geliştirme deneyimi sayesinde projeyi başarıyla tamamladık. Takım çalışması konusunda da çok başarılı.",
      linkedin: "https://linkedin.com/in/mehmetozkan"
    },
    {
      id: 4,
      name: "Fatma Demir",
      position: "Ürün Müdürü",
      company: "MobileApp Inc.",
      avatar: "/avatars/avatar4.jpg",
      rating: 5,
      text: "Cross-platform uygulamamızı Flutter ile geliştirirken Eren'in deneyiminden çok faydalandık. Hem Android hem iOS'ta native performans elde ettik. İletişimi güçlü ve güvenilir bir geliştirici."
    },
    {
      id: 5,
      name: "Can Arslan",
      position: "CTO",
      company: "WebTech Solutions",
      avatar: "/avatars/avatar5.jpg",
      rating: 5,
      text: "Eren'in web geliştirme projemizdeki yaklaşımı çok profesyoneldi. Next.js ve React konularındaki bilgisi ile modern ve performanslı bir web uygulaması geliştirdik. Kesinlikle tavsiye ederim.",
      linkedin: "https://linkedin.com/in/canarslan"
    },
    {
      id: 6,
      name: "Selin Yıldız",
      position: "Freelance Client",
      company: "E-ticaret Projesi",
      avatar: "/avatars/avatar6.jpg",
      rating: 5,
      text: "E-ticaret uygulamamı geliştirirken Eren çok sabırlı ve anlayışlıydı. Tüm isteklerimi dinledi ve mükemmel bir sonuç ortaya çıkardı. Fiyat-performans açısından çok memnunum."
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0F1923] dark:via-[#151F2B] dark:to-[#0F1923] scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white relative z-10">
              💬 MÜŞTERİ YORUMLARI
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6 text-lg">
            Birlikte çalıştığım müşteriler ve iş ortaklarının deneyimleri
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#1F2731]/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-[#FF4655]/20 group relative overflow-hidden"
            >              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-[#FF4655]/20 group-hover:text-[#FF4655]/30 transition-colors">
                <BiSolidQuoteAltLeft className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>              {/* Testimonial Text */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF4655]/20 to-[#FF4655]/10 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-[#FF4655]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.position}
                  </p>
                  <p className="text-xs text-[#FF4655] font-medium">
                    {testimonial.company}
                  </p>
                </div>
                {testimonial.linkedin && (
                  <a
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#0077B5] transition-colors"
                  >
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4655]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#FF4655]/10 to-[#FF4655]/5 rounded-2xl p-8 border border-[#FF4655]/20">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Projeni Birlikte Gerçekleştirelim!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Yukarıdaki müşterilerim gibi sen de projende başarılı olmak istiyorsan, 
              hemen iletişime geç ve projen hakkında konuşalım.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF4655] to-[#FF4655]/80 text-white px-8 py-4 rounded-full font-medium hover:from-[#FF4655]/90 hover:to-[#FF4655]/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>İletişime Geç</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
