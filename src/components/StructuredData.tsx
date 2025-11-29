"use client";
import { profile } from "@/data/profile";

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "jobTitle": profile.title,
    "email": profile.email,
    "url": "https://ernklyc.vercel.app",
    "sameAs": [
      profile.links.github,
      profile.links.linkedin,
      profile.links.twitter,
    ],
    "image": "https://ernklyc.vercel.app/profil_resmim.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR",
      "addressLocality": profile.location,
    },
    "knowsAbout": [
      "Flutter",
      "React",
      "Next.js",
      "Unity",
      "C#",
      "Mobil Uygulama Geliştirme",
      "Web Geliştirme",
      "Oyun Geliştirme",
    ],
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": `Eren Kalaycı Portfolio`,
    "description": `Eren Kalaycı - ${profile.bio.short}. Eren Kalaycı'nın portfolyosu, projeleri ve deneyimleri.`,
    "author": {
      "@type": "Person",
      "name": "Eren Kalaycı",
      "alternateName": ["Eren KALAYCI", "eren kalaycı"],
    },
    "url": "https://ernklyc.vercel.app",
    "keywords": "Eren Kalaycı, Eren KALAYCI, eren kalaycı, bilgisayar mühendisi, mobil uygulama geliştirici",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
    </>
  );
}

