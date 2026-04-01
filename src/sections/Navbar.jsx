import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const handleScroll = (e, targetId) => {
  e.preventDefault();
  const target = document.querySelector(targetId);
  if (!target) return;

  const navbar = document.querySelector(".mobile-glow-bar");

  // Always use the height of the "top bar" only, not the expanded mobile menu
  const topBarHeight = navbar
    ? navbar.querySelector("div.flex")?.offsetHeight
    : 0;

  const y = target.getBoundingClientRect().top + window.scrollY - topBarHeight;

  window.scrollTo({ top: y, behavior: "smooth" });
};

function Navigation() {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <a
          className="nav-link mobile-glow-link"
          href="#home"
          onClick={(e) => handleScroll(e, "#home")}
        >
          Home
        </a>
      </li>
      <li className="nav-li">
        <a
          className="nav-link mobile-glow-link"
          href="#projects"
          onClick={(e) => handleScroll(e, "#projects")}
        >
          Projects
        </a>
      </li>
      <li className="nav-li">
        <a
          className="nav-link mobile-glow-link"
          href="#about"
          onClick={(e) => handleScroll(e, "#about")}
        >
          About
        </a>
      </li>
      <li className="nav-li">
        <a
          className="nav-link mobile-glow-link"
          href="#contact"
          onClick={(e) => handleScroll(e, "#contact")}
        >
          Contact
        </a>
      </li>
      <li className="nav-li">
        <a
          className="nav-link mobile-glow-link cv-link"
          href="/assets/Mogamat_Yaseen_Kannemeyer_CV.pdf"
          download="Mogamat_Yaseen_Kannemeyer_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>CV Download</span>
        </a>
      </li>
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div
      ref={navRef}
      className="fixed inset-x-0 z-30 w-full backdrop-blur-lg bg-primary/30 mobile-glow-bar"
    >
      <div
        className={`mx-auto transition-all duration-500 ${
          scrolled ? "max-w-full px-6 sm:px-10" : "max-w-7xl c-space"
        }`}
      >
        <div className="flex items-center justify-between py-2 sm:py-0">
          <a
            href="/"
            className="text-xl font-bold transition-colors text-neutral-400 hover:text-white mobile-glow-name"
          >
            M.Y . KANNEMEYER
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden mobile-glow-icon"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6"
              alt="toggle"
            />
          </button>

          <nav className="hidden sm:flex">
            <Navigation />
          </nav>
        </div>
      </div>

      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          <nav className="pb-5">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
