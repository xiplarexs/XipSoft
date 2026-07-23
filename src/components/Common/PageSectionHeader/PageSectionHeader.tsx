"use client";
/**
 * PageSectionHeader — Tüm sayfalarda standart section baslıgı.
 * Büyük harf, drop-shadow, gradient metin, opsiyonel alt baslık.
 * "Yazılım & Teknoloji" badge pattern'ı kaldırıldı — dogrudan baslık.
 */
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface PageSectionHeaderProps {
  /** Ana baslık — büyük harf uygulanır */
  title: string;
  /** gradient renkli vurgulanan kısım (title'ın sonuna eklenir) */
  highlight?: string;
  /** Küçük açıklama metni */
  subtitle?: string;
  /** gradient renkleri — varsayılan: rose→orange→yellow */
  gradient?: string;
  /** h1 veya h2 */
  tag?: "h1" | "h2";
  className?: string;
  /** ↓ kaydır ipucu göster */
  showScrollHint?: boolean;
}

export default function PageSectionHeader({
  title,
  highlight,
  subtitle,
  gradient = "from-rose-400 via-orange-400 to-yellow-400",
  tag = "h2",
  className = "",
  showScrollHint = false,
}: PageSectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const Tag = tag;

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tag
          className={`
            -display font-black uppercase tracking-tight leading-none
            text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
            bg-gradient-to-r ${gradient} bg-clip-text text-transparent
            mb-4
          `}
          style={{
            filter: "drop-shadow(0 0 32px rgba(249,115,22,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
          }}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span
                className="bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 0 24px rgba(167,139,250,0.5))",
                }}
              >
                {highlight}
              </span>
            </>
          )}
        </Tag>

        {subtitle && (
          <motion.p
            className="text-zinc-500 text-base max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}

        {showScrollHint && (
          <p className="text-zinc-600 text-xs mt-4 -mono animate-bounce">↓ kaydır</p>
        )}
      </motion.div>
    </div>
  );
}
