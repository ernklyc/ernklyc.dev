"use client";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

// Lazy loading ile performans optimizasyonu
const About = dynamic(() => import("@/components/About"), { 
  loading: () => <div className="h-screen bg-[#0A0F1C] animate-pulse" />
});
const Skills = dynamic(() => import("@/components/Skills"), { 
  loading: () => <div className="h-screen bg-[#0F1923] animate-pulse" />
});
const Experience = dynamic(() => import("@/components/Experience"), { 
  loading: () => <div className="h-screen bg-[#151F2B] animate-pulse" />
});
const Projects = dynamic(() => import("@/components/Projects"), { 
  loading: () => <div className="h-screen bg-[#0A0F1C] animate-pulse" />
});
const Contact = dynamic(() => import("@/components/Contact"), { 
  loading: () => <div className="h-screen bg-[#0F1923] animate-pulse" />
});
const Footer = dynamic(() => import("@/components/Footer"), { 
  loading: () => <div className="h-32 bg-[#151F2B] animate-pulse" />
});

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
