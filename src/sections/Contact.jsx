import { ContactForm } from "../components/ContatcForm";
import Galaxy from "../components/GalaxyBackground";

const Contact = () => {
  return (
    <section className="relative h-screen flex justify-center items-center">
      <Galaxy
        className="absolute inset-0 z-0 h-screen"
        starSpeed={0.2}
        density={0.2}
        hueShift={0}
        speed={0.2}
        glowIntensity={0.3}
        saturation={0}
        mouseRepulsion
        repulsionStrength={5}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        transparent
      />

      <div className="relative z-10 translate-y-10">
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
