"use client";

import { useLanguage } from "@/components/languageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, text } = useLanguage();
  const selectedLanguage = locale === "so" ? text.languageSomali : text.languageEnglish;

  function toggleLanguage() {
    setLocale(locale === "so" ? "en" : "so");
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={locale === "en"}
      aria-label={`${text.language}: ${selectedLanguage}`}
      title={`${text.language}: ${selectedLanguage}`}
      onClick={toggleLanguage}
      className="group inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f8f5] dark:focus-visible:ring-[#9fbea4] dark:focus-visible:ring-offset-[#111914]"
    >
      <span className="relative h-10 w-[104px] rounded-full border border-[#dfe5de] bg-[#edf1ed] p-[3px] shadow-inner shadow-[#183c22]/[0.03] transition-colors duration-300 ease-in-out group-hover:bg-[#e7ede7] dark:border-[#34443a] dark:bg-[#202b23] dark:group-hover:bg-[#27352b] motion-reduce:transition-none">
        <span aria-hidden="true" className={`absolute inset-y-0 flex w-1/2 items-center justify-center text-xs font-semibold tracking-wide transition-colors duration-300 ease-in-out motion-reduce:transition-none ${locale === "en" ? "text-[#68766c] dark:text-[#a3b0a7]" : "text-transparent"}`}>
          SO
        </span>
        <span aria-hidden="true" className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-xs font-semibold tracking-wide transition-colors duration-300 ease-in-out motion-reduce:transition-none ${locale === "so" ? "text-[#68766c] dark:text-[#a3b0a7]" : "text-transparent"}`}>
          EN
        </span>
        <span aria-hidden="true" className={`absolute left-[3px] top-[3px] grid size-8 place-items-center rounded-full bg-[#17452d] text-[11px] font-bold tracking-wide text-white shadow-sm shadow-[#183c22]/20 transition-transform duration-300 ease-in-out motion-reduce:transition-none dark:bg-[#3c7650] ${locale === "en" ? "translate-x-[64px]" : "translate-x-0"}`}>
          {locale.toUpperCase()}
        </span>
      </span>
    </button>
  );
}
