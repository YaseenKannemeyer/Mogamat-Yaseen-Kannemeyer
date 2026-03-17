import StackIcon from "tech-stack-icons";

// Your tech stack array
const techStack = [
  { name: "react", variant: "dark" },
  { name: "nextjs2", variant: "dark" },
  { name: "tailwindcss", variant: "dark" },
  { name: "typescript", variant: "dark" },
  { name: "figma", variant: "dark" },
  { name: "github", variant: "dark" },
  { name: "vscode", variant: "dark" },
  { name: "shadcnui", variant: "dark" },
];

const TechStack = () => {
  return (
    <div className="w-full max-w-md mt-0">
      {/* Mobile: 2 rows x 4 icons; Desktop: 1 row */}
      <div className="grid grid-cols-4 gap-4 md:flex md:flex-row md:justify-center md:gap-6">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col items-center text-center"
          >
            <StackIcon
              name={tech.name}
              variant={tech.variant}
              className="w-10 h-10 md:w-10 md:h-10"
            />
            <span className="mt-1 text-xs text-gray-500 capitalize">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;


// <StackIcon name="java" />
// <StackIcon name="html5" />
// name: "tailwindcss"
//     { name: "typescript" },
// name: "react"
// <StackIcon name="vitejs" />
// <StackIcon name="nextjs2" />
// <StackIcon name="android" />
// <StackIcon name="aws" />
// <StackIcon name="docker" />
// <StackIcon name="figma" />
// <StackIcon name="github" />
// <StackIcon name="js" />
// <StackIcon name="linux" />
// <StackIcon name="mysql" />
// <StackIcon name="shadcnui" />
// <StackIcon name="vscode" />