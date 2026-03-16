"use client";

import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

type LocaleTransitionProps = PropsWithChildren<{
  className?: string;
}>;

export default function LocaleTransition({ children, className }: LocaleTransitionProps) {
  const { isTransitioning, isNavigating } = useLocale();
  const active = isTransitioning || isNavigating;

  return (
    <motion.div
      className={className}
      animate={
        active
          ? { opacity: 0.92, filter: "blur(1.6px) saturate(0.97)" }
          : { opacity: 1, filter: "blur(0px) saturate(1)" }
      }
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
      style={{ willChange: "opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}

