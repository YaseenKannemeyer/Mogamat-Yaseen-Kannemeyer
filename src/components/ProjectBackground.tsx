"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export const BackgroundWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 overflow-hidden">
      {!isMobile && (
        <BackgroundBeams className="absolute inset-0 w-full h-full" />
      )}
      <div className="relative z-10 flex justify-center items-start p-10">
        {children}
      </div>
    </div>
  );
};
