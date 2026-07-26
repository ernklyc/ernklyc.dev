"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const timelineRowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

interface TimelineRowProps {
  index: number;
  borderBottom?: boolean;
  children: ReactNode;
}

/** Deneyim/eğitim listesindeki ortak satır kabuğu (giriş animasyonu + hover). */
export default function TimelineRow({ index, borderBottom = true, children }: TimelineRowProps) {
  return (
    <motion.div
      custom={index}
      variants={timelineRowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      className={cn(
        "flex gap-4 p-4 transition-colors sm:gap-5 sm:p-5",
        borderBottom ? "border-b border-white/[0.08]" : "border-b-0"
      )}
    >
      {children}
    </motion.div>
  );
}
