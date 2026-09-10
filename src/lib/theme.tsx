import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "purple";

export const THEME_KEY = "veda-theme";

const ORDER: Theme[] = ["light", "dark", "purple"];

const THEME_CLASS: Record<Theme, string> = {
  light: "",
  dark: "dark",
  purple: "purple",
};

function applyClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "purple");
  const cls = THEME_CLASS[theme];
  if (cls) root.classList.add(cls);
  const dark = theme === "dark";
  root.style.colorScheme = dark ? "dark" : "light";
}

/** Runs before paint in the document head to avoid a theme flash. */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var t=s||"light";if(!s){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var m={light:"",dark:"dark",purple:"purple"};var c=m[t]||"";var r=document.documentElement;r.classList.remove("dark","purple");if(c)r.classList.add(c);r.style.colorScheme=(t==="dark")?"dark":"light";}catch(e){}})();`;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  const apply = useCallback((next: Theme) => {
    setTheme(next);
    applyClass(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked — theme stays for this session only */
    }
  }, []);

  const cycle = useCallback(() => {
    setTheme((current) => {
      const idx = ORDER.indexOf(current);
      const nextIdx = (idx + 1) % ORDER.length;
      const next = nextIdx >= 0 && nextIdx < ORDER.length ? ORDER[nextIdx]! : "light";
      applyClass(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage blocked */
      }
      return next;
    });
  }, []);

  return { theme, cycle };
}
