"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams";

export const BackgroundWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 overflow-hidden">
      <div className="relative z-10 flex justify-center items-center p-10">
        {children}
      </div>
      <BackgroundBeams />
    </div>
  );
}
