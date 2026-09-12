import { Suspense, lazy, useEffect, useState } from "react";

import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Footer from "./sections/Footer.jsx";
import Loader from "./components/Loader";

// Pulls the tiptap/ProseMirror editor, emailjs and the WebGL galaxy out of the
// initial bundle. The fallback matches the section's h-screen so CLS stays 0.
const Contact = lazy(() => import("./sections/Contact.jsx"));

// Everything painted above the fold. The loader lifts once these have decoded.
const CRITICAL_ASSETS = [
  "/assets/parallax/sky",
  "/assets/parallax/mountain-3",
  "/assets/parallax/planets",
  "/assets/parallax/mountain-2",
  "/assets/parallax/mountain-1",
  "/assets/profilepictures/my-avatar",
];

const MIN_VISIBLE_MS = 500; // floor, so the loader never flashes
const MAX_WAIT_MS = 2000; // ceiling, so a slow network can never stall the page

// Tries AVIF (what the CSS prefers) and falls back to WebP. Never rejects —
// a failed decode must not hold the page hostage.
const preload = (base) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = () => {
      const fallback = new Image();
      fallback.onload = fallback.onerror = resolve;
      fallback.src = `${base}.webp`;
    };
    img.src = `${base}.avif`;
  });

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true); // stays mounted during fade
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let settled = 0;

    const ready = Promise.all(
      CRITICAL_ASSETS.map((base) =>
        preload(base).then(() => {
          settled += 1;
          if (!cancelled) setProgress(settled / CRITICAL_ASSETS.length);
        }),
      ),
    );

    const after = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    Promise.all([
      Promise.race([ready, after(MAX_WAIT_MS)]),
      after(MIN_VISIBLE_MS),
    ]).then(() => {
      if (cancelled) return;
      setProgress(1);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
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
      <main>
        <Hero />
        <Projects />
        <About />
        <Suspense fallback={<section id="contact" className="min-h-screen" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />

      {showLoader && <Loader fadeOut={!loading} progress={progress} />}
    </div>
  );
};

export default App;
