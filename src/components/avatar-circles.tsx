/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "../lib/utils";
import { useState } from "react";
import { Za } from "react-flags-select";

interface Avatar {
  imageUrl: string;
  profileUrl: string;
  hoverUrl?: string;
  showFlag?: boolean;
}

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Avatar[];
  sizeClass?: string;
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  sizeClass = "h-10 w-10",
}: AvatarCirclesProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block"
          style={{ perspective: "600px" }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Flip container */}
          <div
            className={cn(sizeClass)}
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              // 3 full spins (1080°) + land on back face (180°) = 1260°
              // On mouse leave: reverse back — 3 full spins landing on front (0°)
              transition:
                hoveredIndex === index && url.hoverUrl
                  ? "transform 1.2s cubic-bezier(0.33, 0, 0.2, 1)"
                  : "transform 1.2s cubic-bezier(0.33, 0, 0.2, 1)",
              transform:
                hoveredIndex === index && url.hoverUrl
                  ? "rotateY(1260deg)"
                  : "rotateY(0deg)",
            }}
          >
            {/* Front face — default image */}
            <img
              src={url.imageUrl}
              alt={`Avatar ${index + 1}`}
              className={cn(
                "rounded-full border-2 border-white dark:border-gray-800 object-cover",
                sizeClass,
              )}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />

            {/* Back face — hover image */}
            {url.hoverUrl && (
              <img
                src={url.hoverUrl}
                alt={`Avatar Back ${index + 1}`}
                className={cn(
                  "rounded-full border-2 border-white dark:border-gray-800 object-cover",
                  sizeClass,
                )}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </div>

          {/* Flag Badge */}
          {url.showFlag && (
            <div className="absolute bottom-0 right-0 overflow-hidden h-7 w-7 z-10">
              <Za className="w-full h-full" />
            </div>
          )}
        </a>
      ))}

      {(numPeople ?? 0) > 0 && (
        <a
          className={cn(
            "flex items-center justify-center rounded-full border-2 font-medium",
            "border-white bg-black text-white dark:border-gray-800 dark:bg-white dark:text-black",
            sizeClass,
            "text-xs",
          )}
        >
          +{numPeople}
        </a>
      )}
    </div>
  );
};
