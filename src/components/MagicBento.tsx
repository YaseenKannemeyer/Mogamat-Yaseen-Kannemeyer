import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  icon?: string;
}

export interface BentoProps {
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: true;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "59, 130, 246"; // blue-500
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: "#060010",
    title: "Hi, I'm Yaseen 👋",
    description:
      "A South African Applications Development student passionate about crafting modern, high-performance interfaces. I love building responsive layouts, smooth animations, and meaningful UI interactions that elevate user experience.",
    label: "About Me",
    icon: "✦",
  },
  {
    color: "#060010",
    title: "Frontend Passion",
    description:
      "Self-taught in React, TypeScript & Tailwind. I spend most of my time experimenting with motion design, component architecture, and performance-driven UI engineering.",
    label: "What I Love",
    icon: "⚡",
  },
  {
    color: "#060010",
    title: "Diploma in App Dev",
    description:
      "Studying software engineering with a strong foundation in Java, IT principles, and full-stack development practices.",
    label: "Education",
    icon: "🎓",
  },
  {
    color: "#060010",
    title: "Currently Learning",
    description:
      "Deep-diving into Next.js, Framer Motion, and micro-interaction systems to make interfaces feel alive and intuitive.",
    label: "Focus",
    icon: "🔭",
  },
  {
    color: "#060010",
    title: "Let's Collaborate",
    description:
      "Open to frontend projects and opportunities where I can contribute to meaningful products while growing as a UI engineer.",
    label: "Work Together",
    icon: "🤝",
  },
  {
    color: "#060010",
    title: "My Vision",
    description:
      "Ship great UX — not just great code. I care deeply about how software feels as much as how it functions.",
    label: "Goal",
    icon: "🎯",
  },
];

