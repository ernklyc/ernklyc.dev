"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import { profile } from "@/data/profile";
import { useLocale } from "@/contexts/LocaleContext";

interface FormErrors {
  name?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const { t } = useLocale();
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.errorNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("contact.errorNameMin");
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t("contact.errorNameMax");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("contact.errorSubjectRequired");
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = t("contact.errorSubjectMin");
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = t("contact.errorSubjectMax");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.errorMessageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contact.errorMessageMin");
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = t("contact.errorMessageMax");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus('loading');

    try {
      const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Ad: ${formData.name}\n\nMesaj: ${formData.message}`
      )}`;
      window.location.href = mailto;

      setFormStatus('success');
      setTimeout(() => {
        setFormData({ name: '', subject: '', message: '' });
        setFormStatus('idle');
      }, 2000);
    } catch (error) {
      setFormStatus('error');
      console.error('Form submission error:', error);
    }
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
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              {t("contact.title")}
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent relative"
            >
            </motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg mt-8 leading-relaxed"
          >
            {t("contact.subtitle")}
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
          <div className="bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/60 to-[#0F1923]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4655]/0 via-[#FF4655]/5 to-[#FF4655]/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label htmlFor="name" className="text-sm font-semibold text-gray-300 block">
                    {t("contact.nameLabel")} <span className="text-[#FF4655]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full bg-[#1F2731]/60 backdrop-blur-sm border rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#2A3441]/60 hover:border-white/20 focus:border-white/30 focus:ring-white/20'
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label htmlFor="subject" className="text-sm font-semibold text-gray-300 block">
                    {t("contact.subjectLabel")} <span className="text-[#FF4655]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder={t("contact.subjectPlaceholder")}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    className={`w-full bg-[#1F2731]/60 backdrop-blur-sm border rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#2A3441]/60 hover:border-white/20 focus:border-white/30 focus:ring-white/20'
                    }`}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.subject}
                    </p>
                  )}
                </motion.div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="space-y-2"
              >
                <label htmlFor="message" className="text-sm font-semibold text-gray-300 block">
                  {t("contact.messageLabel")} <span className="text-[#FF4655]">*</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({formData.message.length}/1000)
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={1000}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full bg-[#1F2731]/60 backdrop-blur-sm border rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#2A3441]/60 hover:border-white/20 focus:border-white/30 focus:ring-white/20'
                  }`}
                ></textarea>
                {errors.message && (
                  <p id="message-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </motion.div>
              
              {formStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2" role="alert">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>{t("contact.error")}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={formStatus === 'loading' || formStatus === 'success'}
                aria-label={t("contact.submit")}
                whileHover={formStatus === 'idle' ? { scale: 1.02, y: -2 } : {}}
                whileTap={formStatus === 'idle' ? { scale: 0.98 } : {}}
                className={`w-full bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] hover:from-[#FF4655]/90 hover:to-[#FF6B7A]/90 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-500 transform ${
                  formStatus === 'loading' || formStatus === 'success' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {formStatus === 'idle' && (
                  <>
                    <FiSend className="mr-3 w-5 h-5" /> 
                    <span>{t("contact.submit")}</span>
                  </>
                )}
                {formStatus === 'loading' && (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t("contact.sending")}</span>
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <FiCheck className="mr-3 w-5 h-5" /> 
                    <span>{t("contact.success")}</span>
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