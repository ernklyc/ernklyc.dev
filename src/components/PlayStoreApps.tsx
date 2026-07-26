"use client";
import Image from "next/image";
import type { PlayStoreApp } from "@/lib/playstore";
import { useLocale } from "@/contexts/LocaleContext";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import { glassCard, glassCardHover } from "@/lib/theme";
import { cn } from "@/lib/utils";

const PLAY_STORE_DEV_URL = "https://play.google.com/store/apps/dev?id=6576291249346115918";

interface PlayStoreAppsProps {
  apps: PlayStoreApp[];
}

export default function PlayStoreApps({ apps }: PlayStoreAppsProps) {
  const { t } = useLocale();
  const isEmpty = !apps || apps.length === 0;

  return (
    <section id="play-store-apps" className="relative overflow-hidden text-white py-24">
      <SectionBackground />
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 text-center md:text-left">
          <div>
            <SectionHeading title={t("projects.playStoreTitle")} align="left" className="mb-0" />
            <p className="mt-2 text-gray-300">
              {isEmpty ? (
                t("projects.playStoreEmpty")
              ) : (
                <>
                  {t("projects.playStoreDescription")}{" "}
                  <a
                    href={PLAY_STORE_DEV_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A9B7C4] hover:text-[#C7D2DA] underline underline-offset-4 transition-colors"
                    aria-label="Google Play geliştirici sayfasını aç"
                  >
                    {t("projects.playStorePage")}
                  </a>{" "}
                  {t("projects.playStoreVisit")}
                </>
              )}
            </p>
          </div>
        </div>

        {!isEmpty && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <a
                key={app.packageId}
                href={app.playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(glassCard, glassCardHover, "group p-6 flex flex-col")}
                title={`${app.name} - Google Play'de aç`}
                aria-label={`${app.name} uygulamasını Play Store'da aç`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-[#12161B]/70 border border-white/10">
                    {app.iconUrl ? (
                      <Image src={app.iconUrl} alt={`${app.name} ikon`} width={56} height={56} className="object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white/70">{app.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-[#A9B7C4] transition-colors truncate">
                      {app.name}
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-auto inline-flex items-center gap-1 group-hover:text-[#A9B7C4] transition-colors">
                  {t("projects.playStoreCta")}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
