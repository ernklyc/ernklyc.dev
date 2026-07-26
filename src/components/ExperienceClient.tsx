"use client";

import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";
import { formatDuration } from "@/data/experience";
import { useLocale } from "@/contexts/LocaleContext";
import type { ExperienceContent, EducationEntry } from "@/lib/siteContent";
import type { ExperienceEntry } from "@/data/experience";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import LogoAvatar from "@/components/ui/LogoAvatar";
import TimelineRow from "@/components/ui/TimelineRow";
import Chip from "@/components/ui/Chip";

function getDisplayDuration(item: ExperienceEntry): string {
  if (item.startDate) {
    return formatDuration(item.startDate, item.endDate ?? undefined);
  }
  return item.duration ?? "";
}

interface ExperienceClientProps {
  content: ExperienceContent;
}

export default function ExperienceClient({ content }: ExperienceClientProps) {
  const { t } = useLocale();
  const experienceNewestFirst = [...content.work].reverse();
  const education: EducationEntry[] = content.education;

  return (
    <section id="experience" className="relative overflow-hidden py-24 scroll-mt-20">
      <SectionBackground />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeading title={t("experience.title")} subtitle={t("experience.subtitle")} />
        </motion.div>

        <GlassCard className="overflow-hidden">
          {/* Deneyim listesi - en yeni en üstte */}
          {experienceNewestFirst.map((item, index) => (
            <TimelineRow key={`exp-${index}`} index={index}>
              <LogoAvatar
                src={"logo" in item ? item.logo : undefined}
                fallbackIcon={<FiBriefcase className="h-6 w-6 text-gray-500" />}
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-white sm:text-lg">{item.title}</h4>
                <p className="mt-0.5 text-sm text-gray-400">
                  {item.company}
                  {"category" in item && item.category && (
                    <span className="ml-1 font-semibold text-[#A9B7C4]">· {item.category}</span>
                  )}
                </p>
                <p className="mt-1.5 text-xs text-gray-400">
                  {item.period} · {getDisplayDuration(item)}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {item.location} · <span className="font-semibold text-[#A9B7C4]">{item.type}</span>
                </p>
                {"highlights" in item && item.highlights && item.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2 text-sm text-gray-300 leading-relaxed">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#A9B7C4]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {"skills" in item && item.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <Chip key={skill} interactive className="text-xs">
                        {skill}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </TimelineRow>
          ))}

          {/* Eğitim - en altta */}
          {education.map((item, index) => (
            <TimelineRow
              key={`edu-${index}`}
              index={index + experienceNewestFirst.length}
              borderBottom={index !== education.length - 1}
            >
              <LogoAvatar
                src={"logo" in item ? item.logo : undefined}
                fallbackIcon={<FaGraduationCap className="h-6 w-6 text-gray-500" />}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-white sm:text-lg">{item.institution}</h3>
                <p className="mt-0.5 text-sm text-gray-300">
                  {item.degree}
                  <span className="ml-1.5 text-[#A9B7C4]">· Eğitim</span>
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {item.years}
                  {"gpa" in item && item.gpa && (
                    <span className="ml-2 text-gray-500">· Ortalama: {item.gpa}</span>
                  )}
                </p>
              </div>
            </TimelineRow>
          ))}
        </GlassCard>
      </div>
    </section>
  );
}
