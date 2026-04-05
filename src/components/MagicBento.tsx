"use client";

import React, { useRef, useEffect, useCallback } from "react";

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
  glowColor?: string;
  clickEffect?: boolean;
}

const DEFAULT_GLOW_COLOR = "59, 130, 246";

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

const MagicBento: React.FC<BentoProps> = ({
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 300,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const insideRef = useRef(false);

  const tick = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const { x: mx, y: my } = mouseRef.current;
    const cards = grid.querySelectorAll<HTMLElement>(".card");
    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.max(
        0,
        Math.hypot(mx - cx, my - cy) - Math.max(rect.width, rect.height) / 2,
      );

      const intensity = !insideRef.current
        ? 0
        : dist <= proximity
          ? 1
          : dist <= fadeDistance
            ? (fadeDistance - dist) / (fadeDistance - proximity)
            : 0;

      const lx = ((mx - rect.left) / rect.width) * 100;
      const ly = ((my - rect.top) / rect.height) * 100;

      card.style.setProperty("--glow-x", `${lx}%`);
      card.style.setProperty("--glow-y", `${ly}%`);
      card.style.setProperty("--glow-intensity", intensity.toFixed(3));
      card.style.setProperty("--glow-radius", `${spotlightRadius}px`);
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [spotlightRadius]);

  useEffect(() => {
    if (disableAnimations || !enableSpotlight) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const section = gridRef.current?.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      insideRef.current =
        !!rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };

    const onLeave = () => {
      insideRef.current = false;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [disableAnimations, enableSpotlight, tick]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickEffect) return;
      const card = (e.target as HTMLElement).closest<HTMLElement>(".card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const md = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("div");
      ripple.className = "bento-ripple";
      ripple.style.cssText = `width:${md * 2}px;height:${md * 2}px;left:${x - md}px;top:${y - md}px;--glow-color:${glowColor};`;
      card.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), {
        once: true,
      });
    },
    [clickEffect, glowColor],
  );

  const renderCardContent = (card: BentoCardProps, index: number) => (
    <>
      <div className="bc-top">
        <span className="bc-label">{card.label}</span>
        <span className="bc-icon" aria-hidden="true">
          {card.icon}
        </span>
      </div>
      <div className="bc-bottom">
        <h3 className="bc-title">{card.title}</h3>
        <p className="bc-desc">{card.description}</p>
        {index === 0 && (
          <div className="bc-badges">
            {techStack.map((t) => (
              <span key={t} className="bc-badge">
                {t}
              </span>
            ))}
          </div>
        )}
        {index === 4 && (
          <a href="#contact" className="bc-cta">
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

        .bento-outer {
          width: 100%;
          height: 85vh;
          padding: clamp(0.6rem, 1.5vw, 1.25rem);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

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
            grid-auto-rows: auto;
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
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
          will-change: transform;
          transform: translateZ(0);
          transition: box-shadow 0.3s ease;
          contain: layout style;
        }

        /* Mobile: let cards be fully auto-height, no clipping */
        @media (max-width: 599px) {
          .card {
            height: auto;
            min-height: unset;
            padding: 1rem 1.1rem;
          }
        }

        /* Tablet: auto height too */
        @media (min-width: 600px) and (max-width: 1023px) {
          .card {
            height: auto;
            min-height: unset;
          }
        }

        .card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.4); }

        /* Border glow pseudo-element */
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
          will-change: background;
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
          /* Push content down on desktop fixed-height cards */
        }

        .bc-title {
          font-size: clamp(0.92rem, 1.35vw, 1.18rem);
          font-weight: 500;
          margin: 0;
          line-height: 1.25;
          color: #fff;
        }

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
          /* No line-clamp by default — only applied on desktop */
        }

        .bento-grid .card:nth-child(1) .bc-desc {
          font-size: clamp(0.78rem, 1vw, 0.9rem);
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
        }

        /* Desktop only: clamp long descriptions to keep fixed-height cards tidy */
        @media (min-width: 1024px) {
          .bento-grid .card:nth-child(2) .bc-desc,
          .bento-grid .card:nth-child(4) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
          }
          .bento-grid .card:nth-child(3) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            font-size: clamp(0.64rem, 0.8vw, 0.76rem);
          }
          .bento-grid .card:nth-child(5) .bc-desc,
          .bento-grid .card:nth-child(6) .bc-desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            font-size: clamp(0.62rem, 0.78vw, 0.74rem);
          }
        }

        /* Tablet & mobile: no clamping — show all text */
        @media (max-width: 1023px) {
          .bc-desc {
            display: block;
            -webkit-line-clamp: unset;
            overflow: visible;
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

        /* ── Ripple ── */
        .bento-ripple {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(var(--glow-color), 0.35) 0%,
            rgba(var(--glow-color), 0.15) 30%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 10;
          animation: bento-ripple-anim 0.75s ease-out forwards;
        }
        @keyframes bento-ripple-anim {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(1); opacity: 0; }
        }
      `}</style>

      <div className="bento-section bento-outer">
        <div className="bento-grid" ref={gridRef} onClick={handleClick}>
          {cardData.map((card, index) => {
            const cls = `card${enableBorderGlow ? " card--border-glow" : ""}`;
            const style = {
              backgroundColor: card.color ?? "var(--bg-dark)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px",
            } as React.CSSProperties;

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