const techStack = [
  "React",
  "TypeScript",
  "Tailwind",
  "Next.js",
  "GSAP",
  "Framer Motion",
];

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR,
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);pointer-events:none;z-index:100;left:${x}px;top:${y}px;`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty(
    "--glow-x",
    `${((mouseX - rect.left) / rect.width) * 100}%`,
  );
  card.style.setProperty(
    "--glow-y",
    `${((mouseY - rect.top) / rect.height) * 100}%`,
  );
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor,
      ),
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          p.parentNode?.removeChild(p);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();
    memoizedParticles.current.forEach((particle, index) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);
      timeoutsRef.current.push(id);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;
    const onEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt)
        gsap.to(el, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
    };
    const onLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt)
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      if (enableMagnetism)
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      const cx = rect.width / 2,
        cy = rect.height / 2;
      if (enableTilt)
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -10,
          rotateY: ((x - cx) / cx) * 10,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      if (enableMagnetism)
        magnetismAnimationRef.current = gsap.to(el, {
          x: (x - cx) * 0.05,
          y: (y - cy) * 0.05,
          duration: 0.3,
          ease: "power2.out",
        });
    };
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      const md = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;width:${md * 2}px;height:${md * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);left:${x - md}px;top:${y - md}px;pointer-events:none;z-index:1000;`;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement("div");
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,rgba(${glowColor},0.01) 65%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    const onMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const inside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll(".card");
      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
        cards.forEach((c) =>
          (c as HTMLElement).style.setProperty("--glow-intensity", "0"),
        );
        return;
      }
      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDist = Infinity;
      cards.forEach((c) => {
        const ce = c as HTMLElement,
          cr = ce.getBoundingClientRect();
        const d = Math.max(
          0,
          Math.hypot(
            e.clientX - (cr.left + cr.width / 2),
            e.clientY - (cr.top + cr.height / 2),
          ) -
            Math.max(cr.width, cr.height) / 2,
        );
        minDist = Math.min(minDist, d);
        updateCardGlowProperties(
          ce,
          e.clientX,
          e.clientY,
          d <= proximity
            ? 1
            : d <= fadeDistance
              ? (fadeDistance - d) / (fadeDistance - proximity)
              : 0,
          spotlightRadius,
        );
      });
      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(spotlightRef.current, {
        opacity:
          minDist <= proximity
            ? 0.8
            : minDist <= fadeDistance
              ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8
              : 0,
        duration: 0.2,
      });
    };
    const onLeave = () => {
      gridRef.current
        ?.querySelectorAll(".card")
        .forEach((c) =>
          (c as HTMLElement).style.setProperty("--glow-intensity", "0"),
        );
      if (spotlightRef.current)
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const renderCardContent = (card: BentoCardProps, index: number) => (
    <>
      {/* Label + icon pinned to top */}
      <div className="bc-top">
        <span className="bc-label">{card.label}</span>
        <span className="bc-icon" aria-hidden="true">
          {card.icon}
        </span>
      </div>

      {/* Content pinned to bottom */}
      <div className="bc-bottom">
        <h3 className="bc-title">{card.title}</h3>
        <p className="bc-desc">{card.description}</p>

        {/* Tech stack badges — hero card only */}
        {index === 0 && (
          <div className="bc-badges">
            {techStack.map((t) => (
              <span key={t} className="bc-badge">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* CTA — collaboration card */}
        {index === 4 && (
          <a href="mailto:hello@yaseen.dev" className="bc-cta">
            Get in touch →
          </a>
        )}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          --border-col: rgba(59,130,246,0.45);
          --bg-dark: #060010;
          --radius: clamp(14px, 1.6vw, 22px);
          --text-muted: rgba(255,255,255,0.52);
        }

        /* fills the parent at 85vh on desktop */
        .bento-outer {
          width: 100%;
          height: 85vh;
          padding: clamp(0.6rem, 1.5vw, 1.25rem);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        /* ── Grid ── */
        .bento-grid {
          display: grid;
          gap: clamp(0.45rem, 0.9vw, 0.8rem);
          width: 100%;
          flex: 1;
          min-height: 0;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(2, 1fr);
        }

        @media (min-width: 1024px) {
          .bento-grid .card:nth-child(1) { grid-column: 1 / span 5; grid-row: 1 / span 2; }
          .bento-grid .card:nth-child(2) { grid-column: 6 / span 4; grid-row: 1; }
          .bento-grid .card:nth-child(3) { grid-column: 10 / span 3; grid-row: 1; }
          .bento-grid .card:nth-child(4) { grid-column: 6 / span 3; grid-row: 2; }
          .bento-grid .card:nth-child(5) { grid-column: 9 / span 2; grid-row: 2; }
          .bento-grid .card:nth-child(6) { grid-column: 11 / span 2; grid-row: 2; }
        }

        @media (min-width: 600px) and (max-width: 1023px) {
          .bento-outer { height: auto; min-height: 100%; }
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
            grid-auto-rows: minmax(200px, auto);
          }
          .bento-grid .card:nth-child(1) { grid-column: 1 / span 2; }
        }

        @media (max-width: 599px) {
          .bento-outer { height: auto; padding: 0.65rem; }
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            grid-auto-rows: auto;
            gap: 0.55rem;
          }
        }

        /* ── Card shell ── */
        .card {
          border-radius: var(--radius);
          border: 1px solid var(--border-col);
          background: var(--bg-dark);
          background-image: radial-gradient(ellipse at 75% 15%, rgba(59,130,246,0.07) 0%, transparent 55%);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(0.9rem, 1.8vw, 1.4rem);
          overflow: hidden;
          transition: box-shadow 0.3s ease;
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
        }

        /* Mobile: natural height based on content */
        @media (max-width: 599px) {
          .card { height: auto; min-height: unset; padding: 1rem 1.1rem; }
        }
        @media (min-width: 600px) and (max-width: 1023px) {
          .card { min-height: 180px; }
        }

        .card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.4); }

        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.9)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 35%,
            transparent 65%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Inner layout ── */
        .bc-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .bc-label {
          font-size: clamp(0.58rem, 0.8vw, 0.72rem);
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 500;
        }

        .bc-icon {
          font-size: clamp(1rem, 1.4vw, 1.35rem);
          line-height: 1;
          opacity: 0.8;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .card:hover .bc-icon { transform: scale(1.2) rotate(-8deg); opacity: 1; }

        .bc-bottom {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .bc-title {
          font-size: clamp(0.92rem, 1.35vw, 1.18rem);
          font-weight: 500;
          margin: 0;
          line-height: 1.25;
          color: #fff;
          /* wrap naturally — NO line-clamp on title */
        }

        /* Hero card: larger title */
        .bento-grid .card:nth-child(1) .bc-title {
          font-size: clamp(1.45rem, 2.2vw, 1.9rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.15;
        }

        .bc-desc {
          font-size: clamp(0.7rem, 0.88vw, 0.82rem);
          color: var(--text-muted);
          line-height: 1.62;
          margin: 0;
          /* No global clamp — let desktop media query handle per-slot */
        }

        /* Hero card */
        .bento-grid .card:nth-child(1) .bc-desc {
          font-size: clamp(0.78rem, 1vw, 0.9rem);
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
        }

        /* Desktop: per-slot line budgets based on actual card height/width */
        @media (min-width: 1024px) {
          /* Row 1 half-height cards — wide enough for 4 lines */
          .bento-grid .card:nth-child(2) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
          }
          /* Row 1, narrow card — smaller font, 4 lines */
          .bento-grid .card:nth-child(3) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            font-size: clamp(0.64rem, 0.8vw, 0.76rem);
          }
          /* Row 2 medium card */
          .bento-grid .card:nth-child(4) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
          }
          /* Row 2 narrow cards — smaller font so text fits */
          .bento-grid .card:nth-child(5) .bc-desc,
          .bento-grid .card:nth-child(6) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            font-size: clamp(0.62rem, 0.78vw, 0.74rem);
          }
        }

        /* Mobile/tablet: natural 3-line clamp */
        @media (max-width: 1023px) {
          .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
          .bento-grid .card:nth-child(1) .bc-desc {
            -webkit-line-clamp: 4;
          }
        }

        /* ── Tech badges ── */
        .bc-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.55rem;
        }
        .bc-badge {
          font-size: clamp(0.58rem, 0.72vw, 0.67rem);
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.18rem 0.5rem;
          border-radius: 999px;
         background: rgba(59,130,246,0.14);
  border: 1px solid rgba(59,130,246,0.28);
  color: rgba(59,145,246,0.9);
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .bc-badge:hover { background: rgba(59,130,246,0.26); border-color: rgba(59,130,246,0.5); }

        /* ── CTA ── */
        .bc-cta {
          display: inline-block;
          margin-top: 0.5rem;
          font-size: clamp(0.68rem, 0.85vw, 0.78rem);
          font-weight: 600;
            color: rgba(59,145,246,0.9);

          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s, letter-spacing 0.2s;
        }
        .bc-cta:hover { color: #3b82f6; letter-spacing: 0.09em; }

        /* ── Particles ── */
        .particle::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: rgba(${glowColor}, 0.2);
          border-radius: 50%;
          z-index: -1;
        }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="bento-section bento-outer">
        <div className="bento-grid" ref={gridRef}>
          {cardData.map((card, index) => {
            const cls = `card${enableBorderGlow ? " card--border-glow" : ""}`;
            const style = {
              backgroundColor: card.color ?? "var(--bg-dark)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px",
            } as React.CSSProperties;

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={cls}
                  style={style}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {renderCardContent(card, index)}
                </ParticleCard>
              );
            }
            return (
              <div key={index} className={cls} style={style}>
                {renderCardContent(card, index)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MagicBento;
