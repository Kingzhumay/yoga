import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";

const LABEL: Record<string, string> = {
  light: "Switch to dark mode",
  dark: "Switch to purple mode",
  purple: "Switch to light mode",
};

export function ThemeToggle() {
  const { theme, cycle } = useTheme();

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABEL[theme] ?? "Switch theme"}
      className="relative grid size-12 place-items-center overflow-hidden rounded-full text-foreground/75 transition-colors hover:bg-secondary hover:text-accent"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {theme === "dark" ? (
            <Moon className="size-5" />
          ) : theme === "purple" ? (
            <Sparkles className="size-5" />
          ) : (
            <Sun className="size-5" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
