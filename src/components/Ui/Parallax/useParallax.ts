import { useMotionValue, useTransform, useSpring, type MotionValue } from "motion/react";

export type MotionNumber = MotionValue<number>;

export function useMouseMotion() {
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  return { mouseX, mouseY } as { mouseX: MotionNumber; mouseY: MotionNumber };
}

export function useParallaxTransforms(
  mouseX: MotionNumber,
  mouseY: MotionNumber,
  speedX: number,
  speedY: number,
) {
  const tx = useTransform(mouseX, [-0.5, 0.5], [-speedX, speedX]);
  const ty = useTransform(mouseY, [-0.5, 0.5], [-speedY, speedY]);
  const sx = useSpring(tx, { stiffness: 55, damping: 22 });
  const sy = useSpring(ty, { stiffness: 55, damping: 22 });
  return { x: sx, y: sy } as { x: MotionNumber; y: MotionNumber };
}

export function useParallaxTilt(
  mouseX: MotionNumber,
  mouseY: MotionNumber,
  maxTilt = 4,
) {
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 70,
    damping: 25,
  });

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 70,
    damping: 25,
  });

  return { rotateX, rotateY } as { rotateX: MotionNumber; rotateY: MotionNumber };
}
