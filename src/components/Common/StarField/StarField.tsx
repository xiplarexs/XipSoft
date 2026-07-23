"use client";

/**
 * StarField — Tüm site için uzay yıldız arka planı
 * position: fixed, z-index: -1 ile her sayfada görünür
 */

export default function StarField() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      {/* ── Küçük yıldızlar: 300 adet ── */}
      {Array.from({ length: 300 }, (_, i) => {
        const a = (i * 9301 + 49297) % 233280;
        const b = (a * 9301 + 49297) % 233280;
        const c = (b * 9301 + 49297) % 233280;
        const d = (c * 9301 + 49297) % 233280;
        const t = c / 233280;
        const color = t > 0.85 ? "#ffddcc"
          : t > 0.70 ? "#ccddff"
          : t > 0.55 ? "#ddeeff"
          : "#ffffff";
        const sz = 1 + t * 1.4;
        return (
          <div key={`s${i}`} className="absolute rounded-full" style={{
            left: `${(a / 233280) * 100}%`,
            top:  `${(b / 233280) * 100}%`,
            width: sz, height: sz,
            opacity: 0.45 + (d / 233280) * 0.5,
            background: color,
            boxShadow: t > 0.8 ? `0 0 ${sz * 2}px ${color}` : "none",
          }} />
        );
      })}

      {/* ── Orta yıldızlar: 100 adet, renkli glow ── */}
      {Array.from({ length: 100 }, (_, i) => {
        const a = (i * 6271 + 28411) % 233280;
        const b = (a * 6271 + 28411) % 233280;
        const c = (b * 6271 + 28411) % 233280;
        const d = (c * 6271 + 28411) % 233280;
        const t = c / 233280;
        const color = t > 0.80 ? "#ff9977"
          : t > 0.60 ? "#77aaff"
          : t > 0.40 ? "#aa88ff"
          : t > 0.20 ? "#ff88cc"
          : "#ffffff";
        const sz = 1.8 + t * 2.2;
        return (
          <div key={`m${i}`} className="absolute rounded-full" style={{
            left: `${(a / 233280) * 100}%`,
            top:  `${(b / 233280) * 100}%`,
            width: sz, height: sz,
            opacity: 0.6 + (d / 233280) * 0.35,
            background: color,
            boxShadow: `0 0 ${sz * 2.5}px ${color}, 0 0 ${sz * 5}px ${color}55`,
          }} />
        );
      })}

      {/* ── Büyük cross yıldızlar: 28 adet ── */}
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i * 7919 + 13337) % 233280;
        const b = (a * 7919 + 13337) % 233280;
        const c = (b * 7919 + 13337) % 233280;
        const t = c / 233280;
        const sz = 3 + t * 5;
        const armLen = sz * 10;
        const color = t > 0.7 ? "#aaccff" : t > 0.4 ? "#ffeecc" : "#ffffff";
        return (
          <div key={`b${i}`} className="absolute" style={{
            left: `${(a / 233280) * 100}%`,
            top:  `${(b / 233280) * 100}%`,
            transform: "translate(-50%,-50%)",
            width: 0, height: 0,
          }}>
            <div className="absolute rounded-full" style={{
              width: sz, height: sz,
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: "#ffffff",
              boxShadow: `0 0 ${sz*2}px ${color}, 0 0 ${sz*5}px ${color}99, 0 0 ${sz*10}px ${color}33`,
            }} />
            <div className="absolute" style={{
              width: armLen, height: Math.max(1, sz * 0.3),
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: `linear-gradient(90deg, transparent, ${color}55 20%, ${color}ee 50%, ${color}55 80%, transparent)`,
              filter: `blur(${sz * 0.15}px)`,
            }} />
            <div className="absolute" style={{
              width: Math.max(1, sz * 0.3), height: armLen,
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: `linear-gradient(180deg, transparent, ${color}55 20%, ${color}ee 50%, ${color}55 80%, transparent)`,
              filter: `blur(${sz * 0.15}px)`,
            }} />
          </div>
        );
      })}

      {/* ── Nebula bulutsuları ── */}
      <div style={{ position:"absolute", top:"5%",  left:"5%",   width:400, height:300, borderRadius:"50%", opacity:0.10, background:"radial-gradient(ellipse, #3355ff 0%, transparent 70%)", filter:"blur(60px)" }} />
      <div style={{ position:"absolute", top:"12%", right:"6%",  width:320, height:240, borderRadius:"50%", opacity:0.09, background:"radial-gradient(ellipse, #cc44ff 0%, transparent 70%)", filter:"blur(50px)" }} />
      <div style={{ position:"absolute", top:"42%", left:"58%",  width:260, height:200, borderRadius:"50%", opacity:0.07, background:"radial-gradient(ellipse, #ff4488 0%, transparent 70%)", filter:"blur(45px)" }} />
      <div style={{ position:"absolute", top:"65%", left:"8%",   width:280, height:200, borderRadius:"50%", opacity:0.08, background:"radial-gradient(ellipse, #2266ff 0%, transparent 70%)", filter:"blur(50px)" }} />
      <div style={{ position:"absolute", top:"78%", right:"12%", width:340, height:240, borderRadius:"50%", opacity:0.07, background:"radial-gradient(ellipse, #6633ff 0%, transparent 70%)", filter:"blur(55px)" }} />
    </div>
  );
}
