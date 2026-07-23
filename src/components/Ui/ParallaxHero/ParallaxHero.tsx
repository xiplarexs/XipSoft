"use client";
/**
 * ParallaxHero — geometrik / 3D grid tasarım
 * - Perspektif derinligi olan yatay grid zemin
 * - Mouse hareketi ile hafif 3D tilt
 * - Köse diamond aksanları
 * - accentColor / secondaryColor ile sayfa bazlı renk destegi
 */
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/utils";
import { BRAND_COLORS } from "@/config/brand.config";

interface ParallaxHeroProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  titlegradient?: string;
  subtitle?: string;
  accentColor?: string;
  secondaryColor?: string;
  ctaPrimary?: { label: string; onClick: () => void };
  ctaSecondary?: { label: string; href: string };
  stats?: { value: string; label: string }[];
  className?: string;
  children?: React.ReactNode;
}

// ── Güneş / Işık Patlaması ─────────────────────────────────────────────────
function SunBurst({ accentColor, secondaryColor }: { accentColor: string; secondaryColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ana güneş çekirdeği */}
      <motion.div
        className="absolute"
        style={{
          left: "50%",
          top: "-120px",
          transform: "translateX(-50%)",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, #fff8e1 0%, ${accentColor}ff 18%, ${accentColor}cc 35%, ${secondaryColor}66 60%, transparent 75%)`,
          filter: "blur(2px)",
        }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.95, 1, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Güneş corona — geniş halo */}
      <motion.div
        className="absolute"
        style={{
          left: "50%",
          top: "-200px",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}55 0%, ${accentColor}22 30%, ${secondaryColor}11 55%, transparent 70%)`,
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Uzun ışık sütunu — aşağı inen hüzme */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          width: 320,
          height: "70%",
          background: `linear-gradient(180deg, ${accentColor}30 0%, ${accentColor}12 40%, ${secondaryColor}08 70%, transparent 100%)`,
          filter: "blur(18px)",
        }}
      />

      {/* Yatay lens flare çizgisi */}
      <motion.div
        className="absolute"
        style={{
          left: "0%",
          top: "0px",
          width: "100%",
          height: "3px",
          background: `linear-gradient(90deg, transparent 0%, ${secondaryColor}00 20%, ${accentColor}55 45%, #fff9 50%, ${accentColor}55 55%, ${secondaryColor}00 80%, transparent 100%)`,
          filter: "blur(1px)",
        }}
        animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [0.96, 1.02, 0.96] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Işık ışınları — güneş çubukları */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) - 90; // -90 = düz yukarı, oradan dağıl
        const length = 220 + (i % 3) * 80;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: "50%",
              top: "-20px",
              width: 2,
              height: length,
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              background: `linear-gradient(180deg, ${accentColor}60 0%, ${accentColor}20 60%, transparent 100%)`,
              filter: "blur(3px)",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.95, 1.05, 0.95] }}
            transition={{
              duration: 3 + i * 0.4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Zemine düşen ışık havuzu */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${accentColor}10 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ── 3D grid Zemin ──────────────────────────────────────────────────────────
function Perspectivegrid({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Alt perspektif grid */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: "65%",
          backgroundImage: `
            linear-gradient(${accentColor}28 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}18 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(55deg)",
          transformOrigin: "bottom center",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        }}
      />
      {/* Üst flat grid (çok soluk) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${accentColor}0d 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}0a 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

// ── Köse Diamond Aksanı ───────────────────────────────────────────────────
function CornerDiamond({
  color,
  position,
}: {
  color: string;
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "top-8 left-8",
    tr: "top-8 right-8",
    bl: "bottom-8 left-8",
    br: "bottom-8 right-8",
  }[position];

  return (
    <motion.div
      className={cn("absolute pointer-events-none", posClass)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "backOut" }}
    >
      <div
        className="w-3 h-3 rotate-45"
        style={{
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}60`,
        }}
      />
    </motion.div>
  );
}

// ── Yatay Isık Çizgisi ───────────────────────────────────────────────────
function ScanLine({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none"
      style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${color}50 30%, ${color}90 50%, ${color}50 70%, transparent 100%)` }}
      initial={{ top: "100%", opacity: 0 }}
      animate={{ top: "-5%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 5,
        ease: "linear",
        opacity: { times: [0, 0.05, 0.9, 1] },
      }}
    />
  );
}

// ── Istatistik ─────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  color,
  index,
}: {
  value: string;
  label: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.65 + index * 0.1 }}
    >
      <span
        className="font-black text-2xl md:text-3xl leading-none tabular-nums"
        style={{
          background: `linear-gradient(135deg, #fff 20%, ${color} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 10px ${color}70)`,
        }}
      >
        {value}
      </span>
      <span className="text-zinc-500 text-xs font-medium tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
}

