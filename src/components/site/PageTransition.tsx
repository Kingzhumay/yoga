import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionProfile } from "@/lib/motion";

/** Soft fade/rise applied when a route mounts. */
export function PageTransition({ children }: { children: ReactNode }) {
  const profile = useMotionProfile();
  const still = profile === "reduced";

  return (
    <motion.div
      initial={{ opacity: still ? 1 : 0, y: still ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: still ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
