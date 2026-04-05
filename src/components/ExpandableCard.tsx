"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const cards = [
  {
    description: "Three.js • Tween.js • 3D Interactive Gallery",
    title: "3D Rotating Art Gallery",
    tags: ["Three.js", "Tween.js", "3D", "WebGL", "JavaScript"],
    src: "/assets/projectimages/3d-gallery-project.png",
    ctaText: "View Live",
    ctaLink: "https://artwork-gallary.vercel.app/",
    githubText: "GitHub" as string | undefined,
    githubLink: "https://github.com/YaseenKannemeyer/Artwork-Gallary" as
      | string
      | undefined,
    content: () => (
      <p>
        A fully interactive 3D art gallery built with Three.js featuring six
        artworks arranged in a 360° circular layout. Users can navigate between
        artworks using raycast-enabled left/right arrows, while smooth tween.js
        animations handle rotation with quadratic easing. <br />
        <br />
        Each artwork is encased in a realistic gold frame, constructed with
        layered BoxGeometry and metallic MeshStandardMaterials to simulate true
        gallery frames. Museum-style plaques dynamically display the artwork's
        title, artist, year, and a short description, fading in and out as the
        gallery rotates. <br />
        <br />
        The gallery includes a mirror floor using Reflector for a polished
        aesthetic, dramatic overhead spotlighting for immersive lighting, and
        ambient fill for balance. <br />
        <br />
        <strong>Key features:</strong>
        <br />
        • Circular rotating gallery with 6 artworks
        <br />
        • Smooth tween.js transitions with Quadratic.InOut easing
        <br />
        • Gold ornate frames with realistic sheen
        <br />
        • Museum-style plaques with fading UI content
        <br />
        • Mirror floor for reflection and depth
        <br />
        • Raycasting navigation via 3D arrow buttons
        <br />
        • Spotlight lighting with ambient fill
        <br />
        <br />
        <strong>Original changes from tutorial:</strong>
        <br />
        • Redesigned frames with two-layer gold and inner bevel for depth
        <br />
        • Custom HTML plaques connected to 3D scene with opacity fade
        transitions
        <br />
        <br />
        <strong>Core concepts learned:</strong>
        <br />
        1. Three.js fundamentals: Scene, PerspectiveCamera, WebGLRenderer,
        setAnimationLoop
        <br />
        2. 3D objects & geometry: BoxGeometry, CircleGeometry,
        MeshStandardMaterial
        <br />
        3. Textures & image mapping: TextureLoader, sRGB color space
        <br />
        4. Scene graph & transformations: Object3D grouping, positioning,
        rotation
        <br />
        5. Lighting & realism: AmbientLight, SpotLight, material response
        <br />
        6. Advanced visual effects: Reflector for reflective floor, immersive
        depth
        <br />
        7. Interactivity: Raycaster for mouse click detection and navigation
        <br />
        8. Animations: tween.js for smooth gallery rotation with easing
        <br />
        9. UI + 3D integration: Dynamic plaques, opacity transitions
      </p>
    ),
  },
  {
    description: "Next.js • Framer Motion • TypeScript",
    title: "Framer Motion — React Animation Blog",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    src: "/assets/projectimages/framer-motion-project.png",
    ctaText: "View Live",
    ctaLink: "https://framer-motion-react-beta.vercel.app/",
    githubText: "GitHub" as string | undefined,
    githubLink: "https://github.com/YaseenKannemeyer/framer-motion-react" as
      | string
      | undefined,
    content: () => (
      <p>
        An interactive animation blog built with Next.js that teaches React
        animation from the ground up using Framer Motion. Every concept is
        paired with a live demo so readers can instantly understand what the
        code produces. <br />
        <br />
        The blog covers 14 animation concepts — from basic entrance animations
        and easing curves to advanced topics like AnimatePresence, layout FLIP
        animations, and keyframe loops. Each section includes source code,
        interactive controls such as sliders and toggles, and annotated notes
        explaining the mental model behind each animation technique. <br />
        <br />
        Features include a scroll-spy sidebar navigation, animated gradient
        dividers, word-by-word hero animations, spring-based micro-interactions,
        and a fully responsive layout that adapts cleanly to mobile devices.
      </p>
    ),
  },
  {
    description: "Next.js • React Hooks Learning Platform",
    title: "How To React Hooks",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    src: "/assets/projectimages/hooks-project.png",
    ctaText: "View Live",
    ctaLink: "https://how-to-react-hooks.vercel.app/",
    githubText: "GitHub" as string | undefined,
    githubLink: "https://github.com/YaseenKannemeyer/how-to-react-hooks" as
      | string
      | undefined,
    content: () => (
      <p>
        A visual, example-driven guide to mastering React hooks built with
        Next.js, TypeScript, and Framer Motion. Each hook has its own dedicated
        page explaining the mental model, common pitfalls, and includes a live
        interactive demo users can experiment with directly in the browser.
        <br />
        <br />
        The platform currently covers all 9 core React hooks from useState to
        useImperativeHandle, with more planned. It also serves as a showcase of
        modern frontend architecture featuring animated page transitions,
        responsive sidebar navigation with a mobile bottom sheet, and a
        consistent purple editorial design system.
      </p>
    ),
  },
  {
    description: "Java Swing • Apache Derby • Desktop App",
    title: "CampusCompanion",
    tags: ["Java", "Java Swing", "Apache Derby"],
    src: "/assets/projectimages/campus-companion.png",
    ctaText: "GitHub",
    ctaLink: "https://github.com/YaseenKannemeyer/CampusCompanion",
    githubText: undefined as string | undefined,
    githubLink: undefined as string | undefined,
    content: () => (
      <p>
        A modern Java Swing desktop application designed to help students stay
        organized and productive. The application includes an interactive
        dashboard, timetable manager, grade calculator, and real-time
        notifications powered by an Apache Derby database. <br />
        <br />
        As Group Leader and Lead Front-End Designer, I coordinated development
        efforts and designed the main UI architecture to ensure a clean, modern,
        and user-friendly experience inspired by contemporary web design
        patterns.
      </p>
    ),
  },
  {
    description: "UI/UX Design • Figma • Mobile App Redesign",
    title: "MyCiTi Bus App — UX Redesign Case Study",
    tags: ["Figma", "UI/UX", "Mobile Design", "User Research"],
    src: "/assets/projectimages/myciti-redesign.png",

    ctaText: "Prototype",
    ctaLink:
      "https://www.figma.com/proto/YYuOtxbjpZf5YxaIg5Gdql/MAF?node-id=0-1&t=jVuFhMHgyd9kqhmI-1",

    githubText: "Design File",
    githubLink:
      "https://www.figma.com/design/YYuOtxbjpZf5YxaIg5Gdql/MAF?node-id=375-2133&t=X9LMQMifEB9c97zZ-1",

    content: () => (
      <p>
        This project is a UX/UI redesign of the MyCiTi bus app, inspired by
        negative user feedback on the Google Play Store. Many users reported
        that the existing interface feels outdated, difficult to navigate, and
        unreliable — especially for daily commuters who depend on the app.{" "}
        <br />
        <br />
        The redesign focuses on improving usability, clarity, and overall user
        experience by introducing a modern, intuitive interface. Two key areas
        were prioritised: the dashboard and the About Us page. <br />
        <br />
        The dashboard was redesigned as the central hub of the app, giving users
        quick access to essential features such as live bus tracking, saved card
        details, and timetables. A major usability issue identified was the
        difficulty in saving and accessing MyCiTi cards. The current system
        requires repeated scanning, which is slow and often unreliable. This
        redesign introduces a secure method for saving or manually entering card
        details, making the process faster and more efficient. <br />
        <br />
        Another major improvement is live tracking. Due to frequent delays and
        breakdowns, commuters need accurate real-time updates. The redesigned
        dashboard places live tracking at the forefront, ensuring users always
        know where their bus is and when it will arrive. <br />
        <br />
        The About Us page, while a smaller feature, was also refined to improve
        transparency and trust. It provides clear information about services,
        company values, and support channels, helping users feel more confident
        in the system. <br />
        <br />
        Overall, this redesign aims to create a smoother, more reliable, and
        user-friendly experience tailored to the real needs of everyday
        commuters.
      </p>
    ),
  },
];

