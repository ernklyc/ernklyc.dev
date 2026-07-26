"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { glassCard, glassCardHover } from "@/lib/theme";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
}

/**
 * Site genelindeki tüm section kartlarının (About, Skills, Contact,
 * Experience, Repositories, PlayStoreApps) ortak, tek tonlu, minimal
 * cam (glassmorphism) kabuğu. Kart arka planı/kenarlığı/hover geçişi
 * burada tek merkezde tanımlıdır; her section sadece içeriğini geçer.
 */
export default function GlassCard({ className, children, ...motionProps }: GlassCardProps) {
  return (
    <motion.div className={cn(glassCard, glassCardHover, "relative", className)} {...motionProps}>
      {children}
    </motion.div>
  );
}
