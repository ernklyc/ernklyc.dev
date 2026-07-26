import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteBackground from "@/components/SiteBackground";
import StructuredData from "@/components/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LocaleProvider } from "@/contexts/LocaleContext";
import LocaleTransition from "@/components/LocaleTransition";
import ClickSpark from "@/components/ClickSpark";
import GlobalCursor from "@/components/GlobalCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['monospace'],
});

// Not: Başlık/açıklama metinlerini bilerek normal büyük/küçük harfle
// ("Eren Kalaycı") yazıyoruz, "Eren KALAYCI" değil. Google, tamamı büyük
// harfli kelimeleri "bağırma" olarak yorumlayıp SERP'te otomatik olarak
// kendi beğendiği şekilde yeniden yazıyor (title rewriting) — biz baştan
// düzgün yazarsak arama sonucunda görünen metni biz kontrol etmiş oluyoruz.
// Sitedeki görsel marka stili (büyük harfli başlıklar) bundan etkilenmiyor,
// bu sadece <title>/<meta description>/JSON-LD gibi SEO metinleri için.
export const metadata: Metadata = {
  title: {
    default: "Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici | Portfolio",
    template: "%s | Eren Kalaycı"
  },
  description: "Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi. Flutter ve Swift ile yüksek performanslı mobil uygulamalar, Unity ile oyunlar ve modern web projeleri geliştiriyorum.",
  keywords: [
    "Eren Kalaycı",
    "Eren KALAYCI",
    "eren kalaycı",
    "Eren Kalayici",
    "Eren Kalayıcı",
    "ernklyc",
    "Eren Kalaycı Flutter",
    "Eren Kalaycı Swift",
    "Eren Kalaycı mobil uygulama geliştirici",
    "Eren Kalaycı Unity",
    "Eren Kalaycı oyun geliştirici",
    "Eren Kalaycı web tasarım",
    "Eren Kalaycı web geliştirme",
    "Eren Kalaycı yazılım mühendisi",
    "Eren Kalaycı bilgisayar mühendisi",
    "Eren Kalaycı LinkedIn",
    "Eren Kalaycı GitHub",
    "Eren Kalaycı Instagram",
    "Eren Kalaycı Trabzon",
    "Eren Kalaycı ernklyc",
    "Flutter",
    "Swift",
    "Unity",
    "React",
    "Mobil Uygulama Geliştirici",
    "Oyun Geliştirici",
    "Web Tasarımı",
    "Web Geliştirme",
    "Yazılım Mühendisi",
    "Bilgisayar Mühendisi",
    "Eren Kalaycı portfolio",
  ],
  authors: [{ name: "Eren Kalaycı" }],
  creator: "Eren Kalaycı",
  publisher: "Eren Kalaycı",
  metadataBase: new URL('https://ernklyc.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ernklyc.dev',
    title: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi. Flutter ve Swift ile yüksek performanslı mobil uygulamalar, Unity ile oyunlar ve modern web projeleri geliştiriyorum.',
    siteName: 'Eren Kalaycı Portfolio',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Eren Kalaycı - Bilgisayar Mühendisi Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi. Flutter ve Swift ile yüksek performanslı mobil uygulamalar, Unity ile oyunlar ve modern web projeleri geliştiriyorum.',
    images: ['/og-default.png'],
    creator: '@ernklycdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'b7Ch3dbsWpPIhfY61o6V7ewNxUfOxZWf4-P3g73Yjkk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sınıf adlarını sabit bir değişkene atayalım
  const bodyClasses = `${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F1923] text-white min-h-screen`;
  
  return (
    <html lang="tr" className="preboot-lock" suppressHydrationWarning>
      <body className={bodyClasses} suppressHydrationWarning>
        <Script id="scroll-restoration-fix" strategy="beforeInteractive">
          {`
            const forceTop = () => {
              if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            };

            const setBootText = () => {
              const bootText = document.getElementById('boot-loader-text');
              if (!bootText) return;
              try {
                const storedLocale = localStorage.getItem('locale');
                bootText.textContent = storedLocale === 'en' ? 'Page loading' : 'Sayfa yükleniyor';
              } catch {
                bootText.textContent = 'Sayfa yükleniyor';
              }
            };

            const releasePreboot = () => {
              const finalize = () => {
                forceTop();
                document.documentElement.classList.remove('preboot-lock');
              };
              requestAnimationFrame(() => requestAnimationFrame(finalize));
            };

            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }

            setBootText();
            forceTop();
            window.addEventListener('load', () => {
              forceTop();
              setTimeout(forceTop, 80);
              setTimeout(forceTop, 220);
              setTimeout(releasePreboot, 520);
            });
            window.addEventListener('pageshow', () => {
              forceTop();
              setTimeout(releasePreboot, 320);
            });
            window.addEventListener('beforeunload', () => {
              forceTop();
              document.documentElement.classList.add('preboot-lock');
            });

            setTimeout(releasePreboot, 900);
          `}
        </Script>

        <SmoothScrollProvider />
        <SiteBackground />

        <div id="boot-loader" aria-hidden="true">
          <div className="boot-loader-content">
            <div className="boot-loader-spinner" />
            <p id="boot-loader-text" className="boot-loader-text">Sayfa yükleniyor</p>
          </div>
        </div>

        <GlobalCursor />

        <LocaleProvider>
          <StructuredData />
          <ErrorBoundary>
            <ClickSpark sparkColor="#A9B7C4" sparkSize={10} sparkRadius={18} sparkCount={8} duration={400}>
              <Navbar />
              <LocaleTransition>
                {children}
              </LocaleTransition>
            </ClickSpark>
          </ErrorBoundary>
        </LocaleProvider>
      </body>
    </html>
  );
}
