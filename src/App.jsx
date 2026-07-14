import React, { useEffect, useState } from "react";

import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import Loader from "./components/Loader";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true); // stays mounted during fade

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      // remove Loader from DOM only after its fade-out transition finishes
      const t = setTimeout(() => setShowLoader(false), 500); // match CSS duration
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />

      {showLoader && <Loader fadeOut={!loading} />}
    </div>
  );
};

export default App;
