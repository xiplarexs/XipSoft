"use client";
/**
 * HeroSection — Ana sayfa kurumsal hero
 * geometrik / 3D grid tasarım — perspektif grid zemin, scan çizgileri, diamond aksanlar
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Zap, ArrowRight, Globe, Smartphone, Shield, Code2 } from "lucide-react";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import { BRAND_COLORS } from "@/config/brand.config";
import Link from "next/link";

// ── Sabitler ───────────────────────────────────────────────────────────────
const ACCENT    = BRAND_COLORS.primary;
const SECONDARY = BRAND_COLORS.secondary;
const TERTIARY  = BRAND_COLORS.accent;
const GOLD      = BRAND_COLORS.gold;

const SERVICE_LABELS = [
  { text: "Web Yazılım & Tasarım", color: SECONDARY,  icon: Globe },
  { text: "Mobil Uygulama",        color: ACCENT,     icon: Smartphone },
  { text: "Siber güvenlik",        color: "#34d399",  icon: Shield },
];

// ── 3D Perspektif grid ─────────────────────────────────────────────────────
function Perspectivegrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Alt perspektif grid */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: "60%",
          backgroundImage: `
            linear-gradient(${ACCENT}30 1px, transparent 1px),
            linear-gradient(90deg, ${ACCENT}1a 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          transform: "perspective(600px) rotateX(55deg)",
          transformOrigin: "bottom center",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)",
        }}
      />
      {/* Düz flat grid üstte (çok soluk) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${ACCENT}0b 1px, transparent 1px),
            linear-gradient(90deg, ${SECONDARY}08 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

// ── Scan Çizgisi ───────────────────────────────────────────────────────────
function ScanLine({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${color}45 25%, ${color}85 50%, ${color}45 75%, transparent 100%)`,
        boxShadow: `0 0 8px ${color}50`,
      }}
      initial={{ top: "105%", opacity: 0 }}
      animate={{ top: "-5%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        repeatDelay: 6,
        ease: "linear",
        opacity: { times: [0, 0.04, 0.92, 1] },
      }}
    />
  );
}

// ── Köse Diamond ──────────────────────────────────────────────────────────
function CornerDiamond({ color, pos }: { color: string; pos: "tl" | "tr" | "bl" | "br" }) {
  const cls = { tl: "top-6 left-6", tr: "top-6 right-6", bl: "bottom-6 left-6", br: "bottom-6 right-6" }[pos];
  return (
    <motion.div
      className={`absolute pointer-events-none ${cls}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }}
    >
      <div
        className="w-2.5 h-2.5 rotate-45"
        style={{ background: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}50` }}
      />
    </motion.div>
  );
}

