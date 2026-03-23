import MagicBento from "../components/MagicBento";

const About = () => {
  return (
    <section
      className="flex items-start justify-center
         md:items-start md:justify-center
        min-h-screen overflow:hidden pt-20 c-space"
    >
      <MagicBento spotlightRadius={300} enableTilt enableMagnetism />
    </section>
  );
};

export default About;
