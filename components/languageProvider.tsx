"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { Locale, Messages } from "@/lib/i18n";
import { messages } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  text: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    const root = document.documentElement;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("language-switching");
    } else {
      root.classList.add("language-switching");
      transitionTimer.current = setTimeout(() => root.classList.remove("language-switching"), 360);
    }

    updateLocale(nextLocale);
    root.lang = nextLocale;
    document.cookie = `planify-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.title = messages[nextLocale].pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", messages[nextLocale].pageDescription);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, text: messages[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function useOptionalLanguage() {
  return useContext(LanguageContext);
}
