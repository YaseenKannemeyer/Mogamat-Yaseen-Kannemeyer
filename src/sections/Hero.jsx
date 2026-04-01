import HoverHeroText from "../components/HoverHeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import ProfilePicture from "../components/ProfilePicture";
import TechStack from "../components/TechStack";

export const Hero = () => {
  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center overflow-hidden c-space"
    >
      <div className="absolute inset-0 -z-10">
        <ParallaxBackground />
      </div>

      <div className="z-10 flex flex-col items-center text-center gap-0 space-y-0 p-0 m-0">
        <div className="hidden md:block m-0 p-0 leading-none">
          <ProfilePicture />
        </div>

        <div className="m-0 p-0 leading-none">
          <HoverHeroText className="m-0 p-0" />
        </div>

        <div className="m-0 p-0 leading-none">
          <TechStack />
        </div>
      </div>
    </section>
  );
};

export default Hero;
