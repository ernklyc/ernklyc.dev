"use client";

import { useEffect, useState } from "react";
import { CursorProvider, Cursor } from "@/components/animate-ui/components/animate/cursor";

export default function GlobalCursor() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    setHasFinePointer(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setHasFinePointer(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  if (!hasFinePointer) return null;

  return (
    <CursorProvider global>
      <Cursor />
    </CursorProvider>
  );
}
