import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { getPublicRepos } from "@/lib/github";
import { getPlayStoreAppsWithIcons } from "@/lib/playstore";
import Repositories from "@/components/Repositories";
import PlayStoreApps from "@/components/PlayStoreApps";
import BlurHashLoading from "@/components/BlurHashLoading";
import HashScrollHandler from "@/components/HashScrollHandler";

// Lazy loading ile performans optimizasyonu
const About = dynamic(() => import("@/components/About"), { 
  loading: () => <BlurHashLoading />
});
const Skills = dynamic(() => import("@/components/Skills"), { 
  loading: () => <BlurHashLoading />
});
const Experience = dynamic(() => import("@/components/Experience"), { 
  loading: () => <BlurHashLoading />
});
const Contact = dynamic(() => import("@/components/Contact"), { 
  loading: () => <BlurHashLoading minHeightClass="min-h-[22rem]" />
});
const Footer = dynamic(() => import("@/components/Footer"), { 
  loading: () => <BlurHashLoading minHeightClass="min-h-[12rem]" />
});

export default async function Home() {
  const [repos, playStoreApps] = await Promise.all([
    getPublicRepos(),
    getPlayStoreAppsWithIcons(),
  ]);

  return (
    <main className="overflow-x-hidden">
      <HashScrollHandler />
      <section>
        <Hero />
      </section>
      <section>
        <About />
      </section>
      <section>
        <Skills />
      </section>
      <section>
        <Experience />
      </section>
      <section id="projects" className="scroll-mt-20">
        <PlayStoreApps apps={playStoreApps} />
        <Repositories repos={repos} />
      </section>
      <section>
        <Contact />
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
