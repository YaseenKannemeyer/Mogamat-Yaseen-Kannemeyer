import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Outfit:wght@300;400;500&display=swap');

  .sf-footer {
    position: relative;
    overflow: hidden;
    background: #03050f;
    font-family: 'Outfit', sans-serif;
    width: 100%;
  }

  .sf-horizon-glow {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #1e3a8a 20%, #3b82f6 50%, #1e3a8a 80%, transparent 100%);
    z-index: 1;
  }
  .sf-horizon-glow::after {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 50px;
    background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%);
  }

  .sf-nebula-left, .sf-nebula-right {
    position: absolute;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    filter: blur(60px);
  }
  .sf-nebula-left {
    width: 320px; height: 160px;
    top: -40px; left: -80px;
    background: radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 65%);
    animation: sf-nebdrift 22s ease-in-out infinite alternate;
  }
  .sf-nebula-right {
    width: 280px; height: 140px;
    top: -30px; right: -60px;
    background: radial-gradient(ellipse, rgba(96,165,250,0.07) 0%, transparent 65%);
    animation: sf-nebdrift 28s ease-in-out infinite alternate-reverse;
  }
  @keyframes sf-nebdrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(20px, 10px) scale(1.08); }
  }

  .sf-orbit-ring {
    position: absolute;
    top: -110px; left: 50%;
    transform: translateX(-50%);
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(59,130,246,0.1);
    pointer-events: none;
    z-index: 0;
    animation: sf-spin 80s linear infinite;
  }
  .sf-orbit-ring::before {
    content: '';
    position: absolute;
    width: 5px; height: 5px;
    background: #60a5fa;
    border-radius: 50%;
    top: 50%; left: -2.5px;
    transform: translateY(-50%);
    box-shadow: 0 0 7px 2px rgba(96,165,250,0.6);
  }
  @keyframes sf-spin {
    to { transform: translateX(-50%) rotate(360deg); }
  }

  @keyframes sf-scan {
    0%   { opacity: 0; top: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.2; }
    100% { opacity: 0; top: 100%; }
  }
  .sf-scanline {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(96,165,250,0.18), transparent);
    pointer-events: none;
    z-index: 2;
    animation: sf-scan 8s linear infinite;
  }

  .sf-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 40px 14px;
  }

  /* ── MAIN ROW ── */
  .sf-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
    margin-bottom: 14px;
  }

  /* ── LEFT: Name ── */
  .sf-name-block {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .sf-callsign {
    font-family: 'Orbitron', monospace;
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.22em;
    color: #3b82f6;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 2px;
  }
  .sf-callsign::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1px;
    background: #3b82f6;
  }
  .sf-name-display {
    font-family: 'Orbitron', monospace;
    font-size: 17px;
    font-weight: 700;
    color: #e8edf8;
    letter-spacing: 0.05em;
    line-height: 1.1;
  }
  .sf-surname { color: #60a5fa; }
  .sf-tagline {
    font-size: 11px;
    font-weight: 300;
    color: rgba(147,197,253,0.45);
    letter-spacing: 0.03em;
    margin-top: 1px;
  }

  /* ── CENTER: Patch + Nav ── */
  .sf-center-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .sf-patch {
    width: 44px; height: 44px;
  }
  .sf-nav-inline {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
  }
  .sf-nav-sep {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(59,130,246,0.25);
    flex-shrink: 0;
  }
  .sf-nav-link {
    font-size: 11px;
    font-weight: 400;
    color: rgba(232,237,248,0.4);
    text-decoration: none;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 3px;
    transition: color 0.2s, background 0.2s;
    font-family: 'Outfit', sans-serif;
  }
  .sf-nav-link:hover {
    color: #93c5fd;
    background: rgba(59,130,246,0.08);
  }

  /* ── RIGHT: Socials ── */
  .sf-socials {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .sf-social-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 4px;
    background: rgba(59,130,246,0.04);
    color: rgba(232,237,248,0.5);
    text-decoration: none;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.04em;
    transition: border-color 0.22s, color 0.22s, transform 0.22s, box-shadow 0.22s;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  .sf-social-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59,130,246,0.1), transparent);
    opacity: 0;
    transition: opacity 0.22s;
  }
  .sf-social-btn:hover {
    border-color: rgba(96,165,250,0.5);
    color: #93c5fd;
    transform: translateY(-1px);
    box-shadow: 0 3px 14px rgba(59,130,246,0.15);
  }
  .sf-social-btn:hover::before { opacity: 1; }

  /* ── BOTTOM BAR ── */
  .sf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
    margin-bottom: 10px;
  }
  .sf-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  .sf-status-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 100px;
    font-family: 'Orbitron', monospace;
    font-size: 8px;
    letter-spacing: 0.14em;
    color: rgba(96,165,250,0.55);
    text-transform: uppercase;
  }
  @keyframes sf-pulse-dot {
    0%,100% { box-shadow: 0 0 4px rgba(74,222,128,0.8); }
    50%      { box-shadow: 0 0 10px rgba(74,222,128,1); }
  }
  .sf-status-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 5px rgba(74,222,128,0.8);
    animation: sf-pulse-dot 2s ease-in-out infinite;
  }
  
  .sf-copyright {
    font-size: 9px;
    font-weight: 300;
    color: rgba(147,197,253,0.2);
    letter-spacing: 0.06em;
    font-family: 'Orbitron', monospace;
  }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .sf-inner {
      padding: 20px 20px 14px;
    }
    .sf-row {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 18px;
    }
    .sf-name-block {
      align-items: center;
    }
    .sf-callsign::before {
      display: none;
    }
    .sf-socials {
      justify-content: center;
    }
    .sf-orbit-ring {
      display: none;
    }
    .sf-bottom {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
    }
  
  }

  @media (max-width: 480px) {
    .sf-social-btn span {
      display: none;
    }
    .sf-social-btn {
      padding: 7px 10px;
    }
    .sf-name-display {
      font-size: 14px;
    }
  }