// ── Ana Bilesen ────────────────────────────────────────────────────────────
export default function ParallaxHero({
  badge,
  badgeIcon,
  title,
  subtitle,
  accentColor = BRAND_COLORS.primary,
  secondaryColor = BRAND_COLORS.secondary,
  ctaPrimary,
  ctaSecondary,
  stats,
  className,
  children,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mouse tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 24 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 24 });

  useEffect(() => {
    setMounted(true);
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { rawX.set(0); rawY.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden min-h-[62vh] flex items-center", className)}
      style={{ perspective: "1000px" }}
    >
      {/* 3D grid zemin */}
      <Perspectivegrid accentColor={accentColor} />

      {/* Güneş / ışık patlaması — üstten */}
      <SunBurst accentColor={accentColor} secondaryColor={secondaryColor} />

      {/* Alt karartma — içeriğin okunabilirliği için */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, transparent 55%, #000005 100%)",
        }}
      />

      {/* Yatay scan çizgileri */}
      {mounted && (
        <>
          <ScanLine color={accentColor} delay={0.5} />
          <ScanLine color={secondaryColor} delay={4.5} />
        </>
      )}

      {/* Köse aksanları */}
      {mounted && (
        <>
          <CornerDiamond color={accentColor} position="tl" />
          <CornerDiamond color={secondaryColor} position="tr" />
          <CornerDiamond color={`${accentColor}80`} position="bl" />
          <CornerDiamond color={`${secondaryColor}80`} position="br" />
        </>
      )}

      {/* Dikey kenar çizgileri */}
      <div
        className="absolute top-0 bottom-0 left-0 w-px pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}40, transparent)` }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-px pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${secondaryColor}30, transparent)` }}
      />

      {/* ─── Içerik ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Badge */}
          {badge && (
            <motion.div
              className="flex justify-center mb-7"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold tracking-widest uppercase"
                style={{
                  border: `1px solid ${accentColor}45`,
                  color: accentColor,
                  background: `${accentColor}0c`,
                  clipPath:
                    "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)",
                }}
              >
                {badgeIcon}
                <span>{badge}</span>
              </div>
            </motion.div>
          )}

          {/* Baslık */}
          <motion.h1
            className="text-center font-black tracking-tight leading-[1.06]"
            style={{ fontSize: "clamp(2.4rem, 7vw, 5.2rem)" }}
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Baslıgı iki parçaya böl — ilk kelime accent, geri kalan beyaz */}
            {(() => {
              const words = title.split(" ");
              const first = words.slice(0, Math.ceil(words.length / 2)).join(" ");
              const rest  = words.slice(Math.ceil(words.length / 2)).join(" ");
              return (
                <>
                  <span
                    style={{
                      background: `linear-gradient(135deg, #fff 0%, ${accentColor} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: `drop-shadow(0 0 32px ${accentColor}50)`,
                    }}
                  >
                    {first}
                  </span>
                  {rest && (
                    <>
                      {" "}
                      <span
                        style={{
                          background: `linear-gradient(135deg, ${secondaryColor} 0%, #fff 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          filter: `drop-shadow(0 0 24px ${secondaryColor}40)`,
                        }}
                      >
                        {rest}
                      </span>
                    </>
                  )}
                </>
              );
            })()}
          </motion.h1>

          {/* Baslık altı çizgi — kesik geometrik */}
          <motion.div
            className="flex justify-center items-center gap-2 mt-5 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80)` }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <div className="h-px w-16" style={{ background: `${accentColor}60` }} />
            <div className="w-1 h-1 rotate-45" style={{ background: secondaryColor, boxShadow: `0 0 6px ${secondaryColor}` }} />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${secondaryColor}80, transparent)` }} />
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-center text-zinc-400 max-w-2xl mx-auto leading-relaxed"
              style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA butonlar */}
          {(ctaPrimary || ctaSecondary) && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-9"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48 }}
            >
              {ctaPrimary && (
                <button
                  onClick={ctaPrimary.onClick}
                  className="relative inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    boxShadow: `0 0 20px ${accentColor}45, 0 0 6px ${secondaryColor}25`,
                    clipPath:
                      "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10">{ctaPrimary.label}</span>
                </button>
              )}
              {ctaSecondary && (
                <a
                  href={ctaSecondary.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={{
                    border: `1px solid ${accentColor}35`,
                    color: "rgba(255,255,255,0.8)",
                    background: `${accentColor}08`,
                    clipPath:
                      "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                  }}
                >
                  {ctaSecondary.label}
                </a>
              )}
            </motion.div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center gap-10 mt-10 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              {stats.map((s, i) => (
                <StatItem
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  color={[accentColor, secondaryColor, "#fb7185", "#fbbf24"][i % 4] ?? accentColor}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {/* Slot */}
          {children}
        </motion.div>
      </div>
    </div>
  );
}
