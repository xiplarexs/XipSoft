"use client";

/**
 * AmbientOrbs — Sayfa arka planında yüzen tek renkli
 * (violet) blur'lu ısık topları. Tamamen CSS animasyonlu.
 */

export default function AmbientOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[0] overflow-hidden"
    >
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      <style>{`
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          will-change: transform;
        }
        .orb-1 {
          width: 520px; height: 520px;
          top: -140px; left: -100px;
          background: radial-gradient(circle,
            rgba(139,92,246,0.42) 0%,
            rgba(109,40,217,0.16) 55%,
            transparent 75%);
          animation: orbFloat1 14s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 480px; height: 480px;
          top: -80px; right: -80px;
          background: radial-gradient(circle,
            rgba(139,92,246,0.36) 0%,
            rgba(109,40,217,0.13) 55%,
            transparent 75%);
          animation: orbFloat2 18s ease-in-out infinite alternate;
        }
        .orb-3 {
          width: 500px; height: 500px;
          bottom: -100px; left: 25%;
          background: radial-gradient(circle,
            rgba(139,92,246,0.28) 0%,
            rgba(109,40,217,0.10) 55%,
            transparent 75%);
          animation: orbFloat3 22s ease-in-out infinite alternate;
        }
        @keyframes orbFloat1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(70px, 60px) scale(1.08); }
          100% { transform: translate(30px, 100px) scale(0.96); }
        }
        @keyframes orbFloat2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-80px, 70px) scale(1.10); }
          100% { transform: translate(-40px, 110px) scale(0.93); }
        }
        @keyframes orbFloat3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(60px, -70px) scale(1.07); }
          100% { transform: translate(-50px, -40px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
