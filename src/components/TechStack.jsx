import {
  FaReact,
  FaFigma,
  FaGithub,
  FaGitAlt,
  FaNodeJs,
  FaJava,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiJavascript,
  SiLaravel,
  SiPhp,
  SiPostgresql,
  SiSupabase,
  SiMysql,
  SiOpenjdk, // just once
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const techStack = [
  { name: "React", icon: FaReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-sky-400" },

  { name: "Java", icon: FaJava, color: "text-red-600" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "PHP", icon: SiPhp, color: "text-indigo-400" },
  { name: "Laravel", icon: SiLaravel, color: "text-red-500" },

  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-400" },
  { name: "Supabase", icon: SiSupabase, color: "text-emerald-400" },
  { name: "SQL", icon: SiMysql, color: "text-orange-400" },

  { name: "Git", icon: FaGitAlt, color: "text-orange-500" },
  { name: "GitHub", icon: FaGithub, color: "text-gray-300" },
  { name: "VS Code", icon: VscVscode, color: "text-blue-400" },
  { name: "Figma", icon: FaFigma, color: "text-pink-400" },
];

const TechStack = () => {
  return (
    <div className="w-full max-w-md mt-2">
      <div className="grid grid-cols-4 gap-4 md:flex md:flex-nowrap md:justify-center md:gap-6">
        {techStack.map(({ name, icon: Icon, color }) => (
          <div
            key={name}
            className="group flex flex-col items-center text-center"
          >
            {/* Glow + animation wrapper */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-30 group-hover:opacity-70 transition duration-300 bg-current" />

              <Icon
                className={`relative w-10 h-10 ${color}
                transition-all duration-300
                group-hover:scale-125
                group-hover:-translate-y-1
                animate-[float_3s_ease-in-out_infinite]`}
              />
            </div>

            <span
              className={`mt-1 text-xs text-white 
    drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
    group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)]
    transition-all duration-300`}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
