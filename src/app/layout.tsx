import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F1923] text-white min-h-screen`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
