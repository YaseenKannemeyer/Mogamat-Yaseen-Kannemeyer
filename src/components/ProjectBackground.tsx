"use client";
import React, { Suspense, lazy } from "react";
import { useEffect, useState } from "react";
import { useActiveWhenVisible } from "../hooks/use-active-when-visible";

// 50 SVG gradients animating on repeat: Infinity. Worth keeping out of the
// initial bundle and off the main thread until it is actually on screen.
const BackgroundBeams = lazy(() =>
  import("./ui/background-beams").then((m) => ({ default: m.BackgroundBeams })),
);

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
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
  const [sectionRef, visible] = useActiveWhenVisible<HTMLDivElement>();

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen w-full bg-neutral-950 overflow-hidden"
    >
      {!isMobile && visible && (
        <Suspense fallback={null}>
          <BackgroundBeams className="absolute inset-0 w-full h-full" />
        </Suspense>
      )}
      <div className="relative z-10 flex justify-center items-start p-10">
        {children}
      </div>
    </div>
  );
};
