"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { education } from "@/data/education";
import { experience, formatDuration, type ExperienceEntry } from "@/data/experience";
import { useLocale } from "@/contexts/LocaleContext";

const listVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

function getDisplayDuration(item: ExperienceEntry): string {
  if (item.startDate) {
    return formatDuration(item.startDate, item.endDate ?? undefined);
  }
  return item.duration ?? "";
}

export default function Experience() {
  const { t } = useLocale();
  const experienceNewestFirst = [...experience].reverse();

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] py-16 sm:py-20 lg:py-24 scroll-mt-20"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center sm:mb-12"
        >
          <div className="inline-block relative">
            <h2 className="text-2xl font-bold sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              {t("experience.title")}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent mx-auto mt-2"
            />
          </div>
          <p className="mt-4 text-sm text-gray-300">
            {t("experience.subtitle")}
          </p>
        </motion.header>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/60 to-[#0F1923]/90 backdrop-blur-xl hover:border-white/20 transition-all duration-500">
          {/* Deneyim listesi - ince çizgi ile ayrılmış, hover */}
          {experienceNewestFirst.map((item, index) => (
            <motion.div
              key={`exp-${index}`}
              custom={index}
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="flex gap-4 border-b border-white/[0.08] p-4 transition-colors sm:gap-5 sm:p-5"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14">
                {"logo" in item && item.logo ? (
                  <Image
                    src={item.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5">
                    <FiBriefcase className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-white sm:text-lg">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-sm text-gray-400">
                  {item.company}
                  {"category" in item && item.category && (
                    <span className="ml-1 font-semibold text-[#FF4655]">· {item.category}</span>
                  )}
                </p>
                <p className="mt-1.5 text-xs text-gray-500">
                  {item.period} · {getDisplayDuration(item)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item.location} · <span className="font-semibold text-[#FF4655]">{item.type}</span>
                </p>
                {"skills" in item && item.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Eğitim - en altta */}
          {education.map((item, index) => (
            <motion.div
              key={`edu-${index}`}
              custom={index + experienceNewestFirst.length}
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="flex gap-4 border-b-0 p-4 transition-colors sm:gap-5 sm:p-5"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14">
                {"logo" in item && item.logo ? (
                  <Image
                    src={item.logo}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/5">
                    <FaGraduationCap className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  {item.institution}
                </h3>
                <p className="mt-0.5 text-sm text-gray-300">
                  {item.degree}
                  <span className="ml-1.5 text-[#FF4655]">· Eğitim</span>
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {item.years}
                  {"gpa" in item && item.gpa && (
                    <span className="ml-2 text-gray-500">· Ortalama: {item.gpa}</span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
