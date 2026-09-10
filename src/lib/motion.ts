import { useEffect, useState } from "react";
import type { Variants } from "motion/react";

/** Slow, breathing-like easing used across the site. */
export const breathe = [0.22, 0.61, 0.36, 1] as const;

export function useMotionProfile() {
  const [profile, setProfile] = useState<"desktop" | "mobile" | "reduced">("desktop");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const update = () =>
      setProfile(reduce.matches ? "reduced" : small.matches ? "mobile" : "desktop");
    update();
    reduce.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);

  return profile;
}

/**
 * Desktop: long breathing fade + 28px rise.
 * Mobile: same identity, lighter work — shorter distance, no blur-ish scale,
 * faster stagger so mid-range phones stay at 60fps.
 */
export function revealVariants(profile: "desktop" | "mobile" | "reduced"): Variants {
  if (profile === "reduced") {
    return {
      hidden: { opacity: 1 },
      show: { opacity: 1, transition: { duration: 0 } },
    };
  }
  const mobile = profile === "mobile";
  return {
    hidden: { opacity: 0, y: mobile ? 14 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: mobile ? 0.5 : 0.9,
        ease: breathe,
        staggerChildren: mobile ? 0.06 : 0.1,
        delayChildren: mobile ? 0.02 : 0.06,
      },
    },
  };
}

export function childVariants(profile: "desktop" | "mobile" | "reduced"): Variants {
  if (profile === "reduced") {
    return { hidden: { opacity: 1 }, show: { opacity: 1 } };
  }
  const mobile = profile === "mobile";
  return {
    hidden: { opacity: 0, y: mobile ? 10 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: mobile ? 0.45 : 0.8, ease: breathe },
    },
  };
}