`;

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.026 2.748-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MissionPatch = () => (
  <svg
    className="sf-patch"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Glow */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Pulse animation */}
      <style>
        {`
          .orbit {
            transform-origin: 36px 36px;
            animation: spin 18s linear infinite;
          }

          .orbit.reverse {
            animation: spinReverse 22s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes spinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          .pulse {
            animation: pulseGlow 2.5s ease-in-out infinite;
          }

          @keyframes pulseGlow {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </defs>

    {/* Outer rings */}
    <circle
      cx="36"
      cy="36"
      r="34"
      stroke="rgba(59,130,246,0.5)"
      strokeWidth="1.5"
    />
    <circle
      cx="36"
      cy="36"
      r="30"
      stroke="rgba(59,130,246,0.2)"
      strokeWidth="0.5"
    />

    {/* Animated orbits */}
    <g className="orbit">
      <ellipse
        cx="36"
        cy="36"
        rx="22"
        ry="9"
        stroke="rgba(96,165,250,0.35)"
        strokeWidth="1"
        transform="rotate(-35 36 36)"
      />
    </g>

    <g className="orbit reverse">
      <ellipse
        cx="36"
        cy="36"
        rx="22"
        ry="9"
        stroke="rgba(96,165,250,0.2)"
        strokeWidth="0.5"
        transform="rotate(35 36 36)"
      />
    </g>

    {/* Center planet */}
    <circle
      cx="36"
      cy="36"
      r="11"
      fill="rgba(29,78,216,0.8)"
      stroke="rgba(96,165,250,0.7)"
      strokeWidth="1.2"
      className="pulse"
    />

    {/* 🔥 BIG MYK */}
    <text
      x="36"
      y="41"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      letterSpacing="2"
      fill="#bfdbfe"
      filter="url(#glow)"
      className="pulse"
      style={{
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      MYK
    </text>

    {/* Stars */}
    <circle cx="33" cy="33" r="3" fill="rgba(147,197,253,0.25)" />
    <circle cx="58" cy="36" r="2.5" fill="#60a5fa" opacity="0.8" />
    <circle cx="14" cy="20" r="1" fill="rgba(232,237,248,0.6)" />
    <circle cx="56" cy="18" r="1.5" fill="rgba(232,237,248,0.5)" />
    <circle cx="12" cy="50" r="1" fill="rgba(232,237,248,0.4)" />
    <circle cx="61" cy="55" r="1" fill="rgba(232,237,248,0.6)" />
    <circle cx="24" cy="60" r="0.8" fill="rgba(96,165,250,0.7)" />
  </svg>
);

// ── Config — edit these to personalise ──
const CONFIG = {
  firstName: "Mogamat Yaseen",
  lastName: "Kannemeyer",
  tagline: "Designer & Developer · Cape Town",
  email: "yaseenkannemeyer@gmail.com",
  github: "https://github.com/YaseenKannemeyer",
  linkedin: "https://www.linkedin.com/in/yaseen-kannemeyer",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  copyrightYear: new Date().getFullYear(),
  statusText: "Open to work",
};

export default function SpaceFooter() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;
      stars.forEach((s) => {
        const alpha = s.a * (0.7 + 0.3 * Math.sin(tick * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>

      <footer className="sf-footer">
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="sf-horizon-glow" />
        <div className="sf-nebula-left" />
        <div className="sf-nebula-right" />
        <div className="sf-orbit-ring" />
        <div className="sf-scanline" />

        <div className="sf-inner">
          {/* ── MAIN ROW ── */}
          <div className="sf-row">
            {/* Name */}
            <div className="sf-name-block">
              <div className="sf-name-display">
                {CONFIG.firstName}{" "}
                <span className="sf-surname">{CONFIG.lastName}</span>
              </div>
              <p className="sf-tagline">{CONFIG.tagline}</p>
            </div>

            {/* Patch + Nav */}
            <div className="sf-center-block">
              <MissionPatch />
              <nav>
                <ul className="sf-nav-inline">
                  {CONFIG.navLinks.map((link, i) => (
                    <>
                      <li key={link.label}>
                        <a href={link.href} className="sf-nav-link">
                          {link.label}
                        </a>
                      </li>
                      {i < CONFIG.navLinks.length - 1 && (
                        <li
                          key={`sep-${i}`}
                          className="sf-nav-sep"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Socials */}
            <div className="sf-socials">
              <a
                href={CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-social-btn"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
              <a
                href={CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-social-btn"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
              <a href={`mailto:${CONFIG.email}`} className="sf-social-btn">
                <EmailIcon />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="sf-divider" />
          <div className="sf-bottom">
            <div className="sf-status-pill">
              <span className="sf-status-dot" />
              {CONFIG.statusText}
            </div>

            <span className="sf-copyright">&copy; MY .KANNEMEYER</span>
          </div>
        </div>
      </footer>
    </>
  );
}
