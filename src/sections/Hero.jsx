import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import StackIcons from "../components/TechStack";

export const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen overflow-hidden c-space gap-8 md:items-start md:justify-start">
      <HeroText />

      {/* Optional: keep Parallax background */}
      <ParallaxBackground />

    
    </section>
  );
};

export default Hero;
