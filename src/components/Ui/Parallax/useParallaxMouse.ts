"use client";
import { useRef, useEffect, useCallback, type RefObject } from "react";
import { useMouseMotion, type MotionNumber } from "./useParallax";

export function useParallaxMouse() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mouseX, mouseY } = useMouseMotion();

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { containerRef, mouseX, mouseY } as {
    containerRef: RefObject<HTMLDivElement>;
    mouseX: MotionNumber;
    mouseY: MotionNumber;
  };
}
