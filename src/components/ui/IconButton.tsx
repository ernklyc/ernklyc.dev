"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { darkIconButton } from "@/lib/theme";

interface IconButtonProps extends HTMLMotionProps<"a"> {
  href: string;
  external?: boolean;
}

/**
 * Sosyal medya / iletişim ikon butonları (Hero, Footer) için ortak
 * koyu tema + hover/tap animasyonu. Aynı görsel dili tek yerden yönetir.
 */
export default function IconButton({
  href,
  external = true,
  className,
  children,
  ...motionProps
}: IconButtonProps) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn("group p-3.5 rounded-xl", darkIconButton, className)}
      {...motionProps}
    >
      {children}
    </motion.a>
  );
}
