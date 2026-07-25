"use client";

import dynamic from "next/dynamic";

const SilkBackground = dynamic(() => import("./SilkBackground"), { ssr: false });

export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 opacity-45">
        <SilkBackground />
      </div>
      <div className="absolute inset-0 bg-[#0A0F1C]/70" />
    </div>
  );
}
