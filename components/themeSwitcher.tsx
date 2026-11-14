"use client";

import { useLanguage } from "@/components/languageProvider";
import { useTheme } from "@/components/themeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { text } = useLanguage();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? text.switchToLight : text.switchToDark}
      title={isDark ? text.switchToLight : text.switchToDark}
      aria-pressed={isDark}
      className="size-9 rounded-full border-[#dfe5de] bg-white/80 text-[#425047] transition-all duration-300 ease-in-out motion-reduce:transition-none hover:bg-[#f4f6f2] dark:border-[#34443a] dark:bg-[#202b23] dark:text-[#d8e4da] dark:hover:bg-[#2c3b31]"
    >
      <span className="relative grid size-4 place-items-center">
        <Sun className={`absolute size-4 transition-all duration-300 ease-in-out motion-reduce:transition-none ${isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} aria-hidden="true" />
        <Moon className={`absolute size-4 transition-all duration-300 ease-in-out motion-reduce:transition-none ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} aria-hidden="true" />
      </span>
    </Button>
  );
}

