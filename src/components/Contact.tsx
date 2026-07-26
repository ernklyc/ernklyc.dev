"use client";
import { motion } from "framer-motion";
import { FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useLocale } from "@/contexts/LocaleContext";
import { useContactForm } from "@/hooks/useContactForm";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { inputBase, inputBorder } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t } = useLocale();
  const { status, formData, errors, handleChange, handleSubmit } = useContactForm({
    nameRequired: t("contact.errorNameRequired"),
    nameMin: t("contact.errorNameMin"),
    nameMax: t("contact.errorNameMax"),
    subjectRequired: t("contact.errorSubjectRequired"),
    subjectMin: t("contact.errorSubjectMin"),
    subjectMax: t("contact.errorSubjectMax"),
    messageRequired: t("contact.errorMessageRequired"),
    messageMin: t("contact.errorMessageMin"),
    messageMax: t("contact.errorMessageMax"),
  });

  const isBusy = status === "loading" || status === "success";

  return (
    <section id="contact" className="py-24 text-white scroll-mt-20 relative overflow-hidden">
      <SectionBackground />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading title={t("contact.title")} subtitle={t("contact.subtitle")} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <GlassCard className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-300 block">
                    {t("contact.nameLabel")} <span className="text-[#A9B7C4]">*</span>
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
                    className={cn(inputBase, errors.name ? inputBorder.error : inputBorder.default)}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-gray-300 block">
                    {t("contact.subjectLabel")} <span className="text-[#A9B7C4]">*</span>
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
                    className={cn(inputBase, errors.subject ? inputBorder.error : inputBorder.default)}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.subject}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-300 block">
                  {t("contact.messageLabel")} <span className="text-[#A9B7C4]">*</span>
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
                  className={cn(
                    inputBase,
                    "resize-none",
                    errors.message ? inputBorder.error : inputBorder.default
                  )}
                ></textarea>
                {errors.message && (
                  <p id="message-error" className="text-red-400 text-xs flex items-center gap-1" role="alert">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </motion.div>

              {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2" role="alert">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>{t("contact.error")}</span>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isBusy}
                aria-label={t("contact.submit")}
                whileHover={status === "idle" ? { scale: 1.02, y: -2 } : {}}
                whileTap={status === "idle" ? { scale: 0.98 } : {}}
                className={cn(
                  "w-full bg-[#12161B] hover:bg-[#1A1F26] border border-white/10 hover:border-white/20 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-300 transform shadow-lg shadow-black/50",
                  isBusy ? "opacity-70 cursor-not-allowed" : ""
                )}
              >
                {status === "idle" && (
                  <>
                    <FiSend className="mr-3 w-5 h-5" />
                    <span>{t("contact.submit")}</span>
                  </>
                )}
                {status === "loading" && (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t("contact.sending")}</span>
                  </>
                )}
                {status === "success" && (
                  <>
                    <FiCheck className="mr-3 w-5 h-5" />
                    <span>{t("contact.success")}</span>
                  </>
                )}
              </motion.button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