type Card = (typeof cards)[number];

export function ExpandableCard({
  search = "",
  activeTag = "All",
}: {
  search?: string;
  activeTag?: string;
}) {
  const [active, setActive] = useState<Card | null>(null);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const filtered = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || card.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const visibleCards = showAll ? filtered : filtered.slice(0, 5);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-100">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="relative w-full max-w-[500px] h-full md:h-fit md:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-y-auto"
            >
              <motion.button
                key={`close-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="fixed top-16 right-4 z-200 md:absolute md:top-2 md:right-2 md:z-10 flex items-center justify-center bg-white dark:bg-neutral-700 rounded-full h-8 w-8 shadow-md"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>

              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {active.ctaLink && (
                      <a
                        href={active.ctaLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 text-sm rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center text-center"
                      >
                        {active.ctaText}
                      </a>
                    )}
                    {active.githubLink && (
                      <a
                        href={active.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 text-sm rounded-full font-bold bg-neutral-800 border border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white transition-colors flex items-center justify-center text-center"
                      >
                        {active.githubText}
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card List */}
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {filtered.length === 0 ? (
          <p className="text-neutral-500 font-mono text-sm text-center py-10">
            No projects match your search.
          </p>
        ) : (
          <>
            <AnimatePresence>
              {visibleCards.map((card) => (
                <motion.li
                  layout
                  key={`card-${card.title}-${id}`}
                  onClick={() => setActive(card)}
                  className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                >
                  <div className="flex gap-4 flex-col md:flex-row">
                    <motion.div layoutId={`image-${card.title}-${id}`}>
                      <img
                        width={100}
                        height={100}
                        src={card.src}
                        alt={card.title}
                        className="h-40 w-full md:h-14 md:w-14 rounded-lg object-cover object-top"
                      />
                    </motion.div>
                    <div>
                      <motion.h3
                        layoutId={`title-${card.title}-${id}`}
                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${card.description}-${id}`}
                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                      >
                        {card.description}
                      </motion.p>
                    </div>
                  </div>

                  <div
                    className="flex gap-2 mt-4 md:mt-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {card.ctaLink && (
                      <a
                        href={card.ctaLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 text-sm rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        {card.ctaText}
                      </a>
                    )}
                    {card.githubLink && (
                      <a
                        href={card.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 text-sm rounded-full font-bold bg-neutral-800 border border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white transition-colors"
                      >
                        {card.githubText}
                      </a>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {/* View All Button */}
            {filtered.length > 5 && !showAll && (
              <div className="flex justify-center mt-4">
                <motion.button
                  layout
                  className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
                  onClick={() => setShowAll(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All
                </motion.button>
              </div>
            )}
          </>
        )}
      </ul>
    </>
  );
}
