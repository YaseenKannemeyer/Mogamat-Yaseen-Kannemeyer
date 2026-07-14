import Galaxy from "./GalaxyBackground";

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

export default function Loader({ fadeOut }) {
  return (
    <div
      className={`loader-screen fixed inset-0 z-50 overflow-hidden bg-black transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background */}
      <Galaxy
        className="absolute inset-0 z-0 h-full w-full"
        starSpeed={0.2}
        density={0.3}
        hueShift={0}
        speed={0.2}
        glowIntensity={0.3}
        saturation={0}
        mouseRepulsion={false}
        repulsionStrength={5}
        twinkleIntensity={0.5}
        rotationSpeed={0.1}
        transparent
      />

      {/* Loader Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <MissionPatch />
        <h2 className="loader-title m-5">INITIALIZING</h2>
        <div className="loader-bar">
          <div className="loader-progress" />
        </div>
      </div>
    </div>
  );
}
