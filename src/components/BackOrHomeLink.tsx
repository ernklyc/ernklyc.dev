"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

type BackOrHomeLinkProps = {
  children: ReactNode;
  className?: string;
};

export default function BackOrHomeLink({ children, className }: BackOrHomeLinkProps) {
  const router = useRouter();
  const { setIsNavigating } = useLocale();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNavigating(true);

    setTimeout(() => {
      const hasSameOriginReferrer =
        typeof window !== "undefined" &&
        document.referrer &&
        document.referrer.startsWith(window.location.origin);

      if (hasSameOriginReferrer) {
        router.back();
      } else {
        router.push("/");
      }

      setTimeout(() => setIsNavigating(false), 140);
    }, 170);
  };

  return (
    <Link href="/" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
