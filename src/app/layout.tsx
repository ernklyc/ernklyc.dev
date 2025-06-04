import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
  title: "EREN KALAYCI",
  description: "Eren KALAYCI - Bilgisayar Mühendisi & Mobil Uygulama Geliştirici Portfolyosu",
  icons: {
    icon: '/profil_resmim.jpg',
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
      </body>
    </html>
  );
}
