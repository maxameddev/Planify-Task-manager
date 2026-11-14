"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (reduceMotion) {
      root.classList.remove("theme-switching");
    } else {
      root.classList.add("theme-switching");
      transitionTimer.current = setTimeout(() => root.classList.remove("theme-switching"), 320);
    }
    root.dataset.theme = nextTheme;
    setTheme(nextTheme);
    document.cookie = `planify-theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
