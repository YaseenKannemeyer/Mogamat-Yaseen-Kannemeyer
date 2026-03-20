import { FaReact, FaFigma, FaGithub } from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiShadcnui,
  SiVscodium,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const techStack = [
  { name: "React", icon: FaReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Figma", icon: FaFigma },
  { name: "GitHub", icon: FaGithub },
  { name: "VS Code", icon: VscVscode },
  { name: "shadcn/ui", icon: SiShadcnui },
];

const TechStack = () => {
  return (
    <div className="w-full max-w-md mt-0">
      <div className="grid grid-cols-4 gap-4 md:flex md:flex-row md:justify-center md:gap-6">
        {techStack.map(({ name, icon: Icon }) => (
          <div key={name} className="flex flex-col items-center text-center">
            <Icon className="w-10 h-10 md:w-10 md:h-10 text-white" />
            <span className="mt-1 text-xs text-gray-500 capitalize">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
