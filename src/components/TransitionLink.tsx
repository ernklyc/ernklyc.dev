"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import type { ReactNode } from "react";

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter();
  const { setIsNavigating } = useLocale();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
      setTimeout(() => setIsNavigating(false), 120);
    }, 180);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
