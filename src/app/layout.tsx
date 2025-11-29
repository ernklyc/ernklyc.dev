import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AISupport from "@/components/AISupport";
import StructuredData from "@/components/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

export const metadata: Metadata = {
  title: {
    default: "Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici | Portfolio",
    template: "%s | Eren Kalaycı"
  },
  description: "Eren Kalaycı - Flutter, React ve Unity uzmanı bilgisayar mühendisi. Mobil uygulama geliştirme, web geliştirme ve oyun geliştirme projeleri. Eren Kalaycı'nın portfolyosu ve projeleri.",
  keywords: ["Eren Kalaycı", "Eren KALAYCI", "eren kalaycı", "Flutter", "React", "Unity", "Mobil Uygulama", "Web Geliştirme", "Bilgisayar Mühendisi", "Portfolio", "Mobil Uygulama Geliştirici", "Eren Kalaycı portfolio"],
  authors: [{ name: "Eren Kalaycı" }],
  creator: "Eren Kalaycı",
  publisher: "Eren Kalaycı",
  metadataBase: new URL('https://ernklyc.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ernklyc.vercel.app',
    title: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Eren Kalaycı - Flutter, React ve Unity uzmanı bilgisayar mühendisi. Mobil uygulama geliştirme, web geliştirme ve oyun geliştirme projeleri.',
    siteName: 'Eren Kalaycı Portfolio',
    images: [
      {
        url: '/profil_resmim.jpg',
        width: 1200,
        height: 630,
        alt: 'Eren Kalaycı - Bilgisayar Mühendisi Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eren Kalaycı - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Eren Kalaycı - Flutter, React ve Unity uzmanı bilgisayar mühendisi. Portfolio ve projeler.',
    images: ['/profil_resmim.jpg'],
    creator: '@ernklyc',
  },
  icons: {
    icon: '/profil_resmim.jpg',
    shortcut: '/profil_resmim.jpg',
    apple: '/profil_resmim.jpg',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sınıf adlarını sabit bir değişkene atayalım
  const bodyClasses = `${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F1923] text-white min-h-screen`;
  
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className={bodyClasses} suppressHydrationWarning>
        <StructuredData />
        <ErrorBoundary>
          <Navbar />
          {children}
          <AISupport />
        </ErrorBoundary>
      </body>
    </html>
  );
}
