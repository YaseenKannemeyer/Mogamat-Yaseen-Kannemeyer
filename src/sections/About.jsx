import MagicBento from "../components/MagicBento";

const About = () => {
  return (
    <section
      id="about"
      className="flex items-start justify-center
         md:items-start md:justify-center
        min-h-screen overflow-hidden pt-20 c-space"
    >
      <div className="will-change-transform transform-gpu">
        <MagicBento spotlightRadius={300} />
      </div>
    </section>
  );
};

export default About;
