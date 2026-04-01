"use client";

import { useState } from "react";
import MagicBento from "../components/MagicBento";

const About = () => {
  const [active, setActive] = useState(false);

  return (
    <section
      id="about"
      className="flex items-start justify-center
         md:items-start md:justify-center
        min-h-screen overflow-hidden pt-20 c-space"
    >
      <div
        className="will-change-transform transform-gpu"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <MagicBento
          spotlightRadius={300}
          enableTilt={active}
          enableMagnetism={active}
        />
      </div>
    </section>
  );
};

export default About;
