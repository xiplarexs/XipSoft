"use client";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { useParallaxTransforms } from "./useParallax";

type MotionNumber = MotionValue<number>;

export default function Orb({
  size, color, x, y, blur, opacity,
  mouseX, mouseY, speedX, speedY,
}: {
  size: number; color: string; x: string; y: string;
  blur: number; opacity: number;
  mouseX: MotionNumber; mouseY: MotionNumber;
  speedX: number; speedY: number;
}) {
  // local transform/spring used by the hook consumer would be fine,
  // but keeping an internal simple transform keeps the component self-contained
  // for reuse across different heroes.
  // We import transforms here to avoid circular imports and keep API tiny.
  const { x: sx, y: sy } = useParallaxTransforms(mouseX, mouseY, speedX, speedY);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        x: sx, y: sy,
        background: `radial-gradient(circle, ${color}88 0%, transparent 65%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
