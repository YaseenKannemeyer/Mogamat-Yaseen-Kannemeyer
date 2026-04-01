/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "../lib/utils";
import { useState } from "react";

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
    <div
      className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}
      style={{ paddingBottom: "6px", paddingRight: "6px" }}
    >
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block flex-shrink-0"
          style={{ perspective: "600px" }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Flip container */}
          <div
            className={cn(sizeClass)}
            style={{
              position: "relative",
              flexShrink: 0,
              transformStyle: "preserve-3d",
              transition: "transform 1.2s cubic-bezier(0.33, 0, 0.2, 1)",
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
                width: "100%",
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                flexShrink: 0,
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
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  minHeight: 0,
                  flexShrink: 0,
                }}
              />
            )}
          </div>

          {/* Flag Badge */}
          {url.showFlag && (
            <div
              className="absolute z-10"
              style={{
                bottom: "0px",
                right: "0px",
                borderRadius: "2px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                lineHeight: 0,
                touchAction: "none",
                pointerEvents: "none",
              }}
            >
              <img
                src="https://flagcdn.com/32x24/za.png"
                srcSet="https://flagcdn.com/32x24/za.png 1x, https://flagcdn.com/48x36/za.png 1.5x"
                width="28"
                height="21"
                alt="South Africa"
                style={{ display: "block", flexShrink: 0 }}
              />
            </div>
          )}
        </a>
      ))}

      {(numPeople ?? 0) > 0 && (
        <div
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full border-2 font-medium",
            "border-white bg-black text-white dark:border-gray-800 dark:bg-white dark:text-black",
            sizeClass,
            "text-xs",
          )}
        >
          +{numPeople}
        </div>
      )}
    </div>
  );
};
