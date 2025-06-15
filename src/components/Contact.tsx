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
    <section id="contact" className="py-16 bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white scroll-mt-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="inline-block relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -inset-4 bg-gradient-to-r from-[#FF4655]/20 via-transparent to-[#FF4655]/20 rounded-lg blur-xl"
            ></motion.div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#FF4655] relative z-10">
              İLETİŞİME GEÇ
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
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg mt-8 leading-relaxed"
          >
            Proje teklifleri, iş birliği fırsatları veya herhangi bir sorunuz için benimle iletişime geçmekten çekinmeyin.
          </motion.p>
        </motion.div>

        {/* Premium Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/60 to-[#0F1923]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-[#FF4655]/30 hover:border-[#FF4655]/50 transition-all duration-500 shadow-2xl relative overflow-hidden group">
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4655]/0 via-[#FF4655]/5 to-[#FF4655]/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-300 block">Adınız</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Adınızı girin"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1F2731]/60 backdrop-blur-sm border border-[#2A3441]/60 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4655]/60 focus:ring-2 focus:ring-[#FF4655]/20 transition-all duration-300 hover:border-[#FF4655]/40"
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-gray-300 block">Konu</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Mesaj konusu"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1F2731]/60 backdrop-blur-sm border border-[#2A3441]/60 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4655]/60 focus:ring-2 focus:ring-[#FF4655]/20 transition-all duration-300 hover:border-[#FF4655]/40"
                  />
                </motion.div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-300 block">Mesajınız</label>
                <textarea
                  name="message"
                  placeholder="Mesajınızı detaylı bir şekilde yazın..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-[#1F2731]/60 backdrop-blur-sm border border-[#2A3441]/60 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4655]/60 focus:ring-2 focus:ring-[#FF4655]/20 transition-all duration-300 resize-none hover:border-[#FF4655]/40"
                ></textarea>
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={formStatus === 'loading'}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] hover:from-[#FF4655]/90 hover:to-[#FF6B7A]/90 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-500 transform ${formStatus === 'loading' ? 'opacity-70' : ''}`}
              >
                {formStatus === 'idle' && (
                  <>
                    <FiSend className="mr-3 w-5 h-5" /> 
                    <span>Mesaj Gönder</span>
                  </>
                )}
                {formStatus === 'loading' && (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Gönderiliyor...</span>
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <FiCheck className="mr-3 w-5 h-5" /> 
                    <span>Gönderildi!</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 