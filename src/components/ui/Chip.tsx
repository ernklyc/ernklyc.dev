"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { darkChip, darkChipInteractive } from "@/lib/theme";

interface ChipProps extends Omit<HTMLMotionProps<"span">, "children"> {
  interactive?: boolean;
  dotColor?: string;
  children?: ReactNode;
}

/**
 * Site genelindeki tüm etiket/rozet/chip'ler (yetenek etiketleri, dil
 * rozetleri, teknoloji rozetleri) için tek ortak koyu tema. `interactive`
 * true ise hover geçişleri eklenir (tıklanamayan salt bilgi rozetlerinde
 * gerekmez).
 */
export default function Chip({
  interactive = false,
  dotColor,
  className,
  children,
  ...motionProps
}: ChipProps) {
  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm",
        interactive ? darkChipInteractive : darkChip,
        className
      )}
      {...motionProps}
    >
      {dotColor && (
        <span
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </motion.span>
  );
}
