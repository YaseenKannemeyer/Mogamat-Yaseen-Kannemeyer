import { useRef } from "react";
import clsx from "clsx";

const HoverHeroText = () => {
  const containerRef = useRef(null);

  const sentences = [
    <>
      Hi, I'm{" "}
      <span className="text-blue-200 font-bold">Yaseen Kannemeyer</span>{" "}
    </>,
    "A software developer from South Africa, interested in front-end development and UI/UX design.",
    <>
      I build with <span className="text-blue-200 font-semibold">React</span>{" "}
      and <span className="text-blue-200 font-semibold">Tailwind CSS</span>, and
      I enjoy exploring modern UI tools like{" "}
      <span className="text-blue-200 font-semibold">shadcn/ui</span>. I'm in the
      final year of my Applications Development diploma, studying{" "}
      <span className="text-blue-200 font-semibold">Java</span>, and always
      experimenting to make better web experiences. I love turning ideas into
      clean, interactive web experiences.
    </>,
  ];

  const sentenceClasses = [
    "text-neutral-400 font-semibold tracking-tight leading-tight " +
      "text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] " +
      "animate-float",
    "text-neutral-200 font-medium leading-relaxed max-w-3xl " +
      "text-[1.1rem] sm:text-[1.25rem] md:text-[1.4rem] lg:text-[1.6rem] xl:text-[1.75rem] " +
      "animate-float delay-100",
    "text-neutral-100 font-normal leading-relaxed max-w-3xl " +
      "text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem] xl:text-[1.4rem] " +
      "animate-float delay-200",
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
          className={clsx("text-center max-w-4xl", sentenceClasses[index])}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
};

export default HoverHeroText;
