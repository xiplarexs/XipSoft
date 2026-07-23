import MseLink from "@/components/Ui/MseLink/MseLink";
import { cn } from "@/utils";
import { navLabel } from "@/utils/latinize";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useCallback, useRef } from "react";
import { ActiveIndicator } from "./ActiveIndicator";

// ── NavLink ───────────────────────────────────────────────────────────────────
export const NavLink = ({ href, label, isActive, index, widthClass, mm = "", onHover }: {
  href: string; label: string; isActive: boolean; index: number; widthClass: string; mm?: string;
  onHover?: (hovered: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const glowY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const glowOpacity = useMotionValue(0);
  const springOpacity = useSpring(glowOpacity, { stiffness: 200, damping: 25 });
  // useTransform hook'ları JSX içinde degil, component body'de tanımlanmalı
  const glowTransformX = useTransform(glowX, (v) => v - 40);
  const glowTransformY = useTransform(glowY, (v) => v - 40);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const rectCache = useRef<{ left: number; top: number } | null>(null);
  const handleMouseEnterCached = useCallback(() => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      rectCache.current = { left: r.left, top: r.top };
    }
    glowOpacity.set(1);
  }, [glowOpacity]);
  const handleMouseMoveCached = useCallback((e: React.MouseEvent) => {
    const rect = rectCache.current;
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.div ref={ref} className="relative" data-nav-link
      onMouseMove={handleMouseMoveCached}
      onMouseEnter={() => { handleMouseEnterCached(); onHover?.(true); }}
      onMouseLeave={() => { glowOpacity.set(0); onHover?.(false); }}
    >
      {/* Turuncu hover glow */}
      <motion.div className="pointer-events-none absolute -inset-2 rounded-xl"
        style={{
          x: glowTransformX, y: glowTransformY,
          width: 80, height: 80,
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          opacity: springOpacity,
        }}
        suppressHydrationWarning={true}
      />
      <MseLink href={href} className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap -navbar text-[13px] font-extrabold uppercase tracking-[0.1em] py-2 px-1 transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
          : "text-zinc-100",
        widthClass, mm
      )}
        style={isActive ? { filter: "drop-shadow(0 0 8px rgba(249,115,22,0.6))" } : undefined}
      >
        <span className="relative z-10">{navLabel(label)}</span>
      </MseLink>
      {isActive && <ActiveIndicator />}
    </motion.div>
  );
};
