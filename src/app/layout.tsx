import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AISupport from "@/components/AISupport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "EREN KALAYCI - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici",
    template: "%s | EREN KALAYCI"
  },
  description: "Flutter, React ve Unity uzmanı Eren KALAYCI'nin portfolyosu. Mobil uygulama geliştirme, web geliştirme ve oyun geliştirme projeleri.",
  keywords: ["Flutter", "React", "Unity", "Mobil Uygulama", "Web Geliştirme", "Bilgisayar Mühendisi", "Portfolio"],
  authors: [{ name: "Eren KALAYCI" }],
  creator: "Eren KALAYCI",
  publisher: "Eren KALAYCI",
  metadataBase: new URL('https://ernklyc.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ernklyc.vercel.app',
    title: 'EREN KALAYCI - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Flutter, React ve Unity uzmanı Eren KALAYCI\'nin portfolyosu. Mobil uygulama geliştirme, web geliştirme ve oyun geliştirme projeleri.',
    siteName: 'EREN KALAYCI Portfolio',
    images: [
      {
        url: '/profil_resmim.jpg',
        width: 1200,
        height: 630,
        alt: 'Eren KALAYCI Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EREN KALAYCI - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici',
    description: 'Flutter, React ve Unity uzmanı Eren KALAYCI\'nin portfolyosu.',
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
    <html lang="tr" className="scroll-smooth">
      <body className={bodyClasses}>
        <Navbar />
        {children}
        <AISupport />
      </body>
    </html>
  );
}
