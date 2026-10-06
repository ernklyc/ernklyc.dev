"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";

const ITEMS = [
  { href: "/klyc-box", tr: "Genel", en: "Overview" },
  { href: "/klyc-box/database", tr: "Veritabanı", en: "Database" },
  { href: "/klyc-box/anti-cheat", tr: "Hile koruması", en: "Anti-cheat" },
] as const;

/** KLYC-Box sayfalarının ortak alt gezinmesi: Genel · Veritabanı · Hile koruması. */
export default function KlycBoxNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  return (
    <nav aria-label="KLYC-Box" className="flex flex-wrap gap-2">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition-colors " +
              (active
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white")
            }
          >
            {locale === "tr" ? item.tr : item.en}
          </Link>
        );
      })}
    </nav>
  );
}
