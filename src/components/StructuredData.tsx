"use client";
import { profile } from "@/data/profile";

const SITE_URL = "https://ernklyc.vercel.app";

/** Öne çıkan uygulamalar (WebSite/SoftwareApplication schema için). */
const FEATURED_APPS = [
  { name: "Link Manager", applicationCategory: "ProductivityApplication", packageId: "com.link.manager" },
  { name: "HP Character Wiki", applicationCategory: "ReferenceApplication", packageId: "com.ek.hpcharacterwiki" },
  { name: "MF Master Online", applicationCategory: "GameApplication", packageId: "com.yelbegen.minemaster" },
] as const;

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "jobTitle": profile.title,
    "email": profile.email,
    "url": SITE_URL,
    "sameAs": [
      profile.links.linkedin,
      profile.links.twitter,
      profile.links.github,
      profile.links.instagram,
      profile.links.youtube,
      profile.links.playStore,
    ],
    "image": `${SITE_URL}/profil_resmim.jpg`,
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
    "description": `Eren Kalaycı - ${profile.bio.short}`,
    "author": {
      "@type": "Person",
      "name": "Eren Kalaycı",
      "alternateName": ["Eren KALAYCI", "eren kalaycı"],
    },
    "url": SITE_URL,
    "keywords": "Eren Kalaycı, Eren KALAYCI, eren kalaycı, bilgisayar mühendisi, mobil uygulama geliştirici",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Eren Kalaycı Portfolio",
    "url": SITE_URL,
    "description": profile.bio.short,
    "author": { "@id": `${SITE_URL}#person` },
    "inLanguage": ["tr", "en"],
  };

  const softwareApplicationSchemas = FEATURED_APPS.map((app) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "applicationCategory": app.applicationCategory,
    "operatingSystem": "ANDROID",
    "offers": {
      "@type": "Offer",
      "url": `https://play.google.com/store/apps/details?id=${encodeURIComponent(app.packageId)}`,
    },
    "author": { "@type": "Person", "name": profile.name },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...personSchema, "@id": `${SITE_URL}#person` }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {softwareApplicationSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

