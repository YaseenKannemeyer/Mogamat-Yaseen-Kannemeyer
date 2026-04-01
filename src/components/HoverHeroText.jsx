import { useRef } from "react";

const HoverHeroText = () => {
  const containerRef = useRef(null);

  const sentences = [
    "Hi, I'm Yaseen Kannemeyer.",
    "A software developer from South Africa.",
    "I'm a frontend developer working with React and Tailwind CSS, using modern UI libraries like shadcn/ui. I'm currently in my final year of an Applications Development diploma, where I study Java, and I'm focused on improving my web development skills.",
  ];

  const sentenceClasses = [
    "text-neutral-400 font-semibold tracking-tight leading-tight " +
      "text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]",
    "text-neutral-200 font-medium leading-relaxed max-w-3xl " +
      "text-[1.1rem] sm:text-[1.25rem] md:text-[1.4rem] lg:text-[1.6rem] xl:text-[1.75rem]",
    "text-neutral-100 font-normal leading-relaxed max-w-3xl " +
      "text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] xl:text-[1.4rem]",
  ];

  return (
    <div
      ref={containerRef}
      className="
        relative
        w-full
        flex
        flex-col
        items-center
        justify-center
        overflow-visible
        gap-6
        px-4
        pt-4
      "
    >
      {sentences.map((sentence, index) => (
        <p
          key={index}
          className={`text-center max-w-4xl ${sentenceClasses[index]}`}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default HoverHeroText;
