import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMotionProfile } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  strength?: number;
};

/**
 * Pointer-driven 3D tilt. Disabled on touch/mobile and reduced-motion profiles,
 * where it falls back to a simple lift so mobile stays at 60fps.
 */
export function TiltCard({ children, className, strength = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();
  const enabled = profile === "desktop";

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 180, damping: 18, mass: 0.4 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      whileHover={enabled ? { y: -6 } : { y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={
        enabled
          ? { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }
          : {}
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
