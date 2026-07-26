"use client";

import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

/**
 * Her section başlığında tekrarlanan "SplitText + altında açılan çizgi"
 * deseni. Tüm section'lar (About, Skills, Experience, Contact, Projeler)
 * bu tek component üzerinden aynı başlık davranışını paylaşır.
 */
export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn("mb-12", isCenter ? "text-center" : "", className)}>
      <div className={cn("inline-block relative", isCenter ? "" : "block")}>
        <SplitText
          text={title}
          tag="h2"
          className="text-2xl md:text-4xl font-bold text-white"
          splitType="words"
          delay={30}
          duration={0.8}
          ease="power3.out"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.05}
          rootMargin="150px"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={cn(
            "h-1 mt-2",
            isCenter
              ? "bg-gradient-to-r from-transparent via-white to-transparent mx-auto"
              : "bg-gradient-to-r from-white to-transparent rounded"
          )}
        />
      </div>
      {subtitle && (
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
