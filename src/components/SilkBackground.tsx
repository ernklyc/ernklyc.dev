"use client";

import { useEffect, useState } from "react";
import Silk from "./Silk";

export default function SilkBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  if (reducedMotion) return null;

  return (
    <Silk speed={3} scale={1} color="#A9B7C4" noiseIntensity={0.9} rotation={0} />
  );
}
