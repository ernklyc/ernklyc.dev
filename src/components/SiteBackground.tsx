"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Beams = dynamic(() => import("./Beams"), { ssr: false });

export default function SiteBackground() {
  const pathname = usePathname();

  // Film arşivi çok sayıda poster/backdrop gösterdiği için burada hafif CSS
  // arka plan kullanılır. Portfolyonun mevcut WebGL görünümü aynen korunur.
  if (pathname.startsWith("/movies")) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#080b0f]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(169,183,196,0.13),transparent_44%)]" />
        <div className="absolute -left-48 top-1/3 h-96 w-96 rounded-full bg-[#7e8fa0]/[0.045] blur-[110px]" />
        <div className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-white/[0.035] blur-[110px]" />
        <div className="absolute inset-0 bg-black/18" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
      <div className="absolute inset-0 bg-black/78" />
    </div>
  );
}
