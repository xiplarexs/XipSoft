"use client";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { useParallaxTransforms } from "./useParallax";

type MotionNumber = MotionValue<number>;

export default function FloatingShape({
  size, color, x, y, blur, opacity, speedX, speedY, mouseX, mouseY,
}: {
  size: number; color: string; x: string; y: string; blur: number;
  opacity: number; speedX: number; speedY: number;
  mouseX: MotionNumber; mouseY: MotionNumber;
}) {
  const { x: spx, y: spy } = useParallaxTransforms(mouseX, mouseY, speedX, speedY);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        x: spx, y: spy,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
