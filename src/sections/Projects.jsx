import { useState } from "react";
import { ExpandableCard } from "../components/ExpandableCard";
import { BackgroundWrapper } from "../components/ProjectBackground";
import { motion, AnimatePresence } from "framer-motion";

const allTags = [
  "All",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Java",
  "Java Swing",
  "Apache Derby",
];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <BackgroundWrapper>
      <div
        id="projects"
        className="container mx-auto max-w-4xl px-4 py-16 flex flex-col gap-10 self-start w-full"
      >
        {/* Header Row */}
        <div className="flex items-end justify-between gap-4">
          {/* Left: Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Projects
            </h2>
            <p className="text-neutral-500 text-sm max-w-xs mt-1 hidden md:block">
              Click any project to learn more.
            </p>
          </div>

          {/* Right: Expanding Search */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  key="search-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  autoFocus
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono overflow-hidden"
                />
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (searchOpen) setSearch("");
              }}
              className={`p-2 rounded-xl border transition-colors ${
                searchOpen
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-blue-500 hover:text-blue-400"
              }`}
            >
              {searchOpen ? (
                // X icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              ) : (
                // Search icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-all duration-200 ${
                activeTag === tag
                  ? "bg-blue-500 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                  : "bg-transparent border-neutral-700 text-neutral-400 hover:border-blue-500 hover:text-blue-400"
              }`}
            >
              {activeTag === tag && (
                <span className="mr-1 text-blue-200">▸</span>
              )}
              {tag}
            </button>
          ))}
        </div>

        {/* Cards */}
        <ExpandableCard search={search} activeTag={activeTag} />
      </div>
    </BackgroundWrapper>
  );
};

export default Projects;
