"use client";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loading({ size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-[#FF4655]/20 border-t-[#FF4655] rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      {text && (
        <p className="text-gray-300 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}
