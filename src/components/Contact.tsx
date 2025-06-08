"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheck } from "react-icons/fi";
import { profile } from "@/data/profile";

export default function Contact() {
  const [formStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Ad: ${formData.name}\n\nMesaj: ${formData.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <section id="contact" className="py-14 bg-gradient-to-br from-[#0F1923] via-[#0F1923] to-[#0A1017] text-white scroll-mt-20">
      <div className="w-full flex justify-center items-center px-0 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              İLETİŞİME GEÇ
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-xl mx-auto text-xs md:text-sm mt-4">
            Proje teklifleri, iş birliği fırsatları veya herhangi bir sorunuz için benimle iletişime geçmekten çekinmeyin.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        {/* İletişim Formu - Merkeze Alınmış */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-[#0F1923]/70 backdrop-blur-sm rounded-2xl p-8 border border-[#FF4655]/40 hover:border-[#FF4655] transition-all duration-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Adınız"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1F2731] border border-[#FF4655]/30 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF4655] transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Adresiniz"
                    required
                    className="w-full bg-[#1F2731] border border-[#FF4655]/30 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF4655] transition-all"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Konu"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1F2731] border border-[#FF4655]/30 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF4655] transition-all"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Mesajınız"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-[#1F2731] border border-[#FF4655]/30 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF4655] transition-all resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className={`w-full bg-gradient-to-r from-[#FF4655] to-[#FF4655]/80 hover:from-[#FF4655]/90 hover:to-[#FF4655] text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${formStatus === 'loading' ? 'opacity-70' : ''}`}
              >
                {formStatus === 'idle' && (
                  <>
                    <FiSend className="mr-2" /> Mesaj Gönder
                  </>
                )}
                {formStatus === 'loading' && (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <FiCheck className="mr-2" /> Gönderildi!
                  </>
                )}
              </button>
            </form>
            
            {/* Alt Bilgi */}
            <div className="mt-6 pt-6 border-t border-[#FF4655]/20 text-center">
              <p className="text-gray-400 text-sm">
                Alternatif olarak{" "}
                <a 
                  href={`mailto:${profile.email}`}
                  className="text-[#FF4655] hover:text-[#FF4655]/80 transition-colors"
                >
                  {profile.email}
                </a>
                {" "}adresine doğrudan mail gönderebilirsiniz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 