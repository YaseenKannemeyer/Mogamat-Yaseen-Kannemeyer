// StackIcons.tsx
import React from "react";

const techStack = [
  { name: "TypeScript", href: "https://www.typescriptlang.org/", src: "https://assets.chanhdai.com/images/tech-stack-icons/typescript.svg" },
  { name: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", src: "https://assets.chanhdai.com/images/tech-stack-icons/js.svg" },
  { name: "Python", href: "https://www.python.org/", src: "https://assets.chanhdai.com/images/tech-stack-icons/python.svg" },
  { name: "PHP", href: "https://www.php.net/", src: "https://assets.chanhdai.com/images/tech-stack-icons/php.svg" },
  { name: "Java", href: "https://www.java.com/", src: "https://assets.chanhdai.com/images/tech-stack-icons/java.svg" },
  { name: "Node.js", href: "https://nodejs.org/", src: "https://assets.chanhdai.com/images/tech-stack-icons/nodejs.svg" },
  { name: "Bun", href: "https://bun.sh/", src: "https://assets.chanhdai.com/images/tech-stack-icons/bun.svg" },
  { name: "React", href: "https://react.dev/", src: "https://assets.chanhdai.com/images/tech-stack-icons/react.svg" },
  { name: "Next.js", href: "https://nextjs.org/", srcLight: "https://assets.chanhdai.com/images/tech-stack-icons/nextjs2-light.svg", srcDark: "https://assets.chanhdai.com/images/tech-stack-icons/nextjs2-dark.svg" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com/", src: "https://assets.chanhdai.com/images/tech-stack-icons/tailwindcss.svg" },
  // ... add the rest of the tech items
];

const StackIcons: React.FC = () => {
  return (
    <ul className="flex flex-wrap gap-4 select-none">
      {techStack.map((tech, index) => (
        <li key={index} className="flex">
          <a
            href={tech.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tech.name}
          >
            {tech.srcLight && tech.srcDark ? (
              <>
                <img
                  alt={`${tech.name} light icon`}
                  loading="lazy"
                  width={32}
                  height={32}
                  className="hidden [html.light_&]:block"
                  src={tech.srcLight}
                />
                <img
                  alt={`${tech.name} dark icon`}
                  loading="lazy"
                  width={32}
                  height={32}
                  className="hidden [html.dark_&]:block"
                  src={tech.srcDark}
                />
              </>
            ) : (
              <img
                alt={`${tech.name} icon`}
                loading="lazy"
                width={32}
                height={32}
                src={tech.src}
              />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default StackIcons;
