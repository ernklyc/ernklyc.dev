import Image from "next/image";
import type { PlayStoreApp } from "@/lib/playstore";

const PLAY_STORE_DEV_URL = "https://play.google.com/store/apps/dev?id=6576291249346115918";

interface PlayStoreAppsProps {
  apps: PlayStoreApp[];
}

export default function PlayStoreApps({ apps }: PlayStoreAppsProps) {
  return (
    <section
      id="play-store-apps"
      className="relative overflow-hidden bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white px-6 py-16 md:px-16"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              Google Play Uygulamalarım
            </h2>
            <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-[#FF4655] to-transparent rounded mt-2 mx-auto md:mx-0" />
            <p className="mt-4 text-gray-300">
              Yelbegen Software adıyla yayınladığım mobil uygulamalar. Hepsini
              görmek için{" "}
              <a
                href={PLAY_STORE_DEV_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4655] hover:text-[#FF6B7A] underline underline-offset-4 transition-colors"
                aria-label="Google Play geliştirici sayfasını aç"
              >
                Google Play sayfamı
              </a>{" "}
              ziyaret edebilirsin.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <a
              key={app.packageId}
              href={app.playStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#1F2731]/80 to-[#0F1923]/90 backdrop-blur-sm p-5 flex flex-col hover:border-white/20 transition-all duration-500"
              title={`${app.name} - Google Play'de aç`}
              aria-label={`${app.name} uygulamasını Play Store'da aç`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                  {app.iconUrl ? (
                    <Image
                      src={app.iconUrl}
                      alt={`${app.name} ikon`}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white/70">
                      {app.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-[#FF4655] transition-colors truncate">
                    {app.name}
                  </h3>
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-auto inline-flex items-center gap-1 group-hover:text-[#FF4655] transition-colors">
                Google Play&apos;de gör →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
