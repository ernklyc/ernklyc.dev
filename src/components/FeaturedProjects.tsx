"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { FEATURED_PROJECTS } from "@/data/featuredProjects";
import { darkChip, glassCard } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Öne çıkan projeler: solda görsel, sağda anlatım ve yönlendirme bağlantıları. Veri: src/data/featuredProjects.ts */
export default function FeaturedProjects() {
  const { t, locale } = useLocale();

  return (
    <section id="featured-projects" className="relative overflow-hidden text-white pt-24 pb-4">
      <SectionBackground />
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <SectionHeading title={t("projects.featuredTitle")} align="left" className="mb-0" />
          <p className="mt-2 text-gray-300">{t("projects.featuredDescription")}</p>
        </div>

        <div className="flex flex-col gap-8">
          {FEATURED_PROJECTS.map((p) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(glassCard, "grid overflow-hidden md:grid-cols-[1.1fr_1fr]")}
            >
              <a
                href={p.links[0]?.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.name}: ${p.links[0]?.label[locale] ?? ""}`}
                className="group relative block aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem]"
              >
                <Image
                  src={p.image.src}
                  alt={p.image.alt[locale]}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0B0E12]/40" />
              </a>

              <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#A9B7C4]">{p.kind[locale]}</p>
                  <h3 className="mt-2 text-3xl font-bold md:text-4xl">{p.name}</h3>
                </div>
                <p className="leading-relaxed text-gray-300">{p.description[locale]}</p>
                <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                  {p.tags.map((tag) => (
                    <li key={tag} className={cn(darkChip, "rounded-full px-3 py-1 text-xs")}>{tag}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-1">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors",
                        l.primary
                          ? "bg-white text-[#0B0E12] hover:bg-[#C7D2DA]"
                          : "border border-white/15 text-white hover:border-white/30 hover:bg-white/[0.06]"
                      )}
                    >
                      {l.label[locale]}
                    </a>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
