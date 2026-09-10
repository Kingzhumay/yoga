import { motion } from "motion/react";
import type { ReactNode } from "react";
import { childVariants, revealVariants, useMotionProfile } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
};

export function Reveal({ children, className, as = "div" }: Props) {
  const profile = useMotionProfile();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      variants={revealVariants(profile)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className, as = "div" }: Props) {
  const profile = useMotionProfile();
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={childVariants(profile)}>
      {children}
    </MotionTag>
  );
}
