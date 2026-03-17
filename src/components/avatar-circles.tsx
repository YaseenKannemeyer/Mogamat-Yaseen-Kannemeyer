/* eslint-disable @next/next/no-img-element */
"use client"

import { cn } from "../lib/utils"
import { useState } from "react"
import { Za } from "react-flags-select" // import the flag component

interface Avatar {
  imageUrl: string
  profileUrl: string
  hoverUrl?: string
  showFlag?: boolean // <-- use this to display the ZA flag
}

interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: Avatar[]
  sizeClass?: string
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  sizeClass = "h-10 w-10",
}: AvatarCirclesProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Default Image */}
          <img
            src={url.imageUrl}
            alt={`Avatar ${index + 1}`}
            className={cn(
              "rounded-full border-2 border-white dark:border-gray-800 object-cover",
              sizeClass,
              "transition-opacity duration-800 ease-in-out"
            )}
            style={{
              opacity: hoveredIndex === index && url.hoverUrl ? 0 : 1,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Hover Image */}
          {url.hoverUrl && (
            <img
              src={url.hoverUrl}
              alt={`Avatar Hover ${index + 1}`}
              className={cn(
                "rounded-full border-2 border-white dark:border-gray-800 object-cover",
                sizeClass,
                "transition-opacity duration-800 ease-in-out"
              )}
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
              }}
            />
          )}

          {/* Flag Badge */}
          {url.showFlag && (
            <div className="absolute bottom-0 right-0 overflow-hidden h-7 w-7">
              <Za className="w-full h-full" /> {/* full size of the badge */}
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
            "text-xs"
          )}
          href=""
        >
          +{numPeople}
        </a>
      )}
    </div>
  )
}
