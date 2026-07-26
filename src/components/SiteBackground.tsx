"use client";

import dynamic from "next/dynamic";

const Beams = dynamic(() => import("./Beams"), { ssr: false });

export default function SiteBackground() {
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
