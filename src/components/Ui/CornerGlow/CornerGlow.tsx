"use client";

/**
 * Cornerglow — Herhangi bir kutu/section'ın 4 köşesine
 * ince LED aksanı ekler. Wrapper olarak kullanılır.
 * Arka plan veya border EKLEMEz, sadece köşe çizgileri.
 */

interface CornerglowProps {
  children: React.ReactNode;
  /** Köşe çizgi rengi. Default: rgba(167,139,250,0.55) violet */
  color?: string;
  /** Köşe çizgi uzunluğu px. Default: 28 */
  size?: number;
  /** Çizgi kalınlığı px. Default: 1.5 */
  thickness?: number;
  className?: string;
}

export default function Cornerglow({
  children,
  color = "rgba(167,139,250,0.55)",
  size = 28,
  thickness = 1.5,
  className = "",
}: CornerglowProps) {
  const glow = color.replace(/[\d.]+\)$/, (m) => {
    const val = parseFloat(m) * 1.8;
    return `${Math.min(val, 1)})`;
  });

  const line = (
    pos: "tl" | "tr" | "bl" | "br"
  ): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      pointerEvents: "none",
      zIndex: 1,
    };
    const isTop = pos === "tl" || pos === "tr";
    const isLeft = pos === "tl" || pos === "bl";
    return {
      ...base,
      top: isTop ? 0 : "auto",
      bottom: isTop ? "auto" : 0,
      left: isLeft ? 0 : "auto",
      right: isLeft ? "auto" : 0,
      width: size,
      height: size,
      borderTop:    isTop  ? `${thickness}px solid ${color}` : "none",
      borderBottom: !isTop ? `${thickness}px solid ${color}` : "none",
      borderLeft:   isLeft  ? `${thickness}px solid ${color}` : "none",
      borderRight:  !isLeft ? `${thickness}px solid ${color}` : "none",
      borderTopLeftRadius:     pos === "tl" ? 3 : 0,
      borderTopRightRadius:    pos === "tr" ? 3 : 0,
      borderBottomLeftRadius:  pos === "bl" ? 3 : 0,
      borderBottomRightRadius: pos === "br" ? 3 : 0,
      boxShadow: [
        pos === "tl" ? `inset  ${thickness * 2}px  ${thickness * 2}px 6px ${glow}` : "",
        pos === "tr" ? `inset -${thickness * 2}px  ${thickness * 2}px 6px ${glow}` : "",
        pos === "bl" ? `inset  ${thickness * 2}px -${thickness * 2}px 6px ${glow}` : "",
        pos === "br" ? `inset -${thickness * 2}px -${thickness * 2}px 6px ${glow}` : "",
      ].filter(Boolean).join(", ") || undefined,
    };
  };

  return (
    <div className={`relative ${className}`}>
      <span style={line("tl")} aria-hidden />
      <span style={line("tr")} aria-hidden />
      <span style={line("bl")} aria-hidden />
      <span style={line("br")} aria-hidden />
      {children}
    </div>
  );
}
