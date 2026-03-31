import React from "react";
import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />

      {/* This is a single-line comment within JSX */}
    </div>
  );
};

export default App;