// ── Hizmet Etiket Döngüsü ─────────────────────────────────────────────────
function ServiceRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SERVICE_LABELS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const current = SERVICE_LABELS[index]!;
  const Icon = current.icon;
  return (
    <div className="flex justify-center h-9 items-center mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold tracking-widest uppercase"
          style={{
            border: `1px solid ${current.color}45`,
            color: current.color,
            background: "transparent",
            clipPath:
              "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)",
          }}
          initial={{ opacity: 0, y: 8, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.93 }}
          transition={{ duration: 0.28 }}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{current.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Istatistik ─────────────────────────────────────────────────────────────
function StatCard({ value, label, color, delay }: { value: string; label: string; color: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <span
        className="font-black text-2xl leading-none tabular-nums"
        style={{
          background: `linear-gradient(135deg, #fff 20%, ${color} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 10px ${color}60)`,
        }}
      >
        {value}
      </span>
      <span className="text-zinc-500 text-[11px] font-medium tracking-widest uppercase">{label}</span>
    </motion.div>
  );
}

// ── Ana Bilesen ────────────────────────────────────────────────────────────
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 22 });

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
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-[88vh] flex items-center bg-zinc-950"
      style={{ perspective: "1000px" }}
    >
      {/* 3D grid */}
      <Perspectivegrid />

      {/* Üst ısıma */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 55% at 50% -5%, ${ACCENT}16 0%, transparent 58%),
            radial-gradient(ellipse 45% 40% at 5%  80%, ${SECONDARY}0e 0%, transparent 55%),
            linear-gradient(to bottom, #09090b 0%, transparent 25%, transparent 75%, #09090b 100%)
          `,
        }}
      />

      {/* Scan çizgileri */}
      {mounted && (
        <>
          <ScanLine color={ACCENT}    delay={0.8} />
          <ScanLine color={SECONDARY} delay={5.5} />
          <ScanLine color={TERTIARY}  delay={10}  />
        </>
      )}

      {/* Köse aksanları */}
      {mounted && (
        <>
          <CornerDiamond color={ACCENT}    pos="tl" />
          <CornerDiamond color={SECONDARY} pos="tr" />
          <CornerDiamond color={`${TERTIARY}90`} pos="bl" />
          <CornerDiamond color={`${GOLD}80`}      pos="br" />
        </>
      )}

      {/* Dikey kenar çizgileri */}
      <div className="absolute top-0 bottom-0 left-0 w-px pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}35, transparent)` }} />
      <div className="absolute top-0 bottom-0 right-0 w-px pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${SECONDARY}28, transparent)` }} />

      {/* ─── Içerik ─── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>

          {/* Hizmet döngüsü */}
          <ServiceRotator />

          {/* Ana baslık */}
          <motion.h1
            className="text-center font-black tracking-tight leading-[1.04] mb-5"
            style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)" }}
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                background: `linear-gradient(135deg, #fff 0%, ${ACCENT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 40px ${ACCENT}50)`,
              }}
            >
              YAZILIM &amp;
            </span>
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${TERTIARY}, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TEKNOLOJI
            </span>{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${SECONDARY} 0%, #fff 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 28px ${SECONDARY}45)`,
              }}
            >
              SISTEMLERI
            </span>
          </motion.h1>

          {/* geometrik ayraç */}
          <motion.div
            className="flex justify-center items-center gap-2 mb-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
          >
            <div className="h-px flex-1 max-w-[100px]"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}70)` }} />
            <div className="w-1.5 h-1.5 rotate-45"
              style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
            <div className="h-px w-12"
              style={{ background: `${ACCENT}50` }} />
            <div className="w-2 h-2 rotate-45"
              style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
            <div className="h-px w-12"
              style={{ background: `${SECONDARY}50` }} />
            <div className="w-1.5 h-1.5 rotate-45"
              style={{ background: SECONDARY, boxShadow: `0 0 8px ${SECONDARY}` }} />
            <div className="h-px flex-1 max-w-[100px]"
              style={{ background: `linear-gradient(90deg, ${SECONDARY}70, transparent)` }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-center text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: "clamp(0.92rem, 2vw, 1.12rem)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34 }}
          >
            Yazılımda güven, tasarımda fark, sonuçta mükemmellik.{" "}
            <span className="text-zinc-300 font-medium">Web, mobil, masaustu ve siber guvenlik</span>{" "}
            cozumlerinde 15 yillik deneyim.
          </motion.p>

          {/* CTA Butonlar */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
          >
            <button
              onClick={() => teklifModal.open()}
              className="relative inline-flex items-center gap-2 px-8 py-4 font-black text-sm text-zinc-950 transition-all hover:scale-[1.04] active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${SECONDARY})`,
                boxShadow: `0 0 28px ${ACCENT}50, 0 0 8px ${SECONDARY}30`,
                clipPath:
                  "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/22 to-transparent pointer-events-none" />
              <Zap className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Ücretsiz Teklif Al</span>
            </button>

            <Link
              href="/hizmetler/web-yazilim-tasarim"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm transition-all hover:scale-[1.02]"
              style={{
                border: `1px solid ${ACCENT}38`,
                color: "rgba(255,255,255,0.82)",
                background: `${ACCENT}08`,
                clipPath:
                  "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
              }}
            >
              Hizmetleri Incele
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Istatistikler */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-14 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.68 }}
          >
            <StatCard value="15+"  label="Yıllık Deneyim"     color={GOLD}      delay={0.72} />
            <StatCard value="200+" label="Tamamlanan Proje"   color={SECONDARY} delay={0.82} />
            <StatCard value="150+" label="Mutlu Müsteri"      color={ACCENT}    delay={0.92} />
            <StatCard value="5"    label="Hizmet Alanı"       color="#34d399"   delay={1.02} />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
